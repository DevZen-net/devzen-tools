/*
@todo
* Classes: test & implement - like Functions?
* Add default generic types if not breaking
* Check the need for Tany vs any

* Future:
* - Implement `async` option
* - Examine removing `props: 'all'` & allow only `only` - throw error & fix types

@todo(353): Use `next(nextInput)` and optionally yield `returnValue` in the `loop()` iteration.
    * We 'll always pass a `next: TNext = (() =>)` function to the loop as 4rth arg (or 5th if `value` is also passed), and if called its ...args are also passed to the `genOrIter.next(...args)` of the iterator/generator at the next iteration! Dont worry about the first call to `next()` that is args-less, as the first call to `genOrIter.next()` is also args-less (and if you pass something ists lost anyway!).
    * We'll use a while(!genOrIterNextResult.done) { genOrIterNextResult = genOrIter.next(...args) }. When `done: true` is returned, we'll break the loop and yield the final value as `returnValue`, if `options.yieldReturnValue` & `value in genOrIterNextResult` is true & value !== undefined. If `options.yieldReturnValue === false`, then the `returnValue` is also returned on the `loop()` generator (as the original one did), but not yielded (to mimic the original behavior)!
*/
import { And, IfNever, IsAny, IsUnknown, Or, TypedArray } from 'type-fest'
import { isAnyJustIterator } from '../typezen/isAnyJustIterator'
import { Primitive } from '../typezen/isPrimitive'
import { IfBoxedPrimitive, isSingleOrWeak, IsSingleOrWeak } from '../typezen/isSingle'
import { realType, RealTypeNames } from '../typezen/realType'
import { type, TypeNames } from '../typezen/type'
import {
  IsAbsent,
  IsAnyOrUnknown,
  IsNestingObject,
  IsPropFalse,
  IsPropTrue,
  IteratorOrGenerator,
  InsideKeys,
  InsideValues,
  If,
  IfOr,
  Not,
} from '../typezen/type-utils'

import { isPass, isStop, NOTHING, STOP, Stop, StopClass } from '../typezen/utils'

import { ArrayBufferCursor, DataViewType } from './ArrayBufferCursor'
import { IKeys_DefaultOptions, IKeysOptions, keys, Keys, keys_DefaultOptions } from './keys'
import { Values } from './values'
import { takeToFunction } from './take'
import { isAsyncGenerator } from '../typezen/isAsyncGenerator'
import { isRef } from '../typezen/isRef'
import * as _ from 'lodash'
import { isAnyNumber } from '../typezen/isAnyNumber'
import { isStrictNumber } from '../typezen/isStrictNumber'
import { isTypedArray } from '../typezen/isTypedArray'
import { isArrayBuffer } from '../typezen/isArrayBuffer'
import { isSetIterator } from '../typezen/isSetIterator'
import { isMapIterator } from '../typezen/isMapIterator'
import { isGenerator } from '../typezen/isGenerator'
import { isPlainIterator } from '../typezen/isPlainIterator'

/*
Typing notes:
- Titem is the type of the nested items/elements/values of the passed collection / composite input value
- TidxKey is the type of the keys / indexes / props of the input collection value
- Tinput is the type of the actual input value
- TmapItemReturn is the return type of the map callback
- TmapKeyReturn is the return type of the mapKeys callback

The order should be always consistent, as above
 */

export type ItemsCallback<Titem, TidxKey, Tinput, TreturnType> = (
  item: Titem,
  idxOrKey: TidxKey,
  input: Tinput,
  /**
   * `count` is the number of items that have been emitted so far (including the current item, if it is emitted).
   *
   * * It is 1-based (unlike array indexes that are 0-based), hence the first item callback will receive a 1, i.e 1st item to be considered.
   *
   * * It excludes counting of items that have been rejected / filtered out by filtering before. This means that if your filter rejects an item, the count will not be incremented and next item will receive the same count. Therefore, count will deviate from the `idxOrKey` by more than a `+1` for filtered Arrays (& sparse Arrays, even without filter).
   *
   * * When `options.props` is used, props & items receive a separate `count`, so the `count` starts as 1 for each of them.
   *
   * * Iterators and Generators (sync & async) also receive a `count` parameter (if `options.iteratorCount: true` - the default). You can turn it off, if your iterator might exceed the number limit & and you want to avoid the overhead of counting. See [`IloopOptions`](/interfaces/IloopOptions.html)
   */
  count: number // @todo(153): LoopCount<Tinput, Toptions> but we're missing options, we could pass them along? Or pass Tcount directly?
) => TreturnType | Promise<TreturnType>

// Projection & filtering callbacks
export type FilterReturn = boolean | Stop | undefined

export type FilterCallback<Titem, TidxKey, Tinput> = ItemsCallback<
  Titem,
  TidxKey,
  Tinput,
  FilterReturn
>

export type TakeCallback<Titem, TidxKey, Tinput> = ItemsCallback<
  Titem,
  TidxKey,
  Tinput,
  FilterReturn
>

export type MapCallback<
  Titem,
  TidxKey,
  Tinput,
  TmapItemReturn extends any = Titem,
> = ItemsCallback<Titem, TidxKey, Tinput, TmapItemReturn> // needed here cause options.map

export type MapKeysCallback<
  Titem,
  TidxKey,
  Tinput,
  TmapKeyReturn extends any = TidxKey,
> = ItemsCallback<Titem, TidxKey, Tinput, TmapKeyReturn> // needed here cause options.map

export interface ILoopOptions<
  Titem = any,
  TidxKey = any,
  Tinput = any,
  TmapItemReturn extends any = any, // We get `Type NEW_TYPE is not assignable to type Tvalues` if TmapItemReturn as any = Titem
  TmapKeyReturn extends any = any, // as above
> extends IKeysOptions,
    IFilterOnlyOptions {
  /**
   * If `true`, only `isMany` input values (according to `z.isMany` or `option.allProps`) are allowed and iterated over (excluding `WeakMap` & `WeakSet` which can't be iterated at all). All other `z.isSingle` values (& `WeakMap` & `WeakSet`) throw an error.
   *
   * If it is false (default), single & Weak inputs are "iterated over" as a single item iteration. All `isSingle` input values are iterated as-is, even falsey values, which means you can safely use them in a `for...of loop()`, on top of any code block that operates on `isSingle` or `isMany` values!
   *
   * All `isMany` input values are iterated over props/indexes/items always the same way, regardless of this option.
   *
   * @default false / undefined
   */
  strict?: boolean

  /**
   * If `true` (default), `isSingleOrWeak` inputs are iterated **as a single item iteration** (of the input value itself).
   *
   * If `false`, input values are omitted from the "iteration", i.e they are not iterated at all, a 0-item loop.
   *
   * A soft alternative to `strict: true` that doesn't throw, but just omits the single values.
   *
   * @default true
   */
  loopSingles?: boolean

  /**
   * @todo: false NOT IMPLEMENTED YET
   *
   * If `true` (default), iterating over iterators/generators also receive a `count` parameter: the number of items that have been emitted so far.
   *
   * You can turn it off, if your iterator might exceed the number limit & and the small overhead of counting.
   *
   * See `count` parameter in [`TitemsCallback`](/types/TitemsCallback.html)
   *
   * @default true
   */
  loopCount?: boolean

  /**
   * @todo: true NOT IMPLEMENTED yet - treats Promises as normal items. Till then you can await it:
   *    for (const [item, idx] of z.loop(promises) console.log(await item, idx)
   *
   * If `false` (default), it treats nested items that are Promises, as normal items (i.e `for [item] of loop(promises) { item instanceOf Promise === true}
   *
   * If `true`, it awaits each `isPromise` item and passes the resolved value as the item in the loop. It returns an `AsyncGenerator`, so the `for...of` must be awaited, for example:
   *
   * ```javascript
   * const promises = [ Promise.resolve(1]),  Promise.resolve(2]),  Promise.resolve(3]), ]
   *
   * for await (const [item, idx, count] of z.loop(promises, {asyncUnwrap: true, filter: oddNumbers})) {
   *   item instanceOf Promise === false
   *   _.isNumber(item) === true
   *
   *   console.log({item, idx, count})
   * }
   * // {item: 1, idx: 0, count: 1
   * // {item: 3, idx: 2, count: 2
   *
   * Note: if input value is a Promise itself, it is NEVER awaited, but treated as an `isSingle` value. All you need to do is to `loop(await inputPromise)` though!
   *
   * @default false / undefined
   */
  asyncUnwrap?: boolean

  /**
   * Async option: NOTE: it applies only when looping with `z.each()`, not the normal `_.zloop()`
   *
   * If Async is enabled, then if `iteratee` callback returns a promise, it waits for it to resolve before continuing to the next element(s) & the `each()` call returns a `Promise<input>`, resolved when iteration is over.
   *
   * Async is enabled in two ways: Auto Async & Forced Async
   *
   * # Auto Async (default, async: undefined / missing)
   *
   * - If `async: undefined` (default), async is "Auto Async": it goes into async mode automatically, if the iteratee is a **real-runtime async function**.
   *
   * ```javascript
   *   // Auto Async mode, as iteratee is async
   *
   *   z.each(persons, async (person, idxKey) => registerPersonPromise(person))
   *
   *   // waits until each person is registered, before continuing to the next.
   * ```
   *
   * but
   *
   * ```javascript
   *    // No async mode, as iteratee is not marked as async (not it returns a Promise)
   *
   *    z.each(persons, (person, idxKey) => {
   *      registerPersonPromise(person)
   *      return null
   *    })
   *
   *    // DOES NOT wait until each person is registered, before continuing to the next. Effectively, all promises are dispatched simultaneously.
   * ```
   *
   * Note: there's a discrepancy between TypeScript's static evaluation of `async` functions and the actual runtime behavior. TypeScript will always treat as `async` function, any function determined to be returning a `Promise`, even if it is not marked as `async function(...){}`. For example:
   *
   * ```javascript
   *    // Our iteratee is an implicit async function, in the TypeScript world, because the iteratee is returning a promise. Causes a discrepancy between TypeScript static compilation & JS runtime:
   *
   *    z.each(persons, (person, idxKey) => registerPersonPromise(person) )
   *
   *    // DOES NOT wait until each person is registered, before continuing to the next. Effectively, all promises are dispatched simultaneously.
   * ```
   *
   * As iteratee is not a real `async function`, we have no way of knowing to enable the Auto Async mode at runtime. But TypeScript reports it as a Promise returning function, hence at compile type it is treated as async. In short:
   *    - TS assumes we're returning a `Promise<typeof input>` as `each()` result
   *    - But at runtime, we have no way of knowing this is an async function, hence it is treated as sync (and `each()` returns plain `input`).
   *
   * This can't be overcome AFAIK, SIJS (Such Is JavaScript). Just mark you promise-returning functions with `async` keyword, if you want to use Auto Async mode, or use `async: true` option below.

   * # Forced Async (`async: true`)
   *
   * - If we have an explicit `async: true`, it is forced into async mode: it awaits on each callback return (if its a promise), before continuing to the next (and `each()` returns a `Promise<input>`). The `each()` call returns a `Promise<input>`, resolved when iteration is over.
   *
   * ```javascript
   *    z.each(persons, (person, idxKey) => registerPersonPromise(person), {async: true})
   *
   *    // waits until each person is registered, before continuing to the next.
   * ```
   *
   * - If we have an explicit `async: number`, it is forced into async mode with given N parallelism: it awaits on each callback return, but processes up to the number of N tasks in parallel, before continuing to a next item (and `each()` returns a `Promise<input>`).
   * Note: `async: true` is equivalent to `async: 1`, i.e parallelism of 1 (see bellow).
   * Warning: items will be processed in a non-stable order (cause of unpredictable Promises resolving).
   * @todo: NOT IMPLEMENTED (any number is treated as true)
   *
   * ```javascript
   *    z.each(persons, (person, idxKey) => registerPersonPromise(person), {async: 3})
   *
   *    // waits until each person is registered, up to 3 persons at a time, before continuing to a next person.
   * ```
   *
   * - If we have an explicit `async: false`, it is forced into sync mode (even for real async functions). It does not await on each callback return, before continuing to the next (and `each()` returns the original `input` right away).
   *
   * Note: if input value is a Promise itself, it is NEVER awaited, but treated as an `isSingle` value. All you need to do is to `loop(await inputPromise)` though!
   *
   * @default undefined (Auto Async)
   */
  async?: boolean | number

  /**
   * A `filter` callback, used to filter out items as they are iterated over.
   *
   * If both `filter` and `map` are provided, `filter` is applied first, then `map` is applied to the result.
   *
   * WARNING: If you return `STOP` from the filter callback, the loop will stop immediately, without calling the `map` callback.
   *
   * WARNING: If you pass callbacks as a prop of options (eg `loop(input, {props: true, map: (val, prop) => val *2 })`, it will break the TypeScript type inference of the callback args. You should pass the callbacks as a separate argument in `loop()` parameters, eg `loop(input, {props: true}, {map: (val, prop) => val *2 })` if you want to get the perfect TypeScript ingerence of the callback args. See [`IloopCallbacks`](/interfaces/IloopCallbacks.html)
   *
   * Note: It's best to NOT type your callback arguments and let the type system infer them from the context. If you do type them, make sure it's the right types, otherwise the `loop()` signature detection will fail!
   */
  filter?: FilterCallback<Titem, TidxKey, Tinput>

  /**
   * A mapping callback (projection), used to map the items as they are iterated over.
   * If both `filter` and `map` are provided, `filter` is applied first, then `map` is applied to the result.
   *
   * WARNING: If you pass callbacks as a prop of options (eg `loop(input, {props: true, map: (val, prop) => val *2 })`, it will break the TypeScript type inference of the callback args. You should pass the callbacks as a separate argument in `loop()` parameters, eg `loop(input, {props: true}, {map: (val, prop) => val *2 })` if you want to get the perfect TypeScript ingerence of the callback args. See [`IloopCallbacks`](/interfaces/IloopCallbacks.html)
   *
   * Note: It's best to NOT type your callback arguments and let the type system infer them from the context. If you do type them, make sure it's the right types, otherwise the `loop()` signature detection will fail!   *
   */
  map?: MapCallback<Titem, TidxKey, Tinput, TmapItemReturn>
  // BREAKS: map() & props: true in Version 2
  // map?: MapCallback<NoInfer<Titem>, NoInfer<TidxKey>, NoInfer<Tinput>, NoInfer<TmapItemReturn>>
  // map?: NoInfer<MapCallback<NoInfer<Titem>, NoInfer<TidxKey>, NoInfer<Tinput>, NoInfer<TmapItemReturn>>>
  // map?: NoInfer<MapCallback<Titem, TidxKey, Tinput, TmapItemReturn>>

  /**
   * @todo: NOT IMPLEMENTED/tested yet
   *
   * A mapping function that can be used to map the keys that are iterated over.
   * If both `filter` and `map` are provided, `filter` is applied first, then `mapKeys` is applied to the result.
   *
   * WARNING: If you pass callbacks as a prop of options (eg `loop(input, {props: true, map: (val, prop) => val *2 })`, it will break the TypeScript type inference of the callback args. You should pass the callbacks as a separate argument in `loop()` parameters, eg `loop(input, {props: true}, {map: (val, prop) => val *2 })` if you want to get the perfect TypeScript ingerence of the callback args. See [`IloopCallbacks`](/interfaces/IloopCallbacks.html)
   *
   * Note: It's best to NOT type your callback arguments and let the type system infer them from the context. If you do type them, make sure it's the right types, otherwise the `loop()` signature detection will fail!
   */
  mapKeys?: MapKeysCallback<Titem, TidxKey, Tinput, TmapKeyReturn>

  /**
   * If `take` is a `number`, it limits the number of items that are iterated over.
   * If `take` is a `function`, it stops the iteration the 1st time it returns `false`
   *
   * If `options.props` & value is an `_.isObject()` other than `realObject`, it will iterate both on:
   * * the first `n` keys/idx of the value (eg the `Array` elements, `Set` items etc)
   * * the first `n` of props as well
   *
   * WARNING: If you pass callbacks as a prop of options (eg `loop(input, {props: true, map: (val, prop) => val *2 })`, it will break the TypeScript type inference of the callback args. You should pass the callbacks as a separate argument in `loop()` parameters, eg `loop(input, {props: true}, {map: (val, prop) => val *2 })` if you want to get the perfect TypeScript ingerence of the callback args. See [`IloopCallbacks`](/interfaces/IloopCallbacks.html)
   *
   * Note: No guaranteed order for property bags like `Objects`, `Sets`, `Maps` etc and return the same value type of input value.
   *
   * Note: It's best to NOT type your callback arguments and let the type system infer them from the context. If you do type them, make sure it's the right types, otherwise the `loop()` signature detection will fail!
   */
  take?: number | TakeCallback<Titem, TidxKey, Tinput>
}

