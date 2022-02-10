const { transform } = require("./index.js");

test("parse error", () => {
  expect(() => transform("{1..")).toThrowErrorMatchingInlineSnapshot(`
    "Unexpected end of string. Did you forget to close a range?
    {1..
        ^"
  `);
});

test("print error", () => {
  expect(() => transform("{0..-1}")("/foo/bar.js"))
    .toThrowErrorMatchingInlineSnapshot(`
    "An absolute path cannot be used as a source path:
    /foo/bar.js"
  `);
});

test("normal", () => {
  expect(transform("{0..-2}.json")("foo/bar.js")).toMatchInlineSnapshot(
    `"foo/bar.json"`
  );
});
