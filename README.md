# rescript-path-rebuild

Transform a file path by splitting the original path into an array of parts
and defining a new path in terms of indices of the parts.

```
"some/path/to/a/file.js" -> ["some", "path", "to", "a", "file", ".js"]
"new_root/{0}_new/{1..-3}/{-2}.json" -> "new_root/some_new/path/to/a/file.json"
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

```

## Caveats