/**
 * The sole purpose of callbacks to exist here in `IloopCallbacks`, separately from [`ILoopOptions`](/interfaces/ILoopOptions.html), is due to a Zen/TypeScript limitation, that doesn't properly infer the type of a callback's arguments (it ignores the options, probably cause they belong to same type interface before it has been initialized).
 *
 * So, in order to have perfect automatic inference of args, callbacks have to be in a separate 3rd argument in `loop()` parameters, `loop(input, options, callbacks)` eg
 *
 * `loop(input, {props: true}, { map: (val, prop) => val *2 })`
 *
 *    instead of the desired (but type-breaking)
 *
 * `loop(input, {props: true, map: (val, prop) => val *2 })`  // BREAKS TypeScript type inference of callback args
 *
 * Implementation-wise & at runtime, the 2 are equivalent
 *
 * @see [`ILoopOptions`](/interfaces/ILoopOptions.html)
 */
export interface IloopCallbacks<Titem, TidxKey, Tinput, TmapItemReturn = any, TmapKeyReturn = any> {
  /**
   * @see `filter` in [`IloopCallbacks`](/interfaces/IloopCallbacks.html)
   */
  filter?: FilterCallback<Titem, TidxKey, Tinput>

  /**
   * @see `map` in [`IloopCallbacks`](/interfaces/IloopCallbacks.html)
   */
  map?: MapCallback<Titem, TidxKey, Tinput, TmapItemReturn>
  /**
   * @see `mapKeys` in [`IloopCallbacks`](/interfaces/IloopCallbacks.html)
   */
  mapKeys?: MapKeysCallback<Titem, TidxKey, Tinput, TmapKeyReturn>

