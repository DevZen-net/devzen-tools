/**
 * Check if value is a **strict number**, excluding NaNs & boxed `new Number('123'), BigInt & Infinity.
 *
 * Why? Because `typeof NaN === 'number'`, but `_.isNumber(NaN)` && `_.isNumber(Number('foo')))` are both true!
 *
 * @see [`z.isNumber()`](../functions/isNumber.html) for a more inclusive check
 *
 * @see [`z.isAnyNumber()`](../functions/isAnyNumber.html) for the most inclusive check
 *
 * @param val
 */
export const isStrictNumber = (val): val is number =>
  typeof val === 'number' && !isNaN(val) && val !== Number.POSITIVE_INFINITY
