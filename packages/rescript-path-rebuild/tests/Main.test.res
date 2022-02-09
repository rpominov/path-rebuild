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
]->each("Parse errors %s", pattern => pattern->make->msg->expect->toMatchSnapshot)

[
  ("{10}", "file.sql", ""),
  ("{10}/", "file.sql", ""),
  ("/{10}/", "file.sql", "/"),
  ("{-10}", "file.sql", ""),
  ("{-10}/", "file.sql", ""),
  ("/{-10}/", "file.sql", "/"),
  ("{0}", "file.sql", "file"),
  ("{-2}", "file.sql", "file"),
  ("{-2}", "file", "file"),
  ("{-2}", ".file", ".file"),
  ("{-1}", "file", ""),
  ("{-1}", ".file", ""),
  ("{1}", "file.sql", ".sql"),
  ("{0}{1}", "file.sql", "file.sql"),
  ("{0}/{1}", "file.sql", "file/.sql"),
  ("{0..-2}.js", "file.sql", "file.js"),
  ("{-2..-1}", "file.sql", "file.sql"),
  ("{-2..-1}", "a/b/file.sql", "file.sql"),
  ("{0..-2}.js", "a/b/file.sql", "a/b/file.js"),
  ("{0..-3}/__test__/{-2}.test{-1}", "a/b/file.sql", "a/b/__test__/file.test.sql"),
  ("{0..-3}_test/{-2..-1}", "a/b/file.sql", "a/b_test/file.sql"),
  ("test_{0..-1}", "a/b/file.sql", "test_a/b/file.sql"),
  ("test/{0..-1}", "a/b/file.sql", "test/a/b/file.sql"),
  ("/test/{0..-1}", "a/b/file.sql", "/test/a/b/file.sql"),
  ("/{0..-1}", "a/b/file.sql", "/a/b/file.sql"),
  ("{0..-3}/{-2}.js", "file.sql", "file.js"),
  ("{0..-4}/{-2}.js", "a/b/c/d/file.sql", "a/b/c/file.js"),
]->each3("Transform %s + %s = %s", (pattern, path, result) => {
  let transform = pattern->make->Belt.Result.getExn
  path->transform(~sep="/")->Belt.Result.getExn->expect->toBe(result)
})

test("Unconventional separator", () => {
  let transform = "{0..-4}/{-2}.js"->make->Belt.Result.getExn
  "a#b#c#d#file.sql"->transform(~sep="#")->Belt.Result.getExn->expect->toBe("a#b#c#file.js")
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
