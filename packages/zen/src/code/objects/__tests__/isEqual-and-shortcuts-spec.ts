// Tests run in both 'Zen z.isEqual' & those supported in 'Lodash _.isEqual'
//  - All differences are marked with '### z.isEqual DIFFERENT: xxx' - these are potentially BREAKING CHANGES, if you plan to use Zen z.isEqual as a drop in replacement of Lodash _.isEqual
//  - All extra `z.isEqual` functionalities (compared to _.isEqual) are marked with '### z.isEqual EXTRA FUNCTIONALITY: xxx'

import * as c from 'ansi-colors'
import * as chai from 'chai'
/* eslint-disable prefer-rest-params,unicorn/new-for-builtins,import/no-extraneous-dependencies,no-return-assign,class-methods-use-this */
import * as _ from 'lodash'
import { beforeEach } from 'mocha'
import * as sinon from 'sinon'
import {
  a_Array_of_Tvalues,
  a_Array_ofKeys,
  a_Employee,
  a_Person,
  add_CommonProps,
  c3,
  expectedPropertyValues,
  get_arrayOfKeys,
  get_Map_of_TMapKeys_Tvalues,
  get_Map_of_TMapKeys_Tvalues_WithCommonProps,
  get_Set_of_Tvalues,
  get_Set_of_Tvalues_withCommonProps,
  inheritedDeepClone,
  inheritedShallowClone,
  object,
  objectDeepClone1,
  objectDeepClone2,
  objectShallowClone1,
  objectShallowClone2,
  objectWithProtoInheritedProps,
} from '../../../test-utils/test-data'
import * as z from '../../index'
import { NOTHING } from '../../index'
import { Any } from '../../typezen/type-utils'

const { expect } = chai

const oClone = _.cloneDeep(objectWithProtoInheritedProps)
const c3Clone = _.cloneDeep(c3)

const anUndefined: undefined = undefined // cause lint removes 'em

// @todo: SpecZen it!: Some of these tests are lecacy - they need an overhaul: describe/it structure, coverage, limited usage of

const lodashIsEqualSkipOptions = (val, other, ...rest) => {
  if (!_.isEmpty(rest)) {
    console.warn(
      c.yellow(
        'SKIPPING lodash test with callback / options (callback / options not supported in vanilla _.isEqual)'
      ),
      rest
    )
    // just reuse z.isEqual for this call!
    return z.isEqual(val, other, ...rest)
  }
  return _.isEqual(val, other)
}

