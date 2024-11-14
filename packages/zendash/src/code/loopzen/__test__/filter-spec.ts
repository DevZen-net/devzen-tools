import { expect } from 'chai'
import * as _ from 'lodash'
import { isSymbol } from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import * as util from 'util'
import { delaySecs } from '../../../test-utils/misc'
import {
  a_Array_of_Tvalues,
  commonAllValuePropTuples,
  commonStringValuePropTuples,
  falsiesNotFalse,
  filterValues,
  get_AsyncGenerator_of_Tvalues_withCommonProps,
  get_Generator_of_Tvalues_withCommonProps,
  get_plainIteratorPOJSO,
  getMapProjection,
  singleTypesAndPossibleValues,
} from '../../../test-utils/test-data'
import { isEqual } from '../../objects/isEqual'
import { isAnyJustIterator } from '../../typezen/isAnyJustIterator'
import { isDataView } from '../../typezen/isDataView'
import { isFunction } from '../../typezen/isFunction'
import { isGenerator } from '../../typezen/isGenerator'
import { isPromise } from '../../typezen/isPromise'
import { NOTHING, STOP, StopClass } from '../../typezen/utils'
import { filterFalse, filterTrue } from '../../utils'
import { filter } from '../filter'
import { ILoopOptions } from '../loop'

import {
  filter_STOPed_resembling_take,
  loop_each_map_clone_filter_take_SpecHandler,
  testFunctionOnly,
} from './loop-each-map-clone-filter-take.specHandler'

