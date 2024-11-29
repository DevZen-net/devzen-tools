import * as _ from 'lodash'
import { isBigInt } from './isBigInt'

/**
 * Checks and returns true, if value is any kind of a "real number", a good candidate for `Number()`:
 * - boxed `new Number('123')`
 * - BigInt (eg `123456789n` or `BigInt('123456789')`)
 * - `Infinity`
 * - a string value that represents a "real number", eg `"123"` or `"123.456"`
 *
 * Anything that is resulting to a non-NaN via `Number(val)`, is an `isAnyNumber`.
 * NaN is NOT considered an `isAnyNumber`, as well as strings that would lead to `NaN` if we used `Number(str)`.
 *
 * In contrast, Lodash:
 *
 *   - `_.isNumber()` returns `true` for `NaN`
 *
 *   - `_.isNumber()` returns `false` for `BigInt`
 *
 *  and `typeof`..., well, who cares about legacy typeof, its next to useless!
 *
 * Note: by "real number" we refer to the programming terminology, not the Mathematical "Real Numbers"!
 *
 * @see [`z.isNumber()`](../functions/isNumber.html) for a less inclusive, more strict check
 *
 * @see [`z.isStrictNumber()`](../functions/isStrictNumber.html) for the most strict check
 *
 * @param val
 */
export const isAnyNumber = (
  val: any
): val is number | number | bigint | bigint | string | string => {
  let num: number = val as any

  if (_.isString(val))
    try {
      num = Number(val)
    } catch {
      return false
    }
  else if (isBigInt(val)) return true

  return _.isNumber(num) && !_.isNaN(num)
}
