@val external describe: (string, @uncurry (unit => unit)) => unit = "describe"
@val external test: (string, @uncurry (unit => unit)) => unit = "test"

type e<'a>
@val external expect: 'a => e<'a> = "expect"
@send external toBe: (e<'a>, 'a) => unit = "toBe"
@send external toEqual: (e<'a>, 'a) => unit = "toEqual"
@send external toMatchSnapshot: e<'a> => unit = "toMatchSnapshot"

@val external each: (array<'a>, . string, 'a => unit) => unit = "test.each"
let each = (data, title, f) => each(data)(. `${title} (%#) %p`, f)

@val external each2: (array<('a, 'b)>, . string, ('a, 'b) => unit) => unit = "test.each"
let each2 = (data, title, f) => each2(data)(. `${title} (%#) %p %p`, f)
