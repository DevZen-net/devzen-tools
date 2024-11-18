import { TypedArray } from 'type-fest'
import { constructorNamed } from '../utils'

export type TypedArrayNumber =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

export type TypedArrayNumberNames =
  | 'Int8Array'
  | 'Uint8Array'
  | 'Uint8ClampedArray'
  | 'Int16Array'
  | 'Uint16Array'
  | 'Int32Array'
  | 'Uint32Array'
  | 'Float32Array'
  | 'Float64Array'

export type TypedArrayBigInt = BigInt64Array | BigUint64Array

export type TypedArrayBigIntNames = 'BigInt64Array' | 'BigUint64Array'

export type TypedArrayNames = TypedArrayNumberNames | TypedArrayBigIntNames

export const TYPED_ARRAY_NUMBER_NAMES: TypedArrayNumberNames[] = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
]

export const TYPED_ARRAY_BIGINT_NAMES: TypedArrayBigIntNames[] = [
  'BigInt64Array',
  'BigUint64Array',
]

export const TYPED_ARRAY_NAMES: TypedArrayNames[] = [
  ...TYPED_ARRAY_NUMBER_NAMES,
  ...TYPED_ARRAY_BIGINT_NAMES,
]

// Not needed & actually breaks!
// export function isTypedArray<T extends Int8Array>(int8Array: T): int8Array is T
// export function isTypedArray<T extends Uint8Array>(uint8Array: T): uint8Array is T
// export function isTypedArray<T extends Uint8ClampedArray>(uint8ClampedArray: T): uint8ClampedArray is T
// export function isTypedArray<T extends Int16Array>(int16Array: T): int16Array is T
// export function isTypedArray<T extends Uint16Array>(uint16Array: T): uint16Array is T
// export function isTypedArray<T extends Int32Array>(int32Array: T): int32Array is T
// export function isTypedArray<T extends Uint32Array>(uint32Array: T): uint32Array is T
// export function isTypedArray<T extends Float32Array>(float32Array: T): float32Array is T
// export function isTypedArray<T extends Float64Array>(float64Array: T): float64Array is T
// export function isTypedArray<T extends BigInt64Array>(bigInt64Array: T): bigInt64Array is T
// export function isTypedArray<T extends BigUint64Array>(bigUint64Array: T): bigUint64Array is T
// //
// // // export function isTypedArray(unknownVal: unknown): unknownVal is TypedArray
// export function isTypedArray(anyVal: any): anyVal is TypedArray

/**
 * Checks if the value is a [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) adding the **correct type guard**, that lodash lacks.
 *
 * Examples:
 *
 *    // works on TypeScript
 *    if (isTypedArray(unknownValue)) {
 *      unknownValue.forEach((val, idx) => {})
 *      unknownValue.copyWithin(0, 1, 2)
 *    }
 *
 *    // TypeScript error: Property 'forEach' does not exist on type 'unknown'.
 *    if (_.isTypedArray(unknownValue)) typedArray.forEach((val, idx) => {})
 *
 * @param val
 */
export function isTypedArray(val: unknown): val is TypedArray {
  return constructorNamed(
    val,
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'BigInt64Array',
    'BigUint64Array'
  )
}

export const typedArrayType = (value: TypedArray): TypedArrayNames => {
  return value?.constructor?.name as TypedArrayNames
}

export const isTypedArrayBigInt = (value: unknown): value is TypedArrayBigInt => {
  return constructorNamed(value, 'BigInt64Array', 'BigUint64Array')
}

export const isTypedArrayNumber = (value: unknown): value is TypedArrayNumber => {
  return constructorNamed(
    value,
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array'
  )
}

export const isTypedArrayName = (value: string): value is TypedArrayNames => {
  return TYPED_ARRAY_NAMES.includes(value as TypedArrayNames)
}

export const isInt8Array = (value: unknown): value is Int8Array => {
  return constructorNamed(value, 'Int8Array')
}

export const isUint8Array = (value: unknown): value is Uint8Array => {
  return constructorNamed(value, 'Uint8Array')
}

export const isUint8ClampedArray = (value: unknown): value is Uint8ClampedArray => {
  return constructorNamed(value, 'Uint8ClampedArray')
}

export const isInt16Array = (value: unknown): value is Int16Array => {
  return constructorNamed(value, 'Int16Array')
}

export const isUint16Array = (value: unknown): value is Uint16Array => {
  return constructorNamed(value, 'Uint16Array')
}

export const isInt32Array = (value: unknown): value is Int32Array => {
  return constructorNamed(value, 'Int32Array')
}

export const isUint32Array = (value: unknown): value is Uint32Array => {
  return constructorNamed(value, 'Uint32Array')
}

export const isFloat32Array = (value: unknown): value is Float32Array => {
  return constructorNamed(value, 'Float32Array')
}

export const isFloat64Array = (value: unknown): value is Float64Array => {
  return constructorNamed(value, 'Float64Array')
}

export const isBigInt64Array = (value: unknown): value is BigInt64Array => {
  return constructorNamed(value, 'BigInt64Array')
}

export const isBigUint64Array = (value: unknown): value is BigUint64Array => {
  return constructorNamed(value, 'BigUint64Array')
}