describe('filter() - creates a new value (object, Array or anything else), with the results of calling the projector/mapping function on every "nested" element in the input value', () => {
  ;(testFunctionOnly === 'filter' ? describe.only : describe)('filter()', () =>
    loop_each_map_clone_filter_take_SpecHandler('filter', '')
  )
  ;(testFunctionOnly === filter_STOPed_resembling_take ? describe.only : describe)(
    `${filter_STOPed_resembling_take}()`,
    () => loop_each_map_clone_filter_take_SpecHandler(filter_STOPed_resembling_take, '')
  )

  describe('filter() - all other tests', () => {
    describe('filter() reasoning - shortcomings of _.filter / _.mapValues', () => {
      describe('Arrays and _.filter() / Array.filter', () => {
        it(`_.filter doesnt copy array's props`, () => {
          const arr: any = [123, 'a', , , , , , true, { a: 1 }]
          arr[100] = 'sparse value for idx 100'
          arr['ArrayKey'] = 'sparse value for ArrayKey'

          const result: any = _.filter(arr, (val) => true)

          expect(result).to.eql(arr)
          expect(result.length).to.eql(arr.length)

          expect(result['ArrayKey']).to.not.equal(arr['ArrayKey'])
        })
      })
    })

    it(`throws if options.filter exists`, () => {
      expect(() => filter([1, 2, 3], _.identity, { filter: _.identity } as any)).to.throw(
        `_z.filter(): options.filter can NOT be used here - use filterCb only`
      )
    })

    describe('Objects and with filtered keys', () => {
      it('_.filter not working on non-arrays, not returning same type', () => {
        const obj = { a: 1, b: 42 }
        const result = _.filter(obj, (val) => true)

        expect(result).to.be.an('array')
      })
    })

    describe('filter() works on an all other values', () => {
      it('_z.filter is working on non-arrays, returning same type', () => {
        const obj = { a: 1, b: 2, c: 3, d: 4 }
        const result = filter(obj, (val) => filterValues(val))

        expect(result).to.deep.equal({
          b: 2,
          d: 4,
        })
      })

      it('Generator (sync)', () => {
        const generator: Generator<any> = (function* (arg1?: any, arg2?: any) {
          for (const val of a_Array_of_Tvalues) yield val
        })()

        const filteredGenerator = filter(generator, filterValues)

        let count = 0
        const results = a_Array_of_Tvalues.filter(filterValues)
        for (const val of filteredGenerator) {
          expect(val).to.be.eql(results[count])
          count++
        }

        expect(count).to.be.eql(results.length)
      })

      describe(`A Pojso (Plain Old JavaScript Object) Iterator`, () => {
        describe(`simply filtered`, () => {
          const plainIteratorPOJSO2 = get_plainIteratorPOJSO()

          let filteredIterator // : IterableIterator<[any]>
          before(() => {
            filteredIterator = filter(plainIteratorPOJSO2, filterValues)
          })

          it(`returns a generator / iterator`, () =>
            expect(isGenerator(filteredIterator)).to.be.true)

          it(`returns a different iterator`, () =>
            expect(filteredIterator).to.not.equal(plainIteratorPOJSO2))

          it(`iterates yielding filtered values`, () => {
            let count = 0
            const results = a_Array_of_Tvalues.filter(filterValues)

            for (const val of filteredIterator) {
              expect(val).to.be.eql(results[count])
              count++
            }

            expect(count).to.be.eql(results.length)
          })
        })

        describe(`filtered along with allProps`, () => {
          const plainIteratorPOJSO4 = get_plainIteratorPOJSO()

          let filteredIterator //: IterableIterator<any> //<[any]>
          before(() => {
            filteredIterator = filter(
              plainIteratorPOJSO4,
              filterValues,
              { props: 'all' } // can't use `symbol: true`, cause Symbol.iterator gets replaced!
            )
          })

          it(`returns a generator / iterator`, () =>
            expect(isGenerator(filteredIterator)).to.be.true)

          it(`returns a different iterator`, () =>
            expect(filteredIterator).to.not.equal(plainIteratorPOJSO4))

          it(`iterates yielding mapped values`, () => {
            let count = 0
            const results = a_Array_of_Tvalues.filter(filterValues)

            // @note TypeError: .for is not iterable if `const [val] of filteredIterator` when symbol: true & much much worse!
            // Symbol.iterator gets replaced with the original iterator's one!
            for (const val of filteredIterator) {
              expect(val).to.be.eql(results[count])
              count++
            }

            expect(count).to.be.eql(results.length)
          })

          it(`filteredIterator has its own next method`, () => {
            expect(filteredIterator.next).to.be.a('function')
            expect(filteredIterator.next).to.not.equal(plainIteratorPOJSO4.next)
          })

          it(`filteredIterator has allProps (no symbols!)`, () => {
            expect((filteredIterator as any)['someOtherProp1']).to.equal('someOtherValue')
            expect((filteredIterator as any)['someOtherProp2']).to.deep.equal([
              'someOther',
              'ArrayValue',
            ])
          })
        })
      })

      describe(`Generator`, () => {
        it(`simply filtered, no props`, () => {
          const generator = get_Generator_of_Tvalues_withCommonProps()

          const filteredGenerator = filter(generator, filterValues)

          expect((filteredGenerator as any)['stringProp']).to.equal(undefined)
          expect((filteredGenerator as any)['tooBadProp']).to.equal(undefined)
          expect((filteredGenerator as any)[Symbol.for('symbolLabelProp')]).to.equal(undefined)

          let count = 0
          const results = a_Array_of_Tvalues.filter(filterValues)
          // @ts-ignore-next-line it fails sometimes with @ts-expect-error @todo: fix filter() types
          for (const val of filteredGenerator) {
            expect(val).to.be.eql(results[count])
            count++
          }

          expect(count).to.be.eql(results.length)
        })

        it(`filtered along with props, without symbols`, () => {
          const generator = get_Generator_of_Tvalues_withCommonProps()

          const filteredGenerator = filter(generator, filterValues, { props: 'all' })

          _.each(commonStringValuePropTuples, ([val, prop]) => {
            if (filterValues(val, prop))
              expect(filteredGenerator[prop]).to.deep.equal(generator[prop])
            else expect(filteredGenerator[prop]).to.equal(undefined)
          })

          let count = 0
          const results = a_Array_of_Tvalues.filter(filterValues)

          for (const val of filteredGenerator) {
            expect(val).to.be.eql(results[count])
            count++
          }

          expect(count).to.be.eql(results.length)
        })

        it(`filtered along with props incl symbols & map`, () => {
          const generator = get_Generator_of_Tvalues_withCommonProps()
          const mapProjection = getMapProjection(5)

          const filteredGenerator = filter(generator, filterValues, {
            props: 'all',
            symbol: true,
            map: mapProjection,
          })

          _.each(commonAllValuePropTuples, ([val, prop]) => {
            if (filterValues(val, prop))
              expect(filteredGenerator[prop]).to.deep.equal(mapProjection(generator[prop]))
            else expect(filteredGenerator[prop]).to.equal(undefined)
          })

          let count = 0
          const results = a_Array_of_Tvalues.filter(filterValues).map(getMapProjection(5))

          for (const val of filteredGenerator) {
            expect(val).to.be.eql(results[count])
            count++
          }

          expect(count).to.be.eql(results.length)
        })
      })

      describe(`AsyncGenerator`, () => {
        it(`simply filtered`, async () => {
          const asyncfilteredGenerator = filter(
            get_AsyncGenerator_of_Tvalues_withCommonProps(),
            filterValues
          )

          // check props are NOT copied over by default!
          _.each(commonAllValuePropTuples, ([val, prop]) => {
            expect(asyncfilteredGenerator[prop]).to.equal(undefined)
          })

          let count = 0
          const results = a_Array_of_Tvalues.filter(filterValues)

          let previousTime = Date.now()
          for await (const val of asyncfilteredGenerator) {
            const currentTime = Date.now()
            const delaySecsAfterFilter = count > 0 ? delaySecs * 2 : delaySecs

            expect(currentTime - previousTime).to.be.gte(delaySecsAfterFilter * 1000 - 2)
            expect(currentTime - previousTime).to.be.lt(delaySecsAfterFilter * 1000 + 20)
            expect(val).to.be.eql(results[count])
            count++
            previousTime = Date.now()
          }

          expect(count).to.be.eql(results.length)
        })
        it(`filtered along with props: 'all', without symbols`, async () => {
          const asyncGenerator = get_AsyncGenerator_of_Tvalues_withCommonProps()
          const asyncFilteredGenerator = filter(asyncGenerator, filterValues, {
            props: 'all',
            // symbol: true, // failability
          } as any)

          // check eligible props are copied over!
          _.each(commonAllValuePropTuples, ([val, prop]) => {
            if (filterValues(val, prop) && !isSymbol(prop))
              expect(asyncFilteredGenerator[prop]).to.deep.equal(asyncGenerator[prop])
            else expect(asyncFilteredGenerator[prop]).to.equal(undefined)
          })

          let count = 0
          const results = a_Array_of_Tvalues.filter(filterValues)

          let previousTime = Date.now()
          for await (const val of asyncFilteredGenerator) {
            const currentTime = Date.now()
            const delaySecsAfterFilter = count > 0 ? delaySecs * 2 : delaySecs

            expect(currentTime - previousTime).to.be.gte(delaySecsAfterFilter * 1000 - 2)
            expect(currentTime - previousTime).to.be.lt(delaySecsAfterFilter * 1000 + 20)
            expect(val).to.be.eql(results[count])
            count++
            previousTime = Date.now()
          }

          expect(count).to.be.eql(results.length)
        })
        it(`filtered along with props & symbols`, async () => {
          const asyncGenerator = get_AsyncGenerator_of_Tvalues_withCommonProps()
          const asyncFilteredGenerator = filter(asyncGenerator, filterValues, {
            props: 'all',
            symbol: true,
          })

          // check eligible props are copied over!
          _.each(commonAllValuePropTuples, ([val, prop]) => {
            if (filterValues(val, prop))
              expect(asyncFilteredGenerator[prop]).to.deep.equal(asyncGenerator[prop])
            else expect(asyncFilteredGenerator[prop]).to.equal(undefined)
          })

          let count = 0
          const results = a_Array_of_Tvalues.filter(filterValues)

          let previousTime = Date.now()
          for await (const val of asyncFilteredGenerator) {
            const currentTime = Date.now()
            const delaySecsAfterFilter = count > 0 ? delaySecs * 2 : delaySecs

            expect(currentTime - previousTime).to.be.gte(delaySecsAfterFilter * 1000 - 2)
            expect(currentTime - previousTime).to.be.lt(delaySecsAfterFilter * 1000 + 20)
            expect(val).to.be.eql(results[count])
            count++
            previousTime = Date.now()
          }

          expect(count).to.be.eql(results.length)
        })
      })

      describe(`Promise, with filterSingles: true`, () => {
        const options = { filterSingles: true }

        describe(`simple, without map`, () => {
          it(`filtered in`, async () => {
            const promise = Promise.resolve(42)
            const filteredPromise = filter(promise, filterValues, options)
            const result = await filteredPromise

            expect(result).to.be.a('number')
            expect(result).to.be.eql(42)
          })

          it(`filtered out / rejected`, async () => {
            const promise = Promise.resolve(43)
            const filteredPromise = filter(promise, filterValues, options)
            const result = await filteredPromise

            expect(result).to.be.eql(NOTHING)
          })
        })

        describe(`with map`, () => {
          it(`filtered in`, async () => {
            const promise = Promise.resolve(42)
            const filteredPromise = filter(promise, filterValues, {
              map: getMapProjection(5),
              ...options,
            })
            const result = await filteredPromise

            expect(result).to.be.a('number')
            expect(result).to.be.eql(542)
          })

          it(`filtered out / rejected`, async () => {
            const promise = Promise.resolve(43)
            const filteredPromise = filter(promise, filterValues, {
              map: getMapProjection(5),
              ...options,
            })
            const result = await filteredPromise

            expect(result).to.be.eql(NOTHING)
          })
        })
      })

      describe(`Functions`, async () => {
        describe(`Function with filterSingles: true, returns a function`, async () => {
          const options: ILoopOptions<any, any, any> = { filterSingles: true }

          const fn = function (a: number, b: number) {
            return a + b + (this || 0)
          }

          let filteredFunction: Function
          before(() => (filteredFunction = filter(fn, filterValues, options)))

          it(`not equal to original`, () => {
            expect(filteredFunction).to.be.a('function')
            expect(filteredFunction).to.not.equal(fn)
          })

          it(`filtered in value`, () => {
            const result = filteredFunction(2, 2)
            expect(result).to.be.eql(4)
          })

          it(`filtered out / rejected value`, () => {
            const result = filteredFunction(1, 2)
            expect(result).to.be.eql(NOTHING)
          })

          it('respects `this` context', () => {
            const resultCtx = filteredFunction.call(10, 2, 2)
            expect(resultCtx).to.be.eql(14)
          })
        })

        describe(`Function with props:true & filterSingles: true, returns a function`, async () => {
          const fn: any = function (a: number, b: number) {
            return a + b + (this || 0)
          }

          fn['stringProp'] = 'some string'
          fn['numberProp'] = 42
          fn[Symbol.for('symbolLabelFunction')] = 'some symbol'
          // tooBad
          fn['tooBadProp'] = 'tooBad some too bad prop'
          fn[Symbol.for('tooBadSymbol')] = 'tooBad some too bad symbol'

          let filteredFunction: any //  Function
          before(
            () =>
              (filteredFunction = filter(fn, filterValues, {
                props: 'all',
                symbol: true,
                filterSingles: true,
              }))
          )

          it(`not equal to original`, () => {
            expect(filteredFunction).to.be.a('function')
            expect(filteredFunction).to.not.equal(fn)
          })

          it(`filtered in value`, () => {
            const result = filteredFunction(2, 2)
            expect(result).to.be.eql(4)
          })

          it(`filtered out / rejected value`, () => {
            const result = filteredFunction(1, 2)
            expect(result).to.be.eql(NOTHING)
          })

          it('respects `this` context', () => {
            const resultCtx = filteredFunction.call(10, 2, 2)
            expect(resultCtx).to.be.eql(14)
          })

          it('respects props', () => {
            expect(filteredFunction['stringProp']).to.equal('some string')
            expect(filteredFunction['numberProp']).to.equal(42)
            expect(filteredFunction[Symbol.for('symbolLabelFunction')]).to.equal('some symbol')
            expect(filteredFunction['tooBadProp']).to.equal(undefined)
            expect(filteredFunction[Symbol.for('tooBadSymbol')]).to.equal(undefined)
          })
        })
      })

      describe(`isSingle values`, () => {
        describe(`with filterSingles: true`, () => {
          const options = { filterSingles: true }

          describe(`Filter Passing - returns equivalent value / a value clone`, () => {
            _.each(
              singleTypesAndPossibleValues,
              (singleValues: any /* @todo: any[] */, valueType) => {
                _.each(singleValues, (aSingleValue) => {
                  if (_.isWeakSet(aSingleValue) || _.isWeakMap(aSingleValue)) {
                    it(`throws on WeakSet or WeakMap`, () => {
                      expect(() => filter(aSingleValue, filterTrue, options)).to.throw(
                        `_z.filter(): WeakMap & WeakSet are not supported!`
                      )
                    })
                  } else
                    describe(`${String(valueType)}`, async () => {
                      let result: any

                      before(async () => {
                        result = filter(aSingleValue, filterTrue, options)

                        if (isPromise(aSingleValue)) {
                          result = await result
                          aSingleValue = await aSingleValue
                        }
                      })

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
            describe(`with filterSingles: true & singlesReject: NOTHING (default) - return NOTHING`, () => {
              _.each(
                singleTypesAndPossibleValues,
                (singleValues: any /* @todo: any[] */, valueType) =>
                  _.each(singleValues, (aSingleValue) => {
                    if (_.isWeakSet(aSingleValue) || _.isWeakMap(aSingleValue)) {
                      it(`throws on WeakSet or WeakMap`, () => {
                        expect(() => filter(aSingleValue, filterFalse, options)).to.throw(
                          `_z.filter(): WeakMap & WeakSet are not supported!`
                        )
                      })
                    } else
                      describe(`${String(valueType)}`, async () => {
                        let result: any
                        let expected: any = NOTHING

                        before(async () => {
                          result = filter(aSingleValue, filterFalse, options)
                          if (isPromise(aSingleValue)) result = await result
                        })

                        it(`for valueType '${valueType as string}' returns expected = ${String(expected)}`, async () => {
                          if (valueType === `function`) {
                            if (aSingleValue === Promise.resolve) return

                            result = result()
                          }

                          expect(result).to.deep.equal(expected)
                        })
                      })
                  })
              )
            })

            describe(`with filterSingles: true & singlesReject: null - return null in most cases`, () =>
              _.each(
                singleTypesAndPossibleValues,
                (singleValues: any /* @todo: any[] */, valueType) =>
                  _.each(singleValues, (aSingleValue) => {
                    const options = { filterSingles: true, singlesReject: null }

                    if (
                      _.isWeakSet(aSingleValue) ||
                      _.isWeakMap(aSingleValue) ||
                      isDataView(aSingleValue)
                    ) {
                      return // already tested
                    } else
                      describe(`${String(valueType)}`, async () => {
                        let result: any
                        let expected: any = null

                        before(async () => {
                          result = filter(aSingleValue, filterFalse, options)

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
                        })

                        it(`for valueType '${valueType as string}' returns expected = ${String(expected)}`, async () => {
                          if (
                            [`number`, `NaN`, `bigint`, `Number`].includes(valueType as string)
                          ) {
                            result = filter(aSingleValue, filterFalse, options)
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
              ))
          })
        })

        describe(`with filterSingles: false (default) it throws`, () => {
          _.each(singleTypesAndPossibleValues, (singleValues: any /* @todo: any[] */, type) => {
            _.each(singleValues, (value) =>
              it(`${String(type)}`, () => {
                expect(() => filter(value, filterValues)).to.throw(
                  `_z.project() as _z.filter(): Can't filter or take with filterSingles: false over an _z.isSingleOrWeak value`
                )
              })
            )
          })
        })
      })
    })
    describe(`filter returns falseys / truthies / STOPs !`, () => {
      describe(`filter STOPs if STOP or STOP() is returned!`, () => {
        _.each([STOP, STOP(42)], (stopValue) => {
          it(`"${util.inspect(stopValue)}" stops the iteration`, () => {
            const arr = [1, 2, 3, 'foo', 'bar']
            const result = filter(arr, (val, idx, input) => {
              if (idx === 3) return stopValue
              else return true
            })

            const expected = [1, 2, 3]
            if (stopValue instanceof StopClass) expected.push(stopValue.returnValue)

            expect(result).to.deep.equal(expected)
          })
        })
      })

      describe(`filter rejects but doesn't STOP if falsies are returned!`, () => {
        _.each(falsiesNotFalse, (falsey) => {
          it(`"${falsey}" NOT stopping iteration, just filters`, () => {
            const arr = [1, 2, 3, 'foo rejected', 'bar accepted']
            const result = filter(arr, (item, idx, input) => {
              expectType<TypeEqual<typeof item, string | number>>(true)
              expectType<TypeEqual<typeof idx, number>>(true)
              expectType<TypeEqual<typeof input, (string | number)[]>>(true)

              if (idx === 3) return falsey as any
              else return true
            })

            expect(result).to.deep.equal([1, 2, 3, 'bar accepted'])
          })
        })
      })

      describe(`filter passes if truthy returned!`, () => {
        _.each([true, 'a', 1, {}, []], (truthy) => {
          it(`"${truthy}" continues the iteration`, () => {
            const arr = [1, 2, 3, 'foo accepted', 'bar rejected']
            const result = filter(arr, (item, idx, input) => {
              expectType<TypeEqual<typeof item, string | number>>(true)
              expectType<TypeEqual<typeof idx, number>>(true)
              expectType<TypeEqual<typeof input, (string | number)[]>>(true)

              if (idx <= 3) return truthy as any
              else return false
            })

            expect(result).to.deep.equal([1, 2, 3, 'foo accepted'])
          })
        })
      })
    })
  })
})
