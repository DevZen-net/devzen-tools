/**
 * Generic types and utilities
 */

export type ClassType<T> = { new (...args: any[]): T }

export type ExcludeByKey<T, U extends keyof any> = T & { [P in U]?: never } // search "ObjectWithAnyKeyExceptXxxHack"

//** todo: replace with import { TypedArray } from '@devzen/zendash'
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array

/**
 * @todo: replace with import { Tany } from '@devzen/zendash'
 *
 * TL;DR Exclude<any, SomeType> doesn't work, so we use this instead.
 *
 * It's a kind of replacement for TypeScript's "any" used as a utility type, to Exclude specific items from (e.g. specific COMMANDS) from a SUITE or Spec, as `Exclude<any, SomeType>` doesn't work!
 *
 * Search "ObjectWithAnyKeyExceptXxxHack" in SpecZen for more details
 **/
export type TAny =
  | string
  | number
  | bigint
  | boolean
  | undefined
  | null
  | symbol
  | object
  | RegExp
  | Date
  | Error
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>
  | Promise<any>
  | Array<any> // or any[] ?
  | ClassType<any>
  | Function
  | Iterator<any>
  | Generator<any>
  | AsyncIterator<any>
  | AsyncGenerator<any>
  | IterableIterator<any>
  | AsyncIterableIterator<any>
  | Record<any, any>
  | IArguments
  | TypedArray
  | ArrayBuffer

// @todo: use TAny from zendash from add all missing ones, Iterator, Generator, AsyncIterator, AsyncGenerator, IArguments, etc       And Object?

export type TAny_ExcludeObjectAndFunction = Exclude<TAny, object | Function> // @see https://www.totaltypescript.com/uses-for-exclude-type-helper
