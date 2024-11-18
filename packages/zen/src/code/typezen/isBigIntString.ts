import * as _ from 'lodash'
import { isNumberString } from './isNumberString'

/**
 * A Number value, but as a string
 */
export type BigIntString = `${number}n`

/**
 * Check if value is a **string number**, like `'123'` or `'123.456'`
 *
 * @see [`z.isNumber()`](/functions/isNumber.html) for a more inclusive check
 *
 * @see [`z.isAnyNumber()`](/functions/isAnyNumber.html) for the most inclusive check
 *
 * @param val
 */
export const isBigIntString = (val: any): val is BigIntString => {
  if (typeof val !== 'string' || !_.endsWith(val, 'n')) return false

  return isNumberString(val.slice(0, -1))
}