  /**
   * @see `take` in [`IloopCallbacks`](/interfaces/IloopCallbacks.html)
   */
  take?: number | TakeCallback<Titem, TidxKey, Tinput>
}

export const loopCallbackNames = ['filter', 'map', 'mapKeys', 'take'] as const
export type TloopCallbackNames = (typeof loopCallbackNames)[number]

export interface IFilterOnlyOptions {
  /**
   * If `true`, it respects the position of Array items, assigning the mapped/filtered array items to the same indexes (i.e sparse Arrays, will stay sparse). If `false`, it will always return a dense/compact Array.
   *
   * @default: false
   */
  sparse?: boolean

  /**
   * If `filterSingles: false` (default), it throws an error on any `z.isSingleOrWeak` input (eg `z.filter(123)` throws), as well as for `WeakMap` & `WeakSet` which are treated as singles (they can't be iterated over).
   *
   * Otherwise, if `filterSingles: true` see `singlesReject` option for explanation.
   *
   * @default true
   */
  filterSingles?: boolean

  /**
   * If `filterSingles: false` (default), it throws an error on any single input (eg `z.filter(123)` throws).
   *
   * BUT:
   *
   * If `filterSingles: true`, it returns a "clone" of the single value itself, if it passes the filterCb!
   *
   * So, if `filterCb` passes:
   * - `Primitives` are returned as is
   * - `BoxedPrimitive` instances & Boxed single values (eg Date, RegExp) are returned a new instance of the same type, with same underlying value. This is so it's consistent with the other collection functions (map, clone etc), which return new instances of the same type.
   *
   * Now, **if `filterCb` doesn't pass**, the return value depends on `singlesReject` option:
   *
   * If `singlesReject` is **truthy**, it returns that value. **Note that the default** is the special value `z.NOTHING` (which equals to `Symbol('z.NOTHING')`)
   *
   * If `singlesReject` is **falsey**, it returns what ever this value is (eg `undefined`) in most cases, except:
   *
   * - `number` becomes `NaN`
   * - `BigInt` also becomes `NaN`
   * - `Symbol` becomes `z.NOTHING` (i.e `Symbol('z.NOTHING')`)
   * - `Date` becomes `new Date(null)`, which is 1970-01-01T00:00:00.000Z
   * - `Function` becomes a `() => EMPTY` (i.e `() => Symbol('z.NOTHING')`)
   *
   * Boxed Primitives (please, please DONT use them!) are returned as new instances of the same type, with an "invalid" value:
   * - `Number` becomes `new Number(NaN)`
   * - `Boolean` becomes new Boolean(false) (which is bad!), but who uses Boolean instances anyway?
   * - `String` becomes `new String('')` - also bad to use!
   *
   * Note: All other `_.isObject` single input values (eg `Date`, `RegExp`, `BoxedPrimitive` instances) are returned as a new instance of same type, even if `filterCb` rejects them.
   *
   * @default: z.NOTHING (i.e `Symbol('z.NOTHING')`)
   */
  singlesReject?: any
}

export const filter_DefaultOptions: IFilterOnlyOptions = {
  filterSingles: false,
  singlesReject: NOTHING,
}

export interface ILoop_DefaultOptions<
  Tinput extends any = any,
  Titem extends any = any,
  TidxKey extends any = any,
> extends IKeys_DefaultOptions {
  loopCount: true
  loopSingles: true
  sparse: boolean // @todo: why not false ?

  // note: this belongs to Each_defaultOptions (not exist)
  async: undefined

  // callbacks
  map: MapCallback<Titem, TidxKey, Tinput, Titem>
  mapKeys: MapKeysCallback<Titem, TidxKey, Tinput, TidxKey>
  filter: () => true // FilterCallback<Titem, TidxKey, Tinput>
  take: () => true // TakeCallback<Titem, TidxKey, Tinput>
}

export const loop_DefaultOptions: ILoop_DefaultOptions = {
  loopCount: true,
  loopSingles: true,
  sparse: false,

  async: undefined,

  map: (val) => val,
  mapKeys: (val, key) => key,
  filter: _.constant(true),
  take: _.constant(true),
  ...filter_DefaultOptions,
  ...keys_DefaultOptions,
} as const // satisfies ILoopOptions @todo(111): why no working?

