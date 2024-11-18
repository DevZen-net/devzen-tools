import * as _ from 'lodash'
import { IMapOptions, isAnyJustIterator, MapCallback } from '../index'

import { ILoopOptions } from './loop'
import { GetMapReturn, map, ProjectValues } from './map'
import { expectType, TypeEqual } from 'ts-expect';

/**
 * Creates a perfect shallow clone of whatever value is given (and can be perfectly cloned :)
 *
 * Works with (m)any kinds of data: Array, object, Map, Set etc.
 *
 * See examples in `clone-spec.ts` & `loop-each-map-clone-filter-take.specHandler.ts`
 *
 * Notes:
 *
 * - Iterators & Generators CANNOT be cloned, so it throws an error if you try to
 *
 * - class instances will become a POJSO, not an instance of same class! @todo(325): implement a way to clone class instances and receive a proper instance - maybe use class-transformer?
 *
 * - Everything else gets a proper clone. For example arguments are cloned to a new arguments object, with the same items.
 *
 * You can optionally pass an [`IloopOptions`](/interfaces/IloopOptions.html) object as the second parameter, to control which keys / idx are visited (own / inherited / enumerable etc) and more.
 *
 * - if `options.map` already exists on `clone(val, myOptions, myMapCb)`, in will be called (i.e you clone will be a mapped version.
 *
 * - Similarly, if `options.filter` exists, it is applied to the clone. If the input value is an Array, elements will appear on the cloned array at different indexes of the original, like `Array.filter` / `_.filter`. Use `sparse: true` option to get empty elements when they didn't pass the filter.
 *
 * @see [`z.map`](/functions/map.html) as `z.clone()` is just shortcut to `z.map(value, options, _.identity)`, plus some extra sanity checks. In turn `z.map()` is powered by the mighty `z.loop()`.
 *
 * @see [`z.loop()`](/functions/loop.html) the power hidden behind `map()` and most other collection functions.
 *
 * @param input the value to clone
 *
 * @param options an optional object (of type `IloopOptions`) to control which keys / idx are visited (own / inherited / enumerable etc) and more.
 *
 * @returns a new value, with the same type as the input value 99% of time, but with the items mapped over. `Objects`, `Arrays`, `Maps`, `Sets` etc are copied and returned as new values.
 *
 * But Iterators & Generators etc dont make sense to be cloned per se, so these throw. Reason is that these can't be restarted, and it would signal the wrong ida. You can always `z.map()` over their remaining items, with an `z.identity` and that's effectivelly a `z.clone()`, but semantics differ.
 */
export function clone<
  Tinput extends any,
  Toptions extends IMapOptions<any, any, Tinput>,
>(
  input: Tinput,
  options?: Toptions
): GetMapReturn<Tinput, Toptions, null, null> {
  if (isAnyJustIterator(input))
    throw new TypeError(
      'z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using `z.map()` instead'
    )

  try {
    const result = map(input, _.identity, options)
    return result as any // @todo: remove as any
  } catch (error) {
    throw new Error(
      `z.clone(): Could not clone the given value: ${error instanceof Error ? error.message : error}`
    )
  }
}

