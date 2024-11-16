import { expect } from 'chai'
import * as _ from 'lodash'
import * as util from 'util'
import { falsiesNotFalse } from '../../../test-utils/test-data'
import { STOP } from '../../typezen/utils'
import { each } from '../each'
import {
  loop_each_map_clone_filter_take_SpecHandler,
  testFunctionOnly,
} from './loop-each-map-clone-filter-take.specHandler'
import { expectType, TypeEqual } from 'ts-expect'
import { isPromise } from '../../typezen/isPromise'
import { InsideValues } from '../../typezen/type-utils'
import { promise } from 'sinon'

describe('each()', () => {
  ;(testFunctionOnly === 'each' ? describe.only : describe)('each()', () =>
    loop_each_map_clone_filter_take_SpecHandler(
      'each',
      '_.each() on steroids: Iterates over all pairs keys/indexes & values of most "Many" values (object, Array, Set, Map or Iterator etc) by calling the callback (val, key, input) => void'
    )
  )
  const delayTime = 20
  const inputArray = [11, 22, 33, 44, 55, 'foo', 'bar']
  const expectedArrayStopped = [11, 22, 33] // stopValue.returnValue no used anywhere
  const STOP_INDEX = 2

  type TArrayType = typeof inputArray

  describe(`each() loop stoping`, () => {
    describe(`STOPs is callback returns false, STOP, STOP()`, () => {
      _.each([false, STOP, STOP('STOP value')], (stopValue) => {
        it(`"${util.inspect(stopValue)}" stops the iteration`, () => {
          const result: TArrayType = []
          const eachResult = each(inputArray, (item, idx, input) => {
            result.push(item)
            if (idx === STOP_INDEX) return stopValue

            return undefined
          })

          expect(result).to.deep.equal(expectedArrayStopped)
          expect(eachResult).to.equal(inputArray)
        })
      })
    })
    describe(`Not stopping if callback returns other falsies`, () => {
      _.each(falsiesNotFalse, (nonStopValue) => {
        it(`"${nonStopValue}" NOT stopping iteration`, () => {
          const result = []
          const eachResult = each(inputArray, (val, idx, input) => {
            // @ts-expect-error @todo: fix each() typings
            result.push(val)
            return nonStopValue
          })
          expect(result).to.deep.equal(inputArray)
          expect(eachResult).to.equal(inputArray)
        })
      })
    })
  })

  describe(`each() async, forced & auto including stopping`, () => {
    describe(`STOPs is callback returns false, STOP, STOP()`, () => {
      _.each([false, STOP, STOP('STOP value')], (stopValue) => {
        describe(`"${util.inspect(stopValue)}" stops the iteration`, () => {
          describe('ASYNC: returns promise & goes async', () => {
            it(`ASYNC: async: true, forced async on NON-real-async function (but returning promise)`, async () => {
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(
                inputArray,
                (item, idx, input) => {
                  expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                  expectType<TypeEqual<typeof idx, number>>(true)
                  expectType<TypeEqual<typeof input, TArrayType>>(true)

                  expect(input).to.equal(inputArray)

                  result.push(item)

                  return new Promise((resolve) =>
                    setTimeout(() => {
                      if (idx === STOP_INDEX) resolve(stopValue)
                      resolve(undefined)
                    }, delayTime)
                  )
                },
                { async: true }
              )

              expectType<TypeEqual<typeof eachResult, Promise<TArrayType>>>(true)
              expect(isPromise(eachResult)).to.be.true
              await eachResult

              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)

              expect(result).to.deep.equal(expectedArrayStopped)
              expect(await eachResult).to.equal(inputArray)
            })
            it(`ASYNC: async: true, forced async on NON-async function (NOT returning promise)`, async () => {
              const delayTime = 0 // because we don't return a promise at all
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(
                inputArray,
                (item, idx, input) => {
                  expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                  expectType<TypeEqual<typeof idx, number>>(true)
                  expectType<TypeEqual<typeof input, TArrayType>>(true)

                  expect(input).to.equal(inputArray)

                  result.push(item)

                  if (idx === STOP_INDEX) return stopValue
                  return undefined
                },
                { async: true }
              )

              expectType<TypeEqual<typeof eachResult, Promise<TArrayType>>>(true)
              expect(isPromise(eachResult)).to.be.true
              await eachResult

              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)

              expect(result).to.deep.equal(expectedArrayStopped)
              expect(await eachResult).to.equal(inputArray)
            })
            it(`ASYNC: async: number, forced async on NON-async function (returning promise)`, async () => {
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(
                inputArray,
                (item, idx, input) => {
                  expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                  expectType<TypeEqual<typeof idx, number>>(true)
                  expectType<TypeEqual<typeof input, TArrayType>>(true)

                  expect(input).to.equal(inputArray)

                  result.push(item)

                  return new Promise((resolve) =>
                    setTimeout(() => {
                      if (idx === STOP_INDEX) resolve(stopValue)
                      resolve(undefined)
                    }, delayTime)
                  )
                },
                { async: 1 }
              )

              expectType<TypeEqual<typeof eachResult, Promise<TArrayType>>>(true)
              expect(isPromise(eachResult)).to.be.true
              await eachResult

              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)

              expect(result).to.deep.equal(expectedArrayStopped)
              expect(await eachResult).to.equal(inputArray)
            })
            it(`ASYNC: async: undefined (Auto Async), cause of explicit async iteratee function (always returning promise)`, async () => {
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(inputArray, async (item, idx, input) => {
                expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                expectType<TypeEqual<typeof idx, number>>(true)
                expectType<TypeEqual<typeof input, TArrayType>>(true)

                expect(input).to.equal(inputArray)

                result.push(item)

                return new Promise((resolve) =>
                  setTimeout(() => {
                    if (idx === STOP_INDEX) resolve(stopValue)
                    resolve(undefined)
                  }, delayTime)
                )
              })

              expectType<TypeEqual<typeof eachResult, Promise<TArrayType>>>(true)
              expect(isPromise(eachResult)).to.be.true
              await eachResult

              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)

              expect(result).to.deep.equal(expectedArrayStopped)
              expect(await eachResult).to.equal(inputArray)
            })
            it(`ASYNC: options any, assuming async: undefined, so async mode is up to iteratee function being ASYNC`, async () => {
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(inputArray, async (item, idx, input) => {
                expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                expectType<TypeEqual<typeof idx, number>>(true)
                expectType<TypeEqual<typeof input, TArrayType>>(true)

                expect(input).to.equal(inputArray)

                result.push(item)

                return new Promise((resolve) =>
                  setTimeout(() => {
                    if (idx === STOP_INDEX) resolve(stopValue)
                    resolve(undefined)
                  }, delayTime)
                )
              }, { async: true } as any)

              expectType<TypeEqual<typeof eachResult, Promise<TArrayType>>>(true)
              expect(isPromise(eachResult)).to.be.true
              await eachResult

              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)

              expect(result).to.deep.equal(expectedArrayStopped)
              expect(await eachResult).to.equal(inputArray)
            })
            it(`ASYNC: wrong options (unknown), assuming async: undefined, so async mode is up to iteratee function being ASYNC`, async () => {
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(inputArray, async (item, idx, input) => {
                expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                expectType<TypeEqual<typeof idx, number>>(true)
                expectType<TypeEqual<typeof input, TArrayType>>(true)
                
                expect(input).to.equal(inputArray)
                
                result.push(item)
                
                return new Promise((resolve) =>
                  setTimeout(() => {
                    if (idx === STOP_INDEX) resolve(stopValue)
                    resolve(undefined)
                  }, delayTime)
                )
                // @ts-expect-error OK WrongUnknownOptions
              }, { async: true } as unknown)
              
              expectType<TypeEqual<typeof eachResult, Promise<TArrayType>>>(true)
              expect(isPromise(eachResult)).to.be.true
              await eachResult
              
              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)
              
              expect(result).to.deep.equal(expectedArrayStopped)
              expect(await eachResult).to.equal(inputArray)
            })
          })

          describe('SYNC case: DOES NOT return promise & normal sync cases', () => {
            const delayTime = 0 // cause of sync operation

            it(`SYNC: async: undefined (Auto Async), but we dont have a real async iteratee function (we ignore promise returned)`, async () => {
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(inputArray, (item, idx, input) => {
                expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                expectType<TypeEqual<typeof idx, number>>(true)
                expectType<TypeEqual<typeof input, TArrayType>>(true)

                expect(input).to.equal(inputArray)

                result.push(item)

                return new Promise((resolve) =>
                  setTimeout(() => {
                    if (idx === STOP_INDEX) resolve(stopValue)
                    resolve(undefined)
                  }, delayTime)
                ) as unknown // unknown because we want to ignore promise returned at compile time
              })

              expectType<TypeEqual<typeof eachResult, TArrayType>>(true)
              expect(isPromise(eachResult)).to.be.false

              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)

              expect(result).to.deep.equal(inputArray) // NOT expectedArrayStopped, cause STOP is ignored, as it's fired inside a non-awaited promise
              expect(eachResult).to.equal(inputArray)
            })
            it(`SYNC: async: false (forced SYNC), even if we do have an async iteratee function`, async () => {
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(
                inputArray,
                async (item, idx, input) => {
                  expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                  expectType<TypeEqual<typeof idx, number>>(true)
                  expectType<TypeEqual<typeof input, TArrayType>>(true)

                  expect(input).to.equal(inputArray)

                  result.push(item)

                  if (idx === STOP_INDEX) return stopValue
                  return undefined
                },
                { async: false }
              )

              expectType<TypeEqual<typeof eachResult, TArrayType>>(true)
              expect(isPromise(eachResult)).to.be.false

              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)

              expect(result).to.deep.equal(inputArray) // NOT expectedArrayStopped, cause STOP is ignored, as it's fired inside a non-awaited promise
              expect(eachResult).to.equal(inputArray)
            })
            it(`SYNC: options any, assuming async: undefined, so async mode is up to iteratee function being SYNC`, async () => {
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(
                inputArray,
                (item, idx, input) => {
                  expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                  expectType<TypeEqual<typeof idx, number>>(true)
                  expectType<TypeEqual<typeof input, TArrayType>>(true)
                  
                  expect(input).to.equal(inputArray)
                  
                  result.push(item)
                  
                  if (idx === STOP_INDEX) return stopValue
                  return undefined
                }, {} as any)
              
              expectType<TypeEqual<typeof eachResult, TArrayType>>(true)
              expect(isPromise(eachResult)).to.be.false
              
              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)
              
              expect(result).to.deep.equal(expectedArrayStopped)
              expect(eachResult).to.equal(inputArray)
            })
            it(`SYNC: wrong options (unknown), assuming async: undefined, so async mode is up to iteratee function being SYNC`, async () => {
              const result: TArrayType = []
              const timerStart = Date.now()
              const eachResult = each(
                inputArray,
                (item, idx, input) => {
                  expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
                  expectType<TypeEqual<typeof idx, number>>(true)
                  expectType<TypeEqual<typeof input, TArrayType>>(true)
                  
                  expect(input).to.equal(inputArray)
                  
                  result.push(item)
                  
                  if (idx === STOP_INDEX) return stopValue
                  return undefined
              // @ts-expect-error OK WrongUnknownOptions
            }, {} as unknown)
              // @ts-expect-error OKish, since we had to force it with @ts-expect-error. Returns Promise<TArrayType>
              expectType<TypeEqual<typeof eachResult, TArrayType>>(true)
              expectType<TypeEqual<typeof eachResult, Promise<TArrayType>>>(true) // @todo(000): this isn't ideal, but we had to force unknown options it with @ts-expect-error, so it's fine!
              expect(isPromise(eachResult)).to.be.false
              
              const timerEnd = Date.now()
              expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
              expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)
              
              expect(result).to.deep.equal(expectedArrayStopped)
              expect(eachResult).to.equal(inputArray)
            })
          })

          it(`TS FAIL CASE: discrepancy between TypeScript static evaluation & runtime: async: undefined (Auto Async),
                    - TS assumes we're returning a Promise<input> as each() result, because of implicit async iteratee function (it is returning a promise, TS being smart!)
                    - But at runtime, we have no way of knowing this is NOT marked an async function by TS compilation/execution!`, () => {
            const delayTime = 0 // cause at runtime we are sync!
            const result: TArrayType = []
            const timerStart = Date.now()
            const eachResult = each(inputArray, (item, idx, input) => {
              expectType<TypeEqual<typeof item, InsideValues<TArrayType>>>(true)
              expectType<TypeEqual<typeof idx, number>>(true)
              expectType<TypeEqual<typeof input, TArrayType>>(true)

              expect(input).to.equal(inputArray)

              result.push(item)

              return new Promise((resolve) =>
                setTimeout(() => {
                  if (idx === STOP_INDEX) resolve(stopValue)
                  resolve(undefined)
                }, delayTime)
              )
            })

            expectType<TypeEqual<typeof eachResult, Promise<TArrayType>>>(true)
            expect(isPromise(eachResult)).to.be.false // not a real-runtime async function
            // await eachResult

            const timerEnd = Date.now()
            expect(timerEnd - timerStart).to.be.greaterThanOrEqual(delayTime * STOP_INDEX)
            expect(timerEnd - timerStart).to.be.lessThan(delayTime * (STOP_INDEX + 1) + 10)

            expect(result).to.deep.equal(inputArray) // NOT expectedArrayStopped, cause at runtime we are sync, hence we dont respect STOPs!
            expect(eachResult).to.equal(inputArray)
          })
        })
      })
    })
  })
})
