# path-rebuild

Transform a file path by splitting the original path into an array of parts
and defining a new path in terms of indices of the parts:

```
       "some/path/to/a/file.js"
                  ↓
["some", "path", "to", "a", "file", ".js"]  +  "new_home/{0}_new/{1..-3}/{-2}.json"
                                            ↓
                          "new_home/some_new/path/to/a/file.json"

```

Examples:

- `{0..-1}`: no modifications (`foo/baz.js -> foo/baz.js`)
- `{0..-2}.json`: change the extension to `.json` (`foo/baz.js -> foo/baz.json`)
- `dir/{0..-1}`: move the entire path to a different directory (`foo/baz.js -> dir/foo/baz.js`)
- `{0..-3}/prefix_{-2..-1}`: add a prefix to the file name (`foo/baz.js -> foo/prefix_baz.js`)
- `{0..-3}/{-2}_postfix{-1}`: add a postfix to the file name (`foo/baz.js -> foo/baz_postfix.js`)
- `{0..-3}/sub/{-2..-1}`: add a sub directory (`foo/baz.js -> foo/sub/baz.js`)

---

For the API documentation, go to the package corresponding to your programming language:

- [JavaScript](./packages/path-rebuild)
- [ReScript](./packages/rescript-path-rebuild)

### Separator

`/` is a special character. It will be replaced with a [platform dependent separator](https://nodejs.org/api/path.html#pathsep) in the final output.

Examples:

```js
// On Windows

const transform = createTransform("{0..-3}/sub/{-2..-1}");
transform("foo\\bar.js"); // -> foo\sub\bar.js
```

```js
// On Linux

const transform = createTransform("{0..-3}/sub/{-2..-1}");
transform("foo/bar.js"); // -> foo/sub/bar.js
```

### Numerical ranges

- `{n}`: insert the `n`'th part of the source path
- `{n..m}`: insert `n` through `m` (inclusive) parts of the source path

Where `n` and `m` can be negative numbers, indicating an offset from the end of the parts sequence.
`-1` corresponds to the last item.

A range can collapse if there’re no parts corresponding to the parameters.
If a range collapses, and it’s followed by the separator symbol `/`, it will be ignored:

```js
const transform = createTransform("{-5..-4}/{-3..-1}");

// {-5..-4} -> collapsed
// / -> ignored, because the preceding range has collapsed
// {-3..-1} -> foo/bar.js
transform("foo/bar.js"); // -> foo/bar.js
```

When a range like `{n..m}` is interpreted,
a [platform dependent separator](https://nodejs.org/api/path.html#pathsep) is inserted between the parts.
But not before the part that corresponds to the [file extension](https://nodejs.org/api/path.html#pathextnamepath):

```js
const transform = createTransform("{-3..-1}");

// -3 -> bar
// -2 -> baz
// -1 -> .js
// `/` is inserted between `bar` and `baz`, but not before `.js`
transform("foo/bar/baz.js"); // -> bar/baz.js
```

For the consistency, if the source path has no extension,
`-1` will correspond to an empty string:

```js
const transform = createTransform("{-3..-1}");

// -3 -> bar
// -2 -> baz
// -1 ->
transform("foo/bar/baz"); // -> bar/baz
```

### Predefined ranges

You can also use special ranges derived from [path.parse()](https://nodejs.org/api/path.html#pathparsepath).

```
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
```

- `{root}`: inserts `parsed.root`,
- `{dir}`: insert `parsed.dir` 
- ... and so on

```js
const transform = createTransform("{dir}/sub/{name}.json");
transform("foo/bar.js"); // -> foo/sub/bar.json
```

### Root

The root as defined by `path.parse()` cannot be inserted using the [numerical ranges](#numerical-ranges).
If the path to be transformed has a root, it will be stripped before splitting the path into the parts.
If you want to have the root in your final path, make it explicit using `{root}` or `{dir}`:

```js
const withoutRoot = createTransform("{0..-2}.json");
const withRoot = createTransform("{root}{0..-2}.json");

withoutRoot("/foo/bar.js"); // -> foo/bar.json
withRoot("/foo/bar.js"); // -> /foo/bar.json
```

### Escaping

`%` is the escape character.

- `%{`: inserts a `{`
- `%}`: inserts a `}`
- `%/`: inserts a `/`
- `%%`: inserts a `%`
