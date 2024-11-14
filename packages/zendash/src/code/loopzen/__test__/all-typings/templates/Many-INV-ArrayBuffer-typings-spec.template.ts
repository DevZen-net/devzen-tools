// @-ts-nocheck @todo: fix typings
/*{ @common-imports-in-tests-templates }*/

import * as _ from 'lodash'
import { fillArrayEmptySlotsWithZeros } from '../../../../../test-utils/misc'
import { add_CommonProps, get_Array_of_numbers, get_arrayBuffer_Uint8 } from '../../../../../test-utils/test-data'
import { keys_DefaultOptions, ValueOfStrict, loop_DefaultOptions, DataViewType } from '../../../../index'
import {
  arrayBuffer_prototype_stringNonEnumerablesInherited,
  arrayBuffer_prototype_stringNonEnumerablesOwn,
  arrayBuffer_prototype_symbolNonEnumerablesInherited,
  TarrayBuffer_prototype_stringNonEnumerablesInherited,
  TarrayBuffer_prototype_stringNonEnumerablesInherited_values,
  TarrayBuffer_prototype_stringNonEnumerablesOwn,
  TarrayBuffer_prototype_stringNonEnumerablesOwn_values,
  TarrayBuffer_prototype_symbolNonEnumerablesInherited,
  TarrayBuffer_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Many, with No Inspectable Nested Values', () => {
  const inputTitle = `ArrayBuffer` // just for title
  describe(inputTitle, () => {
    before(() => {
      // @ts-ignore
      keys_DefaultOptions.dataViewType = DataViewType.Uint8
      // @ts-ignore
      loop_DefaultOptions.dataViewType = DataViewType.Uint8
    })
    after(() => {
      keys_DefaultOptions.dataViewType = undefined
      loop_DefaultOptions.dataViewType = undefined
    })

    const getInputVanilla = () => get_arrayBuffer_Uint8()
    const getInputWithExtraCommonProps = () => add_CommonProps(getInputVanilla())
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = true

    // ### Keys / Props ###

    type Texpected_nested_keys = number
    const expected_nested_keys: Texpected_nested_keys[] = _.times(8)

    /*{ @common-own-inherited-enumerable-props }*/

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = TarrayBuffer_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = arrayBuffer_prototype_stringNonEnumerablesOwn
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = TarrayBuffer_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = arrayBuffer_prototype_stringNonEnumerablesInherited
    type Texpected_symbolNonEnumerablesInherited = TarrayBuffer_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = arrayBuffer_prototype_symbolNonEnumerablesInherited

    // ### Values ###

    type Texpected_nested_items = typeof isInspectableNested extends false ? never : number

    const expected_nested_items: Texpected_nested_items[] = fillArrayEmptySlotsWithZeros(get_Array_of_numbers(), 8)

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = TarrayBuffer_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = arrayBuffer_prototype_stringNonEnumerablesOwn.map((value) => inputVanilla[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = TarrayBuffer_prototype_stringNonEnumerablesInherited_values
    type Texpected_symbolNonEnumerablesInherited_values = TarrayBuffer_prototype_symbolNonEnumerablesInherited_values

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof ArrayBuffer>>

    /*{ @default-expected-keys-values-iteration }*/

    describe(`all-typings-tests for override`, () => {
      // default overrides here
      //
      type Texpected_iteration_items = number
      const expected_iteration_items = _.times(inputVanilla.byteLength, (idx) => get_Array_of_numbers()[idx] | 0)

      type Texpected_iteration_keys = number
      const expected_iteration_keys = _.times(inputVanilla.byteLength, (idx) => idx)

      /*{ @all-typings-tests-vanilla }*/
      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})
