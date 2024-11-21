import { Any } from '../typezen/type-utils'
import { FilterCallback, ILoopOptions, LoopKeys, MapCallback } from './loop'
import { GetMapReturn, MapOptionsOverride, ProjectValues } from './map'
import { project } from './project'

/**
 * Filter over the (many) items of a value and returning of **a new instance of the value**, containing the elements that pass the filter with [`isPass`](../functions/isPass.html) (an elaborate kind of truthy). Value can be `Object`, `Array`, `Map`, `Iterators` and many more.
 *
 * Similar idea to lodash `_.filter()` or `Array.filter()` but powered by [`z.loop()`](../functions/loop.html). Hence:
 *
 * - it works with many value types, not just `Array` but also `Map`, `Set`, `Object`, Iterators, Generators, AsyncIterators, Functions and optionally `isPrimitive` / `isSingle`s!
 *
 * - BUT the twist is, it's not returning always just an `Array` like a normal `Array.filter()` or lodash `_.filter()`, but **a copy of whatever the input value is**, with the nested items that pass the `filterCb` function. So a `filter(new Map([]))` will return a new Map, with the filtered keys / values of the original Map instance and so on.
 *
 * Using `props: 'all'` you can also copy over the props of the original value, like with `_.mapValues()`, but also for **all object types**.
 *
 * ## In effect:
 *
 * - Arrays (or sparse arrays) can be filter-copied verbatim but dense by default: the filtered items will disappear in the new array (like `Array.filter()`/`_.filter()`. But if `sparse: true` it will be respecting sparse items position, as well as the filtered array elements, which will be at the same indexes of the original. The resulting array will be sparse.
 *
 * - Objects are copied over like with `_.mapValues()`, respecting their props, including symbols ones (optionally), unlike `_.mapValues()` which deals only with string keys.
 *
 * - Generators & AsyncGenerators are also supported, and the result is a new Generator / AsyncGenerator with the mapped items.
 *
 *  NOTE: When `props: 'all'`, the Generator's props are also copied over to the new Generator, all except `next`, `Symbol.iterator` & `Symbol.asyncIterator` (since these would mess the iteration). Also in `strict: true`, you can't use `symbol: true` (via `props`) with Iterators/Generators (it throws).
 *
 * # Other/Single Values
 *
 * All of these currently are **optionally** supported by `z.filter` (with `filterSingles: true`):
 *
 * - Single values - see `isSingle`
 * - Primitives - see `isPrimitive`
 * - Functions
 * - Promises
 * - Boxed primitives
 * - WeakMap, WeakSet
 *
 * but it makes little sense to 'filter' on them. When boxed value is filtered out, the result will be an instance with undefined / / false etc, which it's not great. If `filterSingles: false` (default) it throws an error @todo: unless `props: "only"` is used in which case the props are filtered out, into an "empty" value?
 *
 * - Powered by the mighty [`z.loop()`](../functions/loop.html) / [`z.keys`](../functions/keys.html), so and hence you can control which keys / idx are visited (own / inherited / enumerable / string / symbol etc) via [`IloopOptions`](../interfaces/IloopOptions.html).
 *
 * - [`z.isSingle`](../functions/isSingle-1.html) values are also supported: the projection callback will be called only once (with `options.strict: false` - default) or throw an error (with `options.strict: true`). This follows the functional programming principles, that all values are enclosed and can be mapped over. This is also the reason why `options.strict: false` is the default.
 *
 * - You can pass an [`IloopOptions`](../interfaces/IloopOptions.html) object, to control which keys / idx are visited (own / inherited / enumerable etc):
 *   - Without `options.filter` - if it already exists, it throws an error.
 *   - But if `options.map` or `options.take` exists, **it is applied after** the filter passes.
 *
 * @returns the same type as the input value, but with the nested items within it filtered out.
 * * Objects, Arrays, Maps, Sets etc are copied and returned as new values, with filtered items.
 * * Iterators & Generators (sync or async) are returned as a Generator/Iterator with their items filtered out.
 * * `isSingle` values are returned as copies.
 */
export function filter<
  Tinput extends any,
  IfilterCallback extends FilterCallback<TcallbackItems, TcallbackKeys, Tinput>,
  Toptions extends Omit<
    ILoopOptions<Titem, TidxKey, Tinput>,
    'filter'
  >,
  Titem extends any,
  TidxKey extends any,
  TcallbackItems = ProjectValues<Tinput, MapOptionsOverride<Toptions>>,
  TcallbackKeys = LoopKeys<Tinput, MapOptionsOverride<Toptions>>,
>(
  input: Tinput,
  filterCb: IfilterCallback,
  options?: Toptions
): GetMapReturn<Tinput, Toptions, null, null> {
  return project<Titem, TidxKey, Tinput>(
    input,
    options as any,
    filterCb as any,
    'filter'
  ) as any
}
