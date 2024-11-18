// @-ts-nocheck
import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'

// local
import { keys, Single, ValueOfStrict, values } from '../../../../code'

import {
  generator_prototype_stringNonEnumerablesInherited,
  generator_prototype_stringNonEnumerablesOwn,
  generator_prototype_symbolNonEnumerablesInherited,
  object_stringNonEnumerablesInheritedTop,
  object_stringNonEnumerablesInheritedTopHidden,
  Tgenerator_prototype_stringNonEnumerablesInherited,
  Tgenerator_prototype_stringNonEnumerablesInherited_values,
  Tgenerator_prototype_stringNonEnumerablesOwn,
  Tgenerator_prototype_stringNonEnumerablesOwn_values,
  Tgenerator_prototype_symbolNonEnumerablesInherited,
  Tgenerator_prototype_symbolNonEnumerablesInherited_values,
  Tobject_stringNonEnumerablesInheritedTop,
  Tobject_stringNonEnumerablesInheritedTopHidden,
} from '../../../../code/typezen/types-info'
import { equalSetDeep } from '../../../../test-utils/specHelpers'
import {
  a_Array_of_Tvalues,
  add_CommonProps,
  commonStringProps,
  commonStringProps_values,
  commonSymbolProps,
  commonSymbolProps_values,
  get_Generator_of_Tvalues, NEW_TYPE,
  noPropsKeysOptionsAsConst,
  noPropsKeysOptionsTyped,
  noPropsKeysOptionsUntyped, T_NEW_TYPE,
  TcommonStringProps,
  TcommonStringProps_values,
  TcommonSymbolProps,
  TcommonSymbolProps_values,
  Tvalues,
} from '../../../../test-utils/test-data'
import { loop } from '../loop-legacy'

