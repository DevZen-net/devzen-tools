import { expect } from 'chai'
import * as _ from 'lodash'
import { delay, delaySecs } from '../../../test-utils/misc'
import {
  a_Array_of_Tvalues,
  commonStringValuePropTuples,
  filter_takeN,
  get_AsyncGenerator_of_Tvalues_withCommonProps,
} from '../../../test-utils/test-data'
import { loop } from '../loop'
import {
  loop_each_map_clone_filter_take_SpecHandler,
  testFunctionOnly,
} from './loop-each-map-clone-filter-take.specHandler'

describe('', () => {
  ;(testFunctionOnly === 'loop' ? describe.only : describe)('loop()', () =>
    loop_each_map_clone_filter_take_SpecHandler(
      'loop',
      'iterates over all pairs keys/indexes & values of an object, Array, string, Set, Map or Iterator (and everythign else) and returns an Iterator (Generator Function) of [val, key]'
    )
  )

  describe('loop() - remaining tests', () => {
    describe('AsyncGenerator', () => {
      _.each(
        [
          0,
          1,
          2,
          Math.round(
            Math.min(commonStringValuePropTuples.length, a_Array_of_Tvalues.length) / 2
          ),
          Math.min(commonStringValuePropTuples.length, a_Array_of_Tvalues.length) - 1,
          Math.min(commonStringValuePropTuples.length, a_Array_of_Tvalues.length),
          Math.min(commonStringValuePropTuples.length, a_Array_of_Tvalues.length) + 1,
        ],
        (TAKE_N) =>
          // @todo: also test with filter_takeN_returnValue(TAKE_N)
          // @todo: also test with sync generator, omit duration checks)

          it(`AsyncGenerator iterates on ${TAKE_N} props & ${TAKE_N} items, terminating early via filter_takeN(${TAKE_N})`, async () => {
            const asyncGenerator = get_AsyncGenerator_of_Tvalues_withCommonProps()
            const asyncFilteredGenerator = loop(asyncGenerator, {
              props: 'all',
              filter: filter_takeN(TAKE_N),
            })

            let idx = 0
            let totalCount = 0
            let isPropsDone = false

            let previousTime = Date.now()
            for await (const [val, key, itemsCount] of asyncFilteredGenerator) {
              const currentTime = Date.now()
              if (itemsCount === 1 && idx > 0) {
                // console.log('\n\nisPropsDone = true, idx === TAKE_N', count, TAKE_N)
                isPropsDone = true
                idx = 0
              }

              const delaySecsAfterFilter = isPropsDone ? delaySecs : 0

              // console.log('TEST', { idx, val, key})

              if (!isPropsDone) {
                expect(val).to.be.eql(commonStringValuePropTuples[idx][0])
                expect(key).to.be.eql(commonStringValuePropTuples[idx][1])
              } else {
                expect(val).to.be.eql(a_Array_of_Tvalues[idx])
              }

              expect(currentTime - previousTime).to.be.gte(delaySecsAfterFilter * 1000 - 2)
              expect(currentTime - previousTime).to.be.lt(delaySecsAfterFilter * 1000 + 20)

              previousTime = Date.now()
              idx++
              totalCount++
            }

            expect(totalCount).to.be.equal(
              Math.min(TAKE_N, commonStringValuePropTuples.length) +
                Math.min(TAKE_N, a_Array_of_Tvalues.length)
            )
          })
      )
    })
    describe(`Promise`, () => {
      it('iterates over a Promise', async () => {
        const resolvedValue = 'resolvedValue' as const
        let prom

        const iterator = loop((prom = delay(0, resolvedValue)), {
          loopSingles: true,
          map: (val) => val,
          filter: (val) => true,
        })

        for await (const [val, key] of iterator) {
          expect(val).to.be.eql(prom)
        }

        for (const [val, key] of iterator) {
          expect(val).to.be.eql(prom)
        }
      })
    })

    describe(`Function, loop with a map & filter`, () => {
      it('iterates over the function itself', async () => {
        let func
        const iterator = loop((func = () => 1), {
          loopSingles: true,
          map: (fn) => fn,
          filter: (fn) => true,
        })

        for (const [val, key] of iterator) {
          expect(val).to.be.eql(func)
          expect(key).to.be.eql(null)
        }
      })
    })
  })
})
