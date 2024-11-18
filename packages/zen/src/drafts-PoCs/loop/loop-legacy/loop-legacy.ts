import { IsNever, ValueOf } from 'type-fest'
import {
  Any,
  AsyncIteratorOrGenerator,
  ILoopOptions,
  IteratorOrGenerator,
  Keys,
  loop as loop_implementation,
  MapIteratorEntries,
  ObjectPropTypes,
  Primitive,
  PropertyBag,
  SetIteratorEntries,
  SingleOrWeak,
  TypedArrayBigInt,
  TypedArrayNumber,
  Values,
} from '../../../code'

// Function Overloading - Signatures

/**
 * All Primitives, match before all others
 * @ignore
 */
export function loop<Tinput extends Primitive, TmapItemReturn = Tinput, TmapKeyReturn = null>(
  voidArgs: Tinput,
  options?: ILoopOptions<Tinput, null, Tinput, TmapItemReturn, TmapKeyReturn> & {
    props?: false | undefined
  }
): Generator<
  [
    TmapItemReturn, // Titem
    TmapKeyReturn, // idxOrKey
    1, // count
  ]
>

/**
 * Async TAsyncIteratorOrGenerator with `props: true (i.e "only"`) we return a sync Generator, even if input is async!
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<
  TasyncIteratorGenerator extends AsyncIteratorOrGenerator<any, any, any>,
  Titem = ValueOf<
    TasyncIteratorGenerator,
    Exclude<keyof TasyncIteratorGenerator, keyof AsyncGenerator | AsyncIterator<any>>
  >, // values of own props only, not generator items or non-own props Symbol.iterator, next etc etc
  Tprops = Exclude<keyof TasyncIteratorGenerator, keyof AsyncGenerator | AsyncIterator<any>>, // Exclude standard non-own props like Symbol.iterator, next() etc, allowing user props only!
  TmapItemReturn = Titem,
  TmapKeyReturn = Tprops,
>(
  asyncIteratorOrGeneratorProps: TasyncIteratorGenerator,
  options: ILoopOptions<
    Titem,
    Tprops,
    TasyncIteratorGenerator,
    TmapItemReturn,
    TmapKeyReturn
  > & {
    props: true
  }
): Generator<[TmapItemReturn, TmapKeyReturn, number]>

/**
 * Async variant, returning an AsyncGenerator, that these don't have indexes / keys on the items they emit. Options are anything but props: true
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<
  Titem,
  TasyncIteratorGenerator extends AsyncIteratorOrGenerator<Titem, TReturn, TNext>,
  TmapItemReturn = Titem,
  TmapKeyReturn = null,
  TReturn = void, // TReturn from AsyncGenerator<T, TReturn, TNext>
  TNext = void, // TNext from AsyncGenerator<T, TReturn, TNext>
>(
  asyncIteratorOrGenerator: AsyncIteratorOrGenerator<Titem, TReturn, TNext>,
  options?: ILoopOptions<
    Titem,
    null,
    TasyncIteratorGenerator,
    TmapItemReturn,
    TmapKeyReturn
  > & {
    props?: false | undefined
  }
): AsyncGenerator<[TmapItemReturn, TmapKeyReturn, number]>

// # TypedArray Number

/**
 * TypedArray with Number items
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<Tinput extends TypedArrayNumber>(
  typedArrayNumber: Tinput,
  options?: ILoopOptions<number, number, Tinput, any, any> & {
    props?: false | undefined
  }
): Generator<
  [
    number, // item value
    number, // numeric idx only for arrays
    number, // count
  ]
>

// # TypedArrayBigInt

/**
 * # TypedArray with BigInt items
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<Tinput extends TypedArrayBigInt>(
  typedArrayBigint: Tinput,
  options?: ILoopOptions<bigint, number, Tinput, any, any> & {
    props?: false | undefined
  }
): Generator<
  [
    bigint, // item value
    number, // numeric idx only for arrays
    number, // count
  ]
>

/**
 * # ArrayBuffer
 * @ignore
 */
export function loop<Tinput extends ArrayBuffer>(
  arrayBuffer: Tinput,
  options?: ILoopOptions<number, number, Tinput, number, number> & {
    props?: false | undefined
  }
): Generator<
  [
    number, // item value
    number, // numeric idx only for arrays
    number, // count
  ]
>

// ### Arrays ###

/**
 * Array normal items with indexes, only
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<TarrayItem, TmapItemReturn = TarrayItem>(
  arrayItems: TarrayItem[],
  options?: ILoopOptions<TarrayItem, number, TarrayItem[], TmapItemReturn, number> & {
    props?: false | undefined
  }
): Generator<
  [
    TmapItemReturn, // item value
    number, // numeric idx only for arrays
    number, // count
  ]
>

/**
 * # Array props: true
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<
  TinputArray extends any[],
  Toptions extends ILoopOptions<
    Titem,
    TarrayProps,
    TinputArray,
    TmapItemReturn,
    TmapKeyReturn
  > & {
    props: true
  } = { props: true },
  Titem = Values<TinputArray, Toptions>,
  TarrayProps = Keys<TinputArray, Toptions>,
  TmapItemReturn = Titem,
  TmapKeyReturn = TarrayProps,
>(
  arrayProps: TinputArray,
  // options?: Toptions
  options?: ILoopOptions<Titem, TarrayProps, TinputArray, TmapItemReturn, TmapKeyReturn> & {
    props?: true
  }
): Generator<
  [
    TmapItemReturn,
    TmapKeyReturn,
    number, // count
  ]
>

// ### Maps & Sets: they have any kind of keys (NOT just TObjectProps), even primitives, objects, symbols etc ###

/**
 * # Set entries first, then normal Set
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<TitemAndKey extends Any, TmapAndMapKeyReturn = TitemAndKey>(
  setEntries: SetIteratorEntries<TitemAndKey>,
  options?: ILoopOptions<
    TitemAndKey,
    TitemAndKey,
    SetIteratorEntries<TitemAndKey>,
    TmapAndMapKeyReturn,
    TmapAndMapKeyReturn
  > & {
    props?: false | undefined
  }
): Generator<
  [
    TmapAndMapKeyReturn, // item & key are the same for Set
    TmapAndMapKeyReturn, // Key
    number, // count
  ]
>

// @todo: Map props? Test and add!

/**
 * # Set items, without values, only keys (so items === keys)
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<Titem, TmapItemReturn = Titem, TmapKeyReturn = Titem>(
  set: Set<Titem>,
  options?: ILoopOptions<Titem, Titem, Set<Titem>, TmapItemReturn, TmapKeyReturn> & {
    props?: false | undefined
  }
): Generator<[TmapItemReturn, TmapItemReturn, number]>

/**
 * # Map entries first, then normal Map
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<Titem, Tkey, TmapItemReturn = Titem, TmapKeyReturn = Tkey>(
  mapEntries: MapIteratorEntries<Tkey, Titem>,
  options?: ILoopOptions<
    Titem,
    Tkey,
    MapIteratorEntries<Tkey, Titem>,
    TmapItemReturn,
    TmapKeyReturn
  > & {
    props?: false | undefined
  }
): Generator<
  [
    TmapItemReturn, // item
    TmapKeyReturn, // Key
    number, // count
  ]
>

/**
 * # Map normal
 * @ignore
 * // @todo: OLD, remove
 */
export function loop<
  Titem,
  Tkey,
  Tvalue extends Map<Tkey, Titem>,
  Toptions extends ILoopOptions<
    Titem,
    Tkey,
    Map<Tkey, Titem>, // @todo(524): Tvalue
    TmapItemReturn,
    TmapKeyReturn
  > & {
    props?: false | undefined
  },
  TmapItemReturn = Titem,
  TmapKeyReturn = Tkey,
>(
  map: Tvalue | Map<Tkey, Titem>,
  options?: Toptions
): Generator<
  [
    TmapItemReturn, // item
    TmapKeyReturn, // key
    number, // count
  ]
>

// ### All other Iterators / Generators come last (after Map & Set), so they don't match those. ###
/**
 * # Iterator # Generator with props: true
 * @ignore
 */
