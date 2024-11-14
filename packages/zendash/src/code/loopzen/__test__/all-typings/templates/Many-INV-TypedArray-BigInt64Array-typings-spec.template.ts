// @-ts-nocheck
/*{ @common-imports-in-tests-templates }*/

import { ReadonlyDeep, ValueOf } from 'type-fest'
import {
  a_Array_of_Tvalues,
  a_Array_of_Tvalues_indexes,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  a_TypedArray_BigInt64Array,
  a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
  a_TypedArray_BigInt64Array_indexes,
  arrayAndCommonStringProps,
  arrayAndCommonStringProps_values,
  ArrayOfValuesWithCommonProps,
  get_Array_of_numbers,
  TarrayAndCommonStringProps,
  TarrayAndCommonStringProps_values,
  Tvalues,
  get_Array_of_bigints,
} from '../../../../../test-utils/test-data'
import { ValueOfStrict } from '../../../../typezen/type-utils'
import {
  typedArray_prototype_stringNonEnumerablesInherited,
  typedArray_prototype_stringNonEnumerablesInherited_ES2023,
  typedArray_prototype_stringNonEnumerablesOwn,
  typedArray_prototype_symbolNonEnumerablesInherited,
  TtypedArray_prototype_stringNonEnumerablesInherited,
  TtypedArray_prototype_stringNonEnumerablesInherited_values,
  TtypedArray_prototype_stringNonEnumerablesOwn,
  TtypedArray_prototype_stringNonEnumerablesOwn_values,
  TtypedArray_prototype_symbolNonEnumerablesInherited,
  TtypedArray_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Many, with Inspectable Nested Values', () => {
  const inputTitle = `TypedArray-BigInt64Array` // just for title
  // note: Negative numeric prop is not written, unlike Array.
  describe(inputTitle, () => {
    const getInputVanilla = () => a_TypedArray_BigInt64Array
    const getInputWithExtraCommonProps = () => a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = true
    type Texpected_nested_keys = typeof isInspectableNested extends false ? never : number
    const expected_nested_keys: Texpected_nested_keys[] = !isInspectableNested ? [] : a_TypedArray_BigInt64Array_indexes

    /*{ @common-own-inherited-enumerable-props }*/

    // ### Keys / Props ###

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = TtypedArray_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = typedArray_prototype_stringNonEnumerablesOwn
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = TtypedArray_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = [...typedArray_prototype_stringNonEnumerablesInherited, ...(([] as any).findLastIndex ? typedArray_prototype_stringNonEnumerablesInherited_ES2023 : [])]
    type Texpected_symbolNonEnumerablesInherited = TtypedArray_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = typedArray_prototype_symbolNonEnumerablesInherited

    // ### Values ###

    type Texpected_nested_items = typeof isInspectableNested extends false ? never : bigint
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : get_Array_of_bigints()

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = TtypedArray_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = typedArray_prototype_stringNonEnumerablesOwn.map((value) => a_TypedArray_BigInt64Array[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = TtypedArray_prototype_stringNonEnumerablesInherited_values<typeof inputVanilla>
    type Texpected_symbolNonEnumerablesInherited_values = TtypedArray_prototype_symbolNonEnumerablesInherited_values<typeof inputVanilla>

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof BigInt64Array>>

    /*{ @default-expected-keys-values-iteration }*/

    describe(`all-typings-tests for override`, () => {
      // default overrides
      type Texpected_iteration_items = bigint
      const expected_iteration_items: Texpected_iteration_items[] = get_Array_of_bigints()

      /*{ @all-typings-tests-vanilla }*/

      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})
