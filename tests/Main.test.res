open Jest
open PathRebuild

describe("parse", () => {
  test("example", () => {
    expect(parse("{0..-3}/{-2}.js"))->toEqual(
      PathRebuild.Ok([Range(0, -3), Sep, Range(-2, -2), Literal(".js")]),
    )
  })
})

describe("print", () => {
  test("example", () => {
    let parsed = parseExn("{0..-3}/{-2}.js")
    expect(print(~sep="/", parsed, "file.sql"))->toEqual(Pervasives.Ok("file.js"))
  })
})
