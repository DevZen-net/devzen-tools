import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import {
  And,
  Class,
  IfAny,
  IsAny,
  IsBooleanLiteral,
  IsEqual,
  IsNever,
  IsNull,
  IsNumericLiteral,
  IsStringLiteral,
  IsUnknown,
  Or,
  TypedArray,
  ValueOf,
  Writable,
} from 'type-fest'
import { MapEntries, SetEntries } from 'type-fest/source/entries'
import { IsPrimitive } from 'type-fest/source/internal'
import {
  IKeys_DefaultOptions,
  IKeysOptions,
  InspectableNested,
  KeysStrict,
} from '../loopzen/keys'
import { isAnyArray } from './isAnyArray'
import { isAnyJustIterator } from './isAnyJustIterator'
import { isArrayBuffer } from './isArrayBuffer'
import { isAsyncGenerator } from './isAsyncGenerator'
import { isAsyncIterator } from './isAsyncIterator'
import { isBoxedPrimitive } from './isBoxedPrimitive'
import { isGenerator } from './isGenerator'
import { Many } from './isMany'
import { MapIteratorEntries, MapIteratorValues } from './isMapIterator'
import { NumberString } from './isNumberString'
import { Primitive } from './isPrimitive'
import { IsPromise } from './isPromise'
import { IfRealObject, isRealObject, IsRealObject } from './isRealObject'
import { SetIteratorEntries, SetIteratorValues } from './isSetIterator'
import {
  IfBoxedPrimitive,
  IfSingleOrWeak,
  IsBoxedPrimitive,
  isSingleOrWeak,
  IsSingleOrWeak,
  Single,
} from './isSingle'
import { TypedArrayBigInt, TypedArrayNumber } from './isTypedArray'
import {
  PropsOfKnownPrototype_stringNonEnumerablesInherited,
  PropsOfKnownPrototype_stringNonEnumerablesOwn,
  PropsOfKnownPrototype_symbolNonEnumerablesInherited,
  PropsOfKnownPrototype_symbolNonEnumerablesOwn,
  PropsValuesOfKnownPrototype_stringNonEnumerablesInherited,
  PropsValuesOfKnownPrototype_stringNonEnumerablesOwn,
  PropsValuesOfKnownPrototype_symbolNonEnumerablesInherited,
  PropsValuesOfKnownPrototype_symbolNonEnumerablesOwn,
  Tobject_stringNonEnumerablesInheritedTop,
  Tobject_stringNonEnumerablesInheritedTopHidden,
} from './types-info'
import { Values } from '../loopzen/values'

/**
 * Any kind of value falls into one of these types, either a single value or a many values holder.
 *
 * Useful for cases when `any` can't be used, like `Exclude<any, SomeType>` which fails with any - see ValidZen
 */
export type Any = Single | Many<any, any> | WeakMap<any, any> | WeakSet<any> // | WeakKey ??

export type AsyncIteratorOrGenerator<Titem, TReturn = void, TNext = void> =
  | AsyncIterator<Titem, TReturn, TNext>
  | AsyncIterable<Titem>
  | AsyncGenerator<Titem, TReturn, TNext>
  | AsyncIterableIterator<Titem>

export type IteratorOrGenerator<Titem, TReturn = void, TNext = void> =
  | Iterator<Titem, TReturn, TNext>
  | Generator<Titem, TReturn, TNext>
  | IterableIterator<Titem>

export type GeneratorType<T extends Generator<any> | AsyncGenerator<any>> =
  T extends Generator<infer R> ? R : T extends AsyncGenerator<infer R> ? R : never

export type TypedArrayExact<TinputTypedArray extends TypedArray> =
  TinputTypedArray extends Int8Array
    ? Int8Array
    : TinputTypedArray extends Uint8Array
      ? Uint8Array
      : TinputTypedArray extends Uint8ClampedArray
        ? Uint8ClampedArray
        : TinputTypedArray extends Int16Array
          ? Int16Array
          : TinputTypedArray extends Uint16Array
            ? Uint16Array
            : TinputTypedArray extends Int32Array
              ? Int32Array
              : TinputTypedArray extends Uint32Array
                ? Uint32Array
                : TinputTypedArray extends Float32Array
                  ? Float32Array
                  : TinputTypedArray extends Float64Array
                    ? Float64Array
                    : TinputTypedArray extends BigInt64Array
                      ? BigInt64Array
                      : TinputTypedArray extends BigUint64Array
                        ? BigUint64Array
                        : never

/**
 * Returns the value used in the TypedArray, i.e number or bigint
 */
export type TypedArrayValueType<TinputTypedArray extends TypedArray> = TinputTypedArray extends
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  ? number
  : TinputTypedArray extends BigInt64Array | BigUint64Array
    ? bigint
    : 'ERROR(ZenDash/TypeZen): Not a TypedArray'

/**
 * Like type-fest's `ValueOf` but:
 * - 2nd param `PropsOfObject` (extends `keyof ObjectType`) is required,
 * - if `PropsOfObject` IsAbsent (i.e `never`, `undefined`, `null`, `void` or `unknown`), then `never` is returned (i.e no prop Values are retrieved for non-existent props, and no defaults are used)
 */
export type ValueOfStrict<ObjectType, PropsOfObject extends keyof ObjectType> =
  IsAbsent<PropsOfObject> extends true ? never : ObjectType[PropsOfObject]