// // NEW BREAKING
// export function loop<
//   Titem,
//   // TinputGenerator extends Generator<any, any, any>,
//   TNext,
//   TReturn,
//   TinputGenerator extends Generator<Titem, TReturn, TNext>,
//   // Tprops = Exclude<keyof TinputGenerator, keyof Generator<any> | Iterator<any>>,
//   Toptions extends IloopOptions<
//     TitemValue,
//     Tprops,
//     TinputGenerator,
//     TmapItemReturn,
//     TmapKeyReturn
//   > & {
//     props: true
//   },
//   Tprops = PropsQuery<TinputGenerator, Toptions, never, keyof Generator<Titem>>,
//   TitemValue = ValuesQuery<TinputGenerator, Toptions, Titem, keyof Generator<Titem>>,
//   // Titem = ValueOf<
//   //   TinputGenerator,
//   //   // Exclude<keyof TinputGenerator, keyof Generator<any> | Iterator<any>>
//   //   TkeysQuery<TinputGenerator, Toptions, never, keyof Generator<any>>
//   // >, // values of props only, not iterator values,
//   TmapItemReturn = TitemValue,
//   TmapKeyReturn = Tprops,
// >(
//   generatorProps: TinputGenerator | Generator<Titem, TReturn, TNext>,
//   options: Toptions & {
//     props: true
//   }
//   // options?: Toptions | IloopOptions<
//   //   TitemValue,
//   //   Tprops,
//   //   TinputGenerator,
//   //   TmapItemReturn,
//   //   TmapKeyReturn
//   // >
// ): Generator<[TmapItemReturn, TmapKeyReturn, number]>

// @todo: OLD, remove
export function loop<
  TinputIteratorGenerator extends IteratorOrGenerator<any, any, any>,
  Toptions extends ILoopOptions<
    Titem,
    Tprops,
    TinputIteratorGenerator
    // TmapItemReturn,
    // TmapKeyReturn
  > & {
    props: true
  } = { props: true },
  TNext = void,
  TReturn = void,
  Titem = Values<TinputIteratorGenerator, Toptions>,
  Tprops = Keys<TinputIteratorGenerator, Toptions>,
  TmapItemReturn = Titem,
  TmapKeyReturn = IsNever<Tprops> extends true ? null : Tprops, // @todo: temp, remove and just use null (or never?)
>(
  iteratorOrGeneratorProps: TinputIteratorGenerator,
  options: Toptions
  // options: LoopOptions<
  //   Titem,
  //   Tprops,
  //   TinputIteratorGenerator,
  //   TmapItemReturn,
  //   TmapKeyReturn
  // > & {
  //   props: true
  // }
): Generator<[TmapItemReturn, TmapKeyReturn, number]>

/**
 * TIteratorOrGenerator normal Iterator / Generator items
 * @ignore
 * @todo: OLD, remove
 */
export function loop<
  Titem,
  Tinput extends Generator<Titem, TReturn, TNext>,
  TmapItemReturn = Titem,
  TmapKeyReturn = null,
  TReturn = void, // TReturn from Generator<T, TReturn, TNext>
  TNext = void, // TNext from Generator<T, TReturn, TNext>
>(
  iteratorOrGenerator: Generator<Titem, TReturn, TNext>,
  options?: ILoopOptions<Titem, null, Tinput, TmapItemReturn, TmapKeyReturn> & {
    props?: false | undefined
  }
): Generator<
  [
    TmapItemReturn,
    TmapKeyReturn, // idxOrKey, defaults to void
    number, // count
  ]
>

/**
 * # RegExp: special case so RegExp is not picked up as a Single / PropBag
 * @ignore
 * @todo: OLD, remove
 */
export function loop<Tinput extends RegExp, TmapItemReturn = Tinput, TmapKeyReturn = null>(
  regExp: Tinput,
  options?: ILoopOptions<Tinput, null, Tinput, TmapItemReturn, TmapKeyReturn> & {
    props?: false | undefined
  }
): Generator<
  [
    TmapItemReturn,
    TmapKeyReturn, // idxOrKey
    1, // count
  ]
