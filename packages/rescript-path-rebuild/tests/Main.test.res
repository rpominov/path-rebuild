open Jest
open PathRebuild

let msg = err =>
  switch err {
  | Error(msg) => msg
  | Ok(_) => Js.Exn.raiseError("Not a Error(_)")
  }

[
  "test/{1..0}/{-2}.js",
  "test/{2..1}/{-2}.js",
  "test/{-1..1}/{-2}.js",
  "test/{-1..-2}/{-2}.js",
  "test/{1..0a}/{-2}.js",
  "test/{0a}/{-2}.js",
  "{-2}.js\\",
  "foo/{-2..",
  "test/{1..2.1}/{-2}.js",
  "test/{1...2}/{-2}.js",
  "test/{1.2}/{-2}.js",
  "test/{1\..2}/{-2}.js",
  "test/{1{..2}/{-2}.js",
  "test/{1/..2}/{-2}.js",
  "test}/{1..2}/{-2}.js",
]->each("Parse errors", pattern => pattern->make->msg->expect->toMatchSnapshot)

// TODO: more cases
[("{0..-3}/{-2}.js", "file.sql"), ("{0..-4}/{-2}.js", "a/b/c/d/file.sql")]->each2("Transform", (
  pattern,
  path,
) => {
  let transform = pattern->make->Belt.Result.getExn
  path->transform(~sep="/")->Belt.Result.getExn->expect->toMatchSnapshot
})

test("Unconventional separator", () => {
  let transform = "{0..-4}/{-2}.js"->make->Belt.Result.getExn
  "a#b#c#d#file.sql"->transform(~sep="#")->Belt.Result.getExn->expect->toMatchSnapshot
})

test("Default separator", () => {
  let transform = "{0..-4}/{-2}.js"->make->Belt.Result.getExn

  // NOTE: will fail on Windows
  // TODO: use different path depending on platform
  "a/b/c/d/file.sql"->transform->Belt.Result.getExn->expect->toEqual("a/b/c/file.js")
})

test("Absolute path", () => {
  let transform = "{0..-3}/{-2}.js"->make->Belt.Result.getExn

  // NOTE: will fail on Windows
  // TODO: use different path depending on platform
  "/file.sql"->transform->msg->expect->toMatchSnapshot
})
