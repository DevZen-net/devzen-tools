// @-ts-nocheck
/*{ @common-imports-in-tests-templates }*/

import { ReadonlyDeep, ValueOf } from 'type-fest'
import {
  a_Array_of_Tvalues,
  a_Array_of_Tvalues_indexes,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  arrayAndCommonStringProps,
  arrayAndCommonStringProps_values,
  TarrayAndCommonStringProps,
  TarrayAndCommonStringProps_values,
  Tvalues,
} from '../../../../../test-utils/test-data'
import { ValueOfStrict } from '../../../../typezen/type-utils'
import {
  array_prototype_stringNonEnumerablesInherited,
  array_prototype_stringNonEnumerablesInherited_ES2023,
  array_prototype_stringNonEnumerablesOwn,
  array_prototype_symbolNonEnumerablesInherited,
  Tarray_prototype_stringNonEnumerablesInherited,
  Tarray_prototype_stringNonEnumerablesInherited_values,
  Tarray_prototype_stringNonEnumerablesOwn,
  Tarray_prototype_stringNonEnumerablesOwn_values,
  Tarray_prototype_symbolNonEnumerablesInherited,
  Tarray_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Many, with Inspectable Nested Values', () => {
  const inputTitle = `Array<Tvalues>`
  describe(inputTitle, () => {
    const getInputVanilla = () => a_Array_of_Tvalues
    const getInputWithExtraCommonProps = () => a_Array_of_Tvalues_withCommonAndArrayExtraProps
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = true
    type Texpected_nested_keys = typeof isInspectableNested extends false ? never : number
    const expected_nested_keys: Texpected_nested_keys[] = !isInspectableNested ? [] : a_Array_of_Tvalues_indexes

    /*{ @common-own-inherited-enumerable-props }*/

    // ### Keys / Props ###

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = Tarray_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = array_prototype_stringNonEnumerablesOwn
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Tarray_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = [...array_prototype_stringNonEnumerablesInherited, ...(([] as any).findLastIndex ? array_prototype_stringNonEnumerablesInherited_ES2023 : [])]
    type Texpected_symbolNonEnumerablesInherited = Tarray_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = array_prototype_symbolNonEnumerablesInherited

    // ### Values ###

    type Texpected_nested_items = typeof isInspectableNested extends false ? never : Tvalues
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : a_Array_of_Tvalues

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = Tarray_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = expected_stringNonEnumerablesOwn.map((value) => inputVanilla[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Tarray_prototype_stringNonEnumerablesInherited_values<typeof inputVanilla>
    type Texpected_symbolNonEnumerablesInherited_values = Tarray_prototype_symbolNonEnumerablesInherited_values<typeof inputVanilla>

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof Array<any>>>

    /*{ @default-expected-keys-values-iteration }*/

    describe(`all-typings-tests for override`, () => {
      type Texpected_stringOwnProps = TarrayAndCommonStringProps // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
      const expected_stringOwnProps: Readonly<Texpected_stringOwnProps[]> = arrayAndCommonStringProps // set to `commonStringProps`, or something else
      type Texpected_stringOwnProps_values = TarrayAndCommonStringProps_values // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
      const expected_stringOwnProps_values: ReadonlyDeep<Texpected_stringOwnProps_values[]> = arrayAndCommonStringProps_values // set to `commonStringProps_values`, or something else

      /*{ @all-typings-tests-vanilla }*/
      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})