>

/**
 * # TSingle # isSingle or Weak items (non-isMany) // @todo: add typings for props: 'all' | true
 * @ignore
 * @todo: OLD, remove
 */
export function loop<
  Tinput extends SingleOrWeak,
  TmapItemReturn = Tinput,
  TmapKeyReturn = null,
>(
  singleValue: Tinput,
  options?: ILoopOptions<Tinput, null, Tinput, TmapItemReturn, TmapKeyReturn> & {
    props?: false | undefined
  }
): Generator<
  [
    TmapItemReturn, // mapped Titem
    TmapKeyReturn, // mapped idxOrKey
    1, // count
  ]
>

// Fall back for anything else

/**
 * PropBags: RealObjects (pojsos & instances) & Functions (eg class) & IArguments
 * These can have keys of type string | symbol only
 * @ignore
 * @todo: OLD, remove
 */
export function loop<
  // Toptions extends IloopOptions<Titem, Tprops, TinputObj, TmapItemReturn, TmapKeyReturn>,
  TinputObj extends PropertyBag<Titem, ObjectPropTypes, Any>,
  Titem = ValueOf<TinputObj>,
  Tprops = keyof TinputObj,
  TmapItemReturn = Titem,
  TmapKeyReturn = Tprops,
>(
  propBagOrArgs: TinputObj,
  options?: ILoopOptions<Titem, Tprops, TinputObj, TmapItemReturn, TmapKeyReturn>
  // options?: Toptions // breaks the type inference
): Generator<
  [
    TmapItemReturn,
    TmapKeyReturn,
    number, // count
  ]
>

