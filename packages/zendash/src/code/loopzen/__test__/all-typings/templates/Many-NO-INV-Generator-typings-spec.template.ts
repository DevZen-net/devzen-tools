// @-ts-nocheck
/*{ @common-imports-in-tests-templates }*/

import { a_Array_of_Tvalues, add_CommonProps, get_Generator_of_Tvalues, Tvalues } from '../../../../../test-utils/test-data'
import { ValueOfStrict } from '../../../../index'
import {
  generator_prototype_stringNonEnumerablesInherited,
  generator_prototype_stringNonEnumerablesOwn,
  generator_prototype_symbolNonEnumerablesInherited,
  Tgenerator_prototype_stringNonEnumerablesInherited,
  Tgenerator_prototype_stringNonEnumerablesInherited_values,
  Tgenerator_prototype_stringNonEnumerablesOwn,
  Tgenerator_prototype_stringNonEnumerablesOwn_values,
  Tgenerator_prototype_symbolNonEnumerablesInherited,
  Tgenerator_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Many, with No Inspectable Nested Values', () => {
  const inputTitle = `Generator<Tvalues>` // just for title
  describe(inputTitle, () => {
    const getInputVanilla = () => get_Generator_of_Tvalues()
    const getInputWithExtraCommonProps = () => add_CommonProps(getInputVanilla())
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = false

    // ### Keys / Props ###
    type Texpected_nested_keys = null
    const expected_nested_keys: Texpected_nested_keys[] = a_Array_of_Tvalues.map(() => null)

    // ### Values ###
    type Texpected_nested_items = Tvalues
    const expected_nested_items: Texpected_nested_items[] = a_Array_of_Tvalues

    /*{ @common-own-inherited-enumerable-props }*/

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = Tgenerator_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = generator_prototype_stringNonEnumerablesOwn
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Tgenerator_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = generator_prototype_stringNonEnumerablesInherited
    type Texpected_symbolNonEnumerablesInherited = Tgenerator_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = generator_prototype_symbolNonEnumerablesInherited

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = Tgenerator_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = generator_prototype_stringNonEnumerablesOwn.map((value) => inputVanilla[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Tgenerator_prototype_stringNonEnumerablesInherited_values<typeof inputVanilla>
    type Texpected_symbolNonEnumerablesInherited_values = Tgenerator_prototype_symbolNonEnumerablesInherited_values<typeof inputVanilla>

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof Generator<any>>>

    /*{ @default-expected-keys-values-iteration }*/

    describe(`all-typings-tests for override`, () => {
      // default overrides here
      // type Texpected_iteration_keys = null
      // const expected_iteration_items = a_Array_of_Tvalues
      // const expected_iteration_keys = a_Array_of_Tvalues.map((x) => null) // note: it gets deduplication of same null keys
      /*{ @all-typings-tests-vanilla }*/
      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})