export type TypeErrorMessageUnsupportedInput =
  'Unsupported **input type**, neither `extends object` nor `extends Primitive` (weird, what is it?)'

export type TypeErrorMessageUnsupportedOptions =
  'Unsupported **options type**. Toptions failed IsAbsent, but not extends object (eg. of defaults)'

type IfTrue<T, Then = true, Else = false> = T extends true ? Then : Else
/**
 * LoopKeysOrValues returns the loop keys or values of the input value, those returned in the Loop Generator, depending on the input type and options.
 *
 * It's used by LoopKeys and LoopValues, and is the only type-function that decides what keys/items to return.
 *
 * @param Tinput The input value to iterate over
 * @param Toptions The options to use for the iteration
 * @param IsKeys If true, return the keys, otherwise return the values
 * @param isProject If true, it refers to project family functions (map, filter etc), and it modifies what is returned in the case of Singles: instead of returning the Single it self, ir returns the `InsideValues<Tinput>` (eg for Boxed Primitives. it returns the primitive itself, unboxing the Boxed Primitive) which is what all these project family functions use.
 */
export type LoopKeysOrValues<
  Tinput,
  Toptions extends ILoopOptions | undefined,
  IsKeys = true,
  isProject = false,
> =
  // prettier stay here!
  // Toptions extends undefined // note: IsAbsent here works!
  IsAbsent<Toptions> extends true
    ? LoopKeysOrValues<Tinput, ILoop_DefaultOptions, IsKeys, isProject>
    : Toptions extends object
      ? Tinput extends object
        ? IsSingleOrWeak<Tinput> extends true
          ? /* #############################################################################################
          ## Single Object input @todo: handle loopSingles: false / strict: true
      */
            | (Toptions extends { props: true | 'all' } & ILoopOptions
                  ? Exclude<
                      // Return #1: Keys or Values of Single Object Props
                      IsKeys extends true ? Keys<Tinput, Toptions> : Values<Tinput, Toptions>,
                      never
                    >
                  : never)

              // Return #2: Single Object itself (or Inside Value, i.e the primitive, of Boxed Primitive)
              | IfOr<
                  IsPropFalse<'props', Toptions>,
                  Toptions extends { props: 'all' } & ILoopOptions ? true : false,
                  IsKeys extends true
                    ? null
                    : IfTrue<
                        isProject,
                        // IfBoxedPrimitive<Tinput, InsideValues<Tinput>, Tinput>,
                        // what about Promise and other singles?
                        InsideValues<Tinput>,
                        Tinput
                      >,
                  never
                >
          : /* #############################################################################################
        ## Many Object input

        Many inputs are divided conceptually into:

         - `IsNestingObject` false, which are always
            - iterated over their own keys/values ONLY, irrespective of options.props!

         - `IsNestingObject`, which are iterated:
            - over their NestedKeys/Values, UNLESS props: true
            - over props as well, if props: true | 'all'

          Implementation
        */

            /* Get Nested Keys & Values:
          - only for IsNestingObject
          - only if props is NOT true (i.e only if props: false|undefined|'all')
       */
            | (IsNestingObject<Tinput> extends true
                  ? Or<
                      IsPropFalse<'props', Toptions>, // extends true ? true : false,
                      Toptions extends { props: 'all' } ? true : false
                    > extends true
                    ? Exclude<
                        // # RETURN #3: Nested Keys or Nested Values of IsNestingObject Tinput
                        IsKeys extends true
                          ? IfNever<InsideKeys<Tinput>, null, InsideKeys<Tinput>>
                          : InsideValues<Tinput>,
                        never
                      >
                    : never
                  : never) // add Props / PropsValues, if props: true or 'all', for all objects

              /* Get props:
          - if options.props: true | 'all', for all objects (NestingObjects & IsRealObjects)
          - If NOT IsNestingObject, irrespective of options.props
      */
              | (Or<
                  Not<IsNestingObject<Tinput>>,
                  Toptions extends { props: true | 'all' } ? true : false
                > extends true
                  ? Exclude<
                      // # RETURN #4: Keys or Values of Object Props, when props: true or 'all'
                      IsKeys extends true ? Keys<Tinput, Toptions> : Values<Tinput, Toptions>,
                      never
                    >
                  : never)
        : /* #############################################################################################
          ## Primitive input @todo: handle loopSingles: false / strict: true
      */
          Tinput extends Primitive
          ? // # RETURN #5: Single values are returned as is, with `null` key
            IsKeys extends true
            ? If<IsPropTrue<'props', Toptions>, never, null>
            : If<IsPropTrue<'props', Toptions>, never, Tinput>
          : `ERROR: LoopKeysOrValues: ${TypeErrorMessageUnsupportedInput}`
      : `ERROR: LoopKeysOrValues: ${TypeErrorMessageUnsupportedOptions}`
/**
 * Get the loop keys, depending on the input value type and options.
 * The legwork is done in LoopKeysOrValues<>, this is just a wrapper.
 */
export type LoopKeys<Tinput, Toptions extends IKeysOptions | undefined> = LoopKeysOrValues<
  Tinput,
  Toptions
>

/**
 * Get the loop items (a.k.a values), depending on the input value type and options
 * The legwork is done in LoopKeysOrValues<>, this is just a wrapper.
 */
export type LoopValues<Tinput, Toptions extends IKeysOptions | undefined> = LoopKeysOrValues<
  Tinput,
  Toptions,
  false
>

export type LoopCount<Tinput, Toptions> =
  // prettier stay here!
  IsSingleOrWeak<Tinput> extends true
    ? // @todo: cater for loopSingles & strict
      Toptions extends { props: true | 'all ' }
      ? Tinput extends Primitive
        ? number // @todo(131): props: true | 'all' & Primitive should be 0
        : number
      : 1
    : number

