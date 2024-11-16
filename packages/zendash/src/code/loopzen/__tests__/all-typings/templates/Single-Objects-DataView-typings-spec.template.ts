// @-ts-nocheck
import { add_CommonProps, Tvalues } from '../../../../../test-utils/test-data'
/*{ @common-imports-in-tests-templates }*/
import { ValueOfStrict } from '../../../../index'
import {
  dataView_prototype_stringNonEnumerablesInherited,
  dataView_prototype_stringNonEnumerablesInherited_ES2023,
  dataView_prototype_stringNonEnumerablesOwn,
  dataView_prototype_symbolNonEnumerablesInherited,
  TdataView_prototype_stringNonEnumerablesInherited,
  TdataView_prototype_stringNonEnumerablesInherited_values,
  TdataView_prototype_stringNonEnumerablesOwn,
  TdataView_prototype_stringNonEnumerablesOwn_values,
  TdataView_prototype_symbolNonEnumerablesInherited,
  TdataView_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Singles/Objects', () => {
  const inputTitle = `DataView` // just for title
  describe(inputTitle, () => {
    const getInputVanilla = () => new DataView(new ArrayBuffer(1))
    const getInputWithExtraCommonProps = () => add_CommonProps(getInputVanilla())
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = false

    // ### Keys / Props ###

    type Texpected_nested_keys = typeof isInspectableNested extends false ? never : number
    const expected_nested_keys: Texpected_nested_keys[] = !isInspectableNested ? [] : []

    /*{ @common-own-inherited-enumerable-props }*/

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = TdataView_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = [...dataView_prototype_stringNonEnumerablesOwn]
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = TdataView_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = [...dataView_prototype_stringNonEnumerablesInherited, ...(([] as any).findLastIndex ? dataView_prototype_stringNonEnumerablesInherited_ES2023 : [])]
    type Texpected_symbolNonEnumerablesInherited = TdataView_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = [...dataView_prototype_symbolNonEnumerablesInherited]

    // ### Values ###

    type Texpected_nested_items = typeof isInspectableNested extends false ? never : Tvalues
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : []

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = TdataView_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = dataView_prototype_stringNonEnumerablesOwn.map((value) => inputVanilla[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = TdataView_prototype_stringNonEnumerablesInherited_values
    type Texpected_symbolNonEnumerablesInherited_values = TdataView_prototype_symbolNonEnumerablesInherited_values

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof DataView>>

    /*{ @default-expected-keys-values-iteration }*/

    describe(`all-typings-tests for override`, () => {
      // default overrides here
      type Texpected_iteration_keys = null
      const expected_iteration_keys: Texpected_iteration_keys[] = [null]
      type Texpected_iteration_items = typeof inputVanilla
      const expected_iteration_items = [inputVanilla]

      type Texpected_callback_keys = null
      const expected_callback_keys: Texpected_callback_keys[] = [null]
      type Texpected_callback_items = typeof inputVanilla // as is
      const expected_callback_items = [inputVanilla, 'SHOULD FAIL'] // @todo(333): should fail / not used?

      /*{ @all-typings-tests-vanilla }*/
      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})
