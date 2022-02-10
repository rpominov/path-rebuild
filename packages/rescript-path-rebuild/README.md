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
switch PathRebuild.make("new_root/{0}_new/{1..-3}/{-2}.json") {
| Error(msg) => Js.Console.error(msg)
| Ok(transform) =>
  switch transform("some/path/to/a/file.js") {
  // will log "new_root/some_new/path/to/a/file.json"
  | Ok(newPath) => Js.Console.log(newPath)
  | Error(msg) => Js.Console.error(msg)
  }
}

// will log "new_root/some_new/path/to/a/file.json"
transformExn("new_root/{0}_new/{1..-3}/{-2}.json", "some/path/to/a/file.js")->Js.Console.log
```

## API

### `make: string => result<(~sep: string=?, string) => result<string, string>, string>`

Turns a pattern in to a transform function. Returns a `result` because parsing the pattern may produce a error.

The transform function takes a source path and returns a path transformed according to the pattern. It also returns a `result` that will be a `Error` if the source path is unsupported (currently the only such canse is an absolute paths that the library doesn't support).

You can also pass a custom separator.
It will be used to split the source path into parts,
and will be inserted in place of `/` in the pattern.
By default [path.sep](https://nodejs.org/api/path.html#pathsep) is used.

For the `pattern` syntax documentation go [here](https://github.com/rpominov/path-rebuild#pattern-syntax).

### `transformExn: (string, ~sep: string=?, string) => string`

Same as `make`, but instead of returning a result both functions throw exceptions (`Js.Exn.Error`).

Since we ended up with a function that returns a function,
it's merged into a single function due to first class currying support.
But you still can take advantage of pattern parse caching,
if you call `transformExn` with one argument,
and then use the remaining curried function multiple times.
