// @-ts-nocheck
/*{ @common-imports-in-tests-templates }*/

import { a_Array_of_Tvalues, a_Set_of_Tvalues, a_Set_of_Tvalues_withCommonProps, Tvalues } from '../../../../../test-utils/test-data'
import { ValueOfStrict } from '../../../../index'
import {
  set_prototype_stringNonEnumerablesInherited,
  set_prototype_stringNonEnumerablesOwn,
  set_prototype_symbolNonEnumerablesInherited,
  Tset_prototype_stringNonEnumerablesInherited,
  Tset_prototype_stringNonEnumerablesInherited_values,
  Tset_prototype_stringNonEnumerablesOwn,
  Tset_prototype_stringNonEnumerablesOwn_values,
  Tset_prototype_symbolNonEnumerablesInherited,
  Tset_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Many, with Inspectable Nested Values', () => {
  const inputTitle = `Set<Tvalues>` // Note: keys of Set are just a_Array_of_Tvalues(), so z.values() bring the values of the Set
  describe(inputTitle, () => {
    const inputTitle = `Set (with Tvalues as natural keys/values)` // just for title
    const getInputVanilla = () => a_Set_of_Tvalues
    const getInputWithExtraCommonProps = () => a_Set_of_Tvalues_withCommonProps
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = true

    // ### Keys / Props ###

    type Texpected_nested_keys = typeof isInspectableNested extends false ? never : Tvalues
    const expected_nested_keys: Texpected_nested_keys[] = !isInspectableNested ? [] : a_Array_of_Tvalues

    /*{ @common-own-inherited-enumerable-props }*/

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = Tset_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = set_prototype_stringNonEnumerablesOwn
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Tset_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = set_prototype_stringNonEnumerablesInherited
    type Texpected_symbolNonEnumerablesInherited = Tset_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = set_prototype_symbolNonEnumerablesInherited

    // ### Values ###

    type Texpected_nested_items = typeof isInspectableNested extends false ? never : Tvalues
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : a_Array_of_Tvalues

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = Tset_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = set_prototype_stringNonEnumerablesOwn.map((value) => a_Set_of_Tvalues[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Tset_prototype_stringNonEnumerablesInherited_values<typeof a_Set_of_Tvalues>
    type Texpected_symbolNonEnumerablesInherited_values = Tset_prototype_symbolNonEnumerablesInherited_values<typeof a_Set_of_Tvalues>

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof Set<any>>>

    /*{ @default-expected-keys-values-iteration }*/

    /*{ @all-typings-tests-vanilla }*/
    /*{ @all-typings-tests-WECP }*/
    /*{ @all-typings-tests-options-wrong }*/
  })
})
