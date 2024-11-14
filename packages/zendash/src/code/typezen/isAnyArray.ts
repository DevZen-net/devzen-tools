import * as _ from 'lodash'
import { TypedArray } from 'type-fest'
import { isTypedArray } from './isTypedArray'

/**
 * Returns true if the value is an array of any type, including TypedArrays.
 * @param val
 */
export const isAnyArray = (val): val is Array<any> | TypedArray =>
  _.isArray(val) || isTypedArray(val)
