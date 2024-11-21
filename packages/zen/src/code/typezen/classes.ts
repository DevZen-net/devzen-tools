import { Class, Constructor } from 'type-fest'
import { functionType } from './functionType'
import { ManySystem } from './isMany'
import { SingleSystem } from './isSingle'

export const SYSTEM_CLASSES: Class<any, any>[] = [
  Promise,
  Object,
  Array,
  String,
  Number,
  Boolean,
  Date,
  RegExp,
  Error,
  Function,
  Map,
  Set,
  WeakMap,
  WeakSet,
  ArrayBuffer,
  DataView,
  Float32Array,
  Float64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Uint8Array,
  Uint8ClampedArray,
  Uint16Array,
  Uint32Array,
  BigUint64Array,
  BigInt64Array,
  Proxy,

  // These 2 are not classes, they don't get new-ed
  // Symbol,
  // BigInt,
]

// export type SystemConstructors =
//   | StringConstructor
//   | ArrayConstructor
//   | ObjectConstructor
//   | PromiseConstructor
//   | FunctionConstructor
//   | BooleanConstructor
//   | NumberConstructor
//   | DateConstructor
//   | RegExpConstructor
//   | ErrorConstructor
//   | MapConstructor
//   | SetConstructor
//   | WeakMapConstructor
//   | WeakSetConstructor
//   | ArrayBufferConstructor
//   | DataViewConstructor
//   | Float32ArrayConstructor
//   | Float64ArrayConstructor
//   | Int8ArrayConstructor
//   | Int16ArrayConstructor
//   | Int32ArrayConstructor
//   | Uint8ArrayConstructor
//   | Uint8ClampedArrayConstructor
//   | Uint16ArrayConstructor
//   | Uint32ArrayConstructor
//   | BigUint64ArrayConstructor
//   | BigInt64ArrayConstructor
//   | ProxyConstructor
//   // These are not constructors / classes, cant be new-ed
//   // | SymbolConstructor
//   // | BigIntConstructor

/**
 * Just a stub - not working to matching exclusively System classes, it matches everything!
 */
export type SystemClasses =
  | ManySystem<any, any>
  | SingleSystem
  | WeakMap<any, any>
  | WeakSet<any>
  | typeof Proxy // ??

// not a class
// | BigInt
// | Symbol

/**
 * Check if a value is a class (instead of a "normal" function), with a type guard, so you can `new value()` without TS errors.
 *
 * @see [`z.functionType`](../functions/functionType.html) for the underlying function
 *
 * @see [`z.isUserClass()`](../functions/isUserClass.html) to exclude internal ones like Promise, Object, Array etc
 */
export const isClass = (value: Class<any> | any): value is Class<any> =>
  functionType(value) === 'class'

/**
 * Returns true if the value is a **user class** only, as opposed to a "normal" functions OR non user-defined class, i.e the internal ones like Promise, Object, Array, Set, Map etc
 *
 * @see [`z.isClass`](../functions/isClass.html) for the more inclusive one
 *
 * @see [`z.functionType`](../functions/functionType.html) for the underlying function
 */
export const isUserClass = <T>(value: T | any): value is Class<T> =>
  // exclude all built in non-user classes
  isClass(value) && !SYSTEM_CLASSES.includes(value)

/**
 * Returns true if the value is a **user class** only, as opposed to a "normal" functions OR non user-defined class, i.e the internal ones like Promise, Object, Array, Set, Map etc
 *
 * @todo: improve guard, it results to Class
 *
 * @see [`z.isClass`](../functions/isClass.html) for the more inclusive one
 *
 * @see [`z.functionType`](../functions/functionType.html) for the underlying function
 */
export const isSystemClass = <T>(value: T | any): value is Class<SystemClasses> =>
  isClass(value) && SYSTEM_CLASSES.includes(value) // plain SystemClasses breaks

export type ClassTypeNames = 'systemClass' | 'userClass'

export const CLASS_TYPE_NAMES: ClassTypeNames[] = ['systemClass', 'userClass'] as const

export const classType = (value: Class<any>): ClassTypeNames | undefined =>
  isClass(value) ? (isUserClass(value) ? 'userClass' : 'systemClass') : undefined

/**
 * Returns the `constructor` of an Object value, if it exists.
 *
 * @todo: test
 * @todo: @example
 * @todo: improve typings
 * @todo: handle BigInt separately
 *
 * @param val
 *
 * @returns the constructor of the value if it exists, otherwise undefined
 */
export const constructor = <T>(val: T): Constructor<T> | undefined =>
  val?.constructor as Constructor<T>
