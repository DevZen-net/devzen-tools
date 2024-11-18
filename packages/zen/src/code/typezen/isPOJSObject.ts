import { isInstance } from './isInstance'
import { type } from './type'

/**
 * Checks and returns true if value is a POJSO Object (Plain Old JS Object), such as object literal {} or object created by `Object.create()` etc, but NOT instances (eg `new MyClass()`).
 *
 * - Unlike [`z.isRealObject()`](/functions/isRealObject.html), it does not return `true` for instances created by `new Xxx` or for `Array` or `Function` or `new String()` etc.
 *
 * - Unlike lodash `_.isPlainObject(Object.create({})) === false`, `isPOJSObject()` returns `true` for `Object.create({})` and `Object.create(null)` etc.
 *
 * - Don't even mention `typeof` or `_.isObject()` - it returns true for too many things, almost all refs like `Array`, `Function` etc!
 *
 * @see [`z.isInstance()`](/functions/isInstance.html) for the instance-only check
 *
 * @see [`z.isRealObject()`](/functions/isRealObject.html) for the most useful object check
 *
 *  @param value any value
 *
 *  @returns {boolean} `true` if the value is a POJSO object
 */
// @todo: fix TypeScript type guard, to allow for all "Hash" types, not just "object" types, eg Record<> or similar
export const isPOJSObject = (value: unknown): value is Record<string | symbol, any> => {
  const theType = type(value)
  return theType === 'realObject' && !isInstance(value)
}