/**
 * Check a type is `true`
 *
 * Useful with `IsEqual`, for a strict type check
 *
 *    typeIsTrue<IsEqual<string, string>>()
 *
 * as alternative to
 *
 *    expectType<TypeEqual<string, string>>(true)`
 */
export function typeIsTrue<T extends true>(): void {}

/**
 * Check a type is `false`
 *
 * Useful with `IsEqual`, for a strict type check
 *
 *    typeIsFalse<IsEqual<string, number>>()
 *
 * as alternative to
 *
 *    expectType<TypeEqual<string, number>>(false)`
 */
export function typeIsFalse<T extends false>(): void {}

/**
 * Returns `true` if the input value is a `NestingObject`:
 * - an object that is a Many (Array, Set, Map, etc) *
 * - And contains other Nested Values (and/or Keys  - not just props). For example:
 *  - Array contains elements
 *  - Set contains keys
 *  - Map contains keys/values
 *  - Iterator, Generator etc contain items they go over / emit (includes Set & Map entries etc)
 * - Or a Boxed Primitive (Number, String, Boolean), which is nesting a Primitive value
 *
 *  Therefore, it's not a RealObject or Single or Weak by definition!
 *
 *  Note: this is different to `InspectableNested`, which is a more strict version of `NestingObject` (a subset), that only allows objects that can be inspected for their Nested keys/values, WITHOUT affecting the input value itself. Notable distinctions are:
 *  - `Set`, `Map`, `Array` etc are both `NestingObject` and `InspectableNested`
 *  - `SetEntries`, `Generator`, `Iterator` etc are `NestingObject` but NOT `InspectableNested`, cause iterating over them changes them (they can't be restarted).
 */
export type IsNestingObject<Tinput> = Or<
  Or<IsBoxedPrimitive<Tinput>, IsPromise<Tinput>>,
  And<Not<IfSingleOrWeak<Tinput>>, Not<IfRealObject<Tinput>>>
>

export type IfNestingObject<Tinput, Then = true, Else = false> =
  IsNestingObject<Tinput> extends true ? Then : Else

/**
 * Checks if input is a Nesting Object - it follows IsNestingObject type
 */
export const isNestingObject = (input: any): boolean => {
  if (isBoxedPrimitive(input)) return true // their primitive values

  if (isSingleOrWeak(input)) return false

  return (
    isGenerator(input) ||
    isAsyncGenerator(input) ||
    isAsyncIterator(input) ||
    isAnyJustIterator(input) ||
    _.isSet(input) ||
    _.isMap(input) ||
    isAnyArray(input) ||
    isArrayBuffer(input) ||
    _.isArguments(input)
  )
}

/**
 * # InsideValues
 *
 * Similar idea to TS's `ReturnType`, or `GeneratorType`, `Awaited` etc.
 * `InsideValues` gets the "Return value" or "Nested Values" or "elements" (collectively "items") value types, that are nested inside Tinput:
 *
 *  Inside Values are different & similar for every type: it's the value they convey. For Function it's their `ReturnType`, for `Promise` it is `Awaited` (i.e Resolved value type), for Array its Array elements, and so on for TypedArray, Map, Set, Generator, Iterator, Iterable, Plain Objects, Instances, Classes and IArguments & even Singles!
 *
 *  It can be used on every values, not just `IsNestingObject` or `IsInspectableNested`, but also for most `Tinputs` that hold some other value (types) somehow.
 *
 * So all types are allowed as Tinput: non-nested/non-Many types (i.e Single primitives like number,  string, etc return the same type back, while their Boxed Primitives, return their primitive type.
 *
 * In effect:
 * - Functions return their return type (acts as ReturnType)
 * - Generators, AsyncGenerators, Iterators, Iterable return their yielded types
 * - Promises return their resolved type (acts as Awaited)
 * - Arrays return their elements type
 * - POJSOs and instances return the type of their prop's values
 * - Classes return the type of their static prop's values. Note that it also always contain itself as a value.
 * - Maps, Sets return their key or value type
 * - TypedArrays return their element type
 * - WeakMap, WeakSet return their value type
 * - Boxed primitives return their primitive type
 * - Errors return string (i.e their message)
 * - All other Single types return themselves
 * and finally
 * - IArguments cant work, no type info - returns any @todo: why any and not itself?
 *
 * Note: we use Writable<Tinput> instead of Tinput, to avoid readonly issues
 */
