@val external describe: (string, @uncurry (unit => unit)) => unit = "describe"
@val external test: (string, @uncurry (unit => unit)) => unit = "test"

type e<'a>
@val external expect: 'a => e<'a> = "expect"
@send external toBe: (e<'a>, 'a) => unit = "toBe"
@send external toEqual: (e<'a>, 'a) => unit = "toEqual"
