import { Class, TypedArray, Writable } from 'type-fest'
import { IsSingleOrWeak } from './isSingle'
import { type, TypeNames } from './type'

import { Any, ObjectPropTypes } from './type-utils'

export type ManyNames =
  | 'realObject'
  | 'Array'
  | 'Set'
  | 'Map'
  | 'SetIterator'
  | 'MapIterator'
  | 'class' // see notes
  | 'arguments'
  | 'TypedArray'
  | 'ArrayBuffer'

export const MANY_NAMES: ManyNames[] = [
  // iterable via z.iterate
  'realObject',
  'Array',
  'Set',
  'Map',
  'SetIterator',
  'MapIterator',
  'class', // see notes
  'arguments',
  'TypedArray',
  'ArrayBuffer',
] as const

/**
 * All system types that are Many, everything but your own pojsos / plain objects & instances.
 *
 * Note: not containing isSingle values, including `WeakSet` / `WeakMap` .
 */
export type ManySystem<Titem, TidxKey> =
  | Iterator<Titem>
  | Generator<Titem>
  | AsyncIterator<Titem>
  | AsyncGenerator<Titem>
  | IterableIterator<Titem>
  | AsyncIterableIterator<Titem>
  | Array<Titem>
  | Set<Titem>
  | Map<TidxKey, Titem>
  | IArguments
  | TypedArray
  | ArrayBuffer
  | SharedArrayBuffer

export type ManySystemNames =
  | 'Iterator'
  | 'Generator'
  | 'AsyncIterator'
  | 'AsyncGenerator'
  | 'IterableIterator'
  | 'AsyncIterableIterator'
  | 'Array'
  | 'Set'
  | 'Map'
  | 'arguments'
  | 'TypedArray'
  | 'ArrayBuffer'
  | 'SharedArrayBuffer'

export const MANY_SYSTEM_NAMES: ManySystemNames[] = [
  'Iterator',
  'Generator',
  'AsyncIterator',
  'AsyncGenerator',
  'IterableIterator',
  'AsyncIterableIterator',
  'Array',
  'Set',
  'Map',
  'arguments',
  'TypedArray',
  'ArrayBuffer',
  'SharedArrayBuffer',
] as const

// @todo: see `Many`
// type WithoutWeakTypes<T> = {
//   [P in keyof T]: T[P] extends WeakMap<any, any> | WeakSet<any> ? never : T[P];
// };
//
// type ObjectWithoutWeakTypes = WithoutWeakTypes<Record<TObjectProps, any>>;

/**
 * Supposedly matches any type that can hold many items, including system types like Array, Set, Map, Iterator, Generator, arguments etc.
 *
 * WARNING: Unfortunately, it also matches all `Single` object types like `Date`, `Error`, `Number`, `Promise` etc, which is wrong. On the other hand, `Single` works fine, because it doesn't match `Many` types.
 *
 * @todo(333): NOT WORKING PROPERLY YET! Need to find a way to exclude Boxed singles (eg String, Date etc) from Many.
 *
 * We can use IsMany that excludes these known Single types ;-)
 */
export type Many<Titem, TidxKey> =
  | ManySystem<Titem, TidxKey>
  | Class<any> // Class is a Many type, because it can have static props (unlike function which we treat as isSingle)

  // Objects / PoJSOs / Instances
  | Record<ObjectPropTypes, Titem> // @todo: Record<> and all below, makes all Boxed / Object singles (eg Date, Error, Number, Promise etc) to be matched as Many, which is not correct. If we disable Record<> all POJSOs & instances also arent matched as Many, which is also not correct. Need to find a way to exclude Boxed singles from Many.

/**
 * Returns `true` if `T` is a **Many** type, i.e one of the `ManySystem` types, or a class or a Record (i.e an Object). It correctly excludes all Single & Weak types (unlike `Many` that breaks, cause it matches `Single` object types like Date, Error, Number, Promise etc).
 */
export type IsMany<T> =
  Writable<T> extends Many<any, any> ? (IsSingleOrWeak<T> extends true ? false : true) : false

/**
 * Returns `true` if the data type is a natural holder of other items, also known as a "collection" (eg Array, Object, Set, Map) but Many is also Iterator, Generator, arguments etc, hence the name `isMany` instead of `isCollection`.
 *
 * It's also the opposite of [`_.isSingle()`](/functions/isSingle.html) in terms of naturally/normally having compound or many items (eg props, array items etc) nested inside it.
 *
 * As defined in [`T_MANY_NAMES`](/variables/T_MANY_NAMES.html), they are:
 *
 *   - `'object'`
 *   - `'Array'`
 *   - `'Set'`
 *   - `'Map'`
 *   - `'class'` // see notes
 *   - `'arguments'`
 *   - `'Generator'`
 *   - `'Iterator'`
 *   - `'AsyncGenerator'`
 *   - `'AsyncIterator'`
 *
 *   Not iterable at all, they don't reveal their items, but they are still "many" types
 *   - `'WeakSet'`
 *   - `'WeakMap'`
 *
 * @note: class types makes sense to be categorised as "Many", because a class can have interesting static props.
 *
 * Normal 'function' is not normally a "Many" type (many values holder), although in theory it can hold props. Same applies to Boxed primitives like `String`, `Number` etc, which represent a single value (not many), but they can have properties (very rare & bad practice though). You need to enforce this check in your code.
 *
 *
 * @note: On all of these "Many" types (except `WeakSet`/`WeakMap` which aren't revealing their items), you can use [`z.loop(value)`](/functions/iterate.html) to get an `IterableIterator` of `[keyOrIdx, value]` pairs, which works the same way for all of them.
 *
 * It also has an option `allProps` that deals with props on all `_.isObject` values.
 *
 * @see [`z.isSingle()`](/functions/isSingle.html) is the opposite of `isMany`
 *
 * @see [`z.isPrimitive()`](/functions/isPrimitive.html) for the most basic single types
 *
 * @see [`z.loop(value)`](/functions/iterate.html) to iterate on `isMany()` values (that makes sense).
 *
 * @see [`T_MANY_NAMES`](/variables/T_MANY_NAMES.html) for the string list of types that are considered "Many" types.
 *
 * @see [`TMany`](/types/TMany.html) the types that are considered "Many".
 *
 * @see [`isManyType`](/functions/isManyType.html) to check if a type (not a value) is a "Many" type.
 *
 * @param value any value
 *
 * @returns {boolean} `true` if the value is a single type
 */
// @todo: are all value types fall into either isMany or isSingle? Validate with test or types check!
export const isMany = <Titem, TidxKey extends Any>(
  value: Many<Titem, TidxKey> | any
): value is Many<Titem, TidxKey> => MANY_NAMES.includes(type(value) as ManyNames)

export const isManyType = (theType: string | TypeNames) =>
  MANY_NAMES.includes(theType as ManyNames)
