type node = Sep | Range(int, int) | Index(int) | Literal(string)
type status = L(string) | S(string) | I(string) | R(string, string)

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
      | Some(n') => result->append(Index(n'))->Ok
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
    | S(_) => invalid_arg("Cannot commit a Skip")
    }
  }

  let addSep = result => result->append(Sep)
)

type parseResult = Ok(array<node>) | Error(int, string)

let rec parse = (str, i, maybeStatus, maybeResult: result<array<node>, string>): parseResult => {
  switch maybeResult {
  | Error(s) => Error(i - 1, s)
  | Ok(result) =>
    switch maybeStatus {
    | None => Ok(result)
    | Some(status) => {
        let ch = str->Js.String2.charAt(i)
        switch (ch, status) {
        | ("", L(_)) => parse(str, i + 1, None, result->commit(status))
        | ("", S(_)) => Error(i, "Unexpected end of string. Expected a character after \"\\\"")
        | ("", _) => Error(i, "Unexpected end of string. Did you forget to close a range?")
        | ("\\", L(s)) => parse(str, i + 1, S(s)->Some, result->Ok)
        | ("\\", _) => Error(i, "Unexpected escape character")
        | (_, S(s)) => parse(str, i + 1, L(s ++ ch)->Some, result->Ok)
        | ("{", L(_)) => parse(str, i + 1, I("")->Some, result->commit(status))
        | ("{", _) => Error(i, "Unexpected open range character")
        | ("}", I(_))
        | ("}", R(_, _)) =>
          parse(str, i + 1, L("")->Some, result->commit(status))
        | ("}", _) => Error(i, "Unexpected close range character")
        | (".", I(n)) => parse(str, i + 1, R(n, "")->Some, result->Ok)
        | (".", R(_, "")) => parse(str, i + 1, status->Some, result->Ok)
        | (".", R(_, _)) => Error(i, "Unexpected range delimeter character")
        | ("/", L(_)) => parse(str, i + 1, status->Some, result->addSep->Ok)
        | ("/", _) => Error(i, "Unexpected path separator character")
        | (_, L(s)) => parse(str, i + 1, L(s ++ ch)->Some, result->Ok)
        | (_, I(n)) => parse(str, i + 1, I(n ++ ch)->Some, result->Ok)
        | (_, R(n, m)) => parse(str, i + 1, R(n, m ++ ch)->Some, result->Ok)
        }
      }
    }
  }
}
let parse = str => parse(str, 0, Some(L("")), Ok([]))
