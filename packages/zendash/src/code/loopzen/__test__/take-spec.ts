import { expect } from 'chai'
import * as _ from 'lodash'
import * as util from 'util'
import { delaySecs } from '../../../test-utils/misc'
import {
  a_Array_of_Tvalues,
  commonAllValuePropTuples,
  commonStringValuePropTuples,
  falsiesNotFalse,
  filter_takeN,
  get_AsyncGenerator_of_Tvalues_withCommonProps,
  singleTypesAndPossibleValues,
} from '../../../test-utils/test-data'
import { isEqual } from '../../objects/isEqual'
import { isAnyJustIterator } from '../../typezen/isAnyJustIterator'
import { isFunction } from '../../typezen/isFunction'
import { isPromise } from '../../typezen/isPromise'
import { NOTHING, STOP, StopClass } from '../../typezen/utils'
import { each } from '../each'
import { filter } from '../filter'
import { ILoopOptions } from '../loop'
import { take } from '../take'
import {
  loop_each_map_clone_filter_take_SpecHandler,
  testFunctionOnly,
} from './loop-each-map-clone-filter-take.specHandler'

describe('take() - creates a new value (object, Array or anything else), with the results of calling the projector/mapping function on every "nested" element in the input value', () => {
  ;(testFunctionOnly === 'take' ? describe.only : describe)('take()', () =>
    loop_each_map_clone_filter_take_SpecHandler('take', '')
  )

  describe('take() - other tests', () => {
    it('Array simple example', () => {
      const array = [1, 2, 3, 4, 5]
      const result = take(array, 3)

      expect(result).to.be.eql([1, 2, 3])
      expect(result).to.not.eql(array)
    })

    it(`throws if options.take exists`, () => {
      expect(() => take([1, 2, 3], 1, { take: 1 } as any)).to.throw(
        `_z.take(): options.take can NOT be used here - use takeCb only`
      )
    })

    describe(`take returns falseys / truthies / STOPs !`, () => {
      describe(`take STOPs if STOP or STOP() is returned!`, () => {
        _.each([STOP, STOP('STOPed iteration')], (stopValue) => {
          it(`"${util.inspect(stopValue)}" stops the iteration`, () => {
            const arr = [1, 2, 3, 4, 5, 'foo', 'bar']
            const result = take(arr, (val, idx, input) => {
              if (idx === 3) return stopValue
              else return true
            })

            const expected = [1, 2, 3]
            if (stopValue instanceof StopClass) expected.push(stopValue.returnValue)
            expect(result).to.deep.equal(expected)
          })
        })
      })

      describe(`take STOPs if any falsy is returned!`, () => {
        _.each([false, ...falsiesNotFalse], (falsey) => {
          it(`"${falsey}" stops iteration`, () => {
            const arr = [1, 2, 3, 'foo', 'bar']
            const result = take(arr, (val, idx, input) => {
              if (idx === 3) return falsey as any
              return true
            })

            expect(result).to.deep.equal([1, 2, 3])
          })
        })
      })

      describe(`filter passes if truthy returned!`, () => {
        _.each([true, 'a', 1, {}, []], (truthy) => {
          it(`"${truthy}" continues the iteration`, () => {
            const arr: (string | number)[] = [1, 2, 3, 'foo accepted', 'bar rejected']
            const result = take(arr, (val, idx, input) => {
              if (idx <= 3) return truthy as any
              else return false
            })

            expect(result).to.deep.equal([1, 2, 3, 'foo accepted'])
          })
        })
      })
    })

    describe(`A Function with extra props & symbols & loopSingles: false - returns a Function with mapped returned values`, async () => {
      const options: ILoopOptions<any, any, any> = {
        props: 'all',
        symbol: true,
        filterSingles: true,
      }

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
      before(() => (filteredFunction = take(fn, 1, options)))

      it(`not equal to original`, () => {
        expect(filteredFunction).to.be.a('function')
        expect(filteredFunction).to.not.equal(fn)
      })

      it(`takes 1 single value`, () => {
        const result = filteredFunction(2, 2)
        expect(result).to.be.eql(4)
      })

      it(`not taken value (i. rejected)`, () => {
        const filteredFunctionNothing = take(fn, 0, {
          props: 'all',
          symbol: true,
          filterSingles: true,
        })

        const result = filteredFunctionNothing(1, 2)
        expect(result).to.be.eql(NOTHING)
      })

      it('respects `this` context', () => {
        const resultCtx = filteredFunction.call(10, 2, 2)
        expect(resultCtx).to.be.eql(14)
      })

      it('respects props, just 1 taken', () => {
        expect(filteredFunction['stringProp']).to.equal('some string')
        expect(filteredFunction['numberProp']).to.equal(undefined)
        expect(filteredFunction[Symbol.for('symbolLabelFunction')]).to.equal(undefined)
        expect(filteredFunction['tooBadProp']).to.equal(undefined)
        expect(filteredFunction[Symbol.for('tooBadSymbol')]).to.equal(undefined)
      })
    })

    it('Generator (sync)', () => {
      const generator: Generator<number> = (function* () {
        yield 11
        yield 22
        yield 33
        yield 44
      })()
      // const takenGenerator = map(generator, (v) => v *2 )
      const takenGenerator = take(generator, 2)

      let count = 0
      let results = [11, 22]
      for (const val of takenGenerator) {
        expect(val).to.be.eql(results[count])
        expect(val).to.be.a('number')
        count = count + 1
      }

      expect(count).to.be.eql(results.length)
    })

    describe(`AsyncGenerator`, () => {
      it(`simply take 3`, async () => {
        const asyncfilteredGenerator = take(get_AsyncGenerator_of_Tvalues_withCommonProps(), 3)

        // check props are not copied over!
        _.each(commonStringValuePropTuples, ([val, prop]) => {
          expect(asyncfilteredGenerator[prop]).to.equal(undefined)
        })

        let count = 0
        const results = _.take(a_Array_of_Tvalues, 3)

        let previousTime = Date.now()
        for await (const val of asyncfilteredGenerator) {
          const currentTime = Date.now()

          expect(currentTime - previousTime).to.be.gte(delaySecs * 1000 - 2)
          expect(currentTime - previousTime).to.be.lt(delaySecs * 1000 + 20)
          expect(val).to.be.eql(results[count])
          count++
          previousTime = Date.now()
        }

        expect(count).to.be.eql(results.length)
      })

      it(`take 2 items & 2 props, with props: 'all' & symbol: false`, async () => {
        const TAKE_ITEMS = commonAllValuePropTuples.length - 2
        const asyncGenerator = get_AsyncGenerator_of_Tvalues_withCommonProps()
        const asyncFilteredGenerator = take(asyncGenerator, TAKE_ITEMS, {
          props: 'all',
          // symbol: true, // failability
        })

        // check only TAKE_ITEMS props & string props only are copied over!
        let propsCount = 0
        _.each(commonAllValuePropTuples, ([val, prop]) => {
          if (propsCount < TAKE_ITEMS && !_.isSymbol(prop))
            expect(asyncFilteredGenerator[prop]).to.deep.equal(asyncGenerator[prop])
          else expect(asyncFilteredGenerator[prop]).to.equal(undefined)

          propsCount++
        })

        let count = 0
        const results = _.take(a_Array_of_Tvalues, TAKE_ITEMS)

        let previousTime = Date.now()
        for await (const val of asyncFilteredGenerator) {
          const currentTime = Date.now()

          expect(currentTime - previousTime).to.be.gte(delaySecs * 1000 - 2)
          expect(currentTime - previousTime).to.be.lt(delaySecs * 1000 + 20)
          expect(val).to.be.eql(results[count])
          count++
          previousTime = Date.now()
        }

        expect(count).to.be.eql(results.length)
      })

      it(`take N props & N items, with props & symbols true`, async () => {
        const TAKE_ITEMS = commonAllValuePropTuples.length - 2
        const asyncGenerator = get_AsyncGenerator_of_Tvalues_withCommonProps()
        const asyncFilteredGenerator = take(asyncGenerator, TAKE_ITEMS, {
          props: 'all',
          symbol: true,
        })

        // console.log(asyncGenerator, (asyncGenerator as any)[Symbol.for('symbolProp')])
        // console.log(asyncFilteredGenerator, (asyncFilteredGenerator as any)[Symbol.for('symbolProp')])

        let propsCount = 0
        _.each(commonAllValuePropTuples, ([val, prop]) => {
          if (propsCount < TAKE_ITEMS)
            expect(asyncFilteredGenerator[prop]).to.deep.equal(asyncGenerator[prop])
          else expect(asyncFilteredGenerator[prop]).to.equal(undefined)

          propsCount++
        })

        let count = 0
        const results = _.take(a_Array_of_Tvalues, TAKE_ITEMS)

        let previousTime = Date.now()
        for await (const val of asyncFilteredGenerator) {
          const currentTime = Date.now()
          expect(currentTime - previousTime).to.be.gte(delaySecs * 1000 - 2)
          expect(currentTime - previousTime).to.be.lt(delaySecs * 1000 + 20)
          expect(val).to.be.eql(results[count])
          count++
          previousTime = Date.now()
        }

        expect(count).to.be.eql(results.length)
      })

      it(`use filter_takeN to N props & N items, with props & symbols true`, async () => {
        const TAKE_ITEMS = commonAllValuePropTuples.length - 2
        const asyncGenerator = get_AsyncGenerator_of_Tvalues_withCommonProps()
        const asyncFilteredGenerator = filter(asyncGenerator, filter_takeN(TAKE_ITEMS), {
          props: 'all',
          symbol: true,
        })

        // console.log(asyncGenerator, (asyncGenerator as any)[Symbol.for('symbolProp')])
        // console.log(asyncFilteredGenerator, (asyncFilteredGenerator as any)[Symbol.for('symbolProp')])

        let propsCount = 0
        _.each(commonAllValuePropTuples, ([val, prop]) => {
          if (propsCount < TAKE_ITEMS)
            expect(asyncFilteredGenerator[prop]).to.deep.equal(asyncGenerator[prop])
          else expect(asyncFilteredGenerator[prop]).to.equal(undefined)

          propsCount++
        })

        let count = 0
        const results = _.take(a_Array_of_Tvalues, TAKE_ITEMS)

        let previousTime = Date.now()
        for await (const val of asyncFilteredGenerator) {
          const currentTime = Date.now()
          expect(currentTime - previousTime).to.be.gte(delaySecs * 1000 - 2)
          expect(currentTime - previousTime).to.be.lt(delaySecs * 1000 + 20)
          expect(val).to.be.eql(results[count])
          count++
          previousTime = Date.now()
        }

        expect(count).to.be.eql(results.length)
      })
    })

    describe(`isSingle values`, () => {
      describe(`with filterSingles: true`, () => {
        const options = { filterSingles: true }

        describe(`take(val, 1) is passing - returns equivalent value / a value clone`, () => {
          each(
            singleTypesAndPossibleValues,
            (singleValues: any /* @todo: any[] */, valueType) => {
              each(singleValues, (aSingleValue) => {
                if (_.isWeakSet(aSingleValue) || _.isWeakMap(aSingleValue)) {
                  it(`throws on WeakSet or WeakMap`, () => {
                    expect(() => take(aSingleValue, 1, options)).to.throw(
                      `_z.take(): WeakMap & WeakSet are not supported!`
                    )
                  })
                } else
                  describe(`${String(valueType)}`, async () => {
                    let result: any

                    before(async () => {
                      result = take(aSingleValue, 1, options)

                      // special cases
                      if (isPromise(aSingleValue)) {
                        result = await result
                        aSingleValue = await aSingleValue
                      }
                    })

                    it(`for valueType '${valueType as string}' returns expected = ${util.inspect(aSingleValue)}`, async () => {
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
            each(
              singleTypesAndPossibleValues,
              (singleValues: any /* @todo: any[] */, valueType) =>
                each(singleValues, (aSingleValue) => {
                  if (_.isWeakSet(aSingleValue) || _.isWeakMap(aSingleValue)) {
                    it(`throws on WeakSet or WeakMap`, () => {
                      expect(() => take(aSingleValue, 0, options)).to.throw(
                        `_z.take(): WeakMap & WeakSet are not supported!`
                      )
                    })
                  } else
                    describe(`${String(valueType)}`, async () => {
                      let result: any
                      let expected: any = NOTHING

                      before(() => (result = take(aSingleValue, 0, options)))

                      // special cases
                      it(`for valueType '${valueType as string}' returns NOTHING expected = ${String(expected)}`, async () => {
                        if (isPromise(aSingleValue)) result = await result

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
            each(
              singleTypesAndPossibleValues,
              (singleValues: any /* @todo: any[] */, valueType) =>
                each(singleValues, (aSingleValue) => {
                  const options = { filterSingles: true, singlesReject: null }

                  if (_.isWeakSet(aSingleValue) || _.isWeakMap(aSingleValue)) {
                    it(`throws on WeakSet or WeakMap`, () => {
                      expect(() => take(aSingleValue, 0, options)).to.throw(
                        `_z.take(): WeakMap & WeakSet are not supported!`
                      )
                    })
                  } else
                    describe(`${String(valueType)}`, async () => {
                      let result: any
                      let expected: any = null

                      before(async () => {
                        result = take(aSingleValue, 0, options)

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
                          result = take(aSingleValue, 0, options)
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
        each(singleTypesAndPossibleValues, (singleValues: any /* @todo: any[] */, type) => {
          each(singleValues, (value) =>
            it(`${String(type)}`, () => {
              expect(() => take(value, 999)).to.throw(
                `_z.project() as _z.take(): Can't filter or take with filterSingles: false over an _z.isSingleOrWeak value`
              )
            })
          )
        })
      })
    })
  })
})
