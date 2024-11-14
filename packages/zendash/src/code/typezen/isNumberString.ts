/**
 * A Number value, but as a string
 */
export type NumberString = `${number}`

/**
 * Check if value is a **string number**, like `'123'` or `'123.456'`
 *
 * @see [`_z.isNumber()`](/functions/isNumber.html) for a more inclusive check
 *
 * @see [`_z.isAnyNumber()`](/functions/isAnyNumber.html) for the most inclusive check
 *
 * @param val
 */
export const isNumberString = (val: any): val is NumberString =>
  typeof val === 'string' && !isNaN(Number(val))
