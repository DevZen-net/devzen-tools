import { Class, IfNever, IfNull, Merge } from 'type-fest'
import { IfRealObject } from '../typezen/isRealObject'
import {
  BaseType,
  IfNestingObject,
  InsideKeys,
  InsideValues,
  IsAbsent,
} from '../typezen/type-utils'
import { IKeysOptions, KeysStrict } from './keys'
import {
  ILoop_DefaultOptions,
  ILoopOptions,
  LoopKeys,
  LoopKeysOrValues,
  MapCallback,
} from './loop'

import { project } from './project'
import { Values } from './values'

export interface IMapOptions<TloopItems, TloopIidxKeys, Tinput>
  extends Omit<
    ILoopOptions<TloopItems, TloopIidxKeys, Tinput>,
    'map' | 'inherited' | 'nonEnumerables'
  > {}

export type MapOptionsOverride<TmapOptions extends IMapOptions<any, any, any>> =
  IsAbsent<TmapOptions> extends true
    ? ILoop_DefaultOptions
    : Merge<
        TmapOptions,
        {
          nonEnumerables: false
          inherited: false
        }
      >

/**
 * Returns the same BaseType - follows the map() function in logic and exclusions, and is bound by options. Notes:
 * - Items can be either Nested Values and/or props, which are map-copied over to the new value.
 */
export type GetMapReturn<
  // REQUIRED args
  Tinput extends any,
  Toptions extends IMapOptions<any, any, Tinput>,
  ImapCallback,
  ImapKeysCallback,
  // private "vars" declarations
  _ToptionsPropsOnly extends IMapOptions<any, any, Tinput> = Merge<
    Toptions,
    {
      props: true
      nonEnumerables: false
      inherited: false
    }
  >,
  // Only props of input
  TpropValues = Values<Tinput, _ToptionsPropsOnly>,
  Tprops = KeysStrict<Tinput, _ToptionsPropsOnly>,
  // Nested Items & Keys
  NestedItems = IfNestingObject<
    Tinput,
    InsideValues<Tinput>,
    IfRealObject<Tinput, TpropValues, never>
  >,
  NestedKeys = IfNestingObject<Tinput, InsideKeys<Tinput>, IfRealObject<Tinput, Tprops, never>>,
  MapNestedItemsReturn = IfNull<
    ImapCallback,
    NestedItems,
    ImapCallback extends (...args: any) => infer R ? R : NestedItems
  >,
  MapNestedKeysReturn = ImapKeysCallback extends (...args: any) => infer R ? R : NestedKeys,
  // MapPropsValuesReturn = ImapKeysCallback extends (...args: any) => infer R ? R : TpropValues,
> =
  // @todo(888): undefined / absent options
  // IsAbsent<Toptions> extends true
  //   ? GetMapReturn<Tinput, {}, ImapCallback>
  //   :

  Tinput extends object
    ? Tinput extends Class<any>
      ? never
      : IfNever<Tprops> extends true
        ? BaseType<Tinput, MapNestedItemsReturn, MapNestedKeysReturn>
        : BaseType<Tinput, MapNestedItemsReturn, MapNestedKeysReturn> &
            // Pick<Tinput, KeysStrict<Tinput, _ToptionsPropsOnly>>
            Record<KeysStrict<Tinput, _ToptionsPropsOnly>, MapNestedItemsReturn /* @todo(888): or TpropValues */> // @todo(222): can we also mapKeys here?
    : Tinput

export type ProjectValues<Tinput, Toptions extends IKeysOptions> = LoopKeysOrValues<
  Tinput,
  Toptions,
  false,
  true
>

export type ProjectKeys<Tinput, Toptions extends IKeysOptions> = LoopKeysOrValues<
  Tinput,
  Toptions,
  true,
  true
>

