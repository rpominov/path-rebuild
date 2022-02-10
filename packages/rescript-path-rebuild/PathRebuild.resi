let make: string => result<(~sep: string=?, string) => result<string, string>, string>

let transformExn: (string, ~sep: string=?, string) => string
