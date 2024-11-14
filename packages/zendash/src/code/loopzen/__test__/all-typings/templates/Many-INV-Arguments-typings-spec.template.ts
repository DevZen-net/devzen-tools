// @ts-nocheck @todo: fix this?
/*{ @common-imports-in-tests-templates }*/

import { ReadonlyDeep, ValueOf } from 'type-fest'
import { a_Arguments, a_Arguments_indexes, a_Arguments_values, add_CommonProps } from '../../../../../test-utils/test-data'
import { NumberString } from '../../../../typezen/isNumberString'
import { ValueOfStrict } from '../../../../typezen/type-utils'
import {
  arguments_prototype_stringNonEnumerablesInherited,
  arguments_prototype_stringNonEnumerablesInherited_ES2023,
  arguments_prototype_stringNonEnumerablesOwn,
  arguments_prototype_symbolNonEnumerablesInherited,
  arguments_prototype_symbolNonEnumerablesOwn,
  Targuments_prototype_stringNonEnumerablesInherited,
  Targuments_prototype_stringNonEnumerablesInherited_values,
  Targuments_prototype_stringNonEnumerablesOwn,
  Targuments_prototype_stringNonEnumerablesOwn_values,
  Targuments_prototype_symbolNonEnumerablesInherited,
  Targuments_prototype_symbolNonEnumerablesInherited_values,
  Targuments_prototype_symbolNonEnumerablesOwn,
  Targuments_prototype_symbolNonEnumerablesOwn_values,
} from '../../../../typezen/types-info'

let tru = true
describe('Many, with Inspectable Nested Values', () => {
  const inputTitle = `Arguments`
  // @-ts-ignore  error TS7030: Not all code paths return a value.
  describe.skip(inputTitle, () => {
    if (tru) return // SKIP runtime cause it breaks "TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them"

    const getInputVanilla = () => a_Arguments
    const getInputWithExtraCommonProps = () => add_CommonProps(a_Arguments)
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = true
    type Texpected_nested_keys = NumberString
    const expected_nested_keys: Texpected_nested_keys[] = !isInspectableNested ? [] : a_Arguments_indexes

    /*{ @common-own-inherited-enumerable-props }*/

    // ### Keys / Props ###

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = Targuments_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = arguments_prototype_stringNonEnumerablesOwn
    type Texpected_symbolNonEnumerablesOwn = Targuments_prototype_symbolNonEnumerablesOwn
    const expected_symbolNonEnumerablesOwn = arguments_prototype_symbolNonEnumerablesOwn

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Targuments_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = [...arguments_prototype_stringNonEnumerablesInherited, ...(([] as any).findLastIndex ? arguments_prototype_stringNonEnumerablesInherited_ES2023 : [])]
    type Texpected_symbolNonEnumerablesInherited = Targuments_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = arguments_prototype_symbolNonEnumerablesInherited

    // ### Values ###

    type Texpected_nested_items = unknown
    const expected_nested_items = !isInspectableNested ? [] : a_Arguments_values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = Targuments_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = expected_stringNonEnumerablesOwn.map((value) => inputVanilla[value])
    type Texpected_symbolNonEnumerablesOwn_values = Targuments_prototype_symbolNonEnumerablesOwn_values
    const expected_symbolNonEnumerablesOwn_values = arguments_prototype_symbolNonEnumerablesOwn.map((value) => inputVanilla[value])

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Targuments_prototype_stringNonEnumerablesInherited_values
    type Texpected_symbolNonEnumerablesInherited_values = Targuments_prototype_symbolNonEnumerablesInherited_values

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof IArguments>>

    /*{ @default-expected-keys-values-iteration }*/

    describe(`all-typings-tests for override`, () => {
      type Texpected_iteration_items = any
      type Texpected_iteration_keys = NumberString

      /*{ @all-typings-tests-vanilla }*/
      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})
