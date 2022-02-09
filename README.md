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

For further documentation, go to [packages/path-rebuild](./packages/path-rebuild) or to
[packages/rescript-path-rebuild](./packages/rescript-path-rebuild) 
if you're a [ReScript](https://rescript-lang.org/) user.