export const LOOP_SYMBOL = Symbol('z.loop')

export interface IloopMeta<Titem, TidxKey, Tinput, TmapItemReturn = any, TmapKeyReturn = any> {
  options: ILoopOptions<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>
  input: Tinput
  inputType: TypeNames
  inputRealType: RealTypeNames
  isSetOrMapValuesOrKeys: boolean
}

export interface LoopGenerator<
  Tresult = [any, any, number],
  Titem = any,
  TidxKey = any,
  Tinput = any,
  TmapItemReturn = Titem,
  TmapKeyReturn = TidxKey,
> extends Generator<Tresult> {
  [LOOP_SYMBOL]: IloopMeta<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>
  stop: () => void
  restart: Tinput extends IteratorOrGenerator<any> ? never : () => void
  reloop: Tinput extends IteratorOrGenerator<any>
    ? never
    : () => LoopGenerator<Tresult, Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>
}

export const isLoopGenerator = (val): val is LoopGenerator =>
  isGenerator(val) && Object.hasOwn(val, LOOP_SYMBOL)

export interface AsyncLoopGenerator<
  Tresult = [any, any, number],
  Titem = any,
  TidxKey = any,
  Tinput = any,
  TmapItemReturn = any,
  TmapKeyReturn = any,
> extends AsyncGenerator<Tresult> {
  [LOOP_SYMBOL]: IloopMeta<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>
  // NOT IMPLEMENTED YET - placeholders / ideation
  stop: () => void
  each: () => void
  restart: Tinput extends IteratorOrGenerator<any> ? never : () => void
  reloop: Tinput extends IteratorOrGenerator<any>
    ? never
    : () => LoopGenerator<Tresult, Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>
}

export const isAsyncLoopGenerator = (val): val is AsyncLoopGenerator =>
  isAsyncGenerator(val) && Object.hasOwn(val, LOOP_SYMBOL)

// // @todo: infer parameters & pass to IloopXxxx & meta.options etc
// export const isLoop = (val: any): val is ILoopGenerator => val[LOOP_SYMBOL] && (isGenerator(val))
// export const isLoopAsync = (val: any): val is IAsyncLoopGenerator => val[LOOP_SYMBOL] && (isAsyncGenerator(val))

export type GetLoopGenerator<
  // args - required
  Tinput extends any,
  Toptions extends ILoopOptions,
  TloopCallbacks extends IloopCallbacks<
    LoopValues<Tinput, Toptions>,
    LoopKeys<Tinput, Toptions>,
    Tinput
  > = IloopCallbacks<LoopValues<Tinput, Toptions>, LoopKeys<Tinput, Toptions>, Tinput>, //, TmapItemReturn, TmapKeyReturn>,
  // Note: we can NOT establish `Titem = LoopValues<Tinput, Toptions>` (& same for key) once & reuse it, cause TS doesn't like it!
  TmapItemReturn extends any = TloopCallbacks['map'] extends (...args: any) => infer MapReturn
    ? MapReturn
    : Toptions['map'] extends (...args: any) => infer MapReturn_in_Toptions
      ? MapReturn_in_Toptions // note: MapReturn_in_Toptions doesnt have the right type here always (when Toptions.xxx options are used, eg 'props: true'. Only MapReturn (from TloopCallbacks.map()) has the right type always! Reason is that when Toptions.map() is used (instead of TloopCallbacks.map()), Toptions is a "ghost", cause its accessed before it's initialized. But it's better than nothing. @todo(333): document with minimal example & post on TS issues
      : LoopValues<Tinput, Toptions>,
  TmapKeyReturn extends any = TloopCallbacks['mapKeys'] extends (
    ...args: any
  ) => infer MapKeysReturn
    ? MapKeysReturn // note: see TmapItemReturn
    : Toptions['mapKeys'] extends (...args: any) => infer MapKeysReturn_TOptions
      ? MapKeysReturn_TOptions
      : LoopKeys<Tinput, Toptions>,
  Tcount = LoopCount<Tinput, Toptions>,
> =
  // prettier stay here!
  // Toptions extends undefined // note: IsAbsent here works!
  IsAbsent<Toptions> extends true
    ? GetLoopGenerator<
        Tinput,
        ILoop_DefaultOptions,
        // @todo(111): why can't we simply use `TcallbackOptions`here? TS doesnt like it!
        IloopCallbacks<
          LoopValues<Tinput, ILoop_DefaultOptions>,
          LoopKeys<Tinput, ILoop_DefaultOptions>,
          Tinput
          //, TmapItemReturn, TmapKeyReturn // NOT NEEDED, potentially harmful!
        >
      >
    : IsAny<Tinput> extends true
      ? LoopGenerator<[any, any, number], any, any, any, TmapItemReturn, TmapKeyReturn>
      : IsUnknown<Tinput> extends true
        ? LoopGenerator<
            [unknown, unknown, number],
            unknown,
            unknown,
            unknown,
            TmapItemReturn,
            TmapKeyReturn
          >
        : And<
              IsPropFalse<'props', Toptions>,
              Tinput extends AsyncGenerator<any, any, any> ? true : false
            > extends true
          ? AsyncLoopGenerator<
              [TmapItemReturn, TmapKeyReturn, Tcount],
              LoopValues<Tinput, Toptions>,
              LoopKeys<Tinput, Toptions>,
              Tinput,
              TmapItemReturn,
              TmapKeyReturn
            >
          : LoopGenerator<
              [TmapItemReturn, TmapKeyReturn, Tcount],
              LoopValues<Tinput, Toptions>,
              LoopKeys<Tinput, Toptions>,
              Tinput,
              TmapItemReturn,
              TmapKeyReturn
            >

