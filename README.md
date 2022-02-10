# path-rebuild

Transform a file path by splitting the original path into an array of parts
and defining a new path in terms of indices of the parts:

```
       "some/path/to/a/file.js"
                  ↓
["some", "path", "to", "a", "file", ".js"]  +  "new_root/{0}_new/{1..-3}/{-2}.json"
                                            ↓
                          "new_root/some_new/path/to/a/file.json"

```

### Pattern syntax

- `{n}`: insert the `n`'th part of the source path
- `{n..m}`: insert `n` through `m` (inclusive) parts of the source path
- `/`: insert a platform dependent separator (`\` for Windows, `/` for Linux etc.)
- `%{`: insert a `{` character
- `%/`: insert a `/` character
- `%%`: insert a `%` character

Where `n` and `m` can be negative numbers, indicating an offset from the end of the parts sequence.
`-1` corresponds to the last item.

A range like `{n}` or `{n..m}` can collapse if there’re no parts corresponding to the parameters.
For example, with the source path `foo/bar.ext`, `{3}` will collapse
since it refers to the 4’th item while there’re only 3. Same with `{-5..-4}`.

If a range collapses, and it’s followed by a separator symbol `/`, that separator will be ignored.
For example, with the source path `foo/bar.ext` and pattern `{-5..-4}/{-3..-1}`
the output will be `foo/bar.ext`, not `/foo/bar.ext`.

When a range like `{n..m}` is interpreted, a platform dependent separator is inserted between the parts.
Except the last part! The last part corresponds to the file extension,
as defined by [path.extname(path)](https://nodejs.org/api/path.html#pathextnamepath).
When the last part is a part of a range, nothing is inserted between it and the previous part.
If the source path has no extension, `{-1}` will correspond to `""`.

### Examples

- `{0..-1}`: no modifications (`foo/baz.js -> foo/baz.js`)
- `{0..-2}.json`: change the extension to `.json` (`foo/baz.js -> foo/baz.json`)
- `root/{0..-1}`: move the entire path to a different root (`foo/baz.js -> root/foo/baz.js`)
- `{0..-3}/prefix_{-2..-1}`: add a prefix to the file name (`foo/baz.js -> foo/prefix_baz.js`)
- `{0..-3}/{-2}_postfix{-1}`: add a postfix to the file name (`foo/baz.js -> foo/baz_postfix.js`)
- `{0..-3}/sub/{-2..-1}`: add a sub directory (`foo/baz.js -> foo/sub/baz.js`)

---

For the API documentation, go to the package corresponding to your programming language:

- [JavaScript](./packages/path-rebuild)
- [ReScript](./packages/rescript-path-rebuild)
