// @-ts-nocheck

/*{ @common-imports-in-tests-templates }*/

import {
  a_Employee,
  employee_stringNonEnumerablesInherited,
  employeeStringProps,
  employeeSymbolProps,
  person_stringNonEnumerablesInherited,
  personStringProps,
  personSymbolProps,
  Temployee_stringNonEnumerablesInherited,
  Temployee_stringNonEnumerablesInherited_values,
  Temployee_symbolNonEnumerablesInherited,
  Temployee_symbolNonEnumerablesInherited_values,
  TemployeeStringProps,
  TemployeeStringProps_values,
  TemployeeSymbolProps,
  TemployeeSymbolProps_values,
  Tperson_stringNonEnumerablesInherited,
  Tperson_stringNonEnumerablesInherited_values,
  Tperson_symbolNonEnumerablesInherited,
  Tperson_symbolNonEnumerablesInherited_values,
  TpersonStringProps,
  TpersonStringProps_values,
  TpersonSymbolProps,
  TpersonSymbolProps_values,
  Tvalues,
} from '../../../../../test-utils/test-data'

import { ValueOfStrict } from '../../../../index'

describe('Many, with No Inspectable Nested Values', () => {
  const inputTitle = `realObject / subclass instance / Employee` // just for title
  describe(inputTitle, () => {
    const getInputVanilla = () => a_Employee // NOT USED!
    const getInputWithExtraCommonProps = () => a_Employee
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = false

    // ### Keys / Props ###

    type Texpected_nested_keys = never
    const expected_nested_keys: Texpected_nested_keys[] = []

    /*{ @common-own-inherited-enumerable-props }*/

    // prototype / base-type props

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Tperson_stringNonEnumerablesInherited | Temployee_stringNonEnumerablesInherited | TpersonStringProps | TemployeeStringProps
    const expected_stringNonEnumerablesInherited: (Texpected_stringNonEnumerablesInherited | 'constructor')[] = [...person_stringNonEnumerablesInherited, ...employee_stringNonEnumerablesInherited]
    type Texpected_symbolNonEnumerablesInherited = Tperson_symbolNonEnumerablesInherited | Temployee_symbolNonEnumerablesInherited | TpersonSymbolProps | TemployeeSymbolProps
    const expected_symbolNonEnumerablesInherited: Texpected_symbolNonEnumerablesInherited[] = []

    // ### Values ###

    type Texpected_nested_items = typeof isInspectableNested extends false ? never : Tvalues
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : []

    // prototype / base-type values

    // inherited values
    // lying here, we're returning all props, including own, we can't do otherwise! @todo: add link to ownKeyof issue
    type Texpected_stringNonEnumerablesInherited_values = Tperson_stringNonEnumerablesInherited_values | TpersonStringProps_values | Temployee_stringNonEnumerablesInherited_values | TemployeeStringProps_values
    type Texpected_symbolNonEnumerablesInherited_values = Tperson_symbolNonEnumerablesInherited_values | TpersonSymbolProps_values | Temployee_symbolNonEnumerablesInherited_values | TemployeeSymbolProps_values

    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof typeof a_Employee>>

    // Expected results, per options

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = never
    const expected_stringNonEnumerablesOwn = []
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []
    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = never
    const expected_stringNonEnumerablesOwn_values = []
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    /*{ @default-expected-keys-values-iteration }*/

    describe(`all-typings-tests for override`, () => {
      // Iteration keys
      type Texpected_iteration_keys = never
      const expected_iteration_keys: Texpected_iteration_keys[] = []
      // Iteration values
      type Texpected_iteration_items = never
      const expected_iteration_items: Texpected_iteration_items[] = []

      // Note: we're lying here, we're returning all props, including inherited // @todo(888): add link to ownKeyof issue (keyof SomeObject === keyof SomeObject's prototype)
      type Texpected_stringOwnProps = TemployeeStringProps | TpersonStringProps | Tperson_stringNonEnumerablesInherited | Temployee_stringNonEnumerablesInherited
      type Texpected_symbolOwnProps = TemployeeSymbolProps | TpersonSymbolProps | Tperson_symbolNonEnumerablesInherited | Temployee_symbolNonEnumerablesInherited // set to TcommonSymbolProps, or change to other
      const expected_stringOwnProps: Readonly<Texpected_stringOwnProps[]> = [...personStringProps, ...employeeStringProps] // eg set to `commonStringProps`, or something else
      const expected_symbolOwnProps: Readonly<Texpected_symbolOwnProps[]> = [...personSymbolProps, ...employeeSymbolProps] // eg set to `commonSymbolProps`, or something else

      describe(`all-typings-tests for override`, () => {
        // default overrides here

        // Note: we're lying here, we're returning all props, including inherited// @todo(888): add link to ownKeyof issue
        type Texpected_stringOwnProps_values = TpersonStringProps_values | Tperson_stringNonEnumerablesInherited_values | TemployeeStringProps_values | Temployee_stringNonEnumerablesInherited_values
        type Texpected_symbolOwnProps_values = TpersonSymbolProps_values | Tperson_symbolNonEnumerablesInherited_values | TemployeeSymbolProps_values | Temployee_symbolNonEnumerablesInherited_values // set to TcommonSymbolProps, or change to other
        const expected_stringOwnProps_values: Readonly<Texpected_stringOwnProps_values[]> = expected_stringOwnProps.map((k) => a_Employee[k])
        const expected_symbolOwnProps_values: Readonly<Texpected_symbolOwnProps_values[]> = expected_symbolOwnProps.map((k) => a_Employee[k]) // set to `commonSymbolProps_values`, or something else

        describe(`${inputTitle} NO Vanilla for pojso`, () => {})
        /*{ @all-typings-tests-WECP }*/
        /*{ @all-typings-tests-options-wrong }*/
      })
    })
  })
})
