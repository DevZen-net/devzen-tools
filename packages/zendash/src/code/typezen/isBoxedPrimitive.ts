import { isBoxedBoolean } from './isBoxedBoolean'
import { isBoxedNumber } from './isBoxedNumber'
import { isBoxedString } from './isBoxedString'

/**
 * Checks if value is a boxed primitive. Boxed primitives are:
 *
 * - String
 * - Number
 * - Boolean
 *
 * @param val
 */
/* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
export const isBoxedPrimitive = (
  val: any
): val is String | Number | Boolean | Symbol | bigint =>
  isBoxedNumber(val) || isBoxedString(val) || isBoxedBoolean(val)