export type InsideValues<Tinput extends any> =
  // Behave, prettier!
  Tinput extends undefined
    ? undefined
    : Tinput extends null
      ? null
      : Tinput extends (...args: any[]) => infer FnReturn // i.e ReturnType
        ? FnReturn
        : Writable<Tinput> extends Generator<infer Item>
          ? Item
          : Writable<Tinput> extends AsyncGenerator<infer Item>
            ? Item
            : Writable<Tinput> extends Promise<any>
              ? Awaited<Tinput>
              : Writable<Tinput> extends Array<infer Element>
                ? Element
                : Writable<Tinput> extends TypedArrayBigInt
                  ? bigint
                  : Writable<Tinput> extends TypedArrayNumber
                    ? number
                    : Writable<Tinput> extends ArrayBuffer
                      ? number
                      : Writable<Tinput> extends MapIteratorEntries<any, infer Values>
                        ? Values
                        : Writable<Tinput> extends SetIteratorEntries<infer Keys>
                          ? Keys
                          : Writable<Tinput> extends WeakMap<any, infer Val>
                            ? Val
                            : Writable<Tinput> extends WeakSet<infer Keys>
                              ? Keys
                              : Writable<Tinput> extends Map<any, infer Val>
                                ? Val
                                : Writable<Tinput> extends Set<infer Keys>
                                  ? Keys
                                  : Writable<Tinput> extends Iterator<infer Item>
                                    ? Item
                                    : Writable<Tinput> extends AsyncIterator<infer Item>
                                      ? Item
                                      : Writable<Tinput> extends Iterable<infer Item>
                                        ? Item
                                        : Writable<Tinput> extends AsyncIterable<infer Item>
                                          ? Item
                                          : Tinput extends Primitive
                                            ? Tinput
                                            : Tinput extends Number
                                              ? number
                                              : Tinput extends String
                                                ? string
                                                : Tinput extends Boolean
                                                  ? boolean
                                                  : Tinput extends Date
                                                    ? number // Date.valueOf returns number
                                                    : Tinput extends Error
                                                      ? string // Error.message is string
                                                      : Tinput extends Symbol
                                                        ? symbol
                                                        : Tinput extends Single
                                                          ? Tinput
                                                          : Writable<Tinput> extends Class<any>
                                                            ? ValueOf<Tinput>
                                                            : Writable<Tinput> extends IArguments
                                                              ? unknown // we don't know what the arguments values are
                                                              : ValueOf<Tinput> // All other Objects, i.e posjos, instances, IArguments, etc // @todo: add a strict flag, get only if NestingObjects & return never for other Objects!

/**
 * Like `InsideValue`, but for the keys of the nested values.
 */
export type InsideKeys<Tinput extends any> =
  // behave prettier!
  // with Inspectable Nested Keys
  Writable<Tinput> extends Array<any>
    ? number
    : Writable<Tinput> extends TypedArray
      ? number
      : Writable<Tinput> extends ArrayBuffer
        ? number
        : Writable<Tinput> extends IArguments
          ? NumberString
          : Writable<Tinput> extends MapIteratorEntries<infer Keys, any>
            ? Keys
            : Writable<Tinput> extends SetIteratorEntries<infer Keys>
              ? Keys
              : Writable<Tinput> extends Map<infer Keys, any>
                ? Keys
                : Writable<Tinput> extends Set<infer Keys>
                  ? Keys
                  : Writable<Tinput> extends WeakMap<infer Keys, any>
                    ? Keys
                    : Writable<Tinput> extends WeakSet<infer Keys>
                      ? Keys
                      : Writable<Tinput> extends Class<any>
                        ? keyof Tinput
                        : Tinput extends (...args: any[]) => any // i.e ReturnType
                          ? never
                          : Writable<Tinput> extends Generator<any>
                            ? never
                            : Writable<Tinput> extends AsyncGenerator<any>
                              ? never
                              : Writable<Tinput> extends Promise<any>
                                ? never
                                : Writable<Tinput> extends Iterator<any>
                                  ? never
                                  : Writable<Tinput> extends Iterable<any>
                                    ? never
                                    : Tinput extends Single
                                      ? never
                                      : keyof Tinput // All other Objects, i.e posjos, instances etc // @todo: add a strict flag, get only if NestingObjects & return never for other Objects!

/**
 * Gets the value type of a Generator or AsyncGenerator
 */
export type GeneratorReturnType<T extends Generator<any> | AsyncGenerator<any>> =
  T extends Generator<any, infer TReturn, any>
    ? TReturn
    : T extends AsyncGenerator<any, infer TReturn, any>
      ? TReturn
      : never

/**
 * Props of an object: string and symbol only, unlike number in Arrays indexes, or primitive/objects in Map & Set keys
 */
export type ObjectPropTypes = string | symbol

/**
 * Needed because of TS2538: Type symbol cannot be used as an index type
 * See https://github.com/microsoft/TypeScript/issues/1863
 */
export type SymbolObject<T extends object = Record<any, any>, K = T[keyof T]> = {
  [key: string | number | symbol]: K
}

/**
 * PropBag helper type - all Pojsos, instances, functions & IArguments that dont have plain props, instead "special" keys/indexes (like array have indexes, maps have keys, sets have values as keys, etc.)
 *
 * @todo: incomplete, untested and problematic, not excluding Singles etc - can't always be matched properly, need to add more types?
 */
export type PropertyBag<Titem, Tprops extends ObjectPropTypes, Tinput> = Exclude<
  | Exclude<Record<Tprops, Titem>, Single>
  | InstanceType<new () => Exclude<Tinput, Single>> // instances, excluding Tsingle
  | Function // @todo: what about with ClassType<Tinput> ?
  | IArguments, // this has only string keys
  Single
>

// Type Helpers

/**
 * If Condition is true, then return Then, else return Else
 */
export type If<Condition extends boolean, Then, Else> = Condition extends true ? Then : Else

/**
 * If both Conditions are true, then return Then, else return Else
 */
export type IfAnd<
  AndCondition1 extends boolean,
  AndCondition2 extends boolean,
  Then = true,
  Else = false,
> = AndCondition1 extends true ? (AndCondition2 extends true ? Then : Else) : Else

/**
 * If either Condition is true, then return Then, else return Else
 */
export type IfOr<
  OrCondition1 extends boolean,
  OrCondition2 extends boolean,
  Then = true,
  Else = false,
> = OrCondition1 extends true ? Then : OrCondition2 extends true ? Then : Else

/**
 * If T1 extends T2, then return Then (default true), else return Else (default false)
 */
