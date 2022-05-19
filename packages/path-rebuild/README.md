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

const transform = createTransform("{0..-2}.json");
console.log(transform("path/file.js")); // -> path/file.json
```

## API

### `createTransform(pattern: string): (sourcePath: string, [separator: string]) => string`

Creates a transform function. Throws a error if the `pattern` is incorrect.

The transform function takes a `sourcePath` and returns a path transformed according to the `pattern`.

You can also pass a custom separator.
It will be used to split the `sourcePath` into parts,
and will be inserted in place of `/` in the pattern.
By default [path.sep](https://nodejs.org/api/path.html#pathsep) is used.

For the pattern syntax documentation go [here](https://github.com/rpominov/path-rebuild).