/**
 * # z.loop()
 *
 * `z.loop()` returns an `Iterator` (or `AsyncIterator` if needed) of `[item, idxOrKey, count]` tuples **that work the same way**, with ANY kind of "many" value types (a.k.a collections OR iterables) such as `Object`, `Array`, `Arguments`, `Map`, `Set`, `Iterator`, `Generator`, `AsyncIterator`, `AsyncGenerator` etc. It also iterates on single values once, on the value it self (by default, can opt out).
 *
 * # z.loop() Introduction
 *
 * Think of it as a "universal" `for...of loop(val) {...}`, aiming to be the only iterator style you'll ever need to use!
 *
 * Similarly to what `_.each()` tried to do more than a decade ago, using the same syntax/code for both "collections" of `{}` and `[]` values, now `z.loop()` promises to work the same way, for any value type that has "many" values (and more).
 *
 * And of course it powers its own [`z.each`](/functions/each.html) function, along with the usual [`map`](/functions/map.html), [`filter`](/functions/filter.html), [`take`](/functions/take.html), [`reduce`](/functions/reduce.html) etc offsprings.
 *
 * # z.loop() Reasoning
 *
 * In the JS world there is no way to iterate **on everything**, with a unified syntax.
 *
 * * `Array.forEach()` works only with Arrays, Lodash `_.each()` works only with objects and arrays (but `_.filter` again works only with arrays). The iterator form of `for...of` works only with iterables (array is one, objects in general are not). There are so many different ways to iterate on different types of values, and they all have different syntax and incompatibilities.
 *
 * * Inconsistent order of keys & values: Lodash `_.each()` & `[].forEach()` give us the value first (eg `_.each(obj, (val, key) => {...})`), while iterating on Maps with `for...of` gives you the key first (eg `for (const [key, value] of myMap) {...}`).
 *
 * * The arrival of `Set` & `Map` and `Iterator` & `Generator`, has made the situation even more complex, since popular ways like `_.each` don't apply on them, and most people resolve to `for...of` or `Array.from()`, which are verbose, non-standard,inconsistent and hence error-prone.
 *
 * In general, there is no way to iterate on both an `Object` or `Array`, `Map` / `Map Entries`, `Set` / `Set Entries`, `Generator`, `AsyncIterator` etc with an easy & ubiquitous syntax.
 *
 * With `z.loop()` you can iterate on **any value** via:
 *
 *     for (const [value, idxOrKey] of z.loop(anyValue)) {...}
 *
 * and it will work as expected everywhere.
 *
 * Zen `loop()` exposes all nested items/values as a tuple with 3 parts: `[item, idxOrKey?, count?]` for each item/element/entry of an [`z.isMany()`](/functions/isMany.html) (or for [`z.isSingle()`](/functions/isSingle.html) types as well if `loopSingles: true`).
 *
 * # Filtering, Mapping & Taking
 *
 * You can `filter`, `map`, `mapKeys` and `take` the items/keys that are iterated over, using the relevant callbacks in the options. For example:
 *
 * ```javascript
 * for (const [val, key, count] of z.loop(value, {
 *   filter: (val, key, count) => val > 10,   // filtering always applied first
 *   take: 5,                                 // then taking, if filter has passed
 *   map: (val, key, count) => val * 2,       // then mapping, if filter & take have both passed
 * }) {...}
 * ```
 *
 * In any of these callbacks:
 *
 * * you can return the `STOP` special value, to stop the iteration, or a `STOP(returnValue)` to both stop and return the last value (without iterating again)! Effectively, this turns every callback into a `take`!
 * * you can return a `NOTHING` symbol to filter out the item. Effectively, it turns every callback into a `filter` as well.
 *
 * Note: all callbacks are synchronous, but async support should be possible (but NOT IMPLEMENTED yet)!
 *
 * # `z.loop` Counting
 *
 * A common pattern is to count looped items, so why not include it in the `loop()`? You can (optionally) use the `count` in the returned tuple, to get the number of items that have been looped so far:
 *
 * ```javascript
 * const array = ['foo', 'BAD', 'bar', 'BAD', 'baz']
 *
 * for (const [item, idx, count] of z.loop(array, {filter: v => v !== 'BAD'})) {
 *   console.log({item, idx, count})
 * }
 *
 * // {item: 'foo', idx: 0, count: 1}
 * // {item: 'bar', idx: 2, count: 2}
 * // {item: 'baz', idx: 4, count: 3}
 * ```
 *
 * * The `count` is 1-based (unlike array indexes that are 0-based historically), hence the first item callback will receive a 1, i.e 1st item to be considered.
 *
 * * Also, it excludes counting of items that have been rejected / filtered out:
 *    * If `filter` callback rejects an item, the `count` will not be incremented and next item will receive the same `count` as before in the callback.
 *    * When you finally receive `count` in the `for...of loop(v){ log(count) }, it will be the nth item that has passed filters (and taking, mapping etc).
 *
 *    * Similarly, for sparse Arrays (even without filter) missing items are not iterated or `count`-ed for, hence `count` is NOT `idx` (and often more useful).
 *
 * It's obvious that `count` deviates from the array `idx` by more than a `+1` for filtered items.
 *
 * # Keys & Indexes VS Props
 *
 * By default, `loop()` iterates on the natural `keys` or `indexes` of the corresponding `elements` / `items`  of the various input values (eg `Array` indexes, `Map` keys & entries, Iterator/Generator values etc).
 *
 * But you can also **choose** to iterate on the **raw** `props` of the underlying JS `Object`, by using `options.props: true`.
 *
 * This is powered by [`z.keys`](/functions/keys.html) & fully supports [`IkeysOptions`](/interfaces/IkeysOptions.html), since [`IloopOptions`](/interfaces/IloopOptions.html) extends it!
 *
 * Note `options.props: 'all'` works also (includes both props & natural indexes/keys, in same iterable) but it can be ambiguous & is experimental. The `count` is restarted in each part though & props come first!
 *
 * # Map & Set `.entries()`
 *
 * You can also pass `map.entries()` & `set.entries()` directly to `z.loop()` and get the same loop behaviour.
 *
 * Note: `mapOrSet.values()` & `mapOrSet.keys()` is experimental - they are  supported with a hack, as they can't be distinguished from `.entries()` at runtime. In short `loop()` on `.values()`/`.keys()` work with all values except **arrays of exact length 2** as values/keys!
 *
 * @see [`isMapIterator`](/functions/isMapIterator.html) & [`isSetIterator`](/functions/isSetIterator.html).
 *
 * # `isSingleOrWeak` values
 *
 * All other [`z.isSingleOrWeak`](/functions/isSingleOrWeak.html) values iterate on the single value itself as, **the first and only iteration**.
 *
 * You can also opt to be `strict: true` about it, and throw an error if these values are passed. Or just ignore iterating over them, via `loopSingles: false` where `loop()`. In summary:
 *
 * - `strict: false` (default) no worries if an `isSingle` input is passed
 * - `strict: true` throws if an `isSingle` input is passed.
 * and
 * - `loopSingles: true` (default) iterate on `isSingle` input value itself, an iteration of 1 item.
 * - `loopSingles: false` ignore / don't iterate on `isSingle` inputs.
 *
 * # Iterators / Generators (sync and Async)
 *
 * (Async) Iterators/Generators work out of the box, by returning an `Generator` or `AsyncGenerator`. You need to use the `for await` syntax to iterate on the `z.loop()` result if input is an `AsyncIterator/Generator`:
 *
 * ```javascript
 * function async* asyncGenerator() {
 *   yield await somePromise
 *   yield await anotherPromise
 * }
 *
 * for await (const [item, idxOrKey, count] of _.loop(asyncGenerator) {...}
 * ```
 *
 * In all cases, since Iterators/Generators can't be restarted, only their remaining items are iterated over, but the `count` starts at 1 at each `loop()` call, since there's no way to know the initial/remaining number of items in an Iterator/Generator.
 *
 * # Promises
 *
 * Currently, promises are treated as a single value, and not awaited. This means that if you pass a Promise to `z.loop()`, it will iterate on the Promise itself (if `loopSingles: true`, and not await on the resolved value:
 *
 * ```javascript *
 * for (const [val, idx, count] of z.loop(Promise.resolve([1, 2, 3, 4]))) {
 *   console.log({val, idx, count})
 * }
 * // {val: Promise<[1, 2, 3, 4]>, idx: undefined, count: 1}
 * ```
 *
 * Full Promises and `options.async` support coming soon!
 *
 * # Other Features / Recap
 *
 * - It works the same for all these different z.types such as `realObject`, `Array`, `Map`, `Set`, `Iterator`, `Generator`, both sync and Async!
 *
 * - Many options for filtering & limiting what is iterated over: hidden, own, inherited, Symbols on Objects, Set & Map items, enumerable & non-enumerable etc. The optionality is achieved via [`IloopOptions`](/interfaces/IloopOptions.html) (which extends [`TallKeysOptions`](/interfaces/TallKeysOptions.html))
 *
 * - It extends [`z.keys`](/functions/keys.html) to solve many limitations of iteration in Objects:
 *   - only-string keys are returned by `Object.keys`, `_.keys`, `_.each` and many other popular ways.
 *   - only the own props are returned with `Object.keys`, `_.keys`, `_.each` etc. All are returned with `for..in`
 *
 * - It solves limitations of normally iterating in Arrays:
 *
 *   - Using `for (let idx = 0; idx < arr.length; idx++) {...}` is verbose and error-prone by it-self - and where is the `item` in that anyway, you have to `item = arr[idx]` which sucks.
 *
 *   - Using `z.loop(array)` respects sparse Arrays (unlike `for (let idx = 0; idx < arr.length; idx++) {...}` that doesn't, looping over non-existent items and producing `undefined` for them).
 *
 * - You can `filter`, `map`, `mapKeys` and `take` the items that are iterated over using the relevant callbacks in the options.
 *
 * - Type safe & Type strong: `z.loop` returns the correct `item` & `idxOrKey` type for different input value types: arrays get an `[Titem, numericIdx]`, objects get `[Titem, string | symbol]`, Maps get `[Titem, any]` and so on, respecting the respective input types of nested items & keys passed ;-)
 *
 * @param anyValue any value (usually a collection / iterable / iterator / Map / Set). Note: `z.loop()` has too many overloads, not listed here for brevity. Any value is accepted, and it will be iterated appropriately.
 *
 * @param options IloopOptions
 */
export function loop(input, options) {
  return loop_implementation(input, options) as any
}