export type IfExtends<T1, T2, Then = true, Else = false> = T1 extends T2 ? Then : Else

/**
 * Negates the passed boolean
 */
export type Not<T extends boolean> = T extends true ? false : true

/**
 * Returns true if T is any or unknown, otherwise returns false
 */
export type IsAnyOrUnknown<T> =
  IsAny<T> extends true ? true : IsUnknown<T> extends true ? true : false

/**
 * If T is any or unknown, then return Then, else return Else
 */
export type IfAnyOrUnknown<T, Then = true, Else = false> =
  IsAnyOrUnknown<T> extends true ? Then : Else

export type IsUndefined<T> = T extends undefined ? true : false

export type IfUndefined<T, Then = true, Else = false> = T extends undefined ? Then : Else

/**
 * Returns true if T is any, unknown, undefined
 */
export type IsAnyOrUnknownOrUndefined<T> =
  IsAnyOrUnknown<T> extends true ? true : T extends undefined ? true : false

/**
 * If T is any, unknown, undefined, then return Then, else return Else
 */
export type IfAnyOrUnknownOrUndefined<T, Then = true, Else = false> =
  IsAnyOrUnknownOrUndefined<T> extends true ? Then : Else

/**
 * Returns true if T is any, unknown, undefined, null, never, void
 */
export type IsAbsent<T> =
  IsAnyOrUnknownOrUndefined<T> extends true
    ? true
    : IsNull<T> extends true
      ? true
      : IsNever<T> extends true
        ? true
        : T extends void
          ? true
          : false

/**
 * If T is any, unknown, undefined, null, never, void, then return Then, else return Else
 */
export type IfAbsent<T, Then = true, Else = false> = IsAbsent<T> extends true ? Then : Else

type IfBooleanLiteral<T, Then = true, Else = false> =
  IsBooleanLiteral<T> extends true ? Then : Else

type IfStringLiteral<T, Then = true, Else = false> =
  IsStringLiteral<T> extends true ? Then : Else

type IfNumericLiteral<T, Then = true, Else = false> =
  IsNumericLiteral<T> extends true ? Then : Else

/**
 * Returns `true` if TpropName on the Tobject is `true`, `false` if it is `false`, otherwise (if its undefined etc), it returns `Tdefault` (that it self defaults to `false`)
 */
export type IsPropTrue<
  TpropName extends string,
  Tobject extends any,
  Tdefault extends boolean = false,
> =
  Tobject extends Record<string, any>
    ? Tobject[TpropName] extends true
      ? true
      : Tobject[TpropName] extends false
        ? false
        : Tdefault
    : Tdefault

export type IsPropFalse<
  TpropName extends string,
  Tobject extends any,
  Tdefault extends boolean = false,
> = If<IsPropTrue<TpropName, Tobject, Tdefault>, false, true>

// Props & Values Type Helpers

/**
 * Get the prototype chain's props of `Tinput`, according to the `TkeysOptions` passed, so we can exclude them from the instance props.
 *
 * It uses fine-grained props type info, so it can return the right props according to the options: it filters according to `string`, `symbol`, `nonEnumerables`, `inherited` & `own`, respecting their defaults as described in `KeysOptions` docs.
 *
 * For example, for Arrays, it ends up using:
 *
 *  - Tarray_prototype_stringNonEnumerablesOwn
 *  - Tarray_prototype_stringNonEnumerablesInherited
 *  - Tarray_prototype_symbolNonEnumerablesInherited
 *
 *  by respectively calling into:
 *
 *  - PropsOfKnownPrototype_stringNonEnumerablesInherited<>
 *  - PropsOfKnownPrototype_symbolNonEnumerablesInherited<>
 *  - PropsOfKnownPrototype_stringNonEnumerablesOwn<>
 *
 * depending on the options passed.
 *
 * If a prototype is not known at compile time (eg a custom user class), it returns `never`. Currently, as of TypeScript 5.4, there is no way to get the inherited prototype chain props of a class / instance at compile time @see @todo(888): add link to issue - keyofOwn missing in TS & Can't infer BaseClass from SubClass https://stackoverflow.com/questions/56377792/typescript-get-type-of-super-class
 *
 * Finally, it returns `Tobject_stringNonEnumerablesInheritedTop` if `top: true`.
 */
export type PropsOfKnownPrototype<
  Tinput extends object,
  TkeysOptions extends IKeysOptions = IKeys_DefaultOptions,
> = // add nonEnumerables
  // prettier stay here!
  IsAnyOrUnknown<TkeysOptions> extends true
    ? PropsOfKnownPrototype<Tinput> // Tkeys_DefaultOptions
    : IsPropTrue<'nonEnumerables', TkeysOptions> extends true
      ? // add inherited nonEnumerables
        | (IsPropTrue<'inherited', TkeysOptions> extends true
              ? // add string inherited nonEnumerables
                | (IsPropTrue<'string', TkeysOptions, true> extends true
                      ?
                          | PropsOfKnownPrototype_stringNonEnumerablesInherited<Tinput>
                          | (IsPropTrue<'top', TkeysOptions> extends true
                              ? Tobject_stringNonEnumerablesInheritedTop
                              : never)
                          | (IsPropTrue<'hidden', TkeysOptions> extends true
                              ? Tobject_stringNonEnumerablesInheritedTopHidden
                              : never)
                      : never)
                  // add symbol inherited nonEnumerables
                  | (IsPropTrue<'symbol', TkeysOptions> extends true
                      ? PropsOfKnownPrototype_symbolNonEnumerablesInherited<Tinput>
                      : never)
              : never)
          // add own nonEnumerables
          | (IsPropTrue<'own', TkeysOptions, true> extends true
              ? // add string own nonEnumerables
                | (IsPropTrue<'string', TkeysOptions, true> extends true
                      ? PropsOfKnownPrototype_stringNonEnumerablesOwn<Tinput>
                      : never)
                  // add symbol own nonEnumerables
                  | (IsPropTrue<'symbol', TkeysOptions> extends true
                      ? PropsOfKnownPrototype_symbolNonEnumerablesOwn<Tinput>
                      : never)
              : never)
      : never

