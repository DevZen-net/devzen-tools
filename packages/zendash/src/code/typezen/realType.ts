import * as _ from 'lodash'
import { Simplify } from 'type-fest'
import { CLASS_TYPE_NAMES, classType, ClassTypeNames } from './classes'
import { FUNCTION_TYPE_NAMES, functionType, FunctionTypeNames } from './functionType'
import { INSTANCE_TYPE_NAMES, instanceType, InstanceTypeNames } from './instanceType'
import { MANY_NAMES } from './isMany'
import { SINGLE_NAMES } from './isSingle'
import { TYPED_ARRAY_NAMES, TypedArrayNames, typedArrayType } from './isTypedArray'
import { REAL_OBJECT_TYPE_NAMES, realObjectType, RealObjectTypeNames } from './realObjectType'
import { type, TYPE_NAMES, TypeNames } from './type'

/**
 * The types for which there's a real-world, more fine-grained type!
 */
export const TYPE_TO_REAL_TYPE_FUNCTIONS = {
  function: functionType,
  TypedArray: typedArrayType,
  instance: instanceType, // dummy, not used but needed for typings - realObject is used instead
  realObject: (value) => {
    const theObjectType = realObjectType(value)

    if (theObjectType === 'instance') return instanceType(value)

    return theObjectType || 'pojso'
  },
  class: classType,
} as const

type ExcludedTypeNames = Simplify<keyof typeof TYPE_TO_REAL_TYPE_FUNCTIONS> // excluded cause handled separately

type RealTypeExcludedTypeNames = Exclude<TypeNames, ExcludedTypeNames>

export type RealTypeNames =
  | RealTypeExcludedTypeNames
  | TypedArrayNames
  | Exclude<FunctionTypeNames, 'class'>
  | ClassTypeNames
  | Exclude<RealObjectTypeNames, 'instance'> // only 'pojso'
  | InstanceTypeNames

export const REAL_TYPE_NAMES: RealTypeNames[] = [
  // all types, expect those handled above
  ...(_.filter(
    TYPE_NAMES,
    (name) => !_.includes(_.keys(TYPE_TO_REAL_TYPE_FUNCTIONS), name)
  ) as RealTypeExcludedTypeNames[]),

  // functions, without 'class'
  ...(_.filter(FUNCTION_TYPE_NAMES, (name) => name !== 'class') as Exclude<
    FunctionTypeNames,
    ExcludedTypeNames
  >[]),
  ...CLASS_TYPE_NAMES,
  // realObjects, without 'instance'
  ...(_.filter(REAL_OBJECT_TYPE_NAMES, (name) => name !== 'instance') as Exclude<
    RealObjectTypeNames,
    ExcludedTypeNames
  >[]),
  ...INSTANCE_TYPE_NAMES,

  // rest
  ...TYPED_ARRAY_NAMES,
] as const

/**
 * The most fine-grained and granular version of `_z.type()`, returning the **Real-World Type Name** of the value passed, not just a general type:
 *
 * - Instead of `'function'` you get 'Function' | 'GeneratorFunction' | 'AsyncFunction' | 'AsyncGeneratorFunction' | 'ArrowFunction' (always endsWith 'Function')
 *
 * - Instead of `'realObject'` you get `'pojso'` or `'userInstance'` or `'systemInstance'` (endsWith 'Instance')
 *
 * - Instead of `'class'` you get `'systemClass'` or `'userClass'` (always endsWith 'Class')
 *
 * - Instead of `'TypedArray`, you get `'Int8Array'`, `'Uint8Array'`, `'Uint8ClampedArray'`, `'Int16Array'`, `'Uint16Array'`, `'Int32Array'` etc.
 *
 * @see [`_z.type()`](/functions/type.html) for the underlying function
 *
 * @param value any value
 *
 * @returns TfunctionTypes | TrealObjectTypes | TinstanceTypes | TclassTypes | TrtypeExcludedTypes the type name of the value passed as a string, eg 'number' or 'AsyncFunction' or 'instance' or 'userClass' etc
 */
export const realType = (value: unknown): RealTypeNames => {
  const normalType = type(value)
  if (TYPE_TO_REAL_TYPE_FUNCTIONS[normalType])
    return TYPE_TO_REAL_TYPE_FUNCTIONS[normalType](value)

  return normalType as RealTypeNames
}

/**
 * Returns `true` if the type name passed is a valid type name
 * @param aType
 * @returns `true` if the type name passed is a valid type name, irrespective of whether it is a long or short type name
 */
export const isRealType = (aType: string | TypeNames): aType is RealTypeNames =>
  REAL_TYPE_NAMES.includes(aType as any)