describe(`Many, with No Inspectable Nested Values`, () => {
  describe(`# Generator<Tvalues>`, () => {
    const valueTitle = `Generator` // just for title
    const a_Generator_of_Tvalues = get_Generator_of_Tvalues()

    const getValueVanilla = () => get_Generator_of_Tvalues() // set to the "value" under test, eg `a_Array_of_Tvalues`, `aSetOfValues`, `a_Map_of_TMapKeys_Tvalues`, `aPojso`, `instance` etc
    const getValueWithExtraCommonProps = () => add_CommonProps(get_Generator_of_Tvalues()) // like above, WECP

    // **NestedKeys** are items nested inside the value, separate from  their props/values. For example Array has **indexes** against elements (values), Maps have **keys** against value pairs and so on. All Objects in JS also have props, which can be separate from NestedKeys (eg in Set). All POJSO/instances (including Set & Map Iterators or normal Iterators/Generators), don't have NestedKeys, so only their props are the keys (therefore set this to `never` for these ones)!
    const isInspectableNested = false // Map, Set, Array etc have NestedKeys that can be iterated, without affecting value - set this to `true`. On the other hand `Set.entries()`, `Map.entries()` and other Iterators/Generators can't get iterated to inspect their keys (since they can't be restarted), so their NestedKeys do not exist. For these, along with POJSO/instances, Singles etc, set this to `false`.

    // ### Keys / Props ###

    type ExpectedInspectableNestedKeys = never // POJSO/instances don't have NestedKeys, their props are the keys!
    const expectedInspectableNested_keys: ExpectedInspectableNestedKeys[] = [] // POJSO/instances don't have NestedKeys, their props are the keys!

    // Iteration keys
    type TexpectedIteration_keys = null
    const expectedIteration_keys = a_Array_of_Tvalues.map(() => null)

    // own enumerable props
    type Texpected_stringOwnProps = TcommonStringProps // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
    type Texpected_symbolOwnProps = TcommonSymbolProps // set to TcommonSymbolProps, or change to other
    const expected_stringOwnProps: Readonly<Texpected_stringOwnProps[]> = commonStringProps // set to `commonStringProps`, or something else
    const expected_symbolOwnProps: Readonly<Texpected_symbolOwnProps[]> = commonSymbolProps // set to `commonSymbolProps`, or something else

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

    // top props
    const expected_stringNonEnumerablesInheritedTop = object_stringNonEnumerablesInheritedTop
    type Texpected_stringNonEnumerablesInheritedTop = Tobject_stringNonEnumerablesInheritedTop
    const expected_stringNonEnumerablesInheritedTopHidden = object_stringNonEnumerablesInheritedTopHidden
    type Texpected_stringNonEnumerablesInheritedTopHidden = Tobject_stringNonEnumerablesInheritedTopHidden

    // ### Values ###

    type ExpectedInspectableNestedKeys_values = typeof isInspectableNested extends false ? never : Tvalues // if isInspectableNested is true, set the actual Nested Values type, eg Tvalues. If false, set to never.
    const expectedInspectableNested_values: ExpectedInspectableNestedKeys_values[] = !isInspectableNested ? [] : [] // An array of the actual Nested Values of the value, eg array elements or Map values / Set keys  used. Leave as empty array, if `!isInspectableNested`

    // Iteration values
    type TexpectedIteration_values = Tvalues
    const expectedIteration_values: TexpectedIteration_values[] = a_Array_of_Tvalues

    // own enumerable props values

    type Texpected_stringOwnProps_values = TcommonStringProps_values // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
    type Texpected_symbolOwnProps_values = TcommonSymbolProps_values // set to TcommonSymbolProps, or change to other
    const expected_stringOwnProps_values: Readonly<Texpected_stringOwnProps_values[]> = commonStringProps_values // set to `commonStringProps_values`, or something else
    const expected_symbolOwnProps_values: Readonly<Texpected_symbolOwnProps_values[]> = commonSymbolProps_values // set to `commonSymbolProps_values`, or something else

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = Tgenerator_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = generator_prototype_stringNonEnumerablesOwn.map((value) => a_Generator_of_Tvalues[value])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Tgenerator_prototype_stringNonEnumerablesInherited_values<typeof a_Generator_of_Tvalues>
    const expected_stringNonEnumerablesInherited_values = [...generator_prototype_stringNonEnumerablesInherited].map((value) => a_Generator_of_Tvalues[value])

    type Texpected_symbolNonEnumerablesInherited_values = Tgenerator_prototype_symbolNonEnumerablesInherited_values<typeof a_Generator_of_Tvalues>
    const expected_symbolNonEnumerablesInherited_values = generator_prototype_symbolNonEnumerablesInherited.map((value) => a_Generator_of_Tvalues[value])

    // top values

    const expected_stringNonEnumerablesInheritedTop_values = object_stringNonEnumerablesInheritedTop.map((v) => a_Generator_of_Tvalues[v])
    type Texpected_stringNonEnumerablesInheritedTop_values = ValueOfStrict<Object, Exclude<keyof Object, keyof Generator<any>>>

    describe(`${valueTitle} Vanilla, Nested Values only, without extra props #AR13`, () => {
      const getValue = getValueVanilla
      type CountType = ReturnType<typeof getValue> extends Single ? 1 : number

      // so we can resue `Expecting: ...` that includes WECP
      type Texpected_stringOwnProps = never
      type Texpected_symbolOwnProps = never
      type Texpected_stringOwnProps_values = never
      type Texpected_symbolOwnProps_values = never
      const expected_stringOwnProps = []
      const expected_symbolOwnProps = []
      const expected_stringOwnProps_values = []
      const expected_symbolOwnProps_values = []

      describe('default/weird options - props assumed false. Returns Inspectable NestedKeys OR own enumerable props', () => {
        describe(`NoOptions (special case, not using "Expecting: Nested Keys & Values", but identical apart from call`, () => {
          it(`keys()`, () => {
            const result = keys(getValue())
            expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys[]>>(true)
            equalSetDeep(result, expectedInspectableNested_keys)
          })
          it(`values()`, () => {
            const result = values(getValue())
            expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys_values[]>>(true)
            equalSetDeep(result, expectedInspectableNested_values)
          })
          describe(`loop()`, () => {
            it(`loop() normal`, () => {
              const result = loop(getValue())
              expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

              const result_values: TexpectedIteration_values[] = []
              const resultKeys: TexpectedIteration_keys[] = []
              for (const [item, idxKey, count] of result) {
                expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                expectType<TypeEqual<typeof count, CountType>>(true)

                result_values.push(item)
                resultKeys.push(idxKey)
              }

              equalSetDeep(result_values, expectedIteration_values)
              equalSetDeep(resultKeys, expectedIteration_keys)
            })
            it(`loop() map`, () => {
              type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

              const result = loop(getValue(), {
                map: (item, idxOrKey, value, count) => {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                  expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                  return NEW_TYPE
                },
              })
              expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
            })
          })
          it(`each()`, () => {})
          it(`map()`, () => {})
          it(`filter()`, () => {})
          it(`clone()`, () => {})
          it(`take()`, () => {})
        })
        describe(`EmptyOptions`, () => {
          const options = {} as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsKeysOptions literal`, () => {
          const options = {
            enumerables: true,
            own: true,
            strict: false,
            inherited: false,
            top: false,
            nonEnumerables: false,
          }
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsKeysOptions untyped`, () => {
          const options = noPropsKeysOptionsUntyped
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsKeysOptions as const`, () => {
          const options = noPropsKeysOptionsAsConst
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsKeysOptions TYPED`, () => {
          const options = noPropsKeysOptionsTyped
          // @todo: fails with > #R1
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsOptionsStringTrueIgnored`, () => {
          const options = {
            ...noPropsKeysOptionsUntyped,
            string: true,
          } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsOptionsStringFalseIgnored`, () => {
          const options = {
            ...noPropsKeysOptionsUntyped,
            string: false,
          } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`WrongAnyOptions`, () => {
          const options = { foo: 'bar' } as any
          describe(`Expecting: Nested Keys & Values #R7.@todo:Map_only-loop-ignoring-types-of-any-options`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                // @ts-ignore @todo: fix options any forcing ignoring types
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, number]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  // @ts-ignore @todo: fix options any forcing ignoring types
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    // @ts-ignore @todo: fix options any forcing ignoring types
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    // @ts-ignore @todo: fix options any forcing ignoring types
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    // @ts-ignore @todo: fix options any forcing ignoring types
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    // @ts-ignore @todo: fix options any forcing ignoring types
                    expectType<TypeEqual<typeof count, number>>(true)

                    return NEW_TYPE
                  },
                })
                // @ts-ignore @todo: fix options any forcing ignoring types
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, number]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`WrongUnknownOptions: Expect errors!`, () => {
          const options = { foo: 'bar' } as unknown

          it(`keys() - errors`, () => {
            // @ts-expect-error OK
            const result = keys(getValue(), options)
            expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys[]>>(true)
            equalSetDeep(result, expectedInspectableNested_keys)
          })
          it(`values() - errors`, () => {
            // @ts-expect-error OK
            const result = values(getValue(), options)
            expectType<TypeEqual<typeof result, ExpectedInspectableNestedKeys_values[]>>(true)
            equalSetDeep(result, expectedInspectableNested_values)
          })
          it(`loop() - errors`, () => {})
          it(`each() - errors`, () => {})
          it(`map() - errors`, () => {})
          it(`filter() - errors`, () => {})
          it(`clone() - errors`, () => {})
          it(`take() - errors`, () => {})
        })
      })
      describe('props: false / undefined (default) - returns Inspectable NestedKeys OR own enumerable props', () => {
        describe(`PropsUndefined`, () => {
          const options = { props: undefined } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`PropsFalse`, () => {
          const options = { props: false } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`PropsFalseStringSymbols`, () => {
          const options = {
            props: false,
            string: false,
            symbol: true,
          } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`PropsUndefined`, () => {
          const options = { props: undefined } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsSymbolIgnored`, () => {
          const options = { symbol: true } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsSymbolFalseIgnored`, () => {
          const options = { symbol: false } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsStringIgnored`, () => {
          const options = { string: true } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`NoPropsStringFalseIgnored`, () => {
          const options = { string: false } as const
          describe(`Expecting: Nested Keys & Values #R8`, () => {
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
            describe(`loop()`, () => {
              it(`loop() normal`, () => {
                const result = loop(getValue(), options)
                expectType<TypeEqual<typeof result, Generator<[TexpectedIteration_values, TexpectedIteration_keys, CountType]>>>(true)

                const result_values: TexpectedIteration_values[] = []
                const resultKeys: TexpectedIteration_keys[] = []
                for (const [item, idxKey, count] of result) {
                  expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                  expectType<TypeEqual<typeof idxKey, TexpectedIteration_keys>>(true)
                  expectType<TypeEqual<typeof count, CountType>>(true)

                  result_values.push(item)
                  resultKeys.push(idxKey)
                }

                equalSetDeep(result_values, expectedIteration_values)
                equalSetDeep(resultKeys, expectedIteration_keys)
              })
              it(`loop() map`, () => {
                type ExpectedIterationKeys_mapped = ReturnType<typeof getValue> extends Set<any> ? T_NEW_TYPE : TexpectedIteration_keys

                const result = loop(getValue(), {
                  ...options,
                  map: (item, idxOrKey, value, count) => {
                    expectType<TypeEqual<typeof item, TexpectedIteration_values>>(true)
                    expectType<TypeEqual<typeof idxOrKey, TexpectedIteration_keys>>(true)
                    expectType<TypeEqual<typeof value, ReturnType<typeof getValue>>>(true)
                    expectType<TypeEqual<typeof count, number>>(true) // @todo: should be CountType (1 for Singles)

                    return NEW_TYPE
                  },
                })
                expectType<TypeEqual<typeof result, Generator<[T_NEW_TYPE, ExpectedIterationKeys_mapped, CountType]>>>(true)
              })
            })
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        describe(`Options are true (except symbol & top), but props: false - returns Nested Keys/Values for inputs with InspectableKeys, string inherited props otherwise`, () => {
          const options = {
            props: false,
            string: true,
            symbol: false,
            inherited: true,
            nonEnumerables: true,
            enumerables: true,
          } as const
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, string inherited props otherwise #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys[] : (Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited)[]>>(
                true
              )
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_keys : [...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  typeof isInspectableNested extends true ? ExpectedInspectableNestedKeys_values[] : (Texpected_stringNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values)[]
                >
              >(true)
              equalSetDeep(result, isInspectableNested ? expectedInspectableNested_values : [...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values])
            })
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        describe(`Filters all true (except top), but props: false - returns Nested Keys/Values for inputs with InspectableKeys, all inherited props otherwise`, () => {
          const options = {
            props: false,
            string: true,
            symbol: true,
            inherited: true,
            nonEnumerables: true,
            enumerables: true,
          } as const
          describe(`Expecting: Nested Keys/Values for values with InspectableKeys, all inherited props otherwise #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  typeof isInspectableNested extends true
                    ? ExpectedInspectableNestedKeys[]
                    : (Texpected_stringNonEnumerablesOwn | Texpected_symbolNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesInherited)[]
                >
              >(true)
              equalSetDeep(
                result,
                isInspectableNested
                  ? expectedInspectableNested_keys
                  : [...expected_stringNonEnumerablesOwn, ...expected_symbolNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited, ...expected_symbolNonEnumerablesInherited]
              )
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  typeof isInspectableNested extends true
                    ? ExpectedInspectableNestedKeys_values[]
                    : (Texpected_stringNonEnumerablesOwn_values | Texpected_symbolNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values | Texpected_symbolNonEnumerablesInherited_values)[]
                >
              >(true)
              equalSetDeep(
                result,
                isInspectableNested
                  ? expectedInspectableNested_values
                  : [...expected_stringNonEnumerablesOwn_values, ...expected_symbolNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values, ...expected_symbolNonEnumerablesInherited_values]
              )
            })
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })
      describe(`props: true - returns never[]`, () => {
        describe(`props: true - returns never[]`, () => {
          const options = { props: true } as const
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props:true symbol: true - returns never[]`, () => {
          const options = { props: true, symbol: true } as const
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props:true string: false & symbols: true - returns never[]`, () => {
          const options = { props: true, string: false, symbol: true } as const

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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props:true string: false - returns never[]`, () => {
          const options = { props: true, string: false, symbol: false } as const
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props:true string: false & symbols: false - returns never[]`, () => {
          const options = { props: true, string: false, symbol: false } as const
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })
      describe(`props: true - nonEnumerables, inherited & own - returns requested props only`, () => {
        describe(`symbol nonEnumerables: true & inherited: undefined - returns own nonEnumerable string symbol`, () => {
          const options = {
            props: true,
            symbol: true,
            nonEnumerables: true,
            // inherited: false // default
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`symbol nonEnumerables: true & inherited: false - returns own nonEnumerable string symbol`, () => {
          const options = {
            props: true,
            symbol: true,
            nonEnumerables: true,
            inherited: false, // explicit
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        describe(`symbol inherited top, but nonEnumerables: undefined - returns never: no extra BaseType props (cause nonEnumerables: false)`, () => {
          const options = {
            props: true,
            symbol: true,
            // nonEnumerables: false, // default
            inherited: true,
            top: true,
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`symbol inherited top, but nonEnumerables: false - returns never: no extra BaseType props (cause nonEnumerables: false)`, () => {
          const options = {
            props: true,
            symbol: true,
            nonEnumerables: false, // explicit
            inherited: true,
            top: true,
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: true & symbol nonEnumerables inherited - returns all keys, including base-type inherited & non-enumerables props`, () => {
          const options = {
            props: true,
            symbol: true,
            nonEnumerables: true,
            inherited: true,
          } as const
          describe(`Expecting: own inherited nonEnumerable string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (Texpected_stringNonEnumerablesOwn | Texpected_symbolNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesInherited)[]>>(
                true
              )
              equalSetDeep(result, [...expected_stringNonEnumerablesOwn, ...expected_symbolNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited, ...expected_symbolNonEnumerablesInherited])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (Texpected_stringNonEnumerablesOwn_values | Texpected_symbolNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values | Texpected_symbolNonEnumerablesInherited_values)[]
                >
              >(true)
              equalSetDeep(result, [
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringNonEnumerablesInherited_values,
                ...expected_symbolNonEnumerablesInherited_values,
              ])
            })
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        describe(`props: true & symbol nonEnumerables inherited: true & top - returns all keys, including base-type inherited & non-enumerables props & top`, () => {
          const options = {
            props: true,
            symbol: true,
            nonEnumerables: true,
            inherited: true,
            top: true,
          } as const
          describe(`Expecting: own inherited top nonEnumerable string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | Texpected_stringNonEnumerablesOwn
                    | Texpected_symbolNonEnumerablesOwn
                    | Texpected_stringNonEnumerablesInherited
                    | Texpected_symbolNonEnumerablesInherited
                    | Texpected_stringNonEnumerablesInheritedTop
                  )[]
                >
              >(true)
              equalSetDeep(result, [
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
                    | Texpected_stringNonEnumerablesOwn_values
                    | Texpected_symbolNonEnumerablesOwn_values
                    | Texpected_stringNonEnumerablesInherited_values
                    | Texpected_symbolNonEnumerablesInherited_values
                    | Texpected_stringNonEnumerablesInheritedTop_values
                  )[]
                >
              >(true)
              equalSetDeep(
                result,
                _.uniq([
                  ...expected_stringNonEnumerablesOwn_values,
                  ...expected_symbolNonEnumerablesOwn_values,
                  ...expected_stringNonEnumerablesInherited_values,
                  ...expected_symbolNonEnumerablesInherited_values,
                  ...expected_stringNonEnumerablesInheritedTop_values,
                ])
              )
            })
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })
      describe('props: "all" - returns "Nested Keys & Values", i.e number[] indexes or Set/Map keys', () => {
        describe(`props: "all" - defaults`, () => {
          const options = { props: 'all' } as const
          // @todo: WIP failing with #R2 cause 'all' is not implemented!
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: "all", symbol: true`, () => {
          const options = { props: 'all', symbol: true } as const
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: "all", symbol: true, string: false`, () => {
          const options = { props: 'all', symbol: true, string: false } as const
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: "all", symbol: false, string: false`, () => {
          const options = { props: 'all', symbol: true, string: false } as const
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })
      describe('props: "all" - nonEnumerables, inherited & own - returns requested props only', () => {
        describe(`props: 'all' & nonEnumerables BUT inherited: undefined - returns Nested Values & no base props except own (like 'length')`, () => {
          const options = {
            props: 'all',
            nonEnumerables: true,
            // inherited: false // default
          } as const
          describe(`Expecting: Nested Keys & Values & own string #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys | Texpected_stringNonEnumerablesOwn)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_keys, ...expected_stringNonEnumerablesOwn])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys_values | Texpected_stringNonEnumerablesOwn_values)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_values, ...expected_stringNonEnumerablesOwn_values])
            })
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: 'all' & nonEnumerables BUT inherited: false - returns Nested Values & no base props except own (like 'length')`, () => {
          const options = {
            props: 'all',
            nonEnumerables: true,
            inherited: false, // explicit
          } as const
          describe(`Expecting: Nested Keys & Values & own string #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys | Texpected_stringNonEnumerablesOwn)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_keys, ...expected_stringNonEnumerablesOwn])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys_values | Texpected_stringNonEnumerablesOwn_values)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_values, ...expected_stringNonEnumerablesOwn_values])
            })
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: 'all' & symbol nonEnumerables BUT inherited: undefined - returns Nested Values & no base props except own (like 'length')`, () => {
          const options = {
            props: 'all',
            symbol: true,
            nonEnumerables: true,
            // inherited: false // default
          } as const
          describe(`Expecting: Nested Keys & Values & own string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys | Texpected_stringNonEnumerablesOwn | Texpected_symbolNonEnumerablesOwn)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_keys, ...expected_stringNonEnumerablesOwn, ...expected_symbolNonEnumerablesOwn])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys_values | Texpected_stringNonEnumerablesOwn_values | Texpected_symbolNonEnumerablesOwn_values)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_values, ...expected_stringNonEnumerablesOwn_values, ...expected_symbolNonEnumerablesOwn_values])
            })
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: 'all' & symbol nonEnumerables BUT inherited: false - returns Nested Values & no base props except own (like 'length')`, () => {
          const options = {
            props: 'all',
            symbol: true,
            nonEnumerables: true,
            inherited: false, // explicit
          } as const
          describe(`Expecting: Nested Keys & Values & own string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys | Texpected_stringNonEnumerablesOwn | Texpected_symbolNonEnumerablesOwn)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_keys, ...expected_stringNonEnumerablesOwn, ...expected_symbolNonEnumerablesOwn])
            })
            it(`values()`, () => {
              const result = values(getValue(), options)
              expectType<TypeEqual<typeof result, (ExpectedInspectableNestedKeys_values | Texpected_stringNonEnumerablesOwn_values | Texpected_symbolNonEnumerablesOwn_values)[]>>(true)
              equalSetDeep(result, [...expectedInspectableNested_values, ...expected_stringNonEnumerablesOwn_values, ...expected_symbolNonEnumerablesOwn_values])
            })
            it(`loop()`, () => {})
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
            // nonEnumerables: false, // default
            inherited: true,
            top: true,
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })

        describe(`props: 'all' & symbol nonEnumerables inherited: true - returns all keys, including base-type inherited & non-enumerables props`, () => {
          const options = {
            props: 'all',
            symbol: true,
            nonEnumerables: true,
            inherited: true,
          } as const
          describe(`Expecting: Nested Keys & Values & own inherited nonEnumerable string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (ExpectedInspectableNestedKeys | Texpected_stringNonEnumerablesOwn | Texpected_symbolNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesInherited)[]
                >
              >(true)
              equalSetDeep(result, [
                ...expectedInspectableNested_keys,
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
                    | ExpectedInspectableNestedKeys_values
                    | Texpected_stringNonEnumerablesOwn_values
                    | Texpected_symbolNonEnumerablesOwn_values
                    | Texpected_stringNonEnumerablesInherited_values
                    | Texpected_symbolNonEnumerablesInherited_values
                  )[]
                >
              >(true)
              equalSetDeep(result, [
                ...expectedInspectableNested_values,
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringNonEnumerablesInherited_values,
                ...expected_symbolNonEnumerablesInherited_values,
              ])
            })
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
        describe(`props: 'all' & symbol nonEnumerables inherited: true - returns all keys, including base-type inherited & non-enumerables props`, () => {
          const options = {
            props: 'all',
            symbol: true,
            nonEnumerables: true,
            inherited: true,
            top: true,
          } as const
          describe(`Expecting: Nested Keys & Values & own inherited top nonEnumerable string symbol #R1`, () => {
            it(`keys()`, () => {
              const result = keys(getValue(), options)
              expectType<
                TypeEqual<
                  typeof result,
                  (
                    | ExpectedInspectableNestedKeys
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
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringNonEnumerablesInherited_values,
                ...expected_symbolNonEnumerablesInherited_values,
                ...expected_stringNonEnumerablesInheritedTop_values,
              ])
            })
            it(`loop()`, () => {})
            it(`each()`, () => {})
            it(`map()`, () => {})
            it(`filter()`, () => {})
            it(`clone()`, () => {})
            it(`take()`, () => {})
          })
        })
      })
    })
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
          it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
              it(`loop()`, () => {})
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
              it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
            it(`loop()`, () => {})
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
