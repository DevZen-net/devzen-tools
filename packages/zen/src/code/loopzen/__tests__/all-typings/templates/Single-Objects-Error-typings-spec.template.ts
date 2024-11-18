// @-ts-nocheck
import { add_CommonProps, Tvalues } from '../../../../../test-utils/test-data'
/*{ @common-imports-in-tests-templates }*/
import { ValueOfStrict } from '../../../../index'
import {
  error_prototype_stringNonEnumerablesInherited,
  error_prototype_stringNonEnumerablesInherited_ES2023,
  error_prototype_stringNonEnumerablesOwn,
  error_prototype_symbolNonEnumerablesInherited,
  Terror_prototype_stringNonEnumerablesInherited,
  Terror_prototype_stringNonEnumerablesInherited_values,
  Terror_prototype_stringNonEnumerablesOwn,
  Terror_prototype_stringNonEnumerablesOwn_values,
  Terror_prototype_symbolNonEnumerablesInherited,
  Terror_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Singles/Objects', () => {
  const inputTitle = `Error` // just for title
  describe(inputTitle, () => {
    const ERROR_MESSAGE = 'Error message' as const
    const inputVanilla = new Error(ERROR_MESSAGE, { cause: 'Error cause' })
    const inputWithExtraCommonProps = add_CommonProps(new Error('foo', { cause: 'Error cause' }))
    const getInputVanilla = () => inputVanilla
    const getInputWithExtraCommonProps = () => inputWithExtraCommonProps

    const isInspectableNested = false

    // ### Keys / Props ###

    type Texpected_nested_keys = typeof isInspectableNested extends false ? never : number
    const expected_nested_keys: Texpected_nested_keys[] = !isInspectableNested ? [] : []

    /*{ @common-own-inherited-enumerable-props }*/

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = Terror_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = [...error_prototype_stringNonEnumerablesOwn]
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Terror_prototype_stringNonEnumerablesInherited
    type Texpected_symbolNonEnumerablesInherited = Terror_prototype_symbolNonEnumerablesInherited

    const expected_stringNonEnumerablesInherited = [...error_prototype_stringNonEnumerablesInherited, ...(([] as any).findLastIndex ? error_prototype_stringNonEnumerablesInherited_ES2023 : [])]
    const expected_symbolNonEnumerablesInherited = [...error_prototype_symbolNonEnumerablesInherited]

    // ### Values ###

    type Texpected_nested_items = typeof isInspectableNested extends false ? never : Tvalues
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : []

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = Terror_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = error_prototype_stringNonEnumerablesOwn.map((value) => inputVanilla[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Terror_prototype_stringNonEnumerablesInherited_values
    type Texpected_symbolNonEnumerablesInherited_values = Terror_prototype_symbolNonEnumerablesInherited_values

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof Error>>

    /*{ @default-expected-keys-values-iteration }*/

    describe(`all-typings-tests for override`, () => {
      // default overrides here
      type Texpected_keys = never
      const expected_keys: Texpected_nested_keys[] = []

      type Texpected_values = never
      const expected_values = []

      type Texpected_iteration_keys = null
      const expected_iteration_keys: Texpected_iteration_keys[] = [null]

      type Texpected_iteration_items = typeof inputVanilla
      const expected_iteration_items = [inputVanilla]

      type Texpected_callback_keys = null
      const expected_callback_keys: Texpected_callback_keys[] = [null]
      type Texpected_callback_items = typeof inputVanilla.message
      const expected_callback_items = [inputVanilla.message]

      /*{ @all-typings-tests-vanilla }*/
      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})