// Get Object values (i.e Top values), but only those missing from Tinput
type PropsValuesOfKnownPrototype_stringNonEnumerablesInherited_Object_values<
  Tinput extends object,
> = ValueOfStrict<Object, Exclude<keyof Object, keyof Tinput>>

/**
 * Get the props values based on KeysOptions
 *
 * Note: mirror of `PropsOfKnownPrototype`, but for values instead of props.
 */
export type PropsValuesOfKnownPrototype<
  Tinput extends object,
  TkeysOptions extends IKeysOptions = IKeys_DefaultOptions,
> = // add nonEnumerables
  // prettier stay here!
  IsAnyOrUnknown<TkeysOptions> extends true
    ? PropsValuesOfKnownPrototype<Tinput> // Tkeys_DefaultOptions
    : IsPropTrue<'nonEnumerables', TkeysOptions> extends true
      ? // add inherited nonEnumerables
        | (IsPropTrue<'inherited', TkeysOptions> extends true
              ? // add string inherited nonEnumerables
                | (IsPropTrue<'string', TkeysOptions, true> extends true
                      ?
                          | PropsValuesOfKnownPrototype_stringNonEnumerablesInherited<Tinput>
                          | (IsPropTrue<'top', TkeysOptions> extends true
                              ? PropsValuesOfKnownPrototype_stringNonEnumerablesInherited_Object_values<Tinput>
                              : never) // @todo(213): implement hidden @see  PropsOfKnownPrototype
                      : never)

                  // add symbol inherited nonEnumerables
                  | (IsPropTrue<'symbol', TkeysOptions> extends true
                      ? PropsValuesOfKnownPrototype_symbolNonEnumerablesInherited<Tinput>
                      : never)
              : never)
          // add own nonEnumerables, string & symbol ?
          | (IsPropTrue<'own', TkeysOptions, true> extends true
              ? // add string own nonEnumerables
                | (IsPropTrue<'string', TkeysOptions, true> extends true
                      ? PropsValuesOfKnownPrototype_stringNonEnumerablesOwn<Tinput>
                      : never)
                  // add symbol own nonEnumerables
                  | (IsPropTrue<'symbol', TkeysOptions> extends true
                      ? PropsValuesOfKnownPrototype_symbolNonEnumerablesOwn<Tinput>
                      : never)
              : never)
      : never

export type NO_TYPE_CHANGE = '__NO_TYPE_CHANGE__'

type ChangeType<TypeChange, OldType> =
  IsEqual<TypeChange, NO_TYPE_CHANGE> extends true ? OldType : TypeChange
/**
 * Returns the BaseType of the Tinput, i.e the base type without extra props, but maintaining the same type, including the Type of any Nested values.
 *
 * Optionally, you can pass TypeChange to change the type of the BaseType's Nested values (or in case of Primitives, the type of the returned value itself). Eg a Tinput  = Array<'foo'> will return Array<'bar'> if you use `BaseType<Tinput, 'bar'>`, it will return `Array<'bar'>`,changing the Nested values type to 'bar'.
 *
 * It's used to exclude the BaseType props from the instance props and calculate what to return when `map()`-ing values.
 */
export type BaseType<
  Tinput,
  InternalItemsTypeChange = NO_TYPE_CHANGE,
  InternalKeysTypeChange = NO_TYPE_CHANGE,
