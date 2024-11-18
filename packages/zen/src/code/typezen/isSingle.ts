import { isWeakMap, isWeakSet } from 'lodash'
import { Primitive, PRIMITIVE_NAMES, PrimitiveNames } from './isPrimitive'
import { type, TypeNames } from './type'

export type SingleSystemNames =
  | 'Date'
  | 'RegExp'
  | 'function'
  | 'Promise'
  | 'NaN'
  | 'Boolean'
  | 'String'
  | 'Number'
  | 'Error'
  | 'DataView'
// | 'Symbol' // Symbol is not a class, it's a primitive

export type SingleSystem =
  | Date
  | RegExp
  | Function // @todo: is this correct? Or should it be (...args: any[]) => any ?
  | Promise<any>
  | typeof Number.NaN
  /* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
  | Boolean
  /* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
  | String
  /* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
  | Number
  | Error
  | DataView
  | Symbol

export const SINGLE_SYSTEM_NAMES: SingleSystemNames[] = [
  'Date',
  'RegExp',
  'function',
  'Promise',
  'NaN',
  'Boolean',
  'String',
  'Number',
  'Error',
  'DataView',
  // | 'Symbol' // Symbol is not a class, it's a primitive
] as const

export type SingleNames = PrimitiveNames | SingleSystemNames

export const SINGLE_NAMES: SingleNames[] = [...PRIMITIVE_NAMES, ...SINGLE_SYSTEM_NAMES] as const

/**
 * Matches all Single values, as defined in ZenType. This includes all Primitive types and all TSystemSingles.
 *
 * Note: it excludes `WeakSet` & WeakMap`, which are considered neither as `Single` nor `Many`, they are a special case
 */
export type Single = Primitive | SingleSystem | Symbol

export type IsSingle<T> = T extends Single // @todo(222): why not Writable<T>? Why does it break?
  ? true
  : false

export type IfSingle<T, Then = true, Else = false> = IsSingle<T> extends true ? Then : Else

/**
 * Matches a Single or a WeakSet or WeakMap (BUT unfortunately also Set & Map). So, it is BROKEN! Use `IsSingleOrWeak` instead that works fine!
 *
 * The following both fail, cause `WeakSet` & `WeakMap` are not considered `Single` types:
 *
 * expectType<TypeOf<SingleOrWeak, Set<any>>>(false)
 * expectType<TypeOf<SingleOrWeak, Map<any, any>>>(false)
 *
 * @todo(111): the following fails - find a better way
 *   export type SingleOrWeak = Single | Exclude<WeakSet<any> | WeakMap<any, any>, Map<any, any> | Set<any>>
 *
 * Weak containers are a special case: they might have many nested items internally, but they are not iterable, hence practically they are not "Many" nor "Single" types either!
 *
 * Note: another technical reason is that if we add `WeakXxx` to `Single`, it breaks to also match `Set` & `Map`, which is awful! So we keep these off strict `Single`.
 *
 * We can use `IsSingleOrWeak` till then.
 */
export type SingleOrWeak = Single | WeakSet<any> | WeakMap<any, any>

/**
 * Returns true if T is a Single or a WeakSet or WeakMap.
 */
export type IsSingleOrWeak<T> =
  // prettier stay here!
  IsSingle<T> extends true
    ? true
    : WeakSet<any> extends T // @todo(222): why not Writable<T>? Why does it break?
      ? true
      : WeakMap<any, any> extends T // @todo(222): why not Writable<T>? Why does it break?
        ? true
        : false

export type IfSingleOrWeak<T, Then = true, Else = false> =
  IsSingleOrWeak<T> extends true ? Then : Else

export type IsBoxedPrimitive<T> = T extends Boolean | String | Number ? true : false
export type IfBoxedPrimitive<T, Then = true, Else = false> =
  IsBoxedPrimitive<T> extends true ? Then : Else

/**
 * @see [`TsingleOrWeak`](/types/TsingleOrWeak.html)
 * @param value
 */
export const isSingleOrWeak = (value: any): value is SingleOrWeak =>
  isSingle(value) || isWeakSet(value) || isWeakMap(value)

/**
 * Returns `true` if the data type is a "single" or "plain" value, in terms of NOT naturally/normally having compound or "Many" items (eg props, array items etc) inside it that we can iterate over.
 *
 * Aka and similar to Scalar or Primitive, but there are distinctions - see this answer https://stackoverflow.com/a/6628566/799502 for context.
 *
 * @see `z.isSingle` is similar to [`z.isPrimitive()`](/functions/isPrimitive.html), but :
 *  - `z.isSingle` also includes extras as "singles" (eg `Date` & `RegExp`), as they are not considered as having arbitrary props or contents (days months minutes etc in Date don't count as user-defined props).
 *  - `z.isSingle` also includes boxed values of primitives (eg. `new Boolean(true)`), unlike `z.isPrimitive()` which only allows for really primitive unboxed values.
 *
 * Think of it as lodash's *negated* `_.isObject()`, which unfortunately can't be used as such cause it fails in few cases:
 *
 *       z.isSingle(new String()) === true
 *
 *   but
 *
 *       _.isObject(new String()) === true
 *       _.isObject(new Date()) === true
 *       _.isObject(new RegExp()) === true
 *
 *  For reference, `isSingle(value)` correctly recognises all of these value types:
 *
 *      'string',
 *      'number',
 *      'boolean',
 *      'undefined',
 *      'null',
 *      'symbol',
 *      'bigint',
 *
 *      // extra to `isPrimitive()`:
 *      'Date',
 *      'RegExp',
 *      'function',
 *      'Promise'
 *      'NaN'
 *      'Boolean',
 *      'String',
 *      'Number'
 *      'Error'
 *
 *      // Special cases, as they might have many items internally, but practically they are not iterable, hence not "many" nor "single":
 *      WeakSet
 *      WeakMap
 *
 *  irrespective of how these values are created (literal/primitive or new Xxx).
 *
 * @see [`z.isMany()`](/functions/isMany.html) is the opposite of `isSingle`
 *
 * @see [`z.isPrimitive()`](/functions/isPrimitive.html) for the most basic single types
 *
 * @see [`T_SINGLE_NAMES`](/variables/T_SINGLE_NAMES.html) for the string list of types that are considered "Single" types.
 *
 * @see [`TSingle`](/types/TSingle.html) the types that are considered "Single".
 *
 * @see [`isSingleType`](/functions/isSingleType.html) to check if a type (not a value) is a "Single" type.
 *
 * @param value any value
 *
 * @returns {boolean} `true` if the value is a single type
 */
export const isSingle = (value: unknown): value is Single =>
  SINGLE_NAMES.includes(type(value) as SingleNames)
export const isSingleType = (theType: TypeNames): theType is SingleNames =>
  SINGLE_NAMES.includes(theType as SingleNames)
