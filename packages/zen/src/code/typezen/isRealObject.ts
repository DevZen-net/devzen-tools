import { ValueOf, Writable } from 'type-fest'
import { SystemClasses } from './classes'
import { type } from './type'
import { ObjectPropTypes } from './type-utils'

/**
 * Returns `true` if input value passed is any kind of **real object** (a.k.a. a hash) in any form, such as object literal {}, class instance (instantiated with new MyClass), object created by `Object.create()` with or without a specified prototype etc).
 *
 * Unlike other `isObject` values like "function" or "array" or object-primitives like "Boolean" types are NOT considered a real "hash" object.
 *
 * Why do we need another `isObject()` function ? Because:
 *
 *  - it returns `true` ONLY and ALWAYS if type is any kind of Object Hash (a.k.a `{}`), irrespective of how it was created (literal, new Xxx, etc) - unlike `_.isPlainObject()` or `_.isObject()`.
 *
 *  - it returns `true` for any Object Hash `{}`, even if it is not a plain `{}` but an *instance* created by some Function/class constructor OR even if it has a prototype pointing to null or to another object via `Object.create(anotherObj)` etc (unlike lodash's `_.isPlainObject()`)
 *
 *  - it returns `false` for any non-Hash type, such as `Array`, `Function`, `new String()` etc (unlike JS or lodash's `.isObject()`)
 *
 * @todo: caveat: TypeScript type guard is not great. Fix to allow for only "Hash" types, not just "object" types, eg Record<> or similar
 *
 * @see [`z.isInstance()`](../functions/isInstance.html) for the instance-only check
 *
 * @see [`z.isPOJSObject()`](../functions/isPOJSObject.html) for the Plain Old JavaScript Object check
 *
 * @param input any value
 *
 * @returns {boolean} `true` if the value is a Hash, a.k.a a **realObject** in any sense
 */
export const isRealObject = <Tobj extends Record<ObjectPropTypes, any>>(
  input: Tobj | any
): input is Record<keyof Tobj, ValueOf<Tobj>> => type(input) === 'realObject'

/**
 * Returns `true` if the value is a **realObject** as defined in [`isRealObject()`](../functions/isRealObject.html)
 */
export type IsRealObject<T> = T extends object
  ? Writable<T> extends SystemClasses
    ? false
    : true
  : false

export type IfRealObject<T, Then = true, Else = false> =
  IsRealObject<T> extends true ? Then : Else
