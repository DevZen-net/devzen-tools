import { isStrictNumber } from './isStrictNumber'

/**
 * Checks if value is either a [strict number](/functions/isStrictNumber.html) OR `BigInt` OR `Infinity`, excluding only `NaN`s & boxed `new Number('123')`.
 *
 * Why? Because `typeof NaN === 'number'`, `_.isNumber(NaN)` && `_.isNumber(Number('foo'))` are both true!
 *
 * Also, `_.isNumber()` returns `false` for `BigInt`, but it's just a number!
 *
 * `Infinity` is a number too, in `isNumber` terms.
 *
 * @see [`_z.isAnyNumber()`](/functions/isAnyNumber.html) for the most inclusive, less strict check (incl string numbers!)
 *
 * @see [`_z.isStrictNumber()`](/functions/isStrictNumber.html) for the most strict check, 'real' numbers only!
 *
 * @param value
 */
export const isNumber = (value): value is number | bigint =>
  isStrictNumber(value) || typeof value === 'bigint' || value === Number.POSITIVE_INFINITY
