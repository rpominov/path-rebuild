# rescript-path-rebuild

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
npm i rescript-path-rebuild
```

In your `bsconfig.json` add it to `bs-dependencies`

```
{
  ...,
  "bs-dependencies": [..., "rescript-path-rebuild"],
}
```

## Example

```rescript
let transform = PathRebuild.make("{0..-2}.json")->Belt.Result.getExn
transform("path/file.js")->Js.log // -> path/file.json
```

## API

### `make: string => result<(~sep: string=?, string) => string, string>`

Turns a pattern into a transform function,
which takes a source path and returns a path transformed according to the pattern.
Returns a `result` because parsing a pattern may produce a error.

You can also pass a custom separator.
It will be used to split the source path into parts,
and will be inserted in place of `/` in the pattern.
By default [path.sep](https://nodejs.org/api/path.html#pathsep) is used.

For the pattern syntax documentation go [here](https://github.com/rpominov/path-rebuild).