> =
  // Note: order matters cause there are overlaps - match the most specific first:
  // - Generator / AsyncGenerator must be before Iterator / AsyncIterator
  // - MapXxx should be before SetXxx
  // - Class before Function
  // - and so on

  // prettier stay here!
  IsPrimitive<Tinput> extends true
    ? Tinput // ChangeType<InternalItemsTypeChange, Tinput>
    : Tinput extends Array<infer Titem>
      ? Array<ChangeType<InternalItemsTypeChange, Titem>>
      : Tinput extends IArguments
        ? IArguments
        : Tinput extends TypedArray
          ? TypedArrayExact<Tinput>
          : Tinput extends Generator<infer Titem>
            ? Generator<ChangeType<InternalItemsTypeChange, Titem>>
            : Tinput extends AsyncGenerator<infer Titem>
              ? AsyncGenerator<ChangeType<InternalItemsTypeChange, Titem>>
              : Tinput extends MapIteratorEntries<infer Tkey, infer Titem>
                ? IterableIterator<[Tkey, ChangeType<InternalItemsTypeChange, Titem>]>
                : // ? variation:  MapEntries<Map<Tkey, Titem>>
                  Tinput extends SetIteratorEntries<infer Titem>
                  ? IterableIterator<
                      [
                        ChangeType<InternalItemsTypeChange, Titem>,
                        ChangeType<InternalItemsTypeChange, Titem>,
                      ]
                    >
                  : // ? variation: SetEntries<Set<Titem>>
                    Tinput extends MapIteratorValues<infer Titem>
                    ? MapIteratorValues<ChangeType<InternalItemsTypeChange, Titem>> // @todo: not sure if this is right
                    : Tinput extends SetIteratorValues<infer Titem>
                      ? SetIteratorValues<ChangeType<InternalItemsTypeChange, Titem>> // @todo: not sure if this is right
                      : Tinput extends Map<infer Tkey, infer Titem>
                        ? Map<Tkey, ChangeType<InternalItemsTypeChange, Titem>>
                        : Tinput extends Set<infer Titem>
                          ? Set<ChangeType<InternalItemsTypeChange, Titem>>
                          : Tinput extends IterableIterator<infer Titem>
                            ? IterableIterator<ChangeType<InternalItemsTypeChange, Titem>>
                            : Tinput extends AsyncIterableIterator<infer Titem>
                              ? AsyncIterableIterator<
                                  ChangeType<InternalItemsTypeChange, Titem>
                                >
                              : Tinput extends AsyncIterator<infer Titem>
                                ? AsyncIterator<ChangeType<InternalItemsTypeChange, Titem>>
                                : Tinput extends Iterator<infer Titem>
                                  ? Iterator<ChangeType<InternalItemsTypeChange, Titem>>
                                  : Tinput extends WeakMap<infer Tkey, infer Titem>
                                    ? WeakMap<Tkey, ChangeType<InternalItemsTypeChange, Titem>>
                                    : Tinput extends WeakSet<infer Titem>
                                      ? WeakSet<Titem> // @todo: no type change allowed, cause it must be an object
                                      : Tinput extends Number
                                        ? Number
                                        : Tinput extends String
                                          ? String
                                          : Tinput extends Boolean
                                            ? Boolean
                                            : Tinput extends Symbol
                                              ? Symbol
                                              : Tinput extends Promise<infer Titem>
                                                ? Promise<
                                                    ChangeType<InternalItemsTypeChange, Titem>
                                                  >
                                                : Tinput extends Class<infer Ctype>
                                                  ? Tinput
                                                  : Tinput extends (
                                                        ...args: infer ArgsType
                                                      ) => infer ReturnType
                                                    ? (...args: ArgsType) => ReturnType
                                                    : // : Tinput extends Function
                                                      //   ? Function
                                                      Tinput extends Date
                                                      ? Date
                                                      : Tinput extends RegExp
                                                        ? RegExp
                                                        : Tinput extends TypeError
                                                          ? TypeError
                                                          : Tinput extends RangeError
                                                            ? RangeError
                                                            : Tinput extends SyntaxError
                                                              ? SyntaxError
                                                              : Tinput extends URIError
                                                                ? URIError
                                                                : Tinput extends EvalError
                                                                  ? EvalError
                                                                  : Tinput extends ReferenceError
                                                                    ? ReferenceError
                                                                    : Tinput extends Error
                                                                      ? Error
                                                                      : Tinput extends IArguments
                                                                        ? IArguments
                                                                        : Tinput extends ArrayBuffer
                                                                          ? ArrayBuffer
                                                                          : Tinput extends SharedArrayBuffer
                                                                            ? SharedArrayBuffer
                                                                            : Tinput extends DataView
                                                                              ? DataView
                                                                              : Tinput extends InstanceTypeAll<any>
                                                                                ? {} // @todo(222): what should we return here? InstanceTypeAll<Tinput> ? Or an instance-less object, like a Pick<{}, any> ?
                                                                                : // ? ???? ownKeyof R ???? // @todo(888): create & link issue - keyofOwn missing in TS & Can't infer BaseClass from SubClass https://stackoverflow.com/questions/56377792/typescript-get-type-of-super-class
                                                                                  never
/**
 * Get all the props of a default known system's object (i.e effectively, its prototype).
 *
 * Note: used for excluding these prototype props from the instance props, when `own: true` is passed & we know nothing else about the value.
 * Due to the way TypeScript works, it can't infer the prototype chain of custom classes at compile time, so it returns `never` for custom classes.
 */
export type PropsOfBaseType<Tinput> = keyof BaseType<Tinput>

export type PropsOfStringOrSymbol<Tinput extends object, TkeysOptions extends IKeysOptions> =
  | (IsPropTrue<'string', TkeysOptions, true> extends true
      ? Exclude<PropsString<Tinput>, PropsOfBaseType<Tinput>> // no options, we exclude all base props. If custom class, exclude never
      : never)
  | (IsPropTrue<'symbol', TkeysOptions> extends true
      ? Exclude<PropsSymbol<Tinput>, PropsOfBaseType<Tinput>> // no options, we exclude all base props. If custom class, exclude never
      : never)

/**
 * Returns `string` or `symbol` types, based on the options
 */
export type BasicProps<TkeysOptions extends IKeysOptions = IKeys_DefaultOptions> =
  | (IsPropTrue<'string', TkeysOptions, true> extends true
      ? string // default is string: true
      : never)
  | (IsPropTrue<'symbol', TkeysOptions> extends true ? symbol : never)

/**
 * Like Props, excluding props of the BaseType (only own)
 */
export type PropsStrict<
  Tinput extends object,
  Toptions extends IKeysOptions = IKeys_DefaultOptions,
> =
  // prettier stay here!
  // Get the props of the Input, excluding PropsOfBaseType
  IsAnyOrUnknown<Toptions> extends true
    ? Props<Tinput, IKeys_DefaultOptions>
    : IsPropTrue<'own', Toptions, true> extends true
      ? Exclude<PropsOfStringOrSymbol<Tinput, Toptions>, never>
      : never

