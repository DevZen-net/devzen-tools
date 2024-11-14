import { expect } from 'chai'
import * as _ from 'lodash'
import { delaySecs } from '../../../test-utils/misc'
import {
  a_Array_of_Tvalues,
  a_AsyncGenerator_of_Tvalues_withCommonProps,
  a_Function_withProps,
  a_Generator_of_Tvalues_withCommonProps,
  a_Map_of_TMapKeys_Tvalues,
  a_Set_of_Tvalues,
  commonAllValuePropTuples,
  filterValues,
  get_AsyncGenerator_of_Tvalues_withCommonProps,
  get_Generator_of_Tvalues_withCommonProps,
  get_plainIteratorPOJSO,
  getMapProjection,
  NEW_TYPE,
  Person,
  singleTypesAndPossibleValues,
  T_NEW_TYPE,
  TMapKeys,
  Tvalues,
} from '../../../test-utils/test-data'
import { LogZenMini } from '../../LogZenMini'
import { isEqual } from '../../objects/isEqual'
import { isAnyJustIterator } from '../../typezen/isAnyJustIterator'
import { isFunction } from '../../typezen/isFunction'
import { isGenerator } from '../../typezen/isGenerator'
import { isPromise } from '../../typezen/isPromise'
import { NOTHING } from '../../typezen/utils'
import { filterFalse, filterTrue } from '../../utils'
import { each } from '../each'
import { ILoopOptions, MapCallback } from '../loop'
import { map } from '../map'
import {
  loop_each_map_clone_filter_take_SpecHandler,
  testFunctionOnly,
} from './loop-each-map-clone-filter-take.specHandler'
import { expectType, TypeEqual } from 'ts-expect'
import { Any } from '../../typezen/type-utils'
import { MapEntries, SetEntries } from 'type-fest/source/entries'
import { SetIteratorValues } from '../../typezen/isSetIterator'
import { MapIteratorValues } from '../../typezen/isMapIterator'

const l = new LogZenMini('map-spec', LogZenMini.LEVELS.warn)

const identity = (x) => x
const toNewType = (x: any): T_NEW_TYPE => NEW_TYPE

