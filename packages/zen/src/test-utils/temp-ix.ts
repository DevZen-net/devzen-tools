// import { from, IterableX } from 'ix/Ix.iterable'
// import { filter, map } from 'ix/Ix.iterable.operators'
//
// // The problem with Ix
//
// // Issue #1: from() works only with Iterables, and not all values or objects in JS are Iterables. Most notable, the real plain old JS objects (the famous `{foo: 'bar'}`) object, is not Iterables. Singles are also not iterable naturally, but z.loop() doesnt choke on them (unless you want to).
//
// //Famous libraries like lodash, have an `_.each()` and many other functions, that work with "collections", which are not necessarily Iterables. This source/input FAILs in from()
//
// const sourceThatFails = () => ({ a: 1, b: 2 })
// try {
//   // @ts-expect-error OK SIIX (Such Is Ix)
//   const resultsFail = from(sourceThatFails()).pipe
// } catch (e) {
//   // throws `TypeError: Input type not supported`
// }
//
// // The magic of `z.loop()` is that it works with any value and not just Iterables. And it works the same, for all. And it conveys every possibly useful information, so it can unify the iteration in every aspect: high level or low level programming.
//
// // Instead of accepting only Iterables and their nested values, it can represent ANY value (even Singles), as an Iterable (called the `LoopGenerator`, powered by Generators & AsyncGenerators). And this iteration will be as high or as low level as we want. The `loop()` and family all obey to the easy to use `LoopOptions`, shifting the focus on either nested values & keys or props & props values, filtering by inherited, string or symbols, methods* etc.
//
// const source = function* () {
//   yield 1
//   yield 2
//   yield 3
//   yield 4
// }
//
// const source2 = () => [1, 2, 3, 4] as const
//
// const results = from(source2()).pipe(
//   filter((x) => x % 2 === 0),
//   // map(x => x * x)
//   map((x, idx) => {
//     console.log('item, key = ', x, idx)
//     return 'toString:' + x
//   }),
//   // Issue #3 - no input as 3rd param
//   // @ts-ignore
//   map((x, idx, WHERE_IS_INPUT) => x)
// )
//
// // Issue #4: IterableX is returning ONLY the item! Not even the `idxOrKey` is passed to the result. Of course there is no input, no options, no metadata...
// for (let item of results) {
//   console.log(`Next: ${item}`)
// }
//
// // Despite all those criticisms, IxJS has some great ideas within it (stemming from the amazing RxJS) and the `.pipe()` mechanism for one, is certainly very useful and might be adopted in future generations of Zen ( where `.pipe()` will simply be returns a new `LoopGenerator`, with iteration records projected & filtered according to the operators passed in `pipe()`).
//
// // On the other hand, z.loop() has a different focus. It's not trying to be, at least in this version, a full-blown reactive or Pull or Push or Async or X specific use case programming library. It's only trying to get the *loop* right!
//
// // Be a simple, yet powerful, iteration library, that can handle any value and all the quirks of JS and TS, and can be used in any context, from high level to low level programming. It's trying to be the `lodash` of iteration, but with a twist: it can handle any value, not just `collections` or `Iterables` or other constraints.
// // With the build in ability to extend base classes (class MyMap extends Map {}) it is obvious that values in JS need a next level iteration library to cater for all of their needs. Building on top of `loop()`, `map()`, `filter()` & `reduce()`, we create the basis of implementing all the other higher level functions, such as those in popular utility belt lodash.