/**
 * Get ALL the props of Tinput object, based on the KeysOptions passed
 *
 * It follows the `keys()` function closely:
 * - but cares ONLY for props (no NestedKeys of Arrays, Maps, Sets, TypedArrays)
 * - `own` works when extending a System class, who's prototype is known at compile time, but fails for instances, where the prototype can't be infered at compile time by TypeScript (@todo(888): add link to issue - keyofOwn missing in TS & Can't infer BaseClass from SubClass https://stackoverflow.com/questions/56377792/typescript-get-type-of-super-class)
 */
export type Props<Tinput extends object, Toptions extends IKeysOptions = IKeys_DefaultOptions> =
  // prettier stay here!
  // Get the props of the Input, excluding PropsOfBaseType
  IsAnyOrUnknown<Toptions> extends true
    ? Props<Tinput, IKeys_DefaultOptions>
    :
        | (IsPropTrue<'own', Toptions, true> extends true
            ? Exclude<PropsOfStringOrSymbol<Tinput, Toptions>, never>
            : never)
        // OR we could allow user to pass the SuperType instead, but it still breaks in so many JS/TS ways (mainly due to instanceProps not being part of the SuperType, but the instance itself. "own" at runtime VS where a prop is defined (i.e inherited from SuperType) are completely different things in JS VS TS, so the following is basically meaningless. Also, Super Type is not accessible in TS!   Leaving here as a note for ES2035? :)
        //    TkeysOptions extends { own?: Class<infer SuperType> } & KeysOptions ?
        //       | (TkeysOptions extends { string?: true } & KeysOptions ?
        //           Exclude<PropsString<Tinput>, keyof SuperType>
        //         : never)
        //       | (TkeysOptions extends { symbol: true } & KeysOptions ?
        //           Exclude<PropsSymbol<Tinput>, keyof SuperType>
        //         : never)
        //     :

        // Add actual known base/prototype chain props, based on options {nonEnumerables, inherited, ...} etc. Nothing (i.e `never`) is added for custom class instances, as their prototype can't be inferred at compile time by TypeScript
        | Exclude<PropsOfKnownPrototype<Tinput, Toptions>, never>

export type PropsValues<
  Tinput extends object,
  TkeysOptions extends IKeysOptions = IKeys_DefaultOptions,
> =
  // prettier stay here!
  // Get the props of the Input, excluding PropsOfBaseType
  IsAnyOrUnknown<TkeysOptions> extends true
    ? PropsValues<Tinput>
    :
        | (IsPropTrue<'own', TkeysOptions, true> extends true
            ? ValueOfStrict<Tinput, PropsOfStringOrSymbol<Tinput, TkeysOptions>>
            : never)
        // Add actual known base/prototype chain props values, based on options {nonEnumerables, inherited, ...} etc.
        | PropsValuesOfKnownPrototype<Tinput, TkeysOptions>

/**
 * A type helper to extract the prop names, of props with a matching `TpropType`, i.e the type of the props (i.e `string` or `symbol`) from any value type.
 *
 * If value is any object, It extracts ONLY its `string` or `symbol` keys.
 *
 * Otherwise, it returns never
 */
export type PropsOfPropType<Tinput, TpropType extends string | symbol> =
  // prettier keep here
  Tinput extends object
    ? {
        // @todo: Exclude never is dummy - why is it breaking without it then?
        //        Or is a a "feature", not a bug? It cleans up the type that leads to never, but why?
        [K in Exclude<keyof Tinput, never>]: K extends TpropType ? K : never
        // [K in keyof Tinput]: K extends TpropType ? K : never // BREAKS cause of "Exclude never is dummy"
      }[keyof Tinput]
    : // : Tinput extends Primitive ? never // NOT NEEDED!
      // : TpropType
      never

export type PropsString<Tinput> = PropsOfPropType<Tinput, string>
export type PropsSymbol<Tinput> = PropsOfPropType<Tinput, symbol>

