// @-ts-nocheck
/*{ @common-imports-in-tests-templates }*/

import { a_Array_of_Tvalues, a_Array_ofKeys, a_Map_of_TMapKeys_Tvalues, a_Map_of_TMapKeys_Tvalues_WithCommonProps, TMapKeys, Tvalues } from '../../../../../test-utils/test-data'
import { ValueOfStrict } from '../../../../index'
import {
  map_prototype_stringNonEnumerablesInherited,
  map_prototype_stringNonEnumerablesOwn,
  map_prototype_symbolNonEnumerablesInherited,
  Tmap_prototype_stringNonEnumerablesInherited,
  Tmap_prototype_stringNonEnumerablesInherited_values,
  Tmap_prototype_stringNonEnumerablesOwn,
  Tmap_prototype_stringNonEnumerablesOwn_values,
  Tmap_prototype_symbolNonEnumerablesInherited,
  Tmap_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Many, with Inspectable Nested Values', () => {
  const inputTitle = `Map<TMapKeys, Tvalues>`
  describe(inputTitle, () => {
    const getInputVanilla = () => a_Map_of_TMapKeys_Tvalues
    const getInputWithExtraCommonProps = () => a_Map_of_TMapKeys_Tvalues_WithCommonProps
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = true

    // ### Keys / Props ###

    type Texpected_nested_keys = typeof isInspectableNested extends false ? never : TMapKeys
    const expected_nested_keys: Texpected_nested_keys[] = !isInspectableNested ? [] : a_Array_ofKeys

    /*{ @common-own-inherited-enumerable-props }*/

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = Tmap_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = map_prototype_stringNonEnumerablesOwn
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Tmap_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = map_prototype_stringNonEnumerablesInherited
    type Texpected_symbolNonEnumerablesInherited = Tmap_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = map_prototype_symbolNonEnumerablesInherited

    // ### Values ###

    type Texpected_nested_items = typeof isInspectableNested extends false ? never : Tvalues
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : a_Array_of_Tvalues

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = Tmap_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = map_prototype_stringNonEnumerablesOwn.map((value) => a_Map_of_TMapKeys_Tvalues[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Tmap_prototype_stringNonEnumerablesInherited_values<typeof a_Map_of_TMapKeys_Tvalues>
    type Texpected_symbolNonEnumerablesInherited_values = Tmap_prototype_symbolNonEnumerablesInherited_values<typeof a_Map_of_TMapKeys_Tvalues>

    // top values

    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof Map<any, any>>>

    /*{ @default-expected-keys-values-iteration }*/

    /*{ @all-typings-tests-vanilla }*/
    /*{ @all-typings-tests-WECP }*/
    /*{ @all-typings-tests-options-wrong }*/
  })
})
