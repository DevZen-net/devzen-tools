import * as _ from 'lodash'
import { isNothing } from '../typezen/utils'

/**
 * Places value in a new array, if it's not already an array.
 *
 * @param value to place in a (new) array, if it is not already.
 *
 * @return Array If value is not already an Array, it becomes an item of a new array.
 *
 * Only exception is if value is `undefined` or `_z.NOTHING, then an empty array `[]` is returned instead of `[undefined]`(useful for safe iteration).
 */
export const arrayize = <T>(value?: T | T[]): T[] => {
  if (_.isArray(value)) return value

  return _.isUndefined(value) || isNothing(value) ? [] : [value]
}
