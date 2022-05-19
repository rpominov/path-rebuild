open Jest
open PathRebuild

@module("process") @val external platform: string = "platform"

test("Tail recursion complied to a loop", () => {
  "a"->Js.String2.repeat(5000)->make->ignore
})

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
  "{a}",
]->each("Parse errors %s", pattern => pattern->make->getErrorExn(__LOC__)->expect->toMatchSnapshot)

(
  platform === "win32"
    ? [
        ("{0..-1}", "C:\\file.sql", "file.sql"),
        ("{root}{0..-1}", "C:\\file.sql", "C:\\file.sql"),
        ("D:\\{0..-1}", "C:\\file.sql", "D:\\file.sql"),
        ("{dir}/{base}", "C:\\file.sql", "C:\\file.sql"),
      ]
    : [
        ("{0..-1}", "/file.sql", "file.sql"),
        ("{root}{0..-1}", "/file.sql", "/file.sql"),
        ("{dir}/{base}", "/file.sql", "/file.sql"),
        ("{dir}/new_file.js", "file.sql", "new_file.js"),
        ("{dir}/new_file.js", "a/file.sql", "a/new_file.js"),
        ("{base}", "a/file.sql", "file.sql"),
        ("{name}", "a/file.sql", "file"),
        ("{ext}", "a/file.sql", ".sql"),
        ("{dir}/{name}{ext}", "a/file.sql", "a/file.sql"),
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
      ]
)->each3("Transform %s + %s = %s", (pattern, path, result) => {
  let transform = pattern->make->getOkExn(__LOC__)
  path->transform->expect->toBe(result)
})

test("Unconventional separator", () => {
  let transform = "{0..-4}/{-2}.js"->make->getOkExn(__LOC__)
  "a#b#c#d#file.sql"->transform(~sep="#")->expect->toBe("a#b#c#file.js")
})

test("Default separator", () => {
  let transform = "{0..-4}/{-2}.js"->make->getOkExn(__LOC__)
  if platform === "win32" {
    "a\\b\\c\\d\\file.sql"->transform->expect->toEqual("a\\b\\c\\file.js")
  } else {
    "a/b/c/d/file.sql"->transform->expect->toEqual("a/b/c/file.js")
  }
})