// @todo(182): pass the args? IloopInternalOptions<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn> =
interface IloopInternalOptions extends ILoopOptions<any, any, any> {
  map: MapCallback<any, any, any>
  mapKeys: MapKeysCallback<any, any, any>
  filter: FilterCallback<any, any, any>
  take: number | TakeCallback<any, any, any>
}

export function loop<
  Tinput extends any,
  Toptions extends ILoopOptions<Titem, TidxKey, Tinput>,
  Titem extends LoopValues<Tinput, Toptions> = LoopValues<Tinput, Toptions>,
  TidxKey extends LoopKeys<Tinput, Toptions> = LoopKeys<Tinput, Toptions>,
  TloopCallbacks extends IloopCallbacks<Titem, TidxKey, Tinput> = IloopCallbacks<
    Titem,
    TidxKey,
    Tinput
  >,
>(
  input: Tinput,
  options?: Toptions,
  callbacks?: TloopCallbacks
): GetLoopGenerator<Tinput, Toptions, TloopCallbacks> {
  const _options: IloopInternalOptions = {
    ...loop_DefaultOptions,
    ...filter_DefaultOptions,
    ...options,
    ...callbacks,
  }

  const loopMeta: IloopMeta<Titem, TidxKey, Tinput /*, TmapItemReturn, TmapKeyReturn*/> = {
    options: _options,
    input,
    inputType: type(input),
    inputRealType: realType(input),
    isSetOrMapValuesOrKeys: false,
  }

  // Grab the callbacks
  let { map: mapCb, mapKeys: mapKeysCb, filter: filterCb, take: takeNorCb, strict } = _options

  const takeCb = takeToFunction(takeNorCb)

  const decideStopOrFilter = (
    __item: any,
    __idxKey: any,
    __value: any,
    __count: number
  ): typeof NOTHING | [any, any /* TmapItemReturn, TmapKeyReturn */] | boolean | Stop => {
    const filterResult = filterCb(__item, __idxKey, __value, __count)

    if (isStop(filterResult)) return filterResult

    if (isPass(filterResult)) {
      const takeResult = takeCb(__item, __idxKey, __value, __count)
      // always STOP it take doesn't pass
      if (!isPass(takeResult)) return isStop(takeResult) ? takeResult : STOP

      const mapResult = mapCb(__item, __idxKey, __value, __count)
      if (isStop(mapResult)) return mapResult

      const mapKeysResult = mapKeysCb(__item, __idxKey, __value, __count)

      if (isStop(mapKeysResult)) return mapKeysResult

      return [mapResult, mapKeysResult] as [any, any]
    }

    return NOTHING // i.e filter out!
  }

  if (isSingleOrWeak(input) && strict) {
    const errorMsg = `z.loop(): strict = true, but wrong z.isMany type. With type(value) === '${type(input)}' & value =`
    throw new Error(`${errorMsg} ${String(input)}`)
  }

  const addLoopGeneratorMethods = <TGen extends Generator | AsyncGenerator>(
    generator: TGen
  ): TGen extends Generator ? LoopGenerator : AsyncLoopGenerator => {
    generator[LOOP_SYMBOL] = loopMeta
    generator['each'] = () => {
      throw new Error(`Zen: loop().each() is not implemented yet!`)
    }
    generator['stop'] = () => {
      throw new Error(`Zen: loop().stop() is not implemented yet!`)
    }
    if (isAnyJustIterator(input) && _options.props !== true) {
      generator['restart'] = null
      generator['reloop'] = null
    } else {
      generator['restart'] = () => {
        throw new Error(`Zen: loop().restart() is not implemented yet!`)
      }
      generator['reloop'] = () => {
        throw new Error(`Zen: loop().reloop() is not implemented yet!`)
      }
    }

    return generator as any
  }

  if (isAsyncGenerator(input) && _options.props !== true) {
    // @ts-ignore OK: TS2739: Type AsyncGenerator<any, void, unknown> is missing // : stop, restart, reloop, [LOOP_SYMBOL]
    const asyncGenerator: AsyncLoopGenerator = (async function* () {
      if (_options.props) {
        let count = 1 // count of items iterated
        for (const key of keys(input, { ..._options, props: true })) {
          const decision = decideStopOrFilter((input as any)[key as any], key, input, count)

          if (isStop(decision)) {
            if (decision instanceof StopClass) yield [decision.returnValue, key, count]
            break
          }
          if (decision !== NOTHING) {
            yield [decision[0], decision[1], count]
            count++
          }
        }
      }

      let count = 1 // count of items iterated
      for await (const item of input) {
        const decision = decideStopOrFilter(item, null, input, count)

        if (isStop(decision)) {
          if (decision instanceof StopClass) yield [decision.returnValue, null, count]
          break
        }
        if (decision !== NOTHING) {
          yield [decision[0], null, count]
          count++
        }
      }
    })()
    return addLoopGeneratorMethods(asyncGenerator) as any // @todo: remove as any
  }

  let propsHandled = false
  let handled = false

  // @ts-ignore OK: TS2739: Type Generator<any, void, unknown> is missing // : stop, restart, reloop, [LOOP_SYMBOL]
  const resultGenerator: LoopGenerator = (function* () {
    if (isRef(input) && _options.props) {
      propsHandled = true
      let count = 1 // count of items iterated
      for (const key of keys(input, { ..._options, props: true })) {
        const decision = decideStopOrFilter((input as any)[key as any], key, input, count)

        if (isStop(decision)) {
          if (decision instanceof StopClass) yield [decision.returnValue, key, count]
          break
        }
        if (decision !== NOTHING) {
          yield [decision[0], decision[1], count]
          count++
        }
      }
    }

    if (_options.props === true) return // props only

    if (isSingleOrWeak(input)) {
      handled = true
      if (_options.loopSingles) {
        const decision = decideStopOrFilter(input, null, input, 1)

        if (isStop(decision)) {
          if (decision instanceof StopClass) yield [decision.returnValue, null, 1]
        } else if (decision !== NOTHING) yield [decision[0], null, 1]
      }
    }
    // Array and arguments are similar
    else if (_.isArray(input) || _.isArguments(input)) {
      const isArray = _.isArray(input) // for performance
      handled = true

      let count = 1 // count of items iterated
      for (const idx in input) {
        const _idx: string | number =
          isArray && isAnyNumber(idx) && Number(idx) >= 0 ? Number(idx) : idx

        if (!((isArray && isStrictNumber(_idx)) || !isArray)) continue // omit array props at this part

        const decision = decideStopOrFilter(input[idx], _idx, input, count)

        if (isStop(decision)) {
          if (decision instanceof StopClass) yield [decision.returnValue, _idx, count]
          break
        }
        if (decision !== NOTHING) {
          yield [decision[0], decision[1], count]
          count++
        }

        // @todo: test this with a lazy async, if it makes a difference!
        // @todo: add to all other loops as well
        if ('originalTake' in takeCb && !isPass(takeCb(null, null, null, count))) break
      }
    } else if (isTypedArray(input)) {
      const typedArray: TypedArray = input
      handled = true

      let count = 1 // count of items iterated
      let idx = 0
      for (const val of typedArray) {
        const decision = decideStopOrFilter(val, idx, typedArray, count)

        if (isStop(decision)) {
          if (decision instanceof StopClass) yield [decision.returnValue, idx, count]
          break
        }
        if (decision !== NOTHING) {
          yield [decision[0], decision[1], count]
          count++
        }

        if ('originalTake' in takeCb && !isPass(takeCb(null, null, null, count))) break
        idx++
      }
    } else if (isArrayBuffer(input)) {
      if (!_options.dataViewType)
        throw new Error(
          `z.loop(): options.dataViewType is required to loop over an ArrayBuffer`
        )

      handled = true
      const arrayBuffer: ArrayBuffer = input
      const arrayBufferCursor = new ArrayBufferCursor(arrayBuffer, _options.dataViewType)

      let count = 1 // count of items iterated
      let idx = 0
      while (arrayBufferCursor.hasNext()) {
        const item = arrayBufferCursor.readNext()
        const decision = decideStopOrFilter(item, idx, arrayBuffer, count)

        if (isStop(decision)) {
          if (decision instanceof StopClass) yield [decision.returnValue, idx, count]
          break
        }
        if (decision !== NOTHING) {
          yield [decision[0], decision[1], count]
          count++
        }

        if ('originalTake' in takeCb && !isPass(takeCb(null, null, null, count))) break
        idx++
      }
    } else if (
      _.isMap(input) ||
      _.isSet(input) ||
      isSetIterator(input) ||
      isMapIterator(input)
    ) {
      handled = true
      const entriesOrValuesOrKeys = _.isMap(input) || _.isSet(input) ? input.entries() : input

      let count = 1 // count of items iterated
      let isSetOrMapValuesOrKeys = false
      for (const entryValueOrKey of entriesOrValuesOrKeys) {
        let key
        let item

        if (
          _.isArray(entryValueOrKey) &&
          entryValueOrKey.length === 2 &&
          !isSetOrMapValuesOrKeys
        ) {
          // @todo: a bit of a hack, will cause problems if that's an actual value!
          ;[key, item] = entryValueOrKey // entries array
        } else {
          item = entryValueOrKey // any other value, coming from .values() or .keys()
          key = null
          if (!isSetOrMapValuesOrKeys) {
            loopMeta.isSetOrMapValuesOrKeys = isSetOrMapValuesOrKeys = true // @todo(113): hack, but needed!
          }

          // @todo(121): throw if we thought it was a values() or keys() but it's not!
        }

        const decision = decideStopOrFilter(item, key, input, count)
        if (isStop(decision)) {
          if (decision instanceof StopClass) yield [decision.returnValue, key, count]
          break
        }
        if (decision !== NOTHING) {
          yield [decision[0], decision[1], count]
          count++
        }
      }
    } else if (isGenerator(input)) {
      handled = true
      let count = 1 // count of items iterated
      for (const item of input) {
        const decision = decideStopOrFilter(item, null, input, count)

        if (isStop(decision)) {
          if (decision instanceof StopClass) yield [decision.returnValue, null, count]
          break
        }
        if (decision !== NOTHING) {
          yield [decision[0], null, count]
          count++
        }
      }
    } else if (isPlainIterator(input)) {
      handled = true
      let count = 1 // count of items iterated
      for (const item of input) {
        const decision = decideStopOrFilter(item, null, input, count)

        if (isStop(decision)) {
          if (decision instanceof StopClass) yield decision.returnValue
          break
        }
        if (decision !== NOTHING) {
          yield [decision[0], decision[1], count]
          count++
        }
      }
    } else if (isRef(input)) {
      handled = true
      if (!propsHandled) {
        let count = 1 // count of items iterated
        for (const key of keys(input, _options)) {
          const decision = decideStopOrFilter((input as any)[key as any], key, input, count)

          if (isStop(decision)) {
            if (decision instanceof StopClass) yield [decision.returnValue, key, count]
            break
          }
          if (decision !== NOTHING) {
            yield [decision[0], decision[1], count]
            count++
          }
        }
      }
    }

    if (!handled) {
      const errorMsg = `z.loop(): Internal Error: unsupported input value = `
      // console.error(errorMsg, theValue)
      throw new Error(errorMsg + (input as any))
    }
  })()
  return addLoopGeneratorMethods(resultGenerator) as any // @todo: remove as any
}
