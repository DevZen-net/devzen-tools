import * as _ from 'lodash'
import { isAgree } from '../agreement/isAgree'

/**
 * Mutates the `Value` for each of the `Keys` of a given Object or Array
 *
 * Example:
 * ```js
 *
 * const simpleCalc = (v) => v < 0 ? v + 10 : v + 20
 *
 * const obj = {
 *   a: 1,
 *   b: 2,
 *   c: -1
 * }
 *
 * z.mutate(obj, simpleCalc)
 *
 *  // obj is now mutated to:
 *  // {
 *  //   a: 21,
 *  //   b: 22,
 *  //   c: 9,
 *  // }
 *
 * const arr = [11, 2, -1]
 * z.mutate(arr, simpleCalc, (v) => v > 10) // with z.isAgree agreement as filter
 *
 * // arr is now mutated to:
 * // [31, 2, -1]
 * ```
 *
 * @param oa Object or Array
 *
 * @param mutator the mutation callback, passing the value, key & oa and returns a new value.
 *
 * @param agreement an agreement filter as in [`z.isAgree`](../functions/isAgree.html). If it is true, value is mutated, otherwise it's left intact. Note: isAgree allows "undefined" as a truthy filter value.
 *
 * @returns the mutated object or array
 */
export const mutate = (
  oa: object | any[],
  mutator: (value: any, key?: string, oa?: object | any[]) => any,
  agreement?
): object | any[] => {
  if (_.isFunction(mutator)) {
    _.each(oa, (value, key) => {
      if (isAgree(value, agreement)) oa[key] = mutator(value, key, oa)
    })
  }

  return oa
}
