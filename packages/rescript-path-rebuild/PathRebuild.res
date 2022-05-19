module A = Js.Array2
module S = Js.String2
module I = Belt.Int
module E = Js.Exn
module M = Js.Math

type node =
  Sep | Range(int, int) | Literal(string) | PredefinedRange([#root | #dir | #base | #name | #ext])
type status =
  | L(string) // Parsing a literal
  | S(string) // Parsing a literal, the prev character was an escape character
  | I(string) // Parsing a range, seen 0 dots
  | D(string) // Parsing a range, seen 1 dot
  | R(string, string) // Parsing a range, seen 2 dots

@module("path") external osPathSep: string = "sep"
@module("path")
external parsePath: string => {
  "root": string,
  "dir": string,
  "base": string,
  "name": string,
  "ext": string,
} = "parse"

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
    switch n {
    | "root" => result->append(PredefinedRange(#root))->Ok
    | "dir" => result->append(PredefinedRange(#dir))->Ok
    | "base" => result->append(PredefinedRange(#base))->Ok
    | "name" => result->append(PredefinedRange(#name))->Ok
    | "ext" => result->append(PredefinedRange(#ext))->Ok
    | _ =>
      switch n->int {
      | Some(n') => result->append(Range(n', n'))->Ok
      | None => Error(`Bad range limit: ${n}`)
      }
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

let rec parse = (str, i, status, mResult: result<array<node>, string>) => {
  switch mResult {
  | Error(s) => printError(str, i - 1, s)
  | Ok(result) => {
      let ch = str->S.charAt(i)
      let i' = i + 1
      switch (ch, status) {
      | ("", L(_)) => result->commit(status)
      | ("", S(_)) =>
        printError(
          str,
          i,
          "Unexpected end of string. Expected a character after the escape symbol %",
        )
      | ("", _) => printError(str, i, "Unexpected end of string. Did you forget to close a range?")
      | ("%", L(s)) => parse(str, i', S(s), mResult)
      | (_, S(s)) => parse(str, i', L(s ++ ch), mResult)
      | ("%", _) => printError(str, i, "Unexpected escape symbol % inside a range")
      | ("{", L(_)) => parse(str, i', I(""), result->commit(status))
      | ("{", _) => printError(str, i, "Unexpected { symbol inside a range")
      | ("}", I(_))
      | ("}", R(_, _)) =>
        parse(str, i', L(""), result->commit(status))
      | ("}", _) => printError(str, i, "Unexpected } symbol")
      | (".", I("")) => printError(str, i, "Unexpected . symbol")
      | (".", I(n)) => parse(str, i', D(n), mResult)
      | (".", D(n)) => parse(str, i', R(n, ""), mResult)
      | (x, D(_)) => printError(str, i, `Unexpected character: ${x}. Was expecting a . symbol`)
      | (".", R(_, _)) => printError(str, i, "Unexpected . symbol")
      | ("/", L(_)) =>
        parse(
          str,
          i',
          L(""),
          switch result->commit(status) {
          | Ok(r) => r->append(Sep)->Ok
          | Error(_) as err => err
          },
        )
      | ("/", _) => printError(str, i, "Unexpected / symbol inside a range")
      | (_, L(s)) => parse(str, i', L(s ++ ch), mResult)
      | (_, I(n)) => parse(str, i', I(n ++ ch), mResult)
      | (_, R(n, m)) => parse(str, i', R(n, m ++ ch), mResult)
      }
    }
  }
}
let parse = str => parse(str, 0, L(""), Ok([]))

let rec printRange = (parts, min, max, sep) => {
  if min === max {
    parts->A.unsafe_get(min)
  } else if max === parts->A.length - 1 {
    printRange(parts, min, max - 1, sep) ++ parts->A.unsafe_get(max)
  } else {
    parts->A.slice(~start=min, ~end_=max + 1)->A.joinWith(sep)
  }
}

let print = (~sep=osPathSep, nodes, path): string => {
  let parsed = path->parsePath

  let withoutRoot = path->S.sliceToEnd(~from=S.length(parsed["root"]))
  let withoutExt =
    withoutRoot->S.slice(~from=0, ~to_=S.length(withoutRoot) - S.length(parsed["ext"]))
  let parts = withoutExt->S.split(sep)->append(parsed["ext"])

  let rec loop = (result, i, skipSeparator) => {
    if i === nodes->A.length {
      result
    } else {
      switch nodes->A.unsafe_get(i) {
      | PredefinedRange(#root) => loop(result ++ parsed["root"], i + 1, false)
      | PredefinedRange(#dir) =>
        loop(result ++ parsed["dir"], i + 1, parsed["dir"] === parsed["root"])
      | PredefinedRange(#base) => loop(result ++ parsed["base"], i + 1, false)
      | PredefinedRange(#name) => loop(result ++ parsed["name"], i + 1, false)
      | PredefinedRange(#ext) => loop(result ++ parsed["ext"], i + 1, false)
      | Literal(s) => loop(result ++ s, i + 1, false)
      | Sep => loop(result ++ (skipSeparator ? "" : sep), i + 1, false)
      | Range(min, max) => {
          let len = parts->A.length
          let min = M.max_int(0, min < 0 ? len + min : min)
          let max = M.min_int(len - 1, max < 0 ? len + max : max)

          // if range has collapsed, skip separator
          max < min
            ? loop(result, i + 1, true)
            : loop(result ++ printRange(parts, min, max, sep), i + 1, false)
        }
      }
    }
  }

  loop("", 0, false)
}

let make = pattern =>
  switch parse(pattern) {
  | Ok(nodes) => Ok((~sep=?, path) => print(~sep?, nodes, path))
  | Error(m) => Error(m)
  }

let __jsEndpoint = pattern =>
  switch parse(pattern) {
  | Ok(nodes) => (path, sep) => print(~sep?, nodes, path)
  | Error(message) => E.raiseError(message)
  }
