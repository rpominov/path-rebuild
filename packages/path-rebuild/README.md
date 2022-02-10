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

## Installation

```sh
npm i path-rebuild
```

## Example

```js
const { createTransform } = require("path-rebuild");

const transfrom = createTransform("new_root/{1..0}_new/{1..-3}/{-2}.json");

// will log "new_root/some_new/path/to/a/file.json"
console.log(transfrom("some/path/to/a/file.js"));
```

## API

### `createTransform(pattern: string): (sourcePath: string, [separator: string]) => string`

Creates a transform function.
The transform function takes a `sourcePath` and returns a path transformed according to the `pattern`.
You can also pass a custom separator.
It will be used to split the `sourcePath` into parts,
and will be inserted in place of `/` in the pattern.
By default [path.sep](https://nodejs.org/api/path.html#pathsep) is used.

For the `pattern` syntax documentation go [here](https://github.com/rpominov/path-rebuild#pattern-syntax).
