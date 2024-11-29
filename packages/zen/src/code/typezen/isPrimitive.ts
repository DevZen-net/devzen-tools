import { Primitive as Primitive_TypeFest } from 'type-fest'
import { type } from './type'

/**
 * Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive), also including the pseudo type `void`.
 *
 * Primitive from type-fest is missing `void`, so it can't match the `void` return value i.e `(function () {})()`
 */
export type Primitive = Primitive_TypeFest | void

/**
 * The names of the primitive types: 'string', 'number', 'boolean', 'undefined', 'null', 'symbol', 'bigint' (`void` is not included, it's a pseudo type)
 */
export type PrimitiveNames =
  | 'string'
  | 'number'
  | 'boolean'
  | 'undefined'
  | 'null'
  | 'symbol'
  | 'bigint'

export const PRIMITIVE_NAMES: Readonly<PrimitiveNames[]> = [
  'string',
  'number',
  'boolean',
  'undefined',
  'null',
  'symbol',
  'bigint',
] as const

/**
 * Returns `true` if the data type is a Primitive, according to the [definition of "primitive" in JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)
 *
 * Boxed Primitives
 *
 * Boxed / object versions of primitives result to false in `z.isPrimitive`, i.e they are NOT considered primitives (they are Boxed Primitives).
 *
 * This is in contrast to [`isSingle`](../functions/isSingle-1.html) that considers boxed values as `z.isSingle` and their `z.type` is their designated type.
 *
 * To check Boxed Primitives, use [`z.isBoxedPrimitive()`](../functions/isBoxedPrimitive.html) or use the individual `z.isBoxedXxx` functions.
 *
 * @see [`z.isSingle()`](../functions/isSingle-1.html) is a broader version of `isPrimitive`
 *
 * @see [`z.isMany()`](../functions/isMany.html) is the opposite of `isSingle`
 *
 * @param value any value
 *
 * @returns {boolean} `true` if the value is a primitive type
 */
export const isPrimitive = (value: Primitive | any): value is Primitive =>
  PRIMITIVE_NAMES.includes(type(value) as PrimitiveNames) &&
  (value === null || typeof value !== 'object') // exclude Boxed like new Boolean(true)

/**
 * Returns `true` if `theType` is a name of a Primitive
 * @param theType
 */
export const isPrimitiveType = (
  theType: string /*PrimitiveNames*/
): theType is PrimitiveNames => PRIMITIVE_NAMES.includes(theType as PrimitiveNames)

// Node deprecated util.isPrimitive, suggests `(typeof value !== 'object' && typeof value !== 'function') || value === null`
// https://nodejs.org/docs/latest-v20.x/api/util.html#utilisprimitiveobject