describe('map() - creates a new value (object, Array or anything else), with the results of calling the projector/mapping function on every "nested" element in the input value', () => {
  ;(testFunctionOnly === 'map' ? describe.only : describe)('map()', () =>
    loop_each_map_clone_filter_take_SpecHandler('map', '')
  )
  // ;(testFunctionOnly === map_STOPed_resembling_take ? describe.only : describe)(
  //   `${map_STOPed_resembling_take}()`,
  //   () => loop_each_map_clone_filter_take_SpecHandler(map_STOPed_resembling_take, '')
  // )

  describe('map() reasoning - shortcomings of _.map / _.mapValues', () => {
    describe('Arrays and _.map() / Array.map', () => {
      it(`_.map doesnt copy array's props`, () => {
        const arr: any = [123, 'a', , , , , , true, { a: 1 }]
        arr[100] = 'sparse value for idx 100'
        arr['ArrayKey'] = 'sparse value for ArrayKey'

        const result: any = _.map(arr, (val) => val)

        expect(result).to.eql(arr)
        expect(result.length).to.eql(arr.length)

        expect(result['ArrayKey']).to.equal(undefined)
      })
    })

    describe('Objects and _.mapValues()', () => {
      it('symbol keys are ignored', () => {
        const obj = { a: 1, [Symbol.for('symbolKeyForSet')]: 42 }
        const result = _.mapValues(obj, (val) => val)

        expect(result).to.not.eql(obj)

        expect(obj[Symbol.for('symbolKeyForSet')]).to.be.eql(42)
        expect(result[Symbol.for('symbolKeyForSet')]).to.equal(undefined)
      })
    })
  })

  describe('_z.map() - all other tests', () => {
    it(`throws if options.map exists`, () => {
      expect(() => map([1, 2, 3], _.identity, { map: _.identity } as any)).to.throw(
        `_z.map(): options.map can NOT be used here - use mapCb only`
      )
    })

    it(`Simple object, with value type change`, () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = map(obj, (val) /*:string*/ => 'ToString:' + val)

      expect(result).to.not.equal(obj)
      expect(result).to.eql({ a: `ToString:1`, b: `ToString:2`, c: `ToString:3` })
      expectType<TypeEqual<typeof result, { a: string; b: string; c: string }>>(true)
    })

    it(`Instance object, with value type change`, () => {
      class SimpleObject {
        a: number = 1
        b: boolean = true
        c: string = 'foo'
      }
      const obj = new SimpleObject()

      const result = map(obj, (val) /*:string*/ => 'ToString:' + val)

      expect(result).to.not.equal(obj)
      expect(result).to.eql({ a: `ToString:1`, b: `ToString:true`, c: `ToString:foo` })
      expectType<TypeEqual<typeof result, { a: string; b: string; c: string }>>(true)
    })

    it('Generator (sync)', () => {
      const generator: Generator<any> = (function* (arg1?: any, arg2?: any) {
        for (const val of a_Array_of_Tvalues) yield val
      })()

      const mappedGenerator = map(generator, getMapProjection(3))

      let count = 0
      const results = a_Array_of_Tvalues.map(getMapProjection(3))
      for (const val of mappedGenerator) {
        expect(val).to.be.eql(results[count])
        count++
      }

      expect(count).to.be.eql(results.length)
    })

    describe(`A Pojso (Plain Old JavaScript Object) Iterator`, () => {
      describe(`simply mapped`, () => {
        const plainIteratorPOJSO2 = get_plainIteratorPOJSO()

        let mappedIterator: any // IterableIterator<[any]>
        before(() => {
          mappedIterator = map(plainIteratorPOJSO2, getMapProjection(2))
        })

        // console.log('mappedIterator', mappedIterator)
        it(`returns a generator / iterator`, () =>
          expect(isGenerator(mappedIterator)).to.be.true)

        it(`returns a different iterator`, () =>
          expect(mappedIterator).to.not.equal(plainIteratorPOJSO2))

        it(`iterates yielding mapped values`, () => {
          let count = 0
          const results = a_Array_of_Tvalues.map(getMapProjection(2))

          for (const val of mappedIterator) {
            expect(val).to.be.eql(results[count])
            count++
          }
        })
      })

      describe(`mapped along with allProps`, () => {
        const plainIteratorPOJSO4 = get_plainIteratorPOJSO()

        let mappedIterator //: IterableIterator<[any]>
        before(() => {
          mappedIterator = map(
            plainIteratorPOJSO4,
            getMapProjection(4),
            { props: 'all' } // Can't use `symbol: true`, cause Symbol.iterator gets replaced!
          )
        })

        it(`returns a generator / iterator`, () =>
          expect(isGenerator(mappedIterator)).to.be.true)

        it(`returns a different iterator`, () =>
          expect(mappedIterator).to.not.equal(plainIteratorPOJSO4))

        it(`iterates yielding mapped values`, () => {
          let count = 0
          const results = a_Array_of_Tvalues.map(getMapProjection(4))

          // @note TypeError: .for is not iterable if `const val of mappedIterator` when symbol: true & much much worse!
          // Symbol.iterator gets replaced with the original iterator's one!
          for (const val of mappedIterator) {
            expect(val).to.be.eql(results[count])
            count++
          }
        })

        it(`mappedIterator has its own next method`, () => {
          expect(mappedIterator.next).to.be.a('function')
          expect(mappedIterator.next).to.not.equal(plainIteratorPOJSO4.next)
        })

        it(`mappedIterator has allProps (no symbols!)`, () => {
          expect((mappedIterator as any)['someOtherProp1']).to.equal(
            'someOtherValue !changeByMapProjectionId#4!'
          )
          expect((mappedIterator as any)['someOtherProp2']).to.deep.equal([
            '!changeByMapProjectionId#4!',
            'someOther',
            'ArrayValue',
          ])
        })
      })
    })

    describe(`Generator`, () => {
      it(`simply mapped, no props`, () => {
        const generator = get_Generator_of_Tvalues_withCommonProps()

        const mappedGenerator = map(generator, getMapProjection(6))

        expect((mappedGenerator as any)['stringProp']).to.equal(undefined)
        expect((mappedGenerator as any)['tooBadProp']).to.equal(undefined)
        expect((mappedGenerator as any)[Symbol.for('symbolLabelProp')]).to.equal(undefined)

        let count = 0
        const results = a_Array_of_Tvalues.map(getMapProjection(6))
        for (const val of mappedGenerator) {
          expect(val).to.be.eql(results[count])
          count++
        }

        expect(count).to.be.eql(results.length)
      })

      it(`mapped along with allProps, without symbols`, () => {
        const generator = get_Generator_of_Tvalues_withCommonProps()

        const mappedGenerator = map(generator, getMapProjection(5), { props: 'all' })

        expect((mappedGenerator as any)['stringProp']).to.equal(
          generator['stringProp'] + ' !changeByMapProjectionId#5!'
        )
        expect((mappedGenerator as any)['tooBadProp']).to.equal(
          generator['tooBadProp'] + ' !changeByMapProjectionId#5!'
        )
        expect((mappedGenerator as any)[Symbol.for('symbolLabelProp')]).to.equal(undefined)

        let count = 0
        const results = a_Array_of_Tvalues.map(getMapProjection(5))
        for (const val of mappedGenerator) {
          expect(val).to.be.eql(results[count])
          count++
        }

        expect(count).to.be.eql(results.length)
      })
    })

    describe(`AsyncGenerator`, () => {
      it(`simply mapped, no props`, async () => {
        const asyncMappedGenerator = map(
          get_AsyncGenerator_of_Tvalues_withCommonProps(),
          getMapProjection(3)
        )

        // check props are NOT copied over by default!
        _.each(commonAllValuePropTuples, ([val, prop]) => {
          expect(asyncMappedGenerator[prop]).to.equal(undefined)
        })

        let count = 0
        const results = a_Array_of_Tvalues.map(getMapProjection(3))

        let previousTime = Date.now()
        for await (const val of asyncMappedGenerator) {
          const currentTime = Date.now()

          expect(currentTime - previousTime).to.be.gte(delaySecs * 1000 - 2)
          expect(currentTime - previousTime).to.be.lt(delaySecs * 1000 + 20)
          expect(val).to.be.eql(results[count])
          count++
          previousTime = Date.now()
        }
      })
      it(`mapped along with allProps, without symbols`, async () => {
        const asyncGeneratorWithProps = get_AsyncGenerator_of_Tvalues_withCommonProps()
        const asyncGeneratorWithPropsFiltered = map(
          asyncGeneratorWithProps,
          getMapProjection(4),
          { props: 'all' }
        )

        // check props are mapped over!
        expect((asyncGeneratorWithPropsFiltered as any)['stringProp']).to.equal(
          asyncGeneratorWithProps['stringProp'] + ' !changeByMapProjectionId#4!'
        )

        let count = 0
        const results = a_Array_of_Tvalues.map(getMapProjection(4))

        let previousTime = Date.now()
        for await (const val of asyncGeneratorWithPropsFiltered) {
          const currentTime = Date.now()

          expect(currentTime - previousTime).to.be.gte(delaySecs * 1000 - 2)
          expect(currentTime - previousTime).to.be.lt(delaySecs * 1000 + 20)
          // expect(val).to.be.a('number')
          expect(val).to.be.eql(results[count])
          count++
          previousTime = Date.now()
        }
      })
    })

    describe(`Promise`, async () => {
      it(`Simple Promise`, async () => {
        const promise = Promise.resolve(42)
        const mappedPromise = map(promise, (val) => val * 2)
        const result = await mappedPromise

        expect(result).to.be.a('number')
        expect(result).to.be.eql(84)
      })

      describe(`Promise`, () => {
        describe(`simple map(), without filter`, () => {
          it(`maps the value`, async () => {
            const promise = Promise.resolve(42)
            const filteredPromise = map(promise, getMapProjection(8))
            const result = await filteredPromise

            expect(result).to.be.a('number')
            expect(result).to.be.eql(8 * 100 + 42)
          })
        })

        describe(`with filter & filterSingles: true`, () => {
          const options: ILoopOptions<any, any, any, any, any> = { filterSingles: true }

          it(`filtered in`, async () => {
            const promise = Promise.resolve(42)
            const filteredPromise = map(promise, getMapProjection(5), {
              ...options,
              filter: filterValues,
            })
            const result = await filteredPromise

            expect(result).to.be.a('number')
            expect(result).to.be.eql(542)
          })

          it(`filtered out / rejected`, async () => {
            const promise = Promise.resolve(43)
            const filteredPromise = map(promise, getMapProjection(5), {
              filter: filterValues,
              ...options,
            })
            const result = await filteredPromise

            expect(result).to.be.eql(NOTHING)
          })
        })
      })
    })

    describe(`Function`, async () => {
      describe('A simple Function, with `this` context', async () => {
        const fn = function (a: number, b: number) {
          return a + b + (this || 0)
        }

        let mappedFn //: Function
        before(() => (mappedFn = map(fn, ((val: number) => val * 2) as any)))

        it(`returns a function, not equal to original`, () => {
          expect(mappedFn).to.be.a('function')
          expect(mappedFn).to.not.equal(fn)
        })

        it(`returned function, returns mapped value`, () => {
          const result = mappedFn(1, 2)
          expect(result).to.be.a('number')
          expect(result).to.be.eql(6)
        })

        it('returned function, respects `this` context', () => {
          const resultCtx = mappedFn.call(10, 1, 2)
          expect(resultCtx).to.be.eql(26)
        })
      })

      describe('A Function with extra props & loopSingles: false', async () => {
        const options: ILoopOptions<any, any, any, any, any> = { props: 'all', symbol: true } // loopSingles: false is default

        const mapProjection = getMapProjection(3)

        let mappedFn: any // @todo: () => any
        before(() => (mappedFn = map(a_Function_withProps, mapProjection, options)))

        it(`returns a function, not equal to original`, () => {
          expect(mappedFn).to.be.a('function')
          expect(mappedFn).to.not.equal(a_Function_withProps)
        })

        it(`returned function, returns mapped value`, () => {
          const result = mappedFn()
          expect(result).to.be.a('string')
          expect(result).to.be.eql(a_Function_withProps() + ' !changeByMapProjectionId#3!')
        })

        it(`returned function has the right props`, () => {
          expect((mappedFn as any)['functionStringProp1']).to.equal(
            a_Function_withProps['functionStringProp1'] + ' !changeByMapProjectionId#3!'
          )
          expect((mappedFn as any)['functionNumberProp2']).to.equal(
            mapProjection(a_Function_withProps['functionNumberProp2']) //+ ' !changeByMapProjectionId#3!'
          )
          expect((mappedFn as any)[Symbol.for('functionSymbolProp')]).to.equal(
            a_Function_withProps[Symbol.for('functionSymbolProp')] +
              ' !changeByMapProjectionId#3!'
          )
        })
      })

      // @todo: generator function
      // @todo: async function
      // @todo: async generator
    })

    describe(`isSingle values`, () => {
      const mapProjection = _.identity
      describe(`with filterSingles: true`, () => {
        describe(`Filter Passing - returns equivalent value / a value clone`, () => {
          const options = { filterSingles: true, filter: filterTrue }

          // DONE
          each(
            singleTypesAndPossibleValues,
            (singleValues: any /* @todo: any[] */, valueType) => {
              each(singleValues, (aSingleValue) => {
                if (_.isWeakSet(aSingleValue) || _.isWeakMap(aSingleValue)) {
                  it(`throws on WeakSet or WeakMap`, () => {
                    expect(() => map(aSingleValue, _.identity, options)).to.throw(
                      `_z.map(): WeakMap & WeakSet are not supported!`
                    )
                  })
                } else
                  describe(`${String(valueType)}`, async () => {
                    let result: any = map(aSingleValue, mapProjection, options)

                    // special cases
                    if (isPromise(aSingleValue)) {
                      result = await result
                      aSingleValue = await aSingleValue
                    }

                    it(`for valueType '${valueType as string}' returns expected = ${String(aSingleValue)}`, async () => {
                      if (isFunction(aSingleValue)) {
                        if (aSingleValue === Promise.resolve) return

                        expect(result).to.be.a('function')
                        //  [Function mappedFunction]
                        expect(result.name).to.equal('mappedFunction')

                        if (!isAnyJustIterator(aSingleValue)) return
                        expect(await result()).to.equal(await (aSingleValue as any)())

                        return
                      }

                      expect(result).to.deep.equal(aSingleValue)
                    })
                  })
              })
            }
          )
        })

        describe(`Filter Rejected - testing each singleTypesAndPossibleValues`, () => {
          describe(`with filterSingles: true & singlesReject: EMPTY (default) - return EMPTY`, () => {
            const options = { filterSingles: true, filter: filterFalse }

            each(
              singleTypesAndPossibleValues,
              (singleValues: any /* @todo: any[] */, valueType) => {
                // @ts-ignore-next-line not all paths return a value
                each(singleValues, (aSingleValue) => {
                  if (_.isWeakSet(aSingleValue) || _.isWeakMap(aSingleValue))
                    it(`throws on WeakSet or WeakMap`, () => {
                      expect(() => map(aSingleValue, mapProjection, options)).to.throw(
                        `_z.map(): WeakMap & WeakSet are not supported!`
                      )
                    })
                  else
                    describe(`${String(valueType)}`, async () => {
                      let result: any
                      let expected: any = NOTHING

                      before(async () => {
                        result = map(aSingleValue, mapProjection, options)
                        if (isPromise(aSingleValue)) result = await result
                      })

                      // special cases
                      it(`for valueType '${valueType as string}' returns expected = ${String(expected)}`, async () => {
                        if (valueType === `function`) {
                          if (aSingleValue === Promise.resolve) return

                          result = result()
                        }

                        expect(result).to.deep.equal(expected)
                      })
                    })
                })
              }
            )
          })

          describe(`with filterSingles: true & singlesReject: null - return null in most cases`, () =>
            each(
              singleTypesAndPossibleValues,
              (singleValues: any /* @todo: any[] */, valueType) => {
                each(singleValues, (aSingleValue) => {
                  const options: ILoopOptions<any, any, any, any, any> = {
                    filterSingles: true,
                    singlesReject: null,
                    filter: filterFalse,
                  }

                  if (_.isWeakSet(aSingleValue) || _.isWeakMap(aSingleValue)) {
                    it(`throws on WeakSet or WeakMap`, () => {
                      expect(() => map(aSingleValue, mapProjection, options)).to.throw(
                        `_z.map(): WeakMap & WeakSet are not supported!`
                      )
                    })
                  } else
                    describe(`${valueType as string}`, async () => {
                      let result: any
                      let expected: any = null

                      // before(async () => {
                      result = map(aSingleValue, mapProjection, options)

                      // special cases
                      if (isPromise(aSingleValue)) result = await result

                      if (valueType === `symbol`) expected = NOTHING
                      if (valueType === `string`) expected = ''
                      if (valueType === `String`) expected = new String('')

                      if (['Date', 'RegExp', 'Boolean'].includes(valueType as string))
                        expected = new (aSingleValue as any).constructor(expected)

                      if (valueType === `Error`) {
                        expected = new (aSingleValue as any).constructor('')
                        expected.stack = ''
                      }
                      if ([`number`, `bigint`, `Number`].includes(valueType as string))
                        expected = valueType === 'Number' ? new Number(NaN) : NaN

                      it(`for valueType '${valueType as string}' returns expected = ${String(expected)}`, async () => {
                        if (
                          [`number`, `NaN`, `bigint`, `Number`].includes(valueType as string)
                        ) {
                          result = map(aSingleValue, mapProjection, options)
                          const isResultNan = isEqual(result, expected)

                          if (!isResultNan)
                            console.error(
                              `Not equals NaN:, \nresult:`,
                              result,
                              `\nexpected:`,
                              expected
                            )

                          expect(isResultNan).to.equal(true)

                          return
                        }

                        if (valueType === `function`) {
                          if (aSingleValue === Promise.resolve) return

                          result = result()
                        }

                        expect(result).to.deep.equal(expected)
                      })
                    })
                })
              }
            ))
        })
      })

      describe(`with filterSingles: false (default) it throws`, () => {
        const options: ILoopOptions<any, any, any, any, any> = {
          filter: filterValues,
        } // filterSingles: false is default

        each(singleTypesAndPossibleValues, (singleValues: any /* @todo: any[] */, type) => {
          each(singleValues, (value) =>
            it(`${String(type)}`, () => {
              expect(() => map(value, mapProjection, options)).to.throw(
                `_z.map(): Can't filter or take with filterSingles: false over an _z.isSingleOrWeak value`
              )
            })
          )
        })
      })
    })
  })

  describe(`map() Typings tests`, () => {
    describe(`mapCallback() Typings tests`, () => {
      it(`ALL map2() Typings tests`, async () => {
        const mapStringAndNumber_ToRegExp: MapCallback<string | number, Any, any, RegExp> = (
          val,
          idx,
          value,
          count
        ) => {
          expectType<TypeEqual<string | number, typeof val>>(true)
          expectType<TypeEqual<Any, typeof idx>>(true)
          return new RegExp(val.toString())
        }

        expectType<TypeEqual<ReturnType<typeof mapStringAndNumber_ToRegExp>, RegExp | Promise<RegExp>>>(true)
        const regExpResult = mapStringAndNumber_ToRegExp('string', null, null, 1)
        expectType<TypeEqual<typeof regExpResult, RegExp | Promise<RegExp>>>(true)

        const mapStringNumberRegExp_ToNumber: MapCallback<
          string | number | RegExp,
          null,
          any,
          number
        > = (val, idx, value, number) => {
          expectType<string | number | RegExp>(val)
          expectType<Any>(idx)

          return _.isNumber(val) ? val : _.size(val)
        }

        expectType<TypeEqual<ReturnType<typeof mapStringNumberRegExp_ToNumber>, number | Promise<number>>>(true)
        const numberResult = mapStringNumberRegExp_ToNumber('string', null, null, 1)
        expectType<TypeEqual<typeof numberResult, number | Promise<number>>>(true)
      })
    })
    describe(`map() returns the right type - identity`, async () => {
      it(`Generator`, async () => {
        const result = map(a_Generator_of_Tvalues_withCommonProps, identity)
        expectType<TypeEqual<typeof result extends Generator<Tvalues> ? true : false, true>>(
          true
        )
      })
      it(`AsyncGenerator`, async () => {
        const result = map(a_AsyncGenerator_of_Tvalues_withCommonProps, identity)
        expectType<
          TypeEqual<typeof result extends AsyncGenerator<Tvalues> ? true : false, true>
        >(true)
      })
      describe(`Set & Family`, async () => {
        it(`Set`, async () => {
          const result = map(a_Set_of_Tvalues, identity)
          expectType<TypeEqual<typeof result extends Set<Tvalues> ? true : false, true>>(true)
        })
        it(`Set Entries`, async () => {
          // @todo: returns MapEntries, but should return SetEntries
          const result = map(a_Set_of_Tvalues.entries(), identity)
          expectType<
            TypeEqual<
              typeof result extends IterableIterator<[Tvalues, Tvalues]> ? true : false,
              true
            >
          >(true)

          // expectType<TypeEqual<typeof result extends SetEntries<typeof a_Set_of_Tvalues> ? true : false, true>>(true) // variation not working
          expectType<
            TypeEqual<
              typeof result extends MapEntries<typeof a_Set_of_Tvalues> ? true : false,
              true
            >
            // @ts-expect-error: OK SetEntries is not assignable MapEntries
          >(true)
          // @-ts-expect-error: @todo(000): this SHOULD FAIL in variation, but it doesn't
          // expectType<TypeEqual<typeof result extends MapEntries<Map<Tvalues, Tvalues>> ? true : false, true>>(true)

          // expectType<TypeEqual<typeof result extends Entries<typeof a_Set_of_Tvalues> ? true : false, true>>(true) // should work in variation
        })
        it(`Set Values`, async () => {
          const result = map(a_Set_of_Tvalues.values(), identity)
          expectType<
            TypeEqual<typeof result extends IterableIterator<Tvalues> ? true : false, true>
          >(true)
          expectType<
            TypeEqual<typeof result extends SetIteratorValues<Tvalues> ? true : false, true>
          >(true)
        })
      })
      describe(`Map & Family`, async () => {
        it(`Map`, async () => {
          const result = map(a_Map_of_TMapKeys_Tvalues, identity)
          expectType<
            TypeEqual<typeof result extends Map<TMapKeys, Tvalues> ? true : false, true>
          >(true)
        })
        it(`Map Entries`, async () => {
          const result = map(a_Map_of_TMapKeys_Tvalues.entries(), identity)
          expectType<
            TypeEqual<
              typeof result extends IterableIterator<[TMapKeys, Tvalues]> ? true : false,
              true
            >
          >(true)
          // variation

          expectType<
            TypeEqual<
              // @ts-expect-error: OK TS2344: Type Map<TMapKeys, Tvalues> does not satisfy the constraint Set<unknown>
              typeof result extends SetEntries<typeof a_Map_of_TMapKeys_Tvalues> ? true : false,
              true
            >
            // @ts-expect-error: OK TS2344: Type Map<TMapKeys, Tvalues> does not satisfy the constraint Set<unknown>
          >(true)
          // expectType<TypeEqual<typeof result extends Entries<typeof a_Map_of_TMapKeys_Tvalues> ? true : false, true>>(true)
        })
        it(`Map Values`, async () => {
          const result = map(a_Map_of_TMapKeys_Tvalues.values(), identity)
          expectType<
            TypeEqual<typeof result extends IterableIterator<Tvalues> ? true : false, true>
          >(true)
          expectType<
            TypeEqual<typeof result extends MapIteratorValues<Tvalues> ? true : false, true>
          >(true)
        })
      })

      it(`Class - should throw, cause it makes little sense to clone/map a class`, async () => {
        try {
          const result = map(Person, identity)
          expectType<TypeEqual<typeof result, never>>(true)
        } catch (error) {
          expect(error).to.be.an.instanceOf(Error)
          expect((error as Error).message).to.equal(
            `_z.map(): User classes are not supported - Cannot clone/map a class!`
          )
        }
      })
    })
    describe(`map() returns the right type - toNewType `, async () => {
      it(`Generator`, async () => {
        const result = map(a_Generator_of_Tvalues_withCommonProps, toNewType)
        expectType<TypeEqual<typeof result extends Generator<T_NEW_TYPE> ? true : false, true>>(
          true
        )
      })
      it(`AsyncGenerator`, async () => {
        const result = map(a_AsyncGenerator_of_Tvalues_withCommonProps, toNewType)
        expectType<
          TypeEqual<typeof result extends AsyncGenerator<T_NEW_TYPE> ? true : false, true>
        >(true)
      })
      describe(`Set & Family`, async () => {
        it(`Set`, async () => {
          const result = map(a_Set_of_Tvalues, toNewType)
          expectType<TypeEqual<typeof result extends Set<T_NEW_TYPE> ? true : false, true>>(
            true
          )
        })
        it(`Set Entries`, async () => {
          // @todo: returns MapEntries, but should return SetEntries
          const result = map(a_Set_of_Tvalues.entries(), toNewType)
          expectType<
            TypeEqual<
              typeof result extends IterableIterator<[Tvalues, T_NEW_TYPE]> ? true : false,
              true
            >
          >(true)

          // expectType<TypeEqual<typeof result extends SetEntries<typeof a_Set_of_Tvalues> ? true : false, true>>(true) // variation not working
          expectType<
            TypeEqual<
              typeof result extends MapEntries<typeof a_Set_of_Tvalues> ? true : false,
              true
            >
            // @ts-expect-error: OK SetEntries is not assignable MapEntries
          >(true)
          // @-ts-expect-error: @todo(000): this SHOULD FAIL in variation, but it doesn't
          // expectType<TypeEqual<typeof result extends MapEntries<Map<Tvalues, Tvalues>> ? true : false, true>>(true)

          // expectType<TypeEqual<typeof result extends Entries<typeof a_Set_of_Tvalues> ? true : false, true>>(true) // should work in variation
        })
        it(`Set Values`, async () => {
          const result = map(a_Set_of_Tvalues.values(), toNewType)
          expectType<
            TypeEqual<typeof result extends IterableIterator<T_NEW_TYPE> ? true : false, true>
          >(true)
          expectType<
            TypeEqual<typeof result extends SetIteratorValues<T_NEW_TYPE> ? true : false, true>
          >(true)
        })
      })
      describe(`Map & Family`, async () => {
        it(`Map`, async () => {
          const result = map(a_Map_of_TMapKeys_Tvalues, toNewType)
          expectType<
            TypeEqual<typeof result extends Map<TMapKeys, T_NEW_TYPE> ? true : false, true>
          >(true)
        })
        it(`Map Entries`, async () => {
          const result = map(a_Map_of_TMapKeys_Tvalues.entries(), toNewType)
          expectType<
            TypeEqual<
              typeof result extends IterableIterator<[TMapKeys, T_NEW_TYPE]> ? true : false,
              true
            >
          >(true)
          // variation
          expectType<
            TypeEqual<
              // @ts-expect-error: OK TS2344: Type Map<TMapKeys, Tvalues> does not satisfy the constraint Set<unknown>
              typeof result extends SetEntries<typeof a_Map_of_TMapKeys_Tvalues> ? true : false,
              true
            >
            // @ts-expect-error: OK TS2344: Type Map<TMapKeys, Tvalues> does not satisfy the constraint Set<unknown>
          >(true)
          // expectType<TypeEqual<typeof result extends Entries<typeof a_Map_of_TMapKeys_Tvalues> ? true : false, true>>(true)
        })
        it(`Map Values`, async () => {
          const result = map(a_Map_of_TMapKeys_Tvalues.values(), toNewType)
          expectType<
            TypeEqual<typeof result extends IterableIterator<T_NEW_TYPE> ? true : false, true>
          >(true)
          expectType<
            TypeEqual<typeof result extends MapIteratorValues<T_NEW_TYPE> ? true : false, true>
          >(true)
        })
      })

      it(`Class - should throw, cause it makes little sense to clone/map a class`, async () => {
        try {
          const result = map(Person, toNewType)
          expectType<TypeEqual<typeof result, never>>(true)
        } catch (error) {
          expect(error).to.be.an.instanceOf(Error)
          expect((error as Error).message).to.equal(
            `_z.map(): User classes are not supported - Cannot clone/map a class!`
          )
        }
      })
    })
  })
})
