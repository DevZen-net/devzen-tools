// @-ts-nocheck
import { expectType, TypeEqual } from 'ts-expect'
import { keys, Single, ValueOfStrict, values } from '../../../../code'
import {
  object_stringNonEnumerablesInheritedTop,
  object_stringNonEnumerablesInheritedTopHidden,
  Tobject_stringNonEnumerablesInheritedTop,
  Tobject_stringNonEnumerablesInheritedTopHidden,
} from '../../../../code/typezen/types-info'

import { equalSetDeep } from '../../../../test-utils/specHelpers'
import {
  a_Employee,
  employee_stringNonEnumerablesInherited,
  employeeStringProps,
  employeeSymbolProps,
  noPropsKeysOptionsUntyped,
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
} from '../../../../test-utils/test-data'

describe(`Many, with No Inspectable Nested Values`, () => {
  describe(`# realObject / instance (of a Sub-class): Employee - no vanilla`, () => {
    const valueTitle = `realObject / subclass instance / Employee` // just for title
    const getValueWithExtraCommonProps = () => a_Employee // like above, WECP

    // **NestedKeys** are items nested inside the value, separate from  their props/values. For example Array has **indexes** against elements (values), Maps have **keys** against value pairs and so on. All Objects in JS also have props, which can be separate from NestedKeys (eg in Set). All POJSO/instances (including Set & Map Iterators or normal Iterators/AsyncGenerators), don't have NestedKeys, so only their props are the keys (therefore set this to `never` for these ones)!
    const isInspectableNested = false // Map, Set, Array etc have NestedKeys that can be iterated, without affecting value - set this to `true`. On the other hand `Set.entries()`, `Map.entries()` and other Iterators/AsyncGenerators can't get iterated to inspect their keys (since they can't be restarted), so their NestedKeys do not exist. For these, along with POJSO/instances, Singles etc, set this to `false`.

    // ### Keys / Props ###

    type ExpectedInspectableNestedKeys = typeof isInspectableNested extends false ? never : never // if isInspectableNested is true, set the actual NestedKeys type, eg `number` for Array indexes, or Map/Set actual keys (without the array bit). If false, set to never.
    const expectedInspectableNested_keys: ExpectedInspectableNestedKeys[] = !isInspectableNested ? [] : [] // An array of the actual natural keys of the value, eg for indexes [0,1,2,3], or Map/Set actual keys used. Leave as empty array, if `!isInspectableNested`

    // Iteration keys
    type TexpectedIteration_keys = never
    const expectedIteration_keys: TexpectedIteration_keys[] = []

    // own enumerable props
    // Note: we're lying here, we're returning all props, including inherited // @todo(888): add link to ownKeyof issue
    type Texpected_stringOwnProps = TemployeeStringProps | TpersonStringProps | Tperson_stringNonEnumerablesInherited | Temployee_stringNonEnumerablesInherited // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
    type Texpected_symbolOwnProps = TemployeeSymbolProps | TpersonSymbolProps | Tperson_symbolNonEnumerablesInherited | Temployee_symbolNonEnumerablesInherited // set to TcommonSymbolProps, or change to other
    const expected_stringOwnProps: Readonly<Texpected_stringOwnProps[]> = [...personStringProps, ...employeeStringProps] // eg set to `commonStringProps`, or something else
    const expected_symbolOwnProps: Readonly<Texpected_symbolOwnProps[]> = [...personSymbolProps, ...employeeSymbolProps] // eg set to `commonSymbolProps`, or something else

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = never
    const expected_stringNonEnumerablesOwn = []
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Tperson_stringNonEnumerablesInherited | Temployee_stringNonEnumerablesInherited | TpersonStringProps | TemployeeStringProps
    const expected_stringNonEnumerablesInherited: (Texpected_stringNonEnumerablesInherited | 'constructor')[] = [...person_stringNonEnumerablesInherited, ...employee_stringNonEnumerablesInherited]
    type Texpected_symbolNonEnumerablesInherited = Tperson_symbolNonEnumerablesInherited | Temployee_symbolNonEnumerablesInherited | TpersonSymbolProps | TemployeeSymbolProps
    const expected_symbolNonEnumerablesInherited: Texpected_symbolNonEnumerablesInherited[] = []
    // top props
    const expected_stringNonEnumerablesInheritedTop = object_stringNonEnumerablesInheritedTop
    type Texpected_stringNonEnumerablesInheritedTop = Tobject_stringNonEnumerablesInheritedTop
    const expected_stringNonEnumerablesInheritedTopHidden = object_stringNonEnumerablesInheritedTopHidden
    type Texpected_stringNonEnumerablesInheritedTopHidden = Tobject_stringNonEnumerablesInheritedTopHidden

    // ### Values ###

    type ExpectedInspectableNestedKeys_values = typeof isInspectableNested extends false ? never : Tvalues // if isInspectableNested is true, set the actual Nested Values type, eg Tvalues. If false, set to never.
    const expectedInspectableNested_values: ExpectedInspectableNestedKeys_values[] = !isInspectableNested ? [] : [] // An array of the actual Nested Values of the value, eg array elements or Map values / Set keys  used. Leave as empty array, if `!isInspectableNested`

    // Iteration values
    type TexpectedIteration_values = never
    const expectedIteration_values: TexpectedIteration_values[] = []

    // own enumerable props values

    // Note: we're lying here, we're returning all props, including inherited// @todo(888): add link to ownKeyof issue
    type Texpected_stringOwnProps_values = TpersonStringProps_values | Tperson_stringNonEnumerablesInherited_values | TemployeeStringProps_values | Temployee_stringNonEnumerablesInherited_values // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
    type Texpected_symbolOwnProps_values = TpersonSymbolProps_values | Tperson_symbolNonEnumerablesInherited_values | TemployeeSymbolProps_values | Temployee_symbolNonEnumerablesInherited_values // set to TcommonSymbolProps, or change to other
    const expected_stringOwnProps_values: Readonly<Texpected_stringOwnProps_values[]> = [...employeeStringProps, ...personStringProps].map((k) => a_Employee[k]) // set to `commonStringProps_values`, or something else
    const expected_symbolOwnProps_values: Readonly<Texpected_symbolOwnProps_values[]> = [...employeeSymbolProps, ...personSymbolProps].map((k) => a_Employee[k]) // set to `commonSymbolProps_values`, or something else

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = never
    const expected_stringNonEnumerablesOwn_values = []
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Tperson_stringNonEnumerablesInherited_values | TpersonStringProps_values | Temployee_stringNonEnumerablesInherited_values | TemployeeStringProps_values // lying here, we're returning all props, including own, we can't do otherwise! @todo: add link to ownKeyof issue
    const expected_stringNonEnumerablesInherited_values = [...person_stringNonEnumerablesInherited, ...employee_stringNonEnumerablesInherited].map((k) => a_Employee[k])
    type Texpected_symbolNonEnumerablesInherited_values = Tperson_symbolNonEnumerablesInherited_values | TpersonSymbolProps_values | Temployee_symbolNonEnumerablesInherited_values | TemployeeSymbolProps_values // lying here, we're returning all props, including own, we can't do otherwise! @todo: add link to ownKeyof issue
    const expected_symbolNonEnumerablesInherited_values = []
    // top values

    const expected_stringNonEnumerablesInheritedTop_values = object_stringNonEnumerablesInheritedTop.map((v) => a_Employee[v])
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof typeof a_Employee>>

    describe.skip(`${valueTitle} NO Vanilla for pojso`, () => {})
    describe(`${valueTitle} WECP (With Extra Common Props) #AR3`, () => {
      const getValue = getValueWithExtraCommonProps
      type CountType = ReturnType<typeof getValue> extends Single ? 1 : number

      describe('props: false / undefined (default) - returns "Nested Keys & Values", i.e number[] indexes or Set/Map keys', () => {
        describe(`no options - defaults (special case of "Expecting: Nested Keys/Values for values with InspectableKeys, otherwise string own props #Rx" with no options `, () => {
          // NO OPTIONS HERE
          it(`keys()`, () => {
            const result = keys(getValue())
            expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : Texpected_stringOwnProps[]>>(true)
            equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_stringOwnProps])
          })
          it(`values()`, () => {
            const result = values(getValue())
            expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : Texpected_stringOwnProps_values[]>>(true)
            equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_stringOwnProps_values])
          })
          it(`loop2()`, () => {})
          it(`each()`, () => {})
          it(`map()`, () => {})
          it(`filter()`, () => {})
          it(`clone()`, () => {})
          it(`take()`, () => {})
        })

        describe(`empty options - defaults`, () => {
          const options = {} as const
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, otherwise string own props #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : Texpected_stringOwnProps[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_stringOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : Texpected_stringOwnProps_values[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_stringOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`all irrelevant options, if props: false | undefined`, () => {
          const options = noPropsKeysOptionsUntyped
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, otherwise string own props #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : Texpected_stringOwnProps[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_stringOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : Texpected_stringOwnProps_values[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_stringOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`wrong options with as any - get natural values`, () => {
          const options = { foo: 'bar' } as any
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, otherwise string own props #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : Texpected_stringOwnProps[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_stringOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : Texpected_stringOwnProps_values[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_stringOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: false & others default`, () => {
          const options = { props: false } as const
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, otherwise string own props #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : Texpected_stringOwnProps[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_stringOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : Texpected_stringOwnProps_values[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_stringOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: undefined & others default`, () => {
          const options = { props: undefined } as const
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, otherwise string own props #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : Texpected_stringOwnProps[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_stringOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : Texpected_stringOwnProps_values[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_stringOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`string: true`, () => {
          const options = { string: true } as const
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, otherwise string own props #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : Texpected_stringOwnProps[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_stringOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : Texpected_stringOwnProps_values[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_stringOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        describe(`symbol: true (& string: true default)`, () => {
          const options = { symbol: true } as const
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, otherwise string & symbol own props #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : (Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : (Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`symbol: true, string: false`, () => {
          const options = { symbol: true, string: false } as const
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, otherwise symbol own props #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : Texpected_symbolOwnProps[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : Texpected_symbolOwnProps_values[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`symbol: true, string: false, props: false`, () => {
          const options = { symbol: true, string: false } as const
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, otherwise symbol own props #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : Texpected_symbolOwnProps[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : Texpected_symbolOwnProps_values[]>>(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })
      describe('props: true - simple - returns own & enumerable props only', () => {
        describe(`props: true - returns string props only`, () => {
          const options = { props: true } as const
          describe(`Expecting: string own props only #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, Texpected_stringOwnProps[]>>(true)
              equalSetDeep(result, expected_stringOwnProps)
            })
            it(`values()`, () => {
              const values_valueWithProps_PropsTrue = values(getValue(), options)
              expectType<TypeEqual<typeof values_valueWithProps_PropsTrue, Texpected_stringOwnProps_values[]>>(true)
              equalSetDeep(values_valueWithProps_PropsTrue, expected_stringOwnProps_values)
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props symbol: true - returns string & symbol props`, () => {
          const options = {
            props: true,
            symbol: true,
          } as const
          describe(`Expecting: string symbol own props only #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(result, [...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const values_valueWithProps_PropsTrue = values(getValue(), options)
              expectType<TypeEqual<typeof values_valueWithProps_PropsTrue, (Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(values_valueWithProps_PropsTrue, [...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props:true, string symbol: true - returns string & symbol props`, () => {
          const options = {
            props: true,
            string: true,
            symbol: true,
          } as const
          describe(`Expecting: string symbol own props only #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(result, [...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const values_valueWithProps_PropsTrue = values(getValue(), options)
              expectType<TypeEqual<typeof values_valueWithProps_PropsTrue, (Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(values_valueWithProps_PropsTrue, [...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props string: false, symbol: true - returns only symbol props`, () => {
          const options = {
            props: true,
            string: false,
            symbol: true,
          } as const
          describe(`Expecting: string symbol own props only #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, Texpected_symbolOwnProps[]>>(true)
              equalSetDeep(result, [...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const values_valueWithProps_PropsTrue = values(getValue(), options)
              expectType<TypeEqual<typeof values_valueWithProps_PropsTrue, Texpected_symbolOwnProps_values[]>>(true)
              equalSetDeep(values_valueWithProps_PropsTrue, [...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props:true but string: false, symbol: undefined - returns never[]`, () => {
          const options = {
            props: true,
            string: false,
            // symbol: false, // default
          } as const
          describe(`Expecting: never #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, never[]>>(true)
              equalSetDeep(result, [])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, never[]>>(true)
              equalSetDeep(result, [])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props:true but string: false, symbol: false - returns never[]`, () => {
          const options = {
            props: true,
            string: false,
            symbol: false, // explicit
          } as const
          describe(`Expecting: never #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, never[]>>(true)
              equalSetDeep(result, [])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, never[]>>(true)
              equalSetDeep(result, [])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })
      describe('props: true - nonEnumerables, inherited & own - returns requested props', () => {
        describe(`props: true & symbol nonEnumerables: true & inherited: undefined | false - returns no base props except 'length' + Common Props (cause inherited: false)`, () => {
          const options = {
            props: true,
            symbol: true,
            nonEnumerables: true,
            // inherited: false // default @todo: // explicit
          } as const
          describe(`Expecting: own nonEnumerable string symbol #R2`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringNonEnumerablesOwn | Texpected_symbolNonEnumerablesOwn | Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(result, [...expected_stringNonEnumerablesOwn, ...expected_symbolNonEnumerablesOwn, ...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringNonEnumerablesOwn_values | Texpected_symbolNonEnumerablesOwn_values | Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(
                true
              )
              equalSetDeep(result, [...expected_stringNonEnumerablesOwn_values, ...expected_symbolNonEnumerablesOwn_values, ...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`symbol inherited top: true but nonEnumerables: undefined - returns no extra BaseType props (cause nonEnumerables: false)`, () => {
          const options = {
            props: true,
            symbol: true,
            // nonEnumerables: false, // default
            inherited: true,
            top: true,
          } as const
          describe(`Expecting: WECP own string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(result, [...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(result, [...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`symbol inherited top: true but nonEnumerables: false - returns no extra BaseType props (cause nonEnumerables: false)`, () => {
          const options = {
            props: true,
            symbol: true,
            nonEnumerables: false, // explicit
            inherited: true,
            top: true,
          } as const
          describe(`Expecting: WECP own string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(result, [...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(result, [...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        describe(`symbol nonEnumerables inherited: true - returns all keys, including base-type inherited & non-enumerables props`, () => {
          const options = {
            props: true,
            symbol: true,
            nonEnumerables: true,
            inherited: true,
          } as const
          describe(`Expecting: WECP own inherited string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValueWithExtraCommonProps(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | Texpected_stringOwnProps
                    | Texpected_symbolOwnProps
                    | Texpected_stringNonEnumerablesOwn
                    | Texpected_symbolNonEnumerablesOwn
                    | Texpected_stringNonEnumerablesInherited
                    | Texpected_symbolNonEnumerablesInherited
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expected_stringOwnProps,
                ...expected_symbolOwnProps,
                ...expected_stringNonEnumerablesOwn,
                ...expected_symbolNonEnumerablesOwn,
                ...expected_stringNonEnumerablesInherited,
                ...expected_symbolNonEnumerablesInherited,
              ])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | Texpected_stringOwnProps_values
                    | Texpected_symbolOwnProps_values
                    | Texpected_stringNonEnumerablesOwn_values
                    | Texpected_symbolNonEnumerablesOwn_values
                    | Texpected_stringNonEnumerablesInherited_values
                    | Texpected_symbolNonEnumerablesInherited_values
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expected_stringOwnProps_values,
                ...expected_symbolOwnProps_values,
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringNonEnumerablesInherited_values,
                ...expected_symbolNonEnumerablesInherited_values,
              ])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: true & everything else { symbols nonEnumerables inherited top: true }. Returns all props (string & symbol), including native inherited & non-enumerables props & top`, () => {
          const options = {
            props: true,
            symbol: true,
            nonEnumerables: true,
            inherited: true,
            top: true,
          } as const
          describe(`Expecting: WECP own inherited top string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValueWithExtraCommonProps(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | Texpected_stringOwnProps
                    | Texpected_symbolOwnProps
                    | Texpected_stringNonEnumerablesOwn
                    | Texpected_symbolNonEnumerablesOwn
                    | Texpected_stringNonEnumerablesInherited
                    | Texpected_symbolNonEnumerablesInherited
                    | Texpected_stringNonEnumerablesInheritedTop
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expected_stringOwnProps,
                ...expected_symbolOwnProps,
                ...expected_stringNonEnumerablesOwn,
                ...expected_symbolNonEnumerablesOwn,
                ...expected_stringNonEnumerablesInherited,
                ...expected_symbolNonEnumerablesInherited,
                ...expected_stringNonEnumerablesInheritedTop,
              ])
            })

            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | Texpected_stringOwnProps_values
                    | Texpected_symbolOwnProps_values
                    | Texpected_stringNonEnumerablesOwn_values
                    | Texpected_symbolNonEnumerablesOwn_values
                    | Texpected_stringNonEnumerablesInherited_values
                    | Texpected_symbolNonEnumerablesInherited_values
                    | Texpected_stringNonEnumerablesInheritedTop_values
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expected_stringOwnProps_values,
                ...expected_symbolOwnProps_values,
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringNonEnumerablesInherited_values,
                ...expected_symbolNonEnumerablesInherited_values,
                ...expected_stringNonEnumerablesInheritedTop_values,
              ])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NOT own, only inherited { own: false, nonEnumerables inherited: true }. Returns all **but own** string props, including native inherited & non-enumerables props of input`, () => {
          const options = {
            own: false,
            props: true,
            nonEnumerables: true,
            inherited: true,
          } as const
          describe(`Expecting: WECP inherited top string (own: false) #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValueWithExtraCommonProps(), options)
              expectType<TypeEqual<typeof result, Texpected_stringNonEnumerablesInherited[]>>(true)
              equalSetDeep(result, [...expected_stringNonEnumerablesInherited])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, Texpected_stringNonEnumerablesInherited_values[]>>(true)
              equalSetDeep(result, [...expected_stringNonEnumerablesInherited_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NOT own, only inherited { own: false, symbols nonEnumerables inherited: true }. Returns all **but own** keys (string & symbol), including native inherited & non-enumerables props of input`, () => {
          const options = {
            own: false,
            props: true,
            symbol: true,
            nonEnumerables: true,
            inherited: true,
          } as const
          describe(`Expecting: WECP inherited top string symbol (own: false) #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValueWithExtraCommonProps(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesInherited)[]>>(true)
              equalSetDeep(result, [...expected_stringNonEnumerablesInherited, ...expected_symbolNonEnumerablesInherited])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringNonEnumerablesInherited_values | Texpected_symbolNonEnumerablesInherited_values)[]>>(true)
              equalSetDeep(result, [...expected_stringNonEnumerablesInherited_values, ...expected_symbolNonEnumerablesInherited_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`Empty never[] array: NOT own, only inherited { own: false, symbols nonEnumerables: false, inherited: true }. Returns empty array, because non-own are non-enumerables & non-enumerables: false!`, () => {
          const options = {
            own: false,
            props: true,
            symbol: true,
            nonEnumerables: false,
            inherited: true,
          } as const
          describe(`Expecting: never #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, never[]>>(true)
              equalSetDeep(result, [])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, never[]>>(true)
              equalSetDeep(result, [])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })

      describe('props: "all" - defaults, string only - returns own & enumerable props AND "Nested Keys & Values" (eg number[] of indexes or Set/Map keys)', () => {
        describe(`props: "all" & defaults - returns "Nested Keys & Values" & string props`, () => {
          const options = {
            props: 'all',
            // string: true, // default
            // symbol: false, // default
          } as const
          describe(`Expecting: Nested Keys & Values + string own enumerable props & values #R1`, () => {
            it(`keys()`, () => {
              const keys_valueWithProps_PropsAll = keys(getValueWithExtraCommonProps(), options)
              expectType<TypeEqual<typeof keys_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys | Texpected_stringOwnProps)[]>>(true)
              equalSetDeep(keys_valueWithProps_PropsAll, [...expected_stringOwnProps, ...expectedInspectableNested_keys])
            })
            it(`values()`, () => {
              const values_valueWithProps_PropsAll = values(getValue(), options)
              expectType<TypeEqual<typeof values_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys_values | Texpected_stringOwnProps_values)[]>>(true)
              equalSetDeep(values_valueWithProps_PropsAll, [...expected_stringOwnProps_values, ...expectedInspectableNested_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: "all" & string: true explicit - returns "Nested Keys & Values" & string props`, () => {
          const options = {
            props: 'all',
            string: true, // explicit
            // symbol: false, // default
          } as const
          describe(`Expecting: Nested Keys & Values + string own enumerable props & values #R1`, () => {
            it(`keys()`, () => {
              const keys_valueWithProps_PropsAll = keys(getValueWithExtraCommonProps(), options)
              expectType<TypeEqual<typeof keys_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys | Texpected_stringOwnProps)[]>>(true)
              equalSetDeep(keys_valueWithProps_PropsAll, [...expected_stringOwnProps, ...expectedInspectableNested_keys])
            })
            it(`values()`, () => {
              const values_valueWithProps_PropsAll = values(getValue(), options)
              expectType<TypeEqual<typeof values_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys_values | Texpected_stringOwnProps_values)[]>>(true)
              equalSetDeep(values_valueWithProps_PropsAll, [...expected_stringOwnProps_values, ...expectedInspectableNested_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: "all" - string: true & symbol: false explicit - returns "Nested Keys & Values" & string props`, () => {
          const options = {
            props: 'all',
            string: true, // explicit
            symbol: false, // explicit
          } as const
          describe(`Expecting: Nested Keys & Values + string own enumerable props & values #R1`, () => {
            it(`keys()`, () => {
              const keys_valueWithProps_PropsAll = keys(getValueWithExtraCommonProps(), options)
              expectType<TypeEqual<typeof keys_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys | Texpected_stringOwnProps)[]>>(true)
              equalSetDeep(keys_valueWithProps_PropsAll, [...expected_stringOwnProps, ...expectedInspectableNested_keys])
            })
            it(`values()`, () => {
              const values_valueWithProps_PropsAll = values(getValue(), options)
              expectType<TypeEqual<typeof values_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys_values | Texpected_stringOwnProps_values)[]>>(true)
              equalSetDeep(values_valueWithProps_PropsAll, [...expected_stringOwnProps_values, ...expectedInspectableNested_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })
      describe('props: "all", string symbol - returns own & enumerable props AND "Nested Keys & Values" (eg number[] of indexes or Set/Map keys)', () => {
        describe(`props: "all", symbol: true - returns "Nested Keys & Values" & string & symbol props`, () => {
          const options = {
            props: 'all',
            symbol: true,
            // string: true, // default @todo: explicit
          } as const
          describe(`Expecting: Nested Keys & Values + string symbol own enumerable props & values #R1`, () => {
            it(`keys()`, () => {
              const keys_valueWithProps_PropsAll = keys(getValueWithExtraCommonProps(), options)
              expectType<TypeEqual<typeof keys_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys | Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(keys_valueWithProps_PropsAll, [...expectedInspectableNested_keys, ...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const values_valueWithProps_PropsAll = values(getValue(), options)
              expectType<TypeEqual<typeof values_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys_values | Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(values_valueWithProps_PropsAll, [...expectedInspectableNested_values, ...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: "all", symbol: true & string: true explicit - returns "Nested Keys & Values" & string & symbol props`, () => {
          const options = {
            props: 'all',
            symbol: true,
            string: true, // explicit
          } as const
          describe(`Expecting: Nested Keys & Values + string symbol own enumerable props & values #R1`, () => {
            it(`keys()`, () => {
              const keys_valueWithProps_PropsAll = keys(getValueWithExtraCommonProps(), options)
              expectType<TypeEqual<typeof keys_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys | Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(keys_valueWithProps_PropsAll, [...expectedInspectableNested_keys, ...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const values_valueWithProps_PropsAll = values(getValue(), options)
              expectType<TypeEqual<typeof values_valueWithProps_PropsAll, (ExpectedInspectableNestedKeys_values | Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(values_valueWithProps_PropsAll, [...expectedInspectableNested_values, ...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })

      describe('props: "all", symbol only - returns own & enumerable props AND "Nested Keys & Values" (eg number[] of indexes or Set/Map keys)', () => {
        describe(`props: "all", string: false, symbol: true - returns "Nested Keys & Values" & symbol props`, () => {
          const options = {
            props: 'all',
            string: false,
            symbol: true,
          } as const
          describe(`Expecting: Nested Keys & Values + symbol own enumerable props & values #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_keys, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        describe('props: "all", symbol & string false - returns own & enumerable props AND "Nested Keys & Values" (eg number[] of indexes or Set/Map keys)', () => {
          describe(`props: "all", string: false, symbol: undefined - returns "Nested Keys & Values" only`, () => {
            const options = {
              props: 'all',
              string: false,
              // symbol: false, // default
            } as const
            describe(`Expecting: Nested Keys & Values #R1`, () => {
              it(`keys()`, () => {
                const result = keys(getValue(), options)
                expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys[]>>(true)
                equalSetDeep(result, expectedInspectableNested_keys)
              })
              it(`values()`, () => {
                const result = values(getValue(), options)
                expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys_values[]>>(true)
                equalSetDeep(result, expectedInspectableNested_values)
              })
              it(`loop2()`, () => {})
              it(`each()`, () => {})
              it(`map()`, () => {})
              it(`filter()`, () => {})
              it(`clone()`, () => {})
              it(`take()`, () => {})
            })
          })
          describe(`props: "all", string: false, symbol: false - returns "Nested Keys & Values" only`, () => {
            const options = {
              props: 'all',
              string: false,
              symbol: false, // explicit
            } as const
            describe(`Expecting: Nested Keys & Values #R1`, () => {
              it(`keys()`, () => {
                const result = keys(getValue(), options)
                expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys[]>>(true)
                equalSetDeep(result, expectedInspectableNested_keys)
              })
              it(`values()`, () => {
                const result = values(getValue(), options)
                expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys_values[]>>(true)
                equalSetDeep(result, expectedInspectableNested_values)
              })
              it(`loop2()`, () => {})
              it(`each()`, () => {})
              it(`map()`, () => {})
              it(`filter()`, () => {})
              it(`clone()`, () => {})
              it(`take()`, () => {})
            })
          })
        })
      })

      describe('props: "all" - nonEnumerables, inherited & own - returns Nested Keys & Values + requested props only', () => {
        describe(`props: 'all' & symbol nonEnumerables: true & inherited: undefined - returns no base props except 'length' + Common Props (cause inherited: false)`, () => {
          const options = {
            props: 'all',
            symbol: true,
            nonEnumerables: true,
            // inherited: false // default
          } as const
          describe(`Expecting: Nested Keys & Values + own nonEnumerable string symbol #R1`, () => {
            it(`keys()`, () => {})
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | ExpectedInspectableNestedKeys_values
                    | Texpected_stringNonEnumerablesOwn_values
                    | Texpected_symbolNonEnumerablesOwn_values
                    | Texpected_stringOwnProps_values
                    | Texpected_symbolOwnProps_values
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expectedInspectableNested_values,
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringOwnProps_values,
                ...expected_symbolOwnProps_values,
              ])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: 'all' & symbol nonEnumerables: true & inherited: false - returns no base props except 'length' + Common Props (cause inherited: false)`, () => {
          const options = {
            props: 'all',
            symbol: true,
            nonEnumerables: true,
            inherited: false, // explicit
          } as const
          describe(`Expecting: Nested Keys & Values + own nonEnumerable string symbol #R1`, () => {
            it(`keys()`, () => {})
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | ExpectedInspectableNestedKeys_values
                    | Texpected_stringNonEnumerablesOwn_values
                    | Texpected_symbolNonEnumerablesOwn_values
                    | Texpected_stringOwnProps_values
                    | Texpected_symbolOwnProps_values
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expectedInspectableNested_values,
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringOwnProps_values,
                ...expected_symbolOwnProps_values,
              ])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        // nonEnumerables: false

        describe(`props: 'all', symbol nonEnumerables: false | undefined & inherited & top true - returns no extra BaseType props (cause nonEnumerables: false)`, () => {
          const options = {
            props: 'all',
            symbol: true,
            // nonEnumerables: false, // default
            inherited: true,
            top: true,
          } as const
          describe(`Expecting: Nested Keys & Values + own enumerable string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys | Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_keys, ...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys_values | Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_values, ...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: 'all', symbol nonEnumerables: false | undefined & inherited & top true - returns no extra BaseType props (cause nonEnumerables: false)`, () => {
          const options = {
            props: 'all',
            symbol: true,
            nonEnumerables: false, // explicit
            inherited: true,
            top: true,
          } as const
          describe(`Expecting: Nested Keys & Values + own enumerable string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys | Texpected_stringOwnProps | Texpected_symbolOwnProps)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_keys, ...expected_stringOwnProps, ...expected_symbolOwnProps])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys_values | Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_values, ...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        describe(`WECP with symbol nonEnumerables inherited: true - returns all keys, including base-type inherited & non-enumerables props`, () => {
          const options = {
            props: 'all',
            symbol: true,
            nonEnumerables: true,
            inherited: true,
          } as const

          describe(`Expecting: Nested Keys & Values + own inherited nonEnumerables string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)

              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | Texpected_stringNonEnumerablesOwn
                    | Texpected_symbolNonEnumerablesOwn
                    | ExpectedInspectableNestedKeys
                    | Texpected_stringOwnProps
                    | Texpected_symbolOwnProps
                    | Texpected_stringNonEnumerablesInherited
                    | Texpected_symbolNonEnumerablesInherited
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expectedInspectableNested_keys,
                ...expected_stringOwnProps,
                ...expected_symbolOwnProps,
                ...expected_stringNonEnumerablesOwn,
                ...expected_symbolNonEnumerablesOwn,
                ...expected_stringNonEnumerablesInherited,
                ...expected_symbolNonEnumerablesInherited,
              ])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)

              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | Texpected_stringNonEnumerablesOwn_values
                    | Texpected_symbolNonEnumerablesOwn_values
                    | ExpectedInspectableNestedKeys_values
                    | Texpected_stringOwnProps_values
                    | Texpected_symbolOwnProps_values
                    | Texpected_stringNonEnumerablesInherited_values
                    | Texpected_symbolNonEnumerablesInherited_values
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expectedInspectableNested_values,
                ...expected_stringOwnProps_values,
                ...expected_symbolOwnProps_values,
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringNonEnumerablesInherited_values,
                ...expected_symbolNonEnumerablesInherited_values,
              ])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        // add top: true

        describe(`props: 'all' & everything else { symbols nonEnumerables inherited top: true }. Returns all keys (string & symbol), including native inherited & non-enumerables props & top of Array`, () => {
          const options = {
            props: 'all',
            symbol: true,
            nonEnumerables: true,
            inherited: true,
            top: true,
          } as const

          describe(`Expecting: Nested Keys & Values + own inherited nonEnumerables top string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | ExpectedInspectableNestedKeys
                    | Texpected_stringOwnProps
                    | Texpected_symbolOwnProps
                    | Texpected_stringNonEnumerablesOwn
                    | Texpected_symbolNonEnumerablesOwn
                    | Texpected_stringNonEnumerablesInherited
                    | Texpected_symbolNonEnumerablesInherited
                    | Texpected_stringNonEnumerablesInheritedTop
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expectedInspectableNested_keys,
                ...expected_stringOwnProps,
                ...expected_symbolOwnProps,
                ...expected_stringNonEnumerablesOwn,
                ...expected_symbolNonEnumerablesOwn,
                ...expected_stringNonEnumerablesInherited,
                ...expected_symbolNonEnumerablesInherited,
                ...expected_stringNonEnumerablesInheritedTop,
              ])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | ExpectedInspectableNestedKeys_values
                    | Texpected_stringOwnProps_values
                    | Texpected_symbolOwnProps_values
                    | Texpected_stringNonEnumerablesOwn_values
                    | Texpected_symbolNonEnumerablesOwn_values
                    | Texpected_stringNonEnumerablesInherited_values
                    | Texpected_symbolNonEnumerablesInherited_values
                    | Texpected_stringNonEnumerablesInheritedTop_values
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expectedInspectableNested_values,
                ...expected_stringOwnProps_values,
                ...expected_symbolOwnProps_values,
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringNonEnumerablesInherited_values,
                ...expected_symbolNonEnumerablesInherited_values,
                ...expected_stringNonEnumerablesInheritedTop_values,
              ])
            })
          })
        })

        // own: false,

        describe(`NOT own, only inherited nonEnumerables { own: false, symbols nonEnumerables inherited: true }. Returns all **but own** keys (string & symbol), including native inherited & non-enumerables props of input and also excludes ExpectedInspectableNestedKeys_values? `, () => {
          const options = {
            own: false,
            props: 'all',
            symbol: true,
            nonEnumerables: true,
            inherited: true,
          } as const
          describe(`Expecting: Nested Keys & Values + own inherited nonEnumerables top string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys | Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesInherited)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_keys, ...expected_stringNonEnumerablesInherited, ...expected_symbolNonEnumerablesInherited])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys_values | Texpected_stringNonEnumerablesInherited_values | Texpected_symbolNonEnumerablesInherited_values)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_values, ...expected_stringNonEnumerablesInherited_values, ...expected_symbolNonEnumerablesInherited_values])
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`Empty never[] array: NOT own, only inherited { own: false, symbols nonEnumerables: false, inherited: true }. Returns empty array, because non-own are non-enumerables & non-enumerables: false!`, () => {
          const options = {
            own: false,
            props: 'all',
            symbol: true,
            nonEnumerables: false,
            inherited: true,
          } as const
          describe(`Expecting: Nested Keys & Values #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys[]>>(true)
              equalSetDeep(result, expectedInspectableNested_keys)
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys_values[]>>(true)
              equalSetDeep(result, expectedInspectableNested_values)
            })
            it(`loop2()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })
    })
  })
})