/**
 * Like InstanceType<T>, but also works for private constructors:
 *
 * @example
 *
 *    class ClassPrivateConstructor {
 *      private constructor() {}
 *      aMethod(arg: string): string {return 'foo'}
 *      anotherMethod(num: number): number {return 42}
 *      aField = 'foo'
 *      anotherField = 42
 *    }
 *
 *    // InstanceType fails:
 *    // @ts-expect-error Error: TS2344: Type typeof ClassPrivateConstructor does not satisfy the constraint abstract new (...args: any) => any, Cannot assign a private constructor type to a public constructor type.
 *    type InstanceTypeOfClassPrivateConstructor = InstanceType<typeof ClassPrivateConstructor>
 *
 *    // InstanceTypeAll works! Type is equal to ClassWithPrivateConstructor
 *    type InstanceTypeAllOfClassPrivateConstructor = InstanceTypeAll<typeof ClassPrivateConstructor>
 *    expectType<TypeEqual<InstanceTypeAllOfClassPrivateConstructor, ClassPrivateConstructor>>(true)
 *    expectType<TypeEqual<InstanceTypeAllOfClassPrivateConstructor, {
 *      aMethod: (arg: string) => string,
 *      anotherMethod: (num: number) => number;
 *      aField: string,
 *      anotherField: number
 *     }>>(true)
 *
 * @credit Original code & ideas from
 *  - https://zirkelc.dev/posts/extract-class-methods
 *  - https://www.typescriptlang.org/play?#code/MYGwhgzhAEDKD2BbApgYXFaBvAsAKGmgAcAnASwDcwAXZaYeAOwmpIFdhr4SAKASmwBffIQhJkAWWTUAFvAAm-IfmF58AenXQAogA9WYTtDLNqYRsDrUAnkWT4bdnfpKHqASVPnLAFVvIAHh8APmgAXmgfaGR9ZEZ5GEZkAHdoHgA6TLASAHMIAC5oc2sAbQBdATDQkwAzZBJoACVoAH4m6EKomNp4mCxiEnguR2RC2vroAAVoQVapjqLGawBuB39nA04pWQUAOTAUCCDQiP6SgGljRmgAa2RreBrIss6LsujY3rTM9Oy8wuK5UqoWKc0uhSSFAmghKdweTx8ZVWeBGG1cW2kcgSx3CUzIwBuQQANGi3NssftDsdgsiNOpQgB5c6ddZkGAIFDoSAQNZODloDAQTwsbx0CJ6TYeLwWZB+OwBEaPODiLlQGnQfB00LaEiDEgspwAckVT35qoghug8ngyESQ2gEBobJq1mgsjoDFMrhM1GghrAACMWOjfUlUhksrkCotrMCY4b0ry6GbBcKzDKdXrcWnRXLAiblZzBcFNXhNKE8-QmGYTDAUDsEtAaoNEIWBdyk23zeSFDBxS4yZjewEU9yczL1aXy9AmYVzdBEGwWMZEEQQMgUIxffWsTBm0gu4L8KBuYfuRJ4ASV2uN3FqOyVYKe43cAQHeJn0osKpVFqdLruDnQU-VHKALwJTNuEtEwGF1ZBOBAV0yFXddN3vK5aBIGpDDoQ1QIgZ8LUTMt6SmQY7BIGw-TEFBn2gus2QgEwciuN11jwx9z0vG5IJIS0AzYX0SGQABHNgyGE+RWNRDii3PIcEkNY9gPw8CeIAhpkJvNCHzksCFL6ERFiGGR6k-ARvxUIA
 */
export type InstanceTypeAll<T> = T extends new (...args: any[]) => infer R
  ? R
  : T extends { prototype: infer P }
    ? P
    : any

/**
 * Extract the method key names from a class
 *
 * @example
 *
 *      class MyClass {
 *        constructor() {}
 *        aMethod() {}
 *        anotherMethod() {}
 *        aField = 'foo'
 *        anotherField = 42
 *      }
 *
 *      type MethodNamesMyClass = MethodNames<MyClass>
 *      expectType<TypeEqual<MethodNamesMyClass, 'aMethod' |'anotherMethod'>>(true)
 *
 *  @note constructor is not included
 *
 *  @credit Original code from https://zirkelc.dev/posts/extract-class-methods
 */
export type MethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

/**
 * Extract the non-method key names from a class
 *
 * @example
 *
 *      class MyClass {
 *        constructor() {}
 *        aMethod() {}
 *        anotherMethod() {}
 *        aField = 'foo'
 *        anotherField = 42
 *      }
 *
 *      type PropNamesMyClass = PropNames<MyClass>
 *      expectType<TypeEqual<PropNamesMyClass, 'aField' |'anotherField'>>(true)
 *
 *  @note constructor is not included
 *
 *  @credit Original code from https://zirkelc.dev/posts/extract-class-methods
 */
export type PropNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

/**
 * Extract the methods from a class, return a new structure with methods only.
 *
 * Useful for extending & mocking methods only
 *
 * @example
 *
 *     class MyClass {
 *        constructor() {}
 *        aMethod() {}
 *        anotherMethod() {}
 *        aField = 'foo'
 *        anotherField = 42
 *      }
 *
 *    type MethodsMyClass = JustMethods<MyClass>
 *    expectType<TypeEqual<MethodsMyClass, { aMethod: (arg: string) => string, anotherMethod: (num: number) => number }>>(true)
 *
 * @note constructor is not included
 *
 * @credit Original code from https://zirkelc.dev/posts/extract-class-methods
 *
 * Note: Exclude<..., never> is used to force TypeScript to report final type as an object, not a type helper call
 */
export type JustMethods<T> = Exclude<Pick<T, MethodNames<T>>, never>

/**
 * Create a new type from an object type extracting just properties, not methods.
 *
 *   @see JustMethods for extract just methods
 *
 *   @example
 *   ```
 *   import {JustProps} from 'type-fest';
 *   interface Foo {
 *     a: string;
 *     b: number;
 *     c(): string;
 *     d(x: string): string;
 *   }
 *   const foo: JustProps<Foo> = {a: 'a', b: 1};
 *   ```
 *   @credit Idea from https://github.com/sindresorhus/type-fest/pull/4/files, original code from https://zirkelc.dev/posts/extract-class-methods
 *
 * Note: Exclude<..., never> is used to force TypeScript to report final type as an object, not a type helper call
 */
export type JustProps<T> = Exclude<Pick<T, PropNames<T>>, never>

/**
 * Convert all literal types to their base type, eg 'foobar' => string, 123 => number, true => boolean, etc.
 */
export type Unliteral<TinputType> =
  // prettier stay here!
  TinputType extends string
    ? string
    : TinputType extends number
      ? number
      : TinputType extends boolean
        ? boolean
        : TinputType extends symbol
          ? symbol
          : TinputType
