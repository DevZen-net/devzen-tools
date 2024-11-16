// @-ts-nocheck
/*{ @common-imports-in-tests-templates }*/

import { a_Array_of_Tvalues, add_CommonProps, get_AsyncGenerator_of_Tvalues, Tvalues } from '../../../../../test-utils/test-data'
import { ValueOfStrict, AsyncLoopGenerator } from '../../../../index'
import {
  asyncGenerator_prototype_stringNonEnumerablesInherited,
  asyncGenerator_prototype_stringNonEnumerablesOwn,
  asyncGenerator_prototype_symbolNonEnumerablesInherited,
  TasyncGenerator_prototype_stringNonEnumerablesInherited,
  TasyncGenerator_prototype_stringNonEnumerablesInherited_values,
  TasyncGenerator_prototype_stringNonEnumerablesOwn,
  TasyncGenerator_prototype_stringNonEnumerablesOwn_values,
  TasyncGenerator_prototype_symbolNonEnumerablesInherited,
  TasyncGenerator_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Many, with No Inspectable Nested Values', () => {
  const inputTitle = `AsyncGenerator<Tvalues>` // just for title
  describe(inputTitle, () => {
    const getInputVanilla = () => get_AsyncGenerator_of_Tvalues()
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
    type Texpected_stringNonEnumerablesOwn = TasyncGenerator_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = asyncGenerator_prototype_stringNonEnumerablesOwn
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = TasyncGenerator_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = asyncGenerator_prototype_stringNonEnumerablesInherited
    type Texpected_symbolNonEnumerablesInherited = TasyncGenerator_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = asyncGenerator_prototype_symbolNonEnumerablesInherited

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = TasyncGenerator_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = asyncGenerator_prototype_stringNonEnumerablesOwn.map((value) => inputVanilla[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = TasyncGenerator_prototype_stringNonEnumerablesInherited_values<typeof inputVanilla>
    type Texpected_symbolNonEnumerablesInherited_values = TasyncGenerator_prototype_symbolNonEnumerablesInherited_values<typeof inputVanilla>

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof AsyncGenerator<any>>>

    /*{ @default-expected-keys-values-iteration }*/

    describe(`all-typings-tests for override`, () => {
      // // default overrides here
      // type Texpected_iteration_keys = null
      // const expected_iteration_keys = a_Array_of_Tvalues.map((x) => null) // NOTE: it gets deduplication of same null keys (i.e [null])
      //
      // type Texpected_iteration_items = Tvalues
      // const expected_iteration_items = a_Array_of_Tvalues
      /*{ @all-typings-tests-vanilla }*/
      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})
