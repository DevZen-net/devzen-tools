// @-ts-nocheck
import { add_CommonProps, Tvalues } from '../../../../../test-utils/test-data'
/*{ @common-imports-in-tests-templates }*/
import { ValueOfStrict } from '../../../../index'
import {
  function_prototype_stringNonEnumerablesInherited,
  function_prototype_stringNonEnumerablesInherited_ES2023,
  function_prototype_stringNonEnumerablesOwn,
  function_prototype_symbolNonEnumerablesInherited,
  Tfunction_prototype_stringNonEnumerablesInherited,
  Tfunction_prototype_stringNonEnumerablesInherited_values,
  Tfunction_prototype_stringNonEnumerablesOwn,
  Tfunction_prototype_stringNonEnumerablesOwn_values,
  Tfunction_prototype_symbolNonEnumerablesInherited,
  Tfunction_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

describe('Singles/Objects', () => {
  const inputTitle = `Function - normal - Skipped Runtime tests cause it throws (when accessing not allowed props)` // just for title
  describe.skip(inputTitle, () => {
    const getInputVanilla = () => function named() {}
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
    type Texpected_stringNonEnumerablesOwn = Tfunction_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = [...function_prototype_stringNonEnumerablesOwn]

    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Tfunction_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = [...function_prototype_stringNonEnumerablesInherited, ...(([] as any).findLastIndex ? function_prototype_stringNonEnumerablesInherited_ES2023 : [])]
    type Texpected_symbolNonEnumerablesInherited = Tfunction_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = [...function_prototype_symbolNonEnumerablesInherited]

    // ### Values ###

    // NOTE: the real function throws, cause reading of `'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them`. So we dont actually execute this!
    inputVanilla = { MOCK: 'MOCK' } as any
    inputWithExtraCommonProps = { MOCK: 'MOCK' } as any

    type Texpected_nested_items = typeof isInspectableNested extends false ? never : Tvalues
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : []

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = Tfunction_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = expected_stringNonEnumerablesOwn.map((value) => inputVanilla[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Tfunction_prototype_stringNonEnumerablesInherited_values
    type Texpected_symbolNonEnumerablesInherited_values = Tfunction_prototype_symbolNonEnumerablesInherited_values

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof RegExp>>

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
      type Texpected_callback_items = ReturnType<typeof inputVanilla>
      const expected_callback_items = ['NOT USED'] // @todo(333): should fail / not used?

      /*{ @all-typings-tests-vanilla }*/
      /*{ @all-typings-tests-WECP }*/
      /*{ @all-typings-tests-options-wrong }*/
    })
  })
})
