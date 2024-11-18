import * as _ from 'lodash'

/**
 * Returns `true` if the data type is a Reference type.
 *
 * This includes all `_.isObject` & `_.isSymbol` types.
 *
 * @see [`z.isMany()`](/functions/isMany.html) is the opposite of `isSingle`
 *
 * @see [`z.isPrimitive()`](/functions/isPrimitive.html) for the most basic single types
 *
 * @see [`isSingle`](/functions/isSingle.html) to check if a value's type is a "Single".
 *
 * @param value any value
 *
 * @returns {boolean} `true` if the value is a single type
 */
export const isRef = <Tobj extends Object | symbol>(value: Tobj | any): value is Tobj =>
  _.isObject(value) || _.isSymbol(value)