/**
 * Map over the (many) items of **any possible input value**, returning a new instance of the same input value type (if possible), with the results of calling the projector/mapping function on every "nested" element of the input value (for collections like Objects, Arrays, Maps, Sets but also for Iterators, Generators, AsyncIterators etc).
 *
 * Similar idea to lodash `_.map()` or `Array.map()` or `_.mapValues()`, but powered by [`z.loop()`](../functions/loop.html). Hence:
 *
 * - it works with many value types, not just arrays (and objects with separate `_.mapValues()`) but also on `Map`, `Set`, `Iterator`, `Generator`, `AsyncIterator`, `Function`, `Promise` and even `isPrimitive` / `isSingle`s!
 *
 * - the main twist: it is not returning always just an `Array` like the normal `_.map` or `Array.map()`, but a copy of whatever the input value was, with the nested items mapped/projected over via the `mapCb` function. So a `map(new Map([]))` will return a `new Map([])`, with the same keys & mapped values of the input Map values. A `map({})` will return a new object, with the same props as the original object, but with the values mapped over. And so on!
 *
 * Using `props: true` or`props: 'all'` you can only/also copy over the props of the original object, just like with `_.mapValues()`, but works for all object types. But this will use ONLY enumerable & own props, to avoid messing with the new object's behavior and internals, and since these already exist on the new instance. Hence, `inherited: true` & `nonEnumerables: true` are ignored in `map()`.
 *
 * In effect:
 *
 * - Arrays are copied & mapped verbatim. Sparse Arrays will be mapped compacted / dense by default: the empty items will disappear in the new array, the new array will become dense. But if `sparse: true` it will be respecting sparse items position, and the new array will be sparse as well.
 *
 * - Objects are copied over like with `_.mapValues()`, respecting their props, including symbols ones (optionally with `symbol: true`), unlike `_.mapValues()` which deals only with string keys. But access is prohibited from `inherited` and `nonEnumerables` props.
 *
 * - Maps & Sets are also copied over to new Map & Set, with their items mapped over.
 *
 * - Functions are also supported, and the result is a new function, that passes the args & this to original function, and returns the return value of the original value, but mapped.
 *
 * - Promises are similar to functions: a new Promise is returned, that resolves to the mapped value of the original promise.
 *
 * - Boxed primitives become a new instance of the same type, with their boxed value mapped.
 *
 * - User defined classes are NOT supported, it throws, cause it makes no sense.
 *
 * // @todo: 2 options:
 * - `Iterators` / `Generator` sync or async:
 *  - are NOT supported, because they can't be iterated over without affecting the value, and they are potentially infinite ! The result is a new `Generator` / `AsyncGenerator` is the mapped items of the original.
 * - are also supported, but use with caution! The result is a new `Generator` / `AsyncGenerator` with the mapped items of the original.
 *
 *    NOTE: it uses ONLY the remaining `Iterator` / `Generator` items, since there is no contract to restart Iterators in JS at the moment.
 *
 *    NOTE: When `props: 'all'`, the Generator's props are also copied over to the new Generator, all except `next`, `Symbol.iterator` & `Symbol.asyncIterator` (since these would mess the iteration). Also in strict:true, you can't use `symbol: true` (via `props`) with Iterators/Generators (it throws).
 *
 * - [`z.isSingle`](../functions/isSingle-1.html) values (primitives & boxed) are also supported: the projection callback will be called only once (by default, with `options.loopSingles: true` & `options.strict: false`) or throw an error (with `options.strict: true`). This follows the functional programming principles, that all values are enclosed and can be mapped over. This is also the reason why `options.strict: false` is the default.
 *
 * - Primitives are the only exception to the rule of "getting back the same value type": you can change the return mapped type of the `input`, eg `const numAsString = map(42, (v) => v + '')` will return `'42'` as a `string`, not `42` as `number` (and type will follow). It's up to you if you want to return the same input value type!
 *
 * - WeakMap, WeakSet are NOT supported & throw, since they can't be iterated / mapped / cloned.
 *
 * In all cases, any extra object props (eg `Array` Props, `Map` props etc) can be copied over to the new Array, with `props:true` - ignored for non-objects. WARNING: it is dangerous to copy inherited props like methods that might be bound or internals like `Symbol.iterator` to the mapped object, as they might mess with the new object's behavior. Some of these case are coded against, but dragons might still lurk.
 *
 * - Powered by the mighty [`z.loop()`](../functions/loop.html) / [`z.keys`](../functions/keys.html) & [`z.values`](../functions/values.html), hence you can control which keys / idx are visited (`own` / `inherited` / `nonEnumerables` / `string` / `symbol` etc) via [`IloopOptions`](../interfaces/IloopOptions.html).
 *
 * - You can pass an [`IloopOptions`](../interfaces/IloopOptions.html) object as the second parameter, instead of the callback, to control which keys / idx are visited (own / inherited / enumerable etc).
 *   - NOTE: if `options.map` already exists on `map(val, myOptions, myMapCb)`, it throws an error.
 *   - But if `options.filter` exists, it is applied before the map. If the input value is an array, elements will appear on the result mapped array **at the same indexes of the original**, hence the resulting array will be sparse, for elements that are missing (because they didn't pass the filter). You can change this behavior with `sparse: false` in the options.
 *
 * @see [`z.loop()`](../functions/loop.html) the power hidden behind `map()` and all other collection functions.
 *
 * @returns the same type as the input value, but with the items mapped over. Objects, Arrays, Maps, Sets etc are copied and returned as new values. Also Iterators, Generators etc are returned as a Generator with their items mapped over.
 */
export function map<
  Tinput extends any,
  ImapCallback extends MapCallback<TcallbackItems, TcallbackKeys, Tinput, any>,
  Toptions extends IMapOptions<any, any, Tinput>,
  // Callback items (similar but not same to TloopItems), passed to the map/project function
  // - project / callback values are supported with isProject = true
  // - excluding Props that are inherited & nonEnumerables, with MapOptionsOverride
  TcallbackItems = ProjectValues<Tinput, MapOptionsOverride<Toptions>>,
  TcallbackKeys = LoopKeys<Tinput, MapOptionsOverride<Toptions>>, // @todo(333): what abt ProjectKeys ?
>(
  input: Tinput,
  mapCb: ImapCallback,
  options?: Toptions
): GetMapReturn<Tinput, Toptions, ImapCallback, null> {
  return project<TcallbackItems, TcallbackKeys | null, Tinput>(
    input,
    options as any,
    mapCb as any,
    'map'
  ) as any
}