_.each([z.isEqual, lodashIsEqualSkipOptions], (isEqual) => {
  const isZisEqual = isEqual === z.isEqual
  const isEqualWith: any = isZisEqual ? isEqual : _.isEqualWith
  const trueIfZen = isZisEqual ? 'true' : 'false'
  const falseIfZen = isZisEqual ? 'false' : 'true'

  describe(`Zen'es isEqual tests, both against Zen & Lodash (where supported): ${
    isZisEqual ? 'Zen z.isEqual' : 'Lodash _.isEqual'
  }`, () => {
    describe(`Argument validation - if args are not valid, it throw errors`, () => {
      it('options are used as 3rd & 5th arg', () =>
        // @ts-ignore
        expect(() => isEqual(1, 2, {}, undefined, {})).to.throw(
          /z.isEqual: you cannot pass options as 3rd and 5th argument at the same time/
        ))

      it('customizer is used as 3rd ard & in options', () =>
        // @ts-ignore
        expect(() => isEqual(1, 2, () => {}, undefined, { customizer: () => {} })).to.throw(
          /z.isEqual: you cannot pass customizer as 3rd argument and as options.customizer at the same time/
        ))
    })

    describe('should work with `arguments` objects', () => {
      const args1 = (function (...args) {
        return arguments
      })(1, 2, 3)
      const args2 = (function (...args) {
        return arguments
      })(1, 2, 3)
      const argsLess = (function (...args) {
        return arguments
      })(1, 2)
      const argsMore = (function (...args) {
        return arguments
      })(1, 2, 3, 666)

      it(`with same equal arguments: true`, () => {
        expect(isEqual(args1, args2)).to.be.true
        expect(isEqual(args2, args1)).to.be.true
      })
      it(`with different less arguments: false`, () => {
        expect(isEqual(args1, argsLess)).to.be.false
        expect(isEqual(argsLess, args1)).to.be.false
      })
      it(`with different more arguments: false`, () => {
        expect(isEqual(args1, argsMore)).to.be.false
        expect(isEqual(argsMore, args1)).to.be.false
      })

      describe(`with args look-alike object`, () => {
        const argsClone = { 0: 1, 1: 2, 2: 3 }
        it(`a special case, same as lodash (true)`, () => {
          expect(isEqual(args1, argsClone)).to.be.true
          expect(isEqual(argsClone, args1)).to.be.true
        })
      })
    })

    describe('circular references', () => {
      it(`objects that have circular references to root obj`, () => {
        const object1: any = { prop: 123 }
        const object2: any = { prop: 123 }
        object1.circularProp = object1
        object2.circularProp = object2

        expect(isEqual(object1, object2)).to.be.true
        // expect(_.isEqual(object1, object2)).to.be.true
      })

      it(`objects that have circular references to internal refs`, () => {
        const object1: any = { prop: 123, aRefProp: { some: 'prop' } }
        const object2: any = { prop: 123, aRefProp: { some: 'prop' } }
        object1.circularProp = object1
        object1.aRefProp.circularProp = object1.aRefProp

        object2.circularProp = object2
        object2.aRefProp.circularProp = object2.aRefProp

        expect(isEqual(object1, object2)).to.be.true
        // expect(_.isEqual(object1, object2)).to.be.true
      })

      it(`should work with arrays that have circular references to root obj`, () => {
        const array1: any[] = ['a', null, 'c']
        const array2: any[] = ['a', null, 'c']

        array1[1] = array1
        array2[1] = array2
        array1.push(array1)
        array2.push(array1)

        expect(isEqual(array1, array2)).to.be.true
        // expect(_.isEqual(array1, array2)).to.be.true
      })

      it(`should work with arrays that have circular references to internal ref also`, () => {
        const array1: any[] = ['a', null, 'c']
        const array2: any[] = ['a', null, 'c']

        array1[1] = array1
        array1[2] = array1
        array2[1] = array2
        array2[2] = array2

        expect(isEqual(array1, array2)).to.be.true
      })

      it(`should work with object that cross-side circular references`, () => {
        const object1: any = { prop: 123, aRefProp: { some: 'prop' } }
        const object2: any = { prop: 123, aRefProp: { some: 'prop' } }
        object1.circularProp = object2
        object1.aRefProp.circularProp = object2.aRefProp

        object2.circularProp = object1
        object2.aRefProp.circularProp = object1.aRefProp

        expect(isEqual(object1, object2)).to.be.true
      })
    })

    describe('should return `false` when comparing values with circular references to non-equal values', () => {
      it(`in arrays`, () => {
        const array1: any[] = ['a', null, 'c']
        const array2 = ['a', ['b'], 'c']

        array1[1] = array1
        expect(isEqual(array1, array2)).to.be.false
      })

      it(`in objects`, () => {
        const object1: any = { a: 1, b: null, c: 3 }
        const object2 = { a: 1, b: {}, c: 3 }

        object1.b = object1
        expect(isEqual(object1, object2)).to.be.false
      })
    })

    describe('customizer', () => {
      describe('customizer basics: ### z.isEqual EXTRA FUNCTIONALITY: customizer doesnt need _.isEqualWith, you can use same _.isEqual with an extra arg', () => {
        it('respects returning true', () => {
          expect(
            isEqualWith(111, '111', function (a, b) {
              return `${a}` === `${b}`
            })
          ).to.be.true
        })

        it('is undecided if customizer returns undefined', () => {
          const a = {
            a: 'a',
            b: 'b',
            c: 'EQUAL',
            d: 4,
          }
          const b = {
            a: 'a',
            b: 'b',
            c: {
              d: 'Not really equal, but assumed as so',
            },
            d: 4,
          }
          expect(
            isEqualWith(a, b, function (aV) {
              return
            })
          ).to.be.false
          expect(
            isEqualWith(a, b, function (aV) {
              return aV === 'EQUAL' ? true : undefined
            })
          ).to.be.true
        })

        it('should handle comparisons by it self, if `customizer` returns `undefined`', () => {
          expect(isEqualWith('a', 'a', () => {})).to.be.true
          expect(isEqualWith('a', 'b', () => {})).to.be.false
        })

        it('should treat all truthy as true', () => {
          const truthies = ['hey', {}, [], 1, true]
          _.each(truthies, (truthy) => expect(isEqualWith('a', 'b', () => truthy)).to.be.true)
        })

        it('should treat all falsey (except undefined) as false', () => {
          const falsies = ['', 0, -0, 0 / 0, NaN, null, false]
          _.each(falsies, (falsey) => expect(isEqualWith('a', 'a', () => falsey)).to.be.false)

          if (isZisEqual) expect(isEqualWith('a', 'a', () => NOTHING)).to.be.false
        })
      })

      if (isZisEqual) {
        describe(`customizer & ctx: ### z.isEqual EXTRA FUNCTIONALITY: customizer be bound to ctx`, () => {
          it('should pass the correct arguments (ctx & options) to `customizer`', () => {
            let args
            const ctx = {}

            expect(
              isEqual(
                'a',
                'b',
                function () {
                  args = Array.prototype.slice.call(arguments)
                  return this === ctx
                },
                ctx
              )
            ).to.be.true

            // @todo: fix test / use spies / stubs
            // expect(args).to.be.deep.equal(['a', 'b', isEqual_DefaultOptions])
          })

          // @todo: fix test / use spies / stubs
          it('should correct set the `this` binding', () => {
            expect(
              isEqual(
                'x',
                'y',
                function (a, b) {
                  return this[a] === this[b]
                },
                {
                  x: 13,
                  y: 13,
                }
              )
            ).to.be.true
          })
        })

        describe('customizer in `options.customizer`: called the right number of times, with the right arguments: ### z.isEqual EXTRA FUNCTIONALITY: customizer can be in options, with the same `isEqual()`, no need for `isEqualWith()`', () => {
          const ctx = {}

          const paths: Any[][] = []
          const customizer = function (
            valA: any,
            valB: any,
            opts: any,
            originalA: any,
            originalB: any
          ) {
            paths.push(_.clone(opts.path))
          }

          const customizerSpy = sinon.spy(customizer)

          const opts = {
            customizer: customizerSpy,
          }

          const a = {
            keyLevel1: {
              keyLevel2: [222],
            },
          }
          const b = {
            keyLevel1: {
              keyLevel2: [222],
            },
          }

          let isEqualResult: boolean
          before(() => {
            isEqualResult = isEqual(a, b, opts, ctx)
          })

          it('should return true', () => expect(isEqualResult).to.be.true)

          it('should have called the customizer 4 times in total', () => {
            expect(customizerSpy.callCount).to.equal(4)
          })

          describe('first call', () => {
            let spyCall: sinon.SinonSpyCall
            beforeEach(() => (spyCall = customizerSpy.getCall(0)))

            it('should pass an options object, not strict equal top original object (no mutation of options), ', () => {
              expect(spyCall.calledWith(a, b, opts, a, b)).to.be.false
            })

            it('should pass an options object, matching the original object', () =>
              expect(spyCall.calledWith(a, b, sinon.match(opts), a, b)).to.be.true)

            it('ctx should be the `this` binding', () =>
              expect(spyCall.calledOn(ctx)).to.be.true)
          })

          describe('second call', () => {
            let spyCall: sinon.SinonSpyCall
            beforeEach(() => (spyCall = customizerSpy.getCall(1)))

            it('should pass an options object, matching the original object', () =>
              expect(
                spyCall.calledWith(
                  sinon.match({
                    keyLevel2: [222],
                  }),
                  sinon.match({
                    keyLevel2: [222],
                  }),
                  sinon.match(opts),
                  a,
                  b
                )
              ).to.be.true)

            it('should call with correct path', () =>
              expect(paths[1]).to.be.deep.equal(['keyLevel1']))

            it('ctx should be the `this` binding', () =>
              expect(spyCall.calledOn(ctx)).to.be.true)
          })

          describe('third call', () => {
            let spyCall: sinon.SinonSpyCall
            beforeEach(() => (spyCall = customizerSpy.getCall(2)))

            it('should pass an options object, matching the original object', () =>
              expect(
                spyCall.calledWith(
                  sinon.match([222]),
                  sinon.match([222]),
                  sinon.match(opts),
                  a,
                  b
                )
              ).to.be.true)

            it('should call with correct path', () =>
              expect(paths[2]).to.be.deep.equal(['keyLevel1', 'keyLevel2']))

            it('ctx should be the `this` binding', () =>
              expect(spyCall.calledOn(ctx)).to.be.true)
          })

          describe('fourth call', () => {
            let spyCall: sinon.SinonSpyCall
            beforeEach(() => (spyCall = customizerSpy.getCall(3)))

            it('should pass an options object, matching the original object', () =>
              expect(spyCall.calledWith(222, 222, sinon.match(opts), a, b)).to.be.true)

            it('should call with correct path', () =>
              expect(paths[3]).to.be.deep.equal(['keyLevel1', 'keyLevel2', 0]))

            it('ctx should be the `this` binding', () =>
              expect(spyCall.calledOn(ctx)).to.be.true)
          })
        })
      }
    })

    describe('Equality checks of different types:', () => {
      describe('primitives:', () => {
        it('one undefined', () => {
          expect(isEqual(undefined, objectWithProtoInheritedProps)).to.be.false
          expect(isEqual(objectWithProtoInheritedProps, anUndefined)).to.be.false
        })
        it('one null', () => {
          expect(isEqual(null, objectWithProtoInheritedProps)).to.be.false
          expect(isEqual(objectWithProtoInheritedProps, null)).to.be.false
        })
        it('both undefined/null', () => {
          expect(isEqual(anUndefined, anUndefined)).to.be.true
          expect(isEqual([undefined], [undefined])).to.be.true
          expect(isEqual(null, null)).to.be.true
          expect(isEqual([null], [null])).to.be.true
        })
        it('one undefined, other null', () => {
          expect(isEqual(null, anUndefined)).to.be.false
          expect(isEqual(anUndefined, null)).to.be.false
        })
        it('Number', () => {
          expect(isEqual(111, 111)).to.be.true
          expect(isEqual(111.002, 111.002)).to.be.true
          expect(isEqual(112, 111)).to.be.false
          expect(isEqual(111.002, 111.003)).to.be.false
        })
        it('BigInt', () => {
          expect(isEqual(BigInt(111), BigInt(111))).to.be.true
          expect(isEqual(112n, BigInt(112))).to.be.true

          expect(isEqual(BigInt(112), BigInt(111))).to.be.false
          expect(isEqual(BigInt(112), 112)).to.be.false
        })
        describe('string', () => {
          it('as primitive ""', () => {
            expect(isEqual('AAA 111', 'AAA 111')).to.be.true
            expect(isEqual('AAA 112', 'AAA 111')).to.be.false
          })
        })
        it('Date', () => {
          expect(isEqual(new Date('2012/12/12'), new Date('2012/12/12'))).to.be.true
          expect(isEqual(new Date('2012/12/13'), new Date('2012/12/12'))).to.be.false
        })
        it('Promise', () => {
          const prom1 = Promise.resolve(111)
          const prom2 = Promise.resolve(111)

          expect(isEqual(prom1, prom2)).to.be.false
        })
        it('RegExp', () => {
          expect(isEqual(/abc/, /abc/)).to.be.true
          expect(isEqual(new RegExp(/abc/), /abc/)).to.be.true
          expect(isEqual(new RegExp('abc'), /abc/)).to.be.true
          expect(isEqual(/abcd/, /abc/)).to.be.false
        })
        describe('Boolean', () => {
          it('as primitive', () => {
            expect(isEqual(true, true)).to.be.true
            expect(isEqual(true, false)).to.be.false
          })
        })
        describe('Mixed primitives', () => {
          it('boolean truthys', () => {
            expect(isEqual(true, 1)).to.be.false
            expect(isEqual(true, 'a string')).to.be.false
          })
          it('boolean falsys', () => {
            expect(isEqual(false, 0)).to.be.false
            expect(isEqual(false, '')).to.be.false
          })
        })
      })

      describe('Boxed Primitives & Unboxing: ### z.isEqual DIFFERENT: lodash _.isEqual does unboxing by default, z.isEqual requires `unbox: true`', () => {
        describe('Boolean', () => {
          describe('Without unboxing', () => {
            it(`true / new Boolean(true)`, () => {
              expect(isEqual(new Boolean(true), true)).to.be[falseIfZen]
              expect(isEqual(true, new Boolean(true))).to.be[falseIfZen]
            })

            it(`false / new Boolean(false)`, () => {
              expect(isEqual(new Boolean(false), false)).to.be[falseIfZen]
              expect(isEqual(false, new Boolean(false))).to.be[falseIfZen]
            })
          })
          if (isZisEqual)
            describe('With unboxing - Zen z.isEqual only', () => {
              it(`true / new Boolean(true)`, () => {
                expect(isEqual(new Boolean(true), true, { unbox: true })).to.be.true
                expect(isEqual(true, new Boolean(true), { unbox: true })).to.be.true
              })
              it(`false / new Boolean(false)`, () => {
                expect(isEqual(new Boolean(false), false, { unbox: true })).to.be.true
                expect(isEqual(false, new Boolean(false), { unbox: true })).to.be.true
              })
            })
        })

        describe('Number', () => {
          describe('Without unboxing', () => {
            it(`1 / new Number(1)`, () => {
              expect(isEqual(new Number(1), 1)).to.be[falseIfZen]
              expect(isEqual(1, new Number(1))).to.be[falseIfZen]
            })

            it(`0 / new Number(0)`, () => {
              expect(isEqual(new Number(0), 0)).to.be[falseIfZen]
              expect(isEqual(0, new Number(0))).to.be[falseIfZen]
            })
          })
          if (isZisEqual)
            describe('With unboxing - Zen z.isEqual only', () => {
              it(`1 / new Number(1)`, () => {
                expect(isEqual(new Number(1), 1, { unbox: true })).to.be.true
                expect(isEqual(1, new Number(1), { unbox: true })).to.be.true
              })

              it(`0 / new Number(0)`, () => {
                expect(isEqual(new Number(0), 0, { unbox: true })).to.be.true
                expect(isEqual(0, new Number(0), { unbox: true })).to.be.true
              })
            })
        })

        describe('String', () => {
          describe('Without unboxing', () => {
            it(`"a" / new String("a")`, () => {
              expect(isEqual(new String('a'), 'a')).to.be[falseIfZen]
              expect(isEqual('a', new String('a'))).to.be[falseIfZen]
            })

            it(`"" / new String("")`, () => {
              expect(isEqual(new String(''), '')).to.be[falseIfZen]
              expect(isEqual('', new String(''))).to.be[falseIfZen]
            })
          })
          if (isZisEqual)
            describe('With unboxing - Zen z.isEqual only', () => {
              it(`"a" / new String("a")`, () => {
                expect(isEqual(new String('a'), 'a', { unbox: true })).to.be.true
                expect(isEqual('a', new String('a'), { unbox: true })).to.be.true
              })

              it(`"" / new String("")`, () => {
                expect(isEqual(new String(''), '', { unbox: true })).to.be.true
                expect(isEqual('', new String(''), { unbox: true })).to.be.true
              })
            })
        })
      })

      describe('Objects', () => {
        it('empty objects & arrays', () => {
          expect(isEqual([], [])).to.be.true
          expect(isEqual({}, {})).to.be.true
        })
        it("empty different `_.isObject`s aren't equal", () => {
          expect(isEqual({}, [])).to.be.false
          expect(isEqual([], {})).to.be.false
          expect(isEqual({}, () => {})).to.be.false
          expect(isEqual([], () => {})).to.be.false
        })
        it('present keys are important, even if undefined', () => {
          expect(
            _.isEqual(
              {
                a: 1,
                b: undefined,
              },
              {
                a: 1,
              }
            )
          ).to.be.false
          expect(
            _.isEqual(
              {
                a: 1,
              },
              {
                a: 1,
                b: undefined,
              }
            )
          ).to.be.false
        })

        describe(`pojsos VS instance of same data`, () => {
          class Foo {
            constructor(public aProp: number) {}
          }

          const a = new Foo(1)
          const b = { aProp: 1 }

          it('are NOT equal - same as lodash: search "should compare object instances" in lodash tests', () => {
            expect(isEqual(a, b)).to.be.false
            expect(z.isIqual(b, a)).to.be.false
          })

          if (isZisEqual)
            it('they are equal with `options.realObjectAsPojso: true - ### z.isEqual EXTRA FUNCTIONALITY: options.realObjectAsPojso`', () => {
              // @todo(213): what about different classes, but same values? What about inheritance?

              expect(isEqual(a, b, { realObjectAsPojso: true })).to.be.true
              expect(z.isIqual(b, a, { realObjectAsPojso: true })).to.be.true
            })
        })

        describe('TallKeysOptions Options: objects with symbol keys', () => {
          const a = {
            a: 1,
            [Symbol.for('a')]: 1,
          }
          const aClone = {
            a: 1,
            [Symbol.for('a')]: 1,
          }

          const notACloneCauseOfSymbol = {
            a: 1,
            [Symbol.for('BBB')]: 1,
          }

          describe(`equal clones, are always equal`, () => {
            it('clones are equal, with symbol: false (default)', () =>
              expect(isEqual(a, aClone)).to.be.true)

            it('clones are equal, with symbol: true', () =>
              expect(isEqual(a, aClone, { symbol: true })).to.be.true)
          })

          describe(`clones differing on Symbols`, () => {
            it('notACloneCauseOfSymbol are equal, with symbol: false (default): ### z.isEqual DIFFERENT false if symbol properties are different, only with `options.symbol: true`', () =>
              expect(isEqual(a, notACloneCauseOfSymbol)).to.be[trueIfZen])

            if (isZisEqual)
              it('notACloneCauseOfSymbol are NOT equal, if we have `symbol: true` - Zen z.isEqual only', () =>
                expect(
                  isEqual(a, notACloneCauseOfSymbol, {
                    symbol: true,
                  })
                ).to.be.false)
          })
        })
      })

      describe('Set ', () => {
        // @todo: test with `like: true`
        it('empty Sets', () => {
          expect(isEqual(new Set(), new Set())).to.be.true
        })

        describe('Sets with primitive items', () => {
          it('Sets with same primitive items', () => {
            expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).to.be.true
          })

          it('Sets with different primitive items', () => {
            expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 666]))).to.be.false
          })

          it('Sets with primitive items & like: true', () => {
            const values1 = [1, 2]
            const values2 = [1, 2, 888, 999]
            expect(isEqual(values1, values2, { like: true })).to.be.true
            expect(isEqual(new Set(values1), new Set(values2), { like: true })).to.be.true
          })
        })

        describe('Sets with options.exactKeys: match exact key refs OR clones', () => {
          const setCloneKeys1 = new Set([1, { b: 2 }, { c: true }, [true, { d: 4 }]])
          const setCloneKeys2 = new Set([1, { b: 2 }, { c: true }, [true, { d: 4 }]].reverse())

          const key1 = { b: 2 }
          const key2 = [true, 3]
          const key3 = { c: true }
          const setRefKeys1 = new Set([1, key1, key2, key3])
          const setRefKeys2 = new Set([key1, key2, 1, key3])

          describe('options.exactKeys: false (default)', () => {
            it('Clone Keys match - Sets are equal', () => {
              // const path = []
              // const result = isEqual(set1, set2, { path })
              // console.log('path', path)
              expect(isEqual(setCloneKeys1, setCloneKeys2)).to.be.true
            })

            it('ref keys match - Sets are equal', () => {
              expect(isEqual(setRefKeys1, setRefKeys2)).to.be.true
            })

            it('Sets with same deep equal items - Sets are equal', () => {
              expect(isEqual(get_Set_of_Tvalues(), get_Set_of_Tvalues())).to.be.true
            })

            describe('isEqualWith', () => {
              it('Clone keys with z.isEqual - Sets are equal', () => {
                expect(isEqualWith(setCloneKeys1, setCloneKeys2, (a, b) => z.isEqual(a, b))).to
                  .be.true
              })

              it('Clone keys with strict equals - Sets are NOT equal', () => {
                expect(isEqualWith(setCloneKeys1, setCloneKeys2, (a, b) => a === b)).to.be.false
              })
            })
          })

          if (isZisEqual)
            describe('with exactKeys: true', () => {
              it('Sets with same deep equal items, are not equal', () => {
                expect(isEqual(setCloneKeys1, setCloneKeys2, { exactKeys: true })).to.be.false
              })
              it('ref keys, Sets are equal', () =>
                expect(isEqual(setRefKeys1, setRefKeys2, { exactKeys: true })).to.be.true)

              it('Sets with different refs are not equal', () => {
                expect(isEqual(get_Set_of_Tvalues(), get_Set_of_Tvalues(), { exactKeys: true }))
                  .to.be.false
              })
            })
        })

        describe(`Sets with extra props`, () => {
          describe(`with "props: 'all'", props matter`, () => {
            let aSet
            let bSet
            beforeEach(() => {
              aSet = get_Set_of_Tvalues_withCommonProps()
              bSet = get_Set_of_Tvalues_withCommonProps()
            })

            it('props are ignored by default', () => {
              aSet['someExtraProp'] = 42
              bSet['someExtraProp'] = 666
              expect(isEqual(aSet, bSet)).to.be.true
            })

            it('with allProps, they are different', () => {
              aSet['someExtraProp'] = 42
              bSet['someExtraProp'] = 666
              expect(isEqual(aSet, bSet, { props: 'all' })).to.be.false
            })

            it(`with props: 'all', they are equal, if all props are equal also`, () => {
              expect(isEqual(aSet, bSet, { props: 'all' })).to.be.true
            })
          })

          describe(`with props: true, only props matter - ignores entries`, () => {
            it(`with props: true, they are not equal, even with same Set keys`, () => {
              const aSet = get_Set_of_Tvalues_withCommonProps()
              aSet['someExtraProp'] = 42

              const bSet = get_Set_of_Tvalues_withCommonProps()
              bSet['someExtraProp'] = 666

              expect(isEqual(aSet, bSet, { props: true })).to.be.false
            })

            it(`with props: true, they are equal if props are equal, it ignores different entries`, () => {
              const aSet = add_CommonProps(new Set(['a', 'b', 'c']))
              const bSet = add_CommonProps(new Set([1, 2, 3]))

              expect(isEqual(aSet, bSet, { props: true })).to.be.true
            })
          })
        })
      })

      // @todo(743): test exactKeys & exactValues properly
      // # Map
      describe('Map', () => {
        it('empty Maps', () => {
          expect(isEqual(new Map(), new Map())).to.be.true
        })

        describe('Maps with primitive items', () => {
          it('same primitive items', () => {
            expect(
              isEqual(
                new Map<any, any>([
                  ['a', 1],
                  ['b', 2],
                  ['c', 3],
                ]),
                new Map<any, any>([
                  ['a', 1],
                  ['b', 2],
                  ['c', 3],
                ])
              )
            ).to.be.true
          })

          it('different primitive items', () => {
            expect(
              isEqual(
                new Map<any, any>([
                  ['a', 1],
                  ['b', 2],
                  ['c', 3],
                ]),
                new Map<any, any>([
                  ['a', 1],
                  ['b', 2],
                  ['c', 666],
                ])
              )
            ).to.be.false
          })

          it('different order of same primitive values', () => {
            expect(
              isEqual(
                new Map<any, any>([
                  ['a', 1],
                  ['b', 2],
                  ['c', 3],
                ]),
                new Map<any, any>([
                  ['a', 3],
                  ['b', 1],
                  ['c', 2],
                ])
              )
            ).to.be.false
          })
        })

        it('Maps are equal with ref items & primitive items', () => {
          expect(
            isEqual(
              new Map<any, any>([
                ['aNumberVal', 1],
                ['aStringVal', 'A string Tvalue'],
                ['anObjectVal', { b: 2 }],
                ['anArrayVal', [{ c: 'some val' }]],
              ]),
              new Map<any, any>([
                ['aNumberVal', 1],
                ['aStringVal', 'A string Tvalue'],
                ['anObjectVal', { b: 2 }],
                ['anArrayVal', [{ c: 'some val' }]],
              ])
            )
          ).to.be.true
        })

        it('Maps are not equal, a deep difference', () => {
          expect(
            isEqual(
              new Map<any, any>([['anArrayVal', [{ c: 'some val' }]]]),
              new Map<any, any>([['anArrayVal', [{ c: '666 BAD VALUE' }]]])
            )
          ).to.be.false
        })

        it('Maps with extra / missing entry', () => {
          const mapWithExtraKey = get_Map_of_TMapKeys_Tvalues()
          // @ts-expect-error OK
          mapWithExtraKey.set('bad missing key', 666)

          expect(isEqual(get_Map_of_TMapKeys_Tvalues(), mapWithExtraKey)).to.be.false
          expect(isEqual(mapWithExtraKey, get_Map_of_TMapKeys_Tvalues())).to.be.false
        })

        it('Maps with different entries', () => {
          const map1 = get_Map_of_TMapKeys_Tvalues()
          // @ts-expect-error OK
          map1.set('extraKey', 42)

          const map2 = get_Map_of_TMapKeys_Tvalues()
          // @ts-expect-error OK
          map2.set('extraKey', 666)

          expect(isEqual(map1, map2)).to.be.false
          expect(isEqual(map2, map1)).to.be.false
        })

        describe(`'Maps with options.exactKeys & options.exactValues: match exact key/value refs OR clones`, () => {
          // with clone keys & values
          const mapCloneKeys1 = new Map([
            [{ a: 1 }, { val: 'one' }],
            [{ a: 1 }, { val: 'two' }],
            [{ b: 1 }, { val: 'three' }],
          ])
          const mapCloneKeys2 = new Map([
            [{ a: 1 }, { val: 'two' }], // reverse order
            [{ a: 1 }, { val: 'one' }],
            [{ b: 1 }, { val: 'three' }],
          ])

          // with ref keys
          const ref1 = Symbol('key1')
          const ref2 = { refKey: true }
          const ref3 = [{ refKey2: true }]

          const mapRefKeys1 = new Map<any, any>([
            [ref1, { val: 'val_1' }],
            [ref2, { val: 'val_2' }],
            [ref3, { val: 'val_3' }],
          ])
          const mapRefKeys2 = new Map<any, any>([
            [ref3, { val: 'val_3' }], // different order
            [ref2, { val: 'val_2' }],
            [ref1, { val: 'val_1' }],
          ])

          const mapCloneKeysRefValues1 = new Map<any, any>([
            [{ key1: 1 }, ref1],
            [{ key2: '2' }, ref2],
            [{ key3: 3n }, ref3],
          ])
          const mapCloneKeysRefValues2 = new Map<any, any>([
            [{ key1: 1 }, ref1],
            [{ key2: '2' }, ref2],
            [{ key3: 3n }, ref3],
          ])

          const mapRefKeysAndValues1 = new Map<any, any>([
            [ref1, a_Person],
            [ref2, a_Employee],
            [ref3, a_Array_of_Tvalues],
          ])
          const mapRefKeysAndValues2 = new Map<any, any>([
            [ref1, a_Person],
            [ref2, a_Employee],
            [ref3, a_Array_of_Tvalues],
          ])

          // with nested objects, maps, sets
          const aMapWithNestedObjMapSet1: Map<any, any> = get_Map_of_TMapKeys_Tvalues()
          aMapWithNestedObjMapSet1.set('aStringKey', a_Person)
          aMapWithNestedObjMapSet1.set('manyPersons', [
            a_Person,
            { anEmployee: a_Employee },
            { a: [1, 2, 3] },
            new Set([1, 2, 3, { a: 1 }, get_Map_of_TMapKeys_Tvalues()]),
          ])
          aMapWithNestedObjMapSet1.set({ object: 'as key' }, { an: 'object as value' })

          const aMapWithNestedObjMapSet2: Map<any, any> = get_Map_of_TMapKeys_Tvalues()
          aMapWithNestedObjMapSet2.set('aStringKey', a_Person)
          aMapWithNestedObjMapSet2.set({ object: 'as key' }, { an: 'object as value' })
          aMapWithNestedObjMapSet2.set('manyPersons', [
            a_Person,
            { anEmployee: a_Employee },
            { a: [1, 2, 3] },
            new Set([1, 2, 3, { a: 1 }, get_Map_of_TMapKeys_Tvalues()]),
          ])

          describe(`options.exactKeys: false & exactValues: false (default)`, () => {
            it('Clone Keys match - Maps are equal', () => {
              expect(isEqual(mapCloneKeys1, mapCloneKeys2)).to.be.true
            })

            it('ref keys match - Maps are equal', () => {
              expect(isEqual(mapRefKeys1, mapRefKeys2)).to.be.true
            })

            it('ref values match - Maps are equal', () => {
              expect(isEqual(mapCloneKeysRefValues1, mapCloneKeysRefValues1)).to.be.true
            })

            it('Maps with same deep equal items - Maps are equal', () => {
              expect(isEqual(get_Map_of_TMapKeys_Tvalues(), get_Map_of_TMapKeys_Tvalues())).to
                .be.true
            })

            it('Nested Maps & objects are equal', () => {
              expect(isEqual({ a: aMapWithNestedObjMapSet1 }, { a: aMapWithNestedObjMapSet2 }))
                .to.be.true
            })

            describe('isEqualWith', () => {
              it('Clone keys with z.isEqual - Maps are equal', () => {
                expect(isEqualWith(mapCloneKeys1, mapCloneKeys2, (a, b) => z.isEqual(a, b))).to
                  .be.true
              })

              it('Clone keys with strict equals - Maps are NOT equal', () => {
                expect(isEqualWith(mapCloneKeys1, mapCloneKeys2, (a, b) => a === b)).to.be.false
              })

              it('Maps with same deep equal items z.isEqual - Maps are equal', () =>
                expect(
                  isEqualWith(
                    get_Map_of_TMapKeys_Tvalues(),
                    get_Map_of_TMapKeys_Tvalues(),
                    (a, b) => z.isEqual(a, b)
                  )
                ).to.be.true)

              it('Maps with same deep equal items with strict equal - Maps are NOT equal', () =>
                expect(
                  isEqualWith(
                    get_Map_of_TMapKeys_Tvalues(),
                    get_Map_of_TMapKeys_Tvalues(),
                    (a, b) => a === b
                  )
                ).to.be.false)

              it('Nested Maps & objects with z.isEqual are equal', () => {
                expect(
                  isEqualWith(
                    { a: aMapWithNestedObjMapSet1 },
                    { a: aMapWithNestedObjMapSet2 },
                    (a, b) => z.isEqual(a, b)
                  )
                ).to.be.true
              })

              it('Nested Maps & objects with strict equal are NOT equal', () => {
                expect(
                  isEqualWith(
                    { a: aMapWithNestedObjMapSet1 },
                    { a: aMapWithNestedObjMapSet2 },
                    (a, b) => a === b
                  )
                ).to.be.false
              })
            })
          })

          if (isZisEqual) {
            describe(`options.exactKeys: true`, () => {
              it('Clone keys, hence NOT equal if we opt for exactKeys', () => {
                expect(isEqual(mapCloneKeys1, mapCloneKeys2, { exactKeys: true })).to.be.false
              })

              it('ref keys, Maps are equal', () =>
                expect(isEqual(mapRefKeys1, mapRefKeys2, { exactKeys: true })).to.be.true)

              it('clone keys, ref values, Maps are NOT equal', () =>
                expect(
                  isEqual(mapCloneKeysRefValues1, mapCloneKeysRefValues2, { exactKeys: true })
                ).to.be.false) // ??

              it('Maps with different ref keys are NOT equal', () => {
                expect(
                  isEqual(
                    get_Map_of_TMapKeys_Tvalues(),
                    get_Map_of_TMapKeys_Tvalues(get_arrayOfKeys()),
                    {
                      exactKeys: true,
                    }
                  )
                ).to.be.false
              })

              it('Nested Maps & objects are NOT equal', () => {
                expect(
                  isEqual(aMapWithNestedObjMapSet1, aMapWithNestedObjMapSet2, {
                    exactKeys: true,
                  })
                ).to.be.false
              })
            })

            describe(`options.exactValues: true`, () => {
              it('Clone keys, hence NOT equal if we opt for exactKeys', () => {
                expect(isEqual(mapCloneKeys1, mapCloneKeys2, { exactValues: true })).to.be.false
              })

              it('ref keys, Maps are equal', () =>
                expect(isEqual(mapRefKeys1, mapRefKeys2, { exactValues: true })).to.be.false)

              it('clone keys, ref values, Maps are NOT equal', () =>
                expect(
                  isEqual(mapCloneKeysRefValues1, mapCloneKeysRefValues2, { exactValues: true })
                ).to.be.true)

              it('Maps with different ref values are NOT equal', () => {
                expect(
                  isEqual(get_Map_of_TMapKeys_Tvalues(), get_Map_of_TMapKeys_Tvalues(), {
                    exactValues: true,
                  })
                ).to.be.false
              })

              it('Nested Maps & objects are NOT equal', () => {
                expect(
                  isEqual(aMapWithNestedObjMapSet1, aMapWithNestedObjMapSet2, {
                    exactValues: true,
                  })
                ).to.be.false
              })
            })
            describe(`options.exactValues: true & options.exactKeys: true`, () => {
              it('ref keys & values, Maps are equal', () => {
                expect(
                  isEqual(mapRefKeysAndValues1, mapRefKeysAndValues2, {
                    exactValues: true,
                    exactKeys: true,
                  })
                ).to.be.true
              })

              it('keys & values are same refs - Maps are equal', () => {
                expect(
                  isEqual(
                    get_Map_of_TMapKeys_Tvalues_WithCommonProps(
                      a_Array_ofKeys,
                      a_Array_of_Tvalues
                    ),
                    get_Map_of_TMapKeys_Tvalues_WithCommonProps(
                      a_Array_ofKeys,
                      a_Array_of_Tvalues
                    ),
                    {
                      exactValues: true,
                      exactKeys: true,
                      props: 'all',
                    }
                  )
                ).to.be.true
              })
            })
          }
        })

        describe(`Maps with extra props`, () => {
          describe(`with "props: 'all'", props matter`, () => {
            const aMap = get_Map_of_TMapKeys_Tvalues()
            aMap['someExtraProp'] = 42

            const bMap = get_Map_of_TMapKeys_Tvalues()
            bMap['someExtraProp'] = 666

            it('props are ignored by default', () => {
              expect(isEqual(aMap, bMap)).to.be.true
            })

            it('with allProps, they are different', () => {
              bMap['someExtraProp'] = 666
              expect(isEqual(aMap, bMap, { props: 'all' })).to.be.false
            })

            it('with allProps, they are are same if all props are equal also', () => {
              bMap['someExtraProp'] = aMap['someExtraProp']
              expect(isEqual(aMap, bMap, { props: 'all' })).to.be.true
            })
          })

          describe(`with props: "only", only props matter - ignores entries`, () => {
            const aMap = new Map([
              ['a', 1],
              ['b', 2],
              ['c', 3],
            ])
            aMap['someExtraProp'] = 42

            const bMap = new Map([
              ['foo', 1],
              ['bar', 2],
              ['baz', 3],
            ])
            bMap['someExtraProp'] = 666

            it(`with props: "only", they are different`, () => {
              bMap['someExtraProp'] = 666
              expect(isEqual(aMap, bMap, { props: true })).to.be.false
            })

            it(`with props: "only", it ignores entries, they are are same if all props are equal`, () => {
              bMap['someExtraProp'] = aMap['someExtraProp']
              expect(isEqual(aMap, bMap, { props: true })).to.be.true
            })
          })
        })
      })

      describe('Error', () => {
        describe('same types', () => {
          it('same message: true', () => {
            expect(isEqual(new Error('a'), new Error('a'))).to.be.true
          })
          it('different message: true', () => {
            expect(isEqual(new Error('a'), new Error('b'))).to.be.false
          })
        })
        describe('different types - always false', () => {
          it('different message: false', () => {
            expect(isEqual(new TypeError('a'), new Error('a'))).to.be.false
          })
          it('different message: false', () => {
            expect(isEqual(new Error('a'), new Error('b'))).to.be.false
          })
        })
      })

      describe('WeakSet - cannot be equal, since the items can not be iterated', () => {
        it('empty WeakSets', () => {
          expect(isEqual(new WeakSet(), new WeakSet())).to.be.false
        })
        it('WeakSets with same items', () => {
          const a = {}
          const b = {}
          expect(isEqual(new WeakSet([a, b]), new WeakSet([a, b]))).to.be.false
        })
      })

      describe('WeakMap - cannot be equal, since the items can not be iterated', () => {
        it('empty WeakMaps', () => {
          expect(isEqual(new WeakMap(), new WeakMap())).to.be.false
        })
        it('WeakMaps with same items', () => {
          const a = {}
          const b = {}
          expect(
            isEqual(
              new WeakMap([
                [a, 1],
                [b, 2],
              ]),
              new WeakMap([
                [a, 1],
                [b, 2],
              ])
            )
          ).to.be.false
        })
      })

      describe(`Iterators CAN'T BE CHECKED by isEqual cause they can't be iterated/restarted`, () => {
        describe(`Map Iterators`, () => {
          let aMap, bMap
          before(() => {
            aMap = get_Map_of_TMapKeys_Tvalues()
            bMap = get_Map_of_TMapKeys_Tvalues()
          })
          it(`Map.entries()`, () => expect(isEqual(aMap.entries(), bMap.entries())).to.be.false)
          it(`Map.keys()`, () => expect(isEqual(aMap.keys(), bMap.keys())).to.be.false)
          it(`Map.values()`, () => expect(isEqual(aMap.values(), bMap.values())).to.be.false)
        })
        describe(`Set Iterators`, () => {
          let aSet, bSet
          before(() => {
            aSet = get_Set_of_Tvalues()
            bSet = get_Set_of_Tvalues()
          })
          it(`Set.entries()`, () => expect(isEqual(aSet.entries(), bSet.entries())).to.be.false)
          it(`Set.keys()`, () => expect(isEqual(aSet.keys(), bSet.keys())).to.be.false)
          it(`Set.values()`, () => expect(isEqual(aSet.values(), bSet.values())).to.be.false)
        })
      })

      describe('Symbol', () => {
        it('same Symbols, are equal', () => {
          expect(isEqual(Symbol.for('a'), Symbol.for('a'))).to.be.true
        })
        it('different, Clone Symbols NOT equal - it defeats their purpose otherwise', () => {
          expect(isEqual(Symbol('aa'), Symbol('aa'))).to.be.false
        })
      })

      describe('TypedArray', () => {
        it('same TypedArray', () => {
          const a = new Uint8Array([1, 2, 3])
          const b = new Uint8Array([1, 2, 3])
          expect(isEqual(a, b)).to.be.true
        })
        it('different TypedArray', () => {
          const a = new Uint8Array([1, 2, 3])
          const b = new Uint8Array([1, 2, 4])
          expect(isEqual(a, b)).to.be.false
        })
      })

      describe('ArrayBuffer & DataView @todo: test more cases', () => {
        describe('ArrayBuffer', () => {
          it('same ArrayBuffer', () => {
            const a = new ArrayBuffer(8)
            const b = new ArrayBuffer(8)

            expect(isEqual(a, b)).to.be.true
          })
          it('different ArrayBuffer', () => {
            const a = new ArrayBuffer(8)
            const b = new ArrayBuffer(16)
            expect(isEqual(a, b)).to.be.false
          })
        })

        describe('DataView', () => {
          it('same DataView', () => {
            const a = new DataView(new ArrayBuffer(8))
            const b = new DataView(new ArrayBuffer(8))

            expect(isEqual(a, b)).to.be.true
          })
          it('different DataView', () => {
            const a = new DataView(new ArrayBuffer(8))
            const b = new DataView(new ArrayBuffer(16))
            expect(isEqual(a, b)).to.be.false
          })
        })
      })

      describe('NaN', () => {
        it('same NaN', () => {
          expect(isEqual(Number.NaN, Number.NaN)).to.be.true
          expect(isEqual(Number.NaN, Number(NaN))).to.be.true
          expect(isEqual(Number.NaN, Number('foo'))).to.be.true
          expect(isEqual(Number.NaN, NaN)).to.be.true
        })
        it('different NaN', () => {
          expect(isEqual(Number.NaN, 0)).to.be.false
          expect(isEqual(Number.NaN, 1)).to.be.false
        })
      })

      describe('Infinity', () => {
        it('same Infinity', () => {
          expect(isEqual(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).to.be.true
        })
        it('different Infinity', () => {
          expect(isEqual(Number.POSITIVE_INFINITY, 1)).to.be.false
        })
      })

      describe('functions, with/without props', () => {
        const f1 = () => {}
        const f2 = () => {}
        it('isEqual', () => expect(isEqual(f1, f2)).to.be.false)
        it('isExact', () => expect(z.isExact(f1, f2)).to.be.false)
        it('isIqual', () => expect(z.isIqual(f1, f2)).to.be.false)

        f1.p = 'a'
        f2.p = 'a'
        it('isEqual', () => expect(isEqual(f1, f2)).to.be.false)
        it('isExact', () => expect(z.isExact(f1, f2)).to.be.false)
        it('isIqual', () => expect(z.isIqual(f1, f2)).to.be.false)
      })

      describe('Arrays & Clones :', () => {
        const arr1 = [
          1,
          2,
          '3',
          [4],
          {
            a: 1,
          },
        ]
        const arr2 = [
          1,
          2,
          '3',
          [4],
          {
            a: 1,
          },
        ]

        it('simple Arrays', () => {
          expect(isEqual(arr1, arr2)).to.be.true
        })
        it('Arrays with missing items', () => {
          delete arr2[2]
          expect(isEqual(arr1, arr2)).to.be.false
        })
        it('Array Clones arent equal', () => {
          const arrClone = {
            0: 1,
            1: 2,
            2: '3',
            3: [4],
            4: {
              a: 1,
            },
          }
          expect(isEqual(arr1, arrClone)).to.be.false
        })
      })
    })
    describe("Value's `isEqual` function: ### z.isEqual EXTRA FUNCTIONALITY: uses `isEqual` method if it exists on either side, lodash doesnt at all!", () => {
      class Aclass {
        constructor(public val: string) {}
        isEqual = (other) =>
          other?.val ? _.toLower(other?.val) === _.toLower(this.val) : false
      }
      const aValue = new Aclass('yeah')
      const bValueEqualToA = new Aclass('YEAH')

      it('recognises & uses `isEqual` method on either value sides', () => {
        // uses `isEqual` method on Zen,
        expect(isEqual(aValue, bValueEqualToA)).to.be[trueIfZen]
        expect(isEqual(bValueEqualToA, aValue)).to.be[trueIfZen]
        expect(isEqual(aValue, { val: 'YEAH' })).to.be[trueIfZen]
        expect(isEqual({ val: 'YEAH' }, bValueEqualToA)).to.be[trueIfZen]

        expect(isEqual(aValue, null)).to.be.false
        expect(isEqual(aValue, 'yeah')).to.be.false

        expect(isEqual(aValue, new Aclass('different'))).to.be.false
        expect(isEqual(new Aclass('different'), bValueEqualToA)).to.be.false
      })

      if (isZisEqual)
        it('isEqual can be disabled with `options.isEqualMethod: false` - Zen z.isEqual only', () => {
          expect(isEqual(aValue, bValueEqualToA, { isEqual: false })).to.be.false
          expect(isEqual(bValueEqualToA, aValue, { isEqual: false })).to.be.false
          expect(isEqual(aValue, { val: 'YEAH' }, { isEqual: false })).to.be.false
          expect(isEqual({ val: 'YEAH' }, bValueEqualToA, { isEqual: false })).to.be.false
        })
    })

    describe('options.exclude - excludes properties from test:', () => {
      describe('on Arrays:', () => {
        it('excludes numeric index as Number', () => {
          const a = [1, 2, 3, 99, 5]
          const b = [1, 2, 3, 44, 5]
          expect(isEqual(a, b)).to.be.false

          expect(
            isEqual(a, b, {
              exclude: [3],
            })
          ).to.be.true

          expect(
            isEqual(a, b, {
              exclude: ['3'],
            })
          ).to.be.false
        })
        describe('Consider & excludes index & property with options.allProps', () => {
          let a: any
          let b: any

          beforeEach(() => {
            a = [1, 2, 3, 99, 5]
            a.prop = 1
            a.badProp = 13

            // bad index: 3
            b = [1, 2, 3, 666, 5]
            b.prop = 1
            b.badProp = 666
          })

          it('by default, it doesnt consider object props on arrays', () => {
            expect(isEqual(a, b)).to.be.false // we don't know why exactly they are different

            expect(
              isEqual(a, b, {
                exclude: [3], // but now we do!
              })
            ).to.be.true
          })

          it(`with "props: 'all'", it considers object props on arrays and finds the differences`, () => {
            expect(
              isEqual(a, b, {
                exclude: [3],
                props: 'all',
              })
            ).to.be.false
          })

          it(`with "props: 'all'", it considers object props on arrays, same badProp after all`, () => {
            b.badProp = a.badProp

            expect(
              isEqual(a, b, {
                exclude: [3],
                props: 'all',
              })
            ).to.be.true
          })

          it(`with "props: 'all'", it considers object props on arrays, badProp is excluded`, () => {
            expect(
              isEqual(a, b, {
                exclude: [3, 'badProp'],
                props: 'all',
              })
            ).to.be.true
          })
        })
      })
    })

    describe('options.allProps - considers all properties of Objects (i.e Boxed Primitives, functions, arrays etc):', () => {
      describe('considers string keys of Boxed primitive, like Object with allProps:', () => {
        /* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
        let a: any
        /* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
        let b: any

        beforeEach(() => {
          a = new Number(123)
          b = new Number(123)
          a.stringProp = 456
          b.stringProp = 'WRONG VALUE'
        })

        it('by default, it doesnt consider properties of Boxed primitive', () =>
          expect(isEqual(a, b)).to.be.true)

        it(`with "props: 'all'", it considers properties of Boxed primitive & fails if different`, () =>
          expect(
            isEqual(a, b, {
              props: 'all',
            })
          ).to.be.false)

        it(`with "props: 'all'", it considers properties of Boxed primitive & succeeds if they are same`, () => {
          b.stringProp = a.stringProp
          expect(
            isEqual(a, b, {
              props: 'all',
            })
          ).to.be.true
        })
      })

      describe('Boxed primitive: considers Symbol keys, as its still an Object, with symbol & allProps true', () => {
        /* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
        let a: Boolean
        /* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
        let b: Boolean

        beforeEach(() => {
          /* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
          a = new Boolean(true)
          /* eslint-disable-next-line unicorn/new-for-builtins no-new-wrappers */
          b = new Boolean(true)

          a[Symbol.for('someSymbolLabel')] = 'someSymbolLabel value'
          b[Symbol.for('someSymbolLabel')] = 'WRONG someSymbolLabel value'
        })

        it('by default, it doesnt consider properties of Boxed primitive', () =>
          expect(isEqual(a, b)).to.be.true)

        it(`with "props: 'all'", it considers properties of Boxed primitive & fails if different`, () =>
          expect(
            isEqual(a, b, {
              symbol: true,
              props: 'all',
            })
          ).to.be.false)

        it(`with "props: 'all'", it considers properties of Boxed primitive & succeeds if they are same`, () => {
          b[Symbol.for('someSymbolLabel')] = a[Symbol.for('someSymbolLabel')]

          expect(
            isEqual(a, b, {
              symbol: true,
              props: 'all',
            })
          ).to.be.true
        })
      })

      describe('considers properties (not just items) on Arrays', () => {
        let arr1: any //[]
        let arr2: any //[]

        beforeEach(() => {
          arr1 = [1, 2, '3', [4], { a: 1 }]
          arr2 = [1, 2, '3', [4], { a: 1 }]
        })

        it('by default, it doesnt consider properties of objects that are not realObjects', () => {
          arr1.prop = [1]
          arr2.prop = [222]
          expect(isEqual(arr1, arr2)).to.be.true
        })

        it(`with "props: 'all'", it considers properties of objects that are not realObjects & fails if different`, () => {
          arr1.prop = [1]
          arr2.prop = [222]
          expect(
            isEqual(arr1, arr2, {
              props: 'all',
            })
          ).to.be.false
        })

        it(`with "props: 'all'", it considers properties of objects that are not realObjects & succeeds if they are same`, () => {
          arr1.prop = [333]
          arr2.prop = [333]
          expect(
            isEqual(arr1, arr2, {
              props: 'all',
            })
          ).to.be.true
        })
      })
    })

    describe('props: "only" to ignore value & type of property containers (primitives as Object, functions etc):', () => {
      it('cares only about properties, on equal values', () => {
        const a: any = new Number(111)
        const b: any = new Number(111)
        a.prop = 1
        b.prop = 2

        expect(isEqual(a, b)).to.be.true

        expect(
          isEqual(a, b, {
            props: true,
          })
        ).to.be.false

        b.prop = 1
        expect(
          isEqual(a, b, {
            props: true,
          })
        ).to.be.true
      })
      describe('cares only about properties, even on on NON-equal values:', () => {
        it('ignores Number Object value, only properties matter', () => {
          const a: any = new Number(111)
          const b: any = new Number(222)
          a.prop = 1
          b.prop = 2

          expect(isEqual(b, a, { props: true })).to.be.false

          b.prop = a.prop
          expect(isEqual(b, a, { props: true })).to.be.true
        })

        it("Ignores String Object 'value', only cares about props!", () => {
          const a: any = new String('111')
          const b: any = new String('222')

          expect(isEqual(b, a)).to.be.false

          a.prop = 111
          b.prop = 111

          expect(isEqual(b, a, { props: true })).to.be.true
        })

        it('ignores Array elements, only properties matter', () => {
          const a = [1, 2, 3]
          const b = [4, 5, 6]

          a['prop'] = 1
          b['prop'] = 2
          expect(isEqual(b, a, { props: true })).to.be.false

          b['prop'] = 1
          expect(isEqual(b, a, { props: true })).to.be.true
        })
      })
    })

    describe('options.inherited - Objects with inherited properties:', () => {
      describe('object with inherited properties:', () => {
        it('z.isEqual is true', () => {
          expect(
            isEqual(
              objectWithProtoInheritedProps,
              expectedPropertyValues,
              undefined,
              undefined,
              {
                inherited: true,
              }
            )
          ).to.be.true
          expect(
            isEqual(expectedPropertyValues, objectWithProtoInheritedProps, {
              inherited: true,
            })
          ).to.be.true
        })
        it('_.isEqual fails', () => {
          expect(_.isEqual(objectWithProtoInheritedProps, expectedPropertyValues)).to.be.false
          expect(_.isEqual(expectedPropertyValues, objectWithProtoInheritedProps)).to.be.false
        })
        describe.skip('with _.cloneDeep:', () => {
          it('z.isIqual fails (imperfect _.cloneDeep)', () => {
            expect(z.isIqual(oClone, expectedPropertyValues)).to.be.false
            expect(z.isIqual(expectedPropertyValues, oClone)).to.be.false
          })
          it('_.isEqual fails', () => {
            expect(_.isEqual(oClone, expectedPropertyValues)).to.be.false
            expect(_.isEqual(expectedPropertyValues, oClone)).to.be.false
          })
        })
        // return describe.skip('with z.clone proto: ', () =>  {
        //   var oCloneProto
        //   oCloneProto = z.clone(objectWithProtoInheritedProps, {
        //     copyProto: true,
        //   })
        //   it('z.isIqual succeeds (a perfect clone:-)', () =>  {
        //     expect(z.isIqual(oCloneProto, expectedPropertyValues)).to.be.true
        //     expect(z.isIqual(expectedPropertyValues, oCloneProto)).to.be
        //       .true
        //   })
        //   it('_.isEqual still fails', () =>  {
        //     expect(_.isEqual(oCloneProto, expectedPropertyValues)).to.be.false
        //     expect(_.isEqual(expectedPropertyValues, oCloneProto)).to.be
        //       .false
        //   })
        // })
      })
      describe('coffeescript object with inherited properties:', () => {
        it.skip('z.isEqual is true', () => {
          expect(
            isEqual(c3, expectedPropertyValues, {
              inherited: true,
              exclude: ['constructor'],
            })
          ).to.be.true // alt `options` passing style (in customizer's place)
          expect(z.isIqual(expectedPropertyValues, c3)).to.be.true
        })
        it('_.isEqual fails', () => {
          expect(_.isEqual(c3, expectedPropertyValues)).to.be.false
          expect(_.isEqual(expectedPropertyValues, c3)).to.be.false
        })
        describe('with _.cloneDeep:', () => {
          it.skip('z.isIqual fails (imperfect _.cloneDeep)', () => {
            expect(
              isEqual(c3Clone, expectedPropertyValues, undefined, undefined, {
                inherited: true,
              })
            ).to.be.false
            expect(z.isIqual(expectedPropertyValues, c3Clone)).to.be.false
          })
          it('_.isEqual fails', () => {
            expect(_.isEqual(c3Clone, expectedPropertyValues)).to.be.false
            expect(_.isEqual(expectedPropertyValues, c3Clone)).to.be.false
          })
        })
        // describe('with z.clone: ', () =>  {
        //   var c3CloneProto
        //   c3CloneProto = z.clone(c3, {
        //     copyProto: true,
        //   })
        //   it('z.isIqual is true', () =>  {
        //     expect(
        //       z.isEqual(c3CloneProto, expectedPropertyValues, {
        //         inherited: true,
        //         exclude: ['constructor'],
        //       })
        //     ).to.be.true
        //     expect(z.isIqual([expectedPropertyValues], [c3CloneProto])).to
        //       .be.true
        //   })
        //   it('_.isEqual fails', () =>  {
        //     expect(_.isEqual(c3CloneProto, expectedPropertyValues)).to.be.false
        //     expect(_.isEqual(expectedPropertyValues, c3CloneProto)).to.be
        //       .false
        //   })
        // })
      })
    })
    describe('options.exact (Objects need to have exact refs, i.e shallow clones) :', () => {
      describe('shallow cloned objects :', () => {
        it('z.isExact(object, objectShallowClone1) is true', () => {
          expect(
            isEqual(object, objectShallowClone1, undefined, undefined, {
              exactValues: true,
            })
          ).to.be.true
          expect(z.isExact(objectShallowClone1, object)).to.be.true
        })
        it('z.isExact(object, objectShallowClone2) with _.cloneDeep(object) is true', () => {
          expect(
            isEqual(object, objectShallowClone2, {
              exactValues: true,
            })
          ).to.be.true // alt `options` passing style (in customizer's place)
          expect(z.isExact(objectShallowClone2, object)).to.be.true
        })
        it('_.isEqual(object, shallowClone1 & 2) gives true', () => {
          expect(_.isEqual(object, objectShallowClone1)).to.be.true
          expect(_.isEqual(object, objectShallowClone2)).to.be.true
        })
      })
      describe('deeply cloned objects:', () => {
        describe('objectDeepClone1 with copied proto:', () => {
          it('z.isExact is false', () => {
            expect(
              isEqual(object, objectDeepClone1, {
                exactValues: true,
              })
            ).to.be.false // alt `options` passing style (in customizer's place)
            expect(z.isExact(objectDeepClone1, object)).to.be.false
          })
          it('z.isEqual is true', () => {
            expect(isEqual(object, objectDeepClone1)).to.be.true
            expect(isEqual(objectDeepClone1, object)).to.be.true
          })
        })
        describe('objectDeepClone2 = _.cloneDeep(object)', () => {
          it('z.isExact is false', () => {
            expect(
              isEqual(object, objectDeepClone2, undefined, undefined, {
                exactValues: true,
              })
            ).to.be.false
            expect(z.isExact(objectDeepClone2, object)).to.be.false
          })
          it('z.isEqual is true', () => {
            expect(isEqual(object, objectDeepClone2)).to.be.true
            expect(isEqual(objectDeepClone2, object)).to.be.true
          })
        })
        it('_.isEqual(object, objectDeepClone1 & 2) gives true', () => {
          expect(_.isEqual(object, objectDeepClone1)).to.be.true
          expect(_.isEqual(object, objectDeepClone2)).to.be.true
        })
      })
      describe('isIxact : isEqual with inherited & exact :', () => {
        describe('shallow inherited clone: inheritedShallowClone:', () => {
          it('isIxact is true:', () => {
            expect(z.isIxact(inheritedShallowClone, object)).to.be.true
          })
          it('isIqual is true:', () => {
            expect(z.isIqual(object, inheritedShallowClone)).to.be.true
          })
        })
        describe('deep inherited clone : inheritedDeepClone:', () => {
          it('isIxact is true:', () => {
            expect(z.isIxact(inheritedDeepClone, object)).to.be.false
          })
          it('isIqual is true:', () => {
            expect(z.isIqual(object, inheritedDeepClone)).to.be.true
          })
        })
      })
    })
    describe('passing options.path fills it with failed path:', () => {
      const a1 = {
        a: {
          a1: {
            a2: 1,
          },
        },
        b: {
          b1: 1,
          b2: {
            b3: 3,
          },
        },
      }

      const a2 = {
        a: {
          a1: {
            a2: 1,
          },
        },
        b: {
          b1: 1,
          b2: {
            b3: 3333,
          },
        },
      }
      it('contains the keys as they are processed, 1st obj misses props', () => {
        const options = { path: [] }
        expect(isEqual(a1, a2, options)).to.be.false
        expect(options.path).to.be.deep.equal(['b', 'b2', 'b3'])
      })
      it('contains the keys as they are processed, 2nd obj misses props', () => {
        const options = { path: [] }
        expect(isEqual(a2, a1, options)).to.be.false
        expect(options.path).to.be.deep.equal(['b', 'b2', 'b3'])
      })
    })

    if (isZisEqual) {
      describe('z.isLike / z.isEqual with {like:true}: (1st arg can be a partial of 2nd arg)', () => {
        const obj1IsLikeObj2 = {
          a: 1,
          b: {
            bb: 2,
          },
          c: [
            1,
            {
              p2: 2,
            },
            4,
          ],
        }
        const obj2 = {
          a: 1,
          b: {
            bb: 2,
            missingFromA: {
              a: 'a',
            },
          },
          missingFromA: 'a',
          c: [
            1,
            {
              p2: 2,
              p3_missingFromA: 3,
            },
            4,
            // all below missingFromA
            {
              missingFromA: 5,
            },
            999999999,
          ],
        }

        it("z.isLike: is true if 1st args's properties match to 2nd arg", () =>
          expect(z.isLike(obj1IsLikeObj2, obj2)).to.be.true)
        it("z.isEqual with {like: true}: is true if 1st args's properties match to 2nd arg", () => {
          expect(z.isEqual(obj1IsLikeObj2, obj2)).to.be.false
          expect(z.isEqual(obj1IsLikeObj2, obj2, { like: true })).to.be.true
        })

        it("z.isLike: is false if 1st args's properties are not like to 2nd arg", () => {
          expect(z.isLike(obj2, obj1IsLikeObj2)).to.be.false
        })
        it("z.isEqual with {like: true}: is false if 1st args's properties are not like to 2nd arg", () => {
          expect(z.isEqual(obj2, obj1IsLikeObj2)).to.be.false
          expect(z.isEqual(obj2, obj1IsLikeObj2, { like: true })).to.be.false
        })
      })

      describe(`'Maps with options.exactKeys & options.exactValues: match exact key/value refs OR clones`, () => {
        // with clone keys & values
        const mapCloneKeys1 = new Map([
          // mapCloneKeys1 is like mapCloneKeys2
          [{ a: 1 }, { val: 'one' }],
          [{ b: 2 }, { nested: { a: 1, b: 2 } }],
        ])
        const mapCloneKeys2 = new Map([
          [{ a: 1 }, { val: 'one' }],
          [{ b: 2 }, { nested: { a: 1, b: 2, 'missing from mapCloneKeys1': true } }],
          [{ 'missing from mapCloneKeys1': 3 }, { val: 'three' }],
        ])

        describe(`options.exactKeys: false & exactValues: false (default)`, () => {
          it('z.isLike', () => {
            expect(z.isEqual(mapCloneKeys1, mapCloneKeys2, { like: true })).to.be.true
          })

          it('z.isEqual with {like: true}', () => {
            expect(z.isEqual(mapCloneKeys1, mapCloneKeys2)).to.be.false
            expect(z.isEqual(mapCloneKeys1, mapCloneKeys2, { like: true })).to.be.true
          })
        })
      })

      describe('aliases like z.isLike & other options:', () => {
        const a1 = {
          a: 1,
          b: {
            b1: 1,
          },
        }

        let _b: any
        const b1 = {
          a: 1,
          b: (_b = {
            b1: 1,
            b2: 2,
          }),
          c: 3,
        }

        it('no options, just isLike', () => expect(z.isLike(b1, a1)).to.be.false)

        it('pass options in place in 3rd place', () => {
          let path
          expect(
            z.isLike(b1, a1, {
              path: (path = []),
            })
          ).to.be.false
          expect(path).to.be.deep.equal(['b', 'b2'])
        })
        it('pass options in 5th place', () => {
          let path
          expect(
            z.isLike(b1, a1, undefined, undefined, {
              path: (path = []),
            })
          ).to.be.false
          expect(path).to.be.deep.equal(['b', 'b2'])
        })
        it('passes customizer & options in its proper place & as an option', () => {
          let path
          // @ts-ignore-next-line
          const customizer = function (val1, val2) {
            if (val1 === _b || path[0] === 'c') return true
          }
          // else undefined, which is ignored as a decision
          expect(
            z.isLike(b1, a1, customizer, undefined, {
              path: (path = []),
            })
          ).to.be.true

          expect(
            z.isLike(b1, a1, undefined, undefined, {
              path: (path = []),
              customizer,
            })
          ).to.be.true
        })

        describe(`Argument validation - if args are not valid, it throw errors`, () => {
          it('options are used as 3rd & 5th arg', () =>
            // @ts-ignore
            expect(() => z.isLike(a1, b1, {}, undefined, {})).to.throw(
              /z.isEqual: you cannot pass options as 3rd and 5th argument at the same time/
            ))

          it('customizer is used as 3rd ard & in options', () =>
            // @ts-ignore
            expect(() =>
              z.isLike(a1, b1, () => {}, undefined, { customizer: () => {} })
            ).to.throw(
              /z.isEqual: you cannot pass customizer as 3rd argument and as options.customizer at the same time/
            ))
        })
      })
    }
  })
})
