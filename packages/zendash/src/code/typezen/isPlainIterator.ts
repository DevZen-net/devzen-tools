import * as _ from 'lodash'
import { isFunction } from './isFunction'
import { isRealObject } from './isRealObject'

/**
 * Checks if value is a **plain** Iterator.
 *
 * - It **includes** any objects/realObjects with `Symbol.iterator()` as well as `map.entries()` & `set.entries()` etc.
 * - But it **excludes**:
 *    - Standard Iterables (that are also happen to be an `Iterator`) like `Array`, `Set` & `Map`, `TypedArray` that have their own [`_z.type`](/functions/type).
 *    - Async Iterators
 *    - It also excludes `Generator` & `AsyncGenerator`, although Generators are practically Iterators also (you can use [`isGenerator()`](/functions/isGenerator) / [`isAsyncGenerator()`](/functions/isAsyncGenerator) for that).
 *
 * @see https://stackoverflow.com/questions/59458257/in-javascript-es6-what-is-the-difference-between-an-iterable-and-iterator
 * @see https://stackoverflow.com/questions/47446272/javascript-how-can-i-tell-if-an-object-is-a-map-iterator/48180059#48180059
 *
 * @see [`isAsyncIterator()`](/functions/isAsyncIterator)
 * @see [`isGenerator()`](/functions/isGenerator)
 * @see [`isAsyncGenerator()`](/functions/isAsyncGenerator)
 * @see [`isPlainIterable()`](/functions/isPlainIterable)
 * @see [`isMapIterator()`](/functions/isMapIterator)
 * @see [`isSetIterator()`](/functions/isSetIterator)
 */
export const isPlainIterator = <T>(
  val: IterableIterator<T> | any
): val is IterableIterator<T> =>
  !!val &&
  (_.endsWith(val[Symbol.toStringTag], 'Iterator') ||
    (isFunction(val[Symbol.iterator]) &&
      isRealObject(val) &&
      !_.endsWith(val[Symbol.toStringTag], 'Generator')))
