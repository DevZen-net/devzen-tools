import * as _ from 'lodash'
import { isClass } from './classes'
import { isBigInt } from './isBigInt'
import { isBoxedBoolean } from './isBoxedBoolean'
import { isBoxedNumber } from './isBoxedNumber'
import { isBoxedString } from './isBoxedString'
import { isDataView } from './isDataView'
import { isFunction } from './isFunction'
import { MANY_NAMES, ManyNames } from './isMany'
import { isMapIterator } from './isMapIterator'
import { isPromise } from './isPromise'
import { isSetIterator } from './isSetIterator'
import { SINGLE_NAMES, SingleNames } from './isSingle'

export type TypeNames = SingleNames | ManyNames | 'WeakSet' | 'WeakMap'

export const TYPE_NAMES: TypeNames[] = [
  ...SINGLE_NAMES,
  ...MANY_NAMES,
  'WeakSet',
  'WeakMap',
] as const
/*
@todo: What about Iterator and other synthetic isXxx? Are any more deserving to be real-world types?

/*
@todo: can we use TYPE_NAMES instead of repeating here? The order of the types in this array is important, because it is used to determine the most specific type of a value, which must recede Boxed primitives must be before the primitive types, realObject must be last etc.
 */
export const TYPE_NAMES_ORDER: TypeNames[] = [
  'arguments',
  'null', // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null
  'undefined', // formatting kept compatible with typeof
  'Array',
  'class',
  'function', // formatting kept compatible with typeof
  'String',
  'string', // formatting kept compatible with typeof
  'Date',
  'RegExp',
  'Number',
  'NaN', // NaN is a proper type, not a number!
  'number', // formatting kept compatible with typeof
  'bigint', // formatting kept compatible with typeof
  'Boolean',
  'boolean', // formatting kept compatible with typeof
  'Set',
  'Map',
  'SetIterator',
  'MapIterator',
  'WeakSet',
  'WeakMap',
  'symbol', // formatting kept compatible with typeof
  'TypedArray',
  'ArrayBuffer',
  'DataView',
  'Promise',
  'Error',
  'realObject',
] as const

const capitalize1stChar = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const zenTypes: Partial<Record<TypeNames, (...args: any[]) => boolean>> = {
  bigint: isBigInt,
  class: isClass,
  function: isFunction,
  Promise: isPromise,
  Number: isBoxedNumber,
  String: isBoxedString,
  Boolean: isBoxedBoolean,
  DataView: isDataView,
  SetIterator: isSetIterator,
  MapIterator: isMapIterator,
  realObject: (value: unknown) => _.isObject(value), // realObject at the end of typesOrder, no need to exclude others,
  // TypedArray: (value: any) =>
  //   // _.isArrayBuffer(value) || _.isTypedArray(value),
}
/**
 * Returns the **type name** of the value passed, similar to the flawed [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof), but in a much richer, fine-grained & *non-Bad Parts* manner, recognising & many more distinct "real" types.
 *
 * For example `'realObject'` is considered only and for all real `{}` objects, in all object forms (i.e plain {} object, instance etc.) but does NOT include Arrays, Functions, Maps, Sets etc etc unlike [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) (and `isObject` for that matter).
 *
 * Nestedly `null`'s type is well... `'null'` and not `'object'`, unlike JS's dummy [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof).
 *
 * Also, functions are recognised as `'function'` but ES6 Classes as `'class'`.
 *
 * And NaNs as just a `'NaN'`, not a `number` as the name stipulates!
 *
 * Finally, it recognises many other built-in types, like Set, Map, Iterator, Generator, TypedArray, Promise and others.
 *
 * # Naming Conventions
 *
 * The type name is returned as a string, where possible types names are among [TtypeNames](/types/TtypeNames.html).
 *
 * We keep same names as [typeof](etc. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) when these type co-exist in `typeof` & `z.type()`. But we also add many more types, not needing adhere to the ill-formed legacy of `typeof` formatting and rules. So we have types like 'class', 'Generator', 'Iterator', 'Generator', 'Promise' etc. There's a distinction between primitives & boxed primitives, so we also have 'Number', 'String', 'Boolean' etc.
 *
 * The convention is to use either:
 *  - the `typeof` name, for example `string` or `number` or `function`, if those co-exist (and make sense).
 *
 *  Otherwise, we use:
 *  - the TypeScript/ES6 built-in type name or construct (preferred, if it exists). For example, we choose "class" instead of "Class"
 *    OR
 *  - the same name as the constructor function used to create the value, for example `WeakSet` *
 *  - Boxed values (of primitives) always get their type in capitalized form, i.e `'Number'`, `'String'` or `'Boolean'`.
 *
 * @param value any value
 *
 * @returns TtypeNames the type name of the value passed as a string, eg 'number' or 'boolean' or 'class' or 'Generator' etc
 */
export const type = (value: unknown): TypeNames => {
  // @todo: optimise this, instead of looping - not efficient!
  for (const typeName of TYPE_NAMES_ORDER) {
    if (zenTypes[typeName]) {
      if ((zenTypes[typeName] as any)(value)) return typeName
    }
    // capitalise & delegate to lodash
    else if ((_ as any)[`is${capitalize1stChar(typeName)}`](value)) return typeName
  }

  // should never reach here
  throw new Error(`Zen: type() - Unknown type '${value}'`)
}

/**
 * Returns `true` if the type name passed is a valid type name
 *
 * @param aType
 *
 * @returns `true` if the type name passed is a valid type name, irrespective of whether it is a long or short type name
 */
export const isType = (aType: string | TypeNames): aType is TypeNames =>
  TYPE_NAMES.includes(aType as any)
