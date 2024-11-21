import * as _ from 'lodash'

/**
 *   Checks if `value` is in agreement with an `agreement` - see below.
 *
 *   @note legacy, used by other libs. Needs revising or obsoleting.
 *
 *   @param value Any value (object, primitive etc) to check against agreement.
 *
 *   @param agreement
 *   *  If it is a RegExp, it executes an `agreement.test()` against (the string representation of) value.
 *
 *   *  If it is a Function, it is called with value as param, returns true if truthy is returned
 *
 *   *  If `agreement` is `undefined`, it returns true (you can't disagree with an agreement that isn't defined).
 *
 *   *  If `agreement` is an Array, it recursively executes isAgree on each item in the array, and returns true if any of them returns true.
 *
 *   *  Othewise `_.isEqual is applied`, and if that fails it compares the string representation of value and agreement.
 *
 *   Examples:
 *
 *       z.isAgree('angelos', /angel/) // true
 *       z.isAgree('angelos', 'angelos') // true
 *       z.isAgree('angelos', 'angel') // false
 *       z.isAgree(1.23, 1.23) // true
 *       z.isAgree('angelos', undefined) // true
 *       z.isAgree({x: 'angelos', toString: () => this.x}, 'angelos') // true
 *       z.isAgree({toString: () => 'foo'}, 'angelos') // false
 *       z.isAgree('angelos', ['foo', 'angelos']) // true
 *
 *   @returns `true` if the value is in agreement with the agreement(s).
 */
export const isAgree = (value: any, agreement: any): boolean => {
  if (_.isRegExp(agreement)) return agreement.test(`${value}`)

  if (_.isArray(agreement)) for (const agr of agreement) if (isAgree(value, agr)) return true

  if (_.isFunction(agreement)) return !!agreement(value)

  if (agreement === undefined) return true // Undefined returns true! You can't disagree with what isn't defined!

  return _.isEqual(value, agreement) ? true : `${value}` === `${agreement}` // @todo(111) - use z.isEqual
}
