open Jest
open PathRebuild

@module("process") @val external platform: string = "platform"

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
  "{-2}.js%",
  "foo/{-2..",
  "test/{1..2.1}/{-2}.js",
  "test/{1...2}/{-2}.js",
  "test/{1.2}/{-2}.js",
  "test/{1%..2}/{-2}.js",
  "test/{1{..2}/{-2}.js",
  "test/{1/..2}/{-2}.js",
  "test}/{1..2}/{-2}.js",
]->each("Parse errors %s", pattern => pattern->make->msg->expect->toMatchSnapshot)

[
  ("", "file.sql", ""),
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
  ("%{", "file.sql", "{"),
  ("%%", "file.sql", "%"),
  ("{10}%/", "file.sql", "/"),
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
  if platform === "win32" {
    "a\\b\\c\\d\\file.sql"->transform->Belt.Result.getExn->expect->toEqual("a\\b\\c\\file.js")
  } else {
    "a/b/c/d/file.sql"->transform->Belt.Result.getExn->expect->toEqual("a/b/c/file.js")
  }
})

test("Absolute path", () => {
  let transform = "{0..-3}/{-2}.js"->make->Belt.Result.getExn
  (platform === "win32" ? "C:\\file.sql" : "/file.sql")
  ->transform
  ->msg
  ->Js.String2.includes("An absolute path cannot be used")
  ->expect
  ->toBe(true)
})

test("transformExn parse error", () => {
  let err = try {
    Ok(transformExn("foo/{-2.."))
  } catch {
  | Js.Exn.Error(err) =>
    switch Js.Exn.message(err) {
    | Some(m) => Error(m)
    | None => Error("Without message")
    }
  }
  expect(err->msg)->toMatchSnapshot
})

test("transformExn print error", () => {
  let err = try {
    Ok(transformExn("{0..-1}", "/foo/bar.js"))
  } catch {
  | Js.Exn.Error(err) =>
    switch Js.Exn.message(err) {
    | Some(m) => Error(m)
    | None => Error("Without message")
    }
  }
  expect(err->msg)->toMatchSnapshot
})

test("transformExn no errors", () => {
  expect(transformExn(~sep="/", "{0..-2}.json", "foo/bar.js"))->toBe("foo/bar.json")
})
