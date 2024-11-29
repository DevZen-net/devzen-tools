import * as _ from 'lodash'
import { isRealObject } from './isRealObject'
import { InstanceTypeAll } from './type-utils'

/**
 * Checks if value passed is a **user class instance**, created with `new MyClass()`, as opposed to Plain/POJSO Objects, i.e an object created as literal `{}` or by `Object.create()` or `new Object()`.
 *
 * Also, all builtins (like `new Error()` / `new Number(1)` etc) and those created by native code, even with `new Xxx()`, are not considered as an `isInstance()` value (it returns false).
 *
 * To the contrary, `new function PseudoClass(){}` is a valid instance, as it's a user-defined pseudo class in JS.
 *
 * @see [`z.isRealObject()`](../functions/isRealObject.html) for the most useful object check
 *
 * @see [`z.isPOJSObject()`](../functions/isPOJSObject.html) for the Plain Old JavaScript Object check
 *
 *  @param value any value
 *
 *  @returns {boolean} `true` if the value is an instance object, i.e created as `new Thing()` where `class Thing {}`
 */
export const isInstance = (value: unknown): value is InstanceTypeAll<any> =>
  isRealObject(value) &&
  !_.isPlainObject(value) &&
  !['Object'].includes(value.constructor?.name) &&
  !(value instanceof Error)
