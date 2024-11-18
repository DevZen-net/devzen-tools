// @-ts-nocheck
import { add_CommonProps, Tvalues } from '../../../../../test-utils/test-data'
/*{ @common-imports-in-tests-templates }*/
import { ValueOfStrict } from '../../../../index'
import {
  boxedString_prototype_stringNonEnumerablesInherited,
  boxedString_prototype_stringNonEnumerablesOwn,
  boxedString_prototype_symbolNonEnumerablesInherited,
  TboxedString_prototype_stringNonEnumerablesInherited,
  TboxedString_prototype_stringNonEnumerablesInherited_values,
  TboxedString_prototype_stringNonEnumerablesOwn,
  TboxedString_prototype_stringNonEnumerablesOwn_values,
  TboxedString_prototype_symbolNonEnumerablesInherited,
  TboxedString_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

let inputVanilla: any // leave this as any, generated by template

describe('Singles/Boxed Primitives', () => {
  const inputTitle = `String` // just for title
  describe(inputTitle, () => {
    const getInputVanilla = () => new String('Actual String Value')
    const getInputWithExtraCommonProps = () => add_CommonProps(getInputVanilla())
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = false

    type Texpected_nested_keys = never
    const expected_nested_keys: Texpected_nested_keys[] = []

    type Texpected_nested_items = never
    const expected_nested_items: Texpected_nested_items[] = []

    /*{ @common-own-inherited-enumerable-props }*/

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = TboxedString_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = [...boxedString_prototype_stringNonEnumerablesOwn]
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = TboxedString_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = [...boxedString_prototype_stringNonEnumerablesInherited]
    type Texpected_symbolNonEnumerablesInherited = TboxedString_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = [...boxedString_prototype_symbolNonEnumerablesInherited]

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = TboxedString_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = boxedString_prototype_stringNonEnumerablesOwn.map((value) => inputVanilla[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = TboxedString_prototype_stringNonEnumerablesInherited_values
    type Texpected_symbolNonEnumerablesInherited_values = TboxedString_prototype_symbolNonEnumerablesInherited_values

    // top values

    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof String>>

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
      type Texpected_callback_items = ReturnType<typeof inputVanilla.valueOf>
      const expected_callback_items = [inputVanilla.valueOf()]

      /*{ @all-typings-tests-vanilla }*/
      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})