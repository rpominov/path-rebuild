type node = Sep | Range(int, int) | Literal(string)
type status = L(string) | S(string) | I(string) | R(string, string)

@module("path") external osPathSep: string = "sep"
@module("path") external isAbsolute: string => bool = "isAbsolute"
@module("path") external normalize: string => string = "normalize"
@module("path") external extname: string => string = "extname"

// module Path = {
//   type t = {
//     dir: string,
//     root: string,
//     base: string,
//     name: string,
//     ext: string,
//   }
//   @module("path") external format: t => string = "format"
//   @module("path") external parse: string => t = "parse"

//   @module("path") external basename: string => string = "basename"

//   @module("path")
//   external basenameExt: (string, string) => string = "basename"

//   @module("path") external delimiter: string = "delimiter"

//   @module("path") external dirname: string => string = "dirname"

//   @module("path") external extname: string => string = "extname"

//   @module("path") external isAbsolute: string => bool = "isAbsolute"

//   @module("path") @variadic
//   external join: array<string> => string = "join"

//   @module("path") external join2: (string, string) => string = "join"

//   @module("path") external normalize: string => string = "normalize"

//   @module("path")
//   external relative: (~from: string, ~to_: string) => string = "relative"

//   @module("path") @variadic
//   external resolve: array<string> => string = "resolve"

//   @module("path") external sep: string = "sep"

//   @module("path")
//   external toNamespacedPath: string => string = "toNamespacedPath"
// }

%%private(
  @val external int: string => float = "Number"
  let int = str => {
    let result = int(str)
    let result' = result->Belt.Int.fromFloat
    result === result'->Belt.Int.toFloat ? Some(result') : None
  }

  @send external append: (array<'a>, 'a) => array<'a> = "concat"

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
          if n' >= 0 ? m' > 0 && m' < n' : m' >= 0 || n' < m' {
            // Maybe at a support of reverse ranges?
            Error(`Bad range limits: ${n}..${m}`)
          } else {
            result->append(Range(n', m'))->Ok
          }
        | None => Error(`Bad range limit: ${m}`)
        }
      | None => Error(`Bad range limit: ${n}`)
      }
    | S(_) => Js.Exn.raiseError("Cannot commit a Skip")
    }
  }
)

type parseResult = Ok(array<node>) | Error(int, string)

let rec parse = (str, i, mStatus, mResult: result<array<node>, string>): parseResult => {
  switch mResult {
  | Error(s) => Error(i - 1, s)
  | Ok(result) =>
    switch mStatus {
    | None => Ok(result)
    | Some(status) => {
        let ch = str->Js.String2.charAt(i)
        let i' = i + 1
        switch (ch, status) {
        | ("", L(_)) => parse(str, i', None, result->commit(status))
        | ("", S(_)) => Error(i, "Unexpected end of string. Expected a character after \"\\\"")
        | ("", _) => Error(i, "Unexpected end of string. Did you forget to close a range?")
        | ("\\", L(s)) => parse(str, i', S(s)->Some, mResult)
        | ("\\", _) => Error(i, "Unexpected escape character")
        | (_, S(s)) => parse(str, i', L(s ++ ch)->Some, mResult)
        | ("{", L(_)) => parse(str, i', I("")->Some, result->commit(status))
        | ("{", _) => Error(i, "Unexpected open range character")
        | ("}", I(_))
        | ("}", R(_, _)) =>
          parse(str, i', L("")->Some, result->commit(status))
        | ("}", _) => Error(i, "Unexpected close range character")
        | (".", I(n)) => parse(str, i', R(n, "")->Some, mResult)
        | (".", R(_, "")) => parse(str, i', status->Some, mResult)
        | (".", R(_, _)) => Error(i, "Unexpected range delimeter character")
        | ("/", L(_)) => parse(str, i', status->Some, result->append(Sep)->Ok)
        | ("/", _) => Error(i, "Unexpected path separator character")
        | (_, L(s)) => parse(str, i', L(s ++ ch)->Some, mResult)
        | (_, I(n)) => parse(str, i', I(n ++ ch)->Some, mResult)
        | (_, R(n, m)) => parse(str, i', R(n, m ++ ch)->Some, mResult)
        }
      }
    }
  }
}
let parse = str => parse(str, 0, Some(L("")), Ok([]))

let printRange = (parts, min, max, sep) => {
  let len = parts->Js.Array2.length
  let min = min < 0 ? len - min : min
  let max = Js.Math.min_int(len - 1, max < 0 ? len - max : max)
  let rec helper = st => {
    let i = min + st
    i === max ? parts[i] : parts[i] ++ (st === len - 2 ? "" : sep) ++ helper(st + 1)
  }
  max < min ? "" : helper(0)
}

let print = (~sep=osPathSep, nodes, path): result<string, string> => {
  if path->isAbsolute {
    Error("An absolute path cannot be used as a source path")
  } else {
    let ext = path->extname
    let withoutExt =
      path->Js.String2.substring(~from=0, ~to_=path->Js.String2.length - ext->Js.String2.length)
    let parts = withoutExt->Js.String2.split(sep)->append(ext)
    nodes
    ->Js.Array2.map(node =>
      switch node {
      | Literal(s) => s
      | Sep => sep
      | Range(min, max) => printRange(parts, min, max, sep)
      }
    )
    ->Js.Array2.joinWith("")
    ->normalize
    ->Ok
  }
}
