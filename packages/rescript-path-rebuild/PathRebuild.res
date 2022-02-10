module A = Js.Array2
module S = Js.String2
module I = Belt.Int
module E = Js.Exn
module M = Js.Math

type node = Sep | Range(int, int) | Literal(string)
type status = L(string) | S(string) | I(string) | D(string) | R(string, string)

@module("path") external osPathSep: string = "sep"
@module("path") external isAbsolute: string => bool = "isAbsolute"
@module("path") external extname: string => string = "extname"

@val external int: string => float = "Number"
let int = str => {
  let result = int(str)
  let result' = result->I.fromFloat
  result === result'->I.toFloat ? Some(result') : None
}

@send external append: (array<'a>, 'a) => array<'a> = "concat"
@send external repeat: (string, int) => string = "repeat"

let commit = (result, status) => {
  switch status {
  | L("") => result->Ok
  | L(s) => result->append(Literal(s))->Ok
  | I(n) =>
    switch n->int {
    | Some(n') => result->append(Range(n', n'))->Ok
    | None => Error(`Bad range limit: ${n}`)
    }
  | R(n, m) =>
    switch n->int {
    | Some(n') =>
      switch m->int {
      | Some(m') =>
        // 1..2 -> ok
        // 1..-1 -> ok
        // 2..1 -> err
        // -2..-1 -> ok
        // -1..1 -> err
        // -1..-2 -> err
        if n' >= 0 ? m' >= 0 && m' < n' : m' >= 0 || n' > m' {
          Error(`Bad range limits: ${n}..${m}`)
        } else {
          result->append(Range(n', m'))->Ok
        }
      | None => Error(`Bad range limit: ${m}`)
      }
    | None => Error(`Bad range limit: ${n}`)
    }
  | S(_) => E.raiseError("Cannot commit a Skip")
  | D(_) => E.raiseError("Cannot commit a Dot")
  }
}

let printError = (str, i, msg) => Error(`${msg}\n${str}\n${" "->repeat(i)}^`)

let rec parse = (str, i, mStatus, mResult: result<array<node>, string>) => {
  switch mResult {
  | Error(s) => printError(str, i - 1, s)
  | Ok(result) =>
    switch mStatus {
    | None => Ok(result)
    | Some(status) => {
        let ch = str->S.charAt(i)
        let i' = i + 1
        switch (ch, status) {
        | ("", L(_)) => parse(str, i', None, result->commit(status))
        | ("", S(_)) =>
          printError(
            str,
            i,
            "Unexpected end of string. Expected a character after the escape symbol %",
          )
        | ("", _) =>
          printError(str, i, "Unexpected end of string. Did you forget to close a range?")
        | ("%", L(s)) => parse(str, i', S(s)->Some, mResult)
        | (_, S(s)) => parse(str, i', L(s ++ ch)->Some, mResult)
        | ("%", _) => printError(str, i, "Unexpected escape symbol % inside a range")
        | ("{", L(_)) => parse(str, i', I("")->Some, result->commit(status))
        | ("{", _) => printError(str, i, "Unexpected { symbol inside a range")
        | ("}", I(_))
        | ("}", R(_, _)) =>
          parse(str, i', L("")->Some, result->commit(status))
        | ("}", _) => printError(str, i, "Unexpected } symbol")
        | (".", I("")) => printError(str, i, "Unexpected . symbol")
        | (".", I(n)) => parse(str, i', D(n)->Some, mResult)
        | (".", D(n)) => parse(str, i', R(n, "")->Some, mResult)
        | (x, D(_)) => printError(str, i, `Unexpected character: ${x}. Was expecting a . symbol`)
        | (".", R(_, _)) => printError(str, i, "Unexpected . symbol")
        | ("/", L(_)) =>
          parse(
            str,
            i',
            L("")->Some,
            switch result->commit(status) {
            | Ok(r) => r->append(Sep)->Ok
            | Error(m) => Error(m)
            },
          )
        | ("/", _) => printError(str, i, "Unexpected / symbol inside a range")
        | (_, L(s)) => parse(str, i', L(s ++ ch)->Some, mResult)
        | (_, I(n)) => parse(str, i', I(n ++ ch)->Some, mResult)
        | (_, R(n, m)) => parse(str, i', R(n, m ++ ch)->Some, mResult)
        }
      }
    }
  }
}
let parse = str => parse(str, 0, Some(L("")), Ok([]))

let rec printRange = (parts, min, max, sep) => {
  if min === max {
    parts->A.unsafe_get(min)
  } else if max === parts->A.length - 1 {
    printRange(parts, min, max - 1, sep) ++ parts->A.unsafe_get(max)
  } else {
    parts->A.slice(~start=min, ~end_=max + 1)->A.joinWith(sep)
  }
}

let print = (~sep=osPathSep, nodes, path): result<string, string> => {
  if path->isAbsolute {
    Error(`An absolute path cannot be used as a source path:\n${path}`)
  } else {
    let ext = path->extname
    let withoutExt = path->S.substring(~from=0, ~to_=path->S.length - ext->S.length)
    let parts = withoutExt->S.split(sep)->append(ext)
    let len = parts->A.length

    let rec helper = (result, i, skipSeparator) => {
      if i === nodes->A.length {
        result
      } else {
        switch nodes->A.unsafe_get(i) {
        | Literal(s) => helper(result ++ s, i + 1, false)
        | Sep => helper(result ++ (skipSeparator ? "" : sep), i + 1, false)
        | Range(min, max) => {
            let min = M.max_int(0, min < 0 ? len + min : min)
            let max = M.min_int(len - 1, max < 0 ? len + max : max)
            max < min
              ? helper(result, i + 1, true)
              : helper(result ++ printRange(parts, min, max, sep), i + 1, false)
          }
        }
      }
    }

    helper("", 0, false)->Ok
  }
}

let make = pattern =>
  switch parse(pattern) {
  | Ok(nodes) => Ok((~sep=?, path) => print(~sep?, nodes, path))
  | Error(m) => Error(m)
  }

let transformExn = pattern =>
  switch parse(pattern) {
  | Ok(nodes) =>
    (~sep=?, path) =>
      switch print(~sep?, nodes, path) {
      | Ok(result) => result
      | Error(message) => E.raiseError(message)
      }
  | Error(message) => E.raiseError(message)
  }
