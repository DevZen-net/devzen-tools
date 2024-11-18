import * as chai from 'chai'
import * as _ from 'lodash'
import { classType, constructor } from '../classes'
import { isPromise, UnwrapPromise } from '../isPromise'
import { type } from '../type'
import { expectType, TypeEqual } from 'ts-expect'

const { expect } = chai

describe('isPromise', () => {
  describe(`motivation`, () => {
    describe(`Native Promises discovery`, () => {
      it(`Promise.isPromise === undefined`, () => {
        expect((Promise as any).isPromise).to.equal(undefined)
      })

      it(`_.isPromise === undefined`, () => {
        expect((_ as any).isPromise as any).to.equal(undefined)
      })

      it(`typeof new Promise === 'object'`, () => {
        expect(typeof new Promise(() => {})).to.equal('object')
      })

      it(`typeof Promise === 'function'`, () => {
        expect(typeof Promise).to.equal('function')
      })

      it(`promise instanceof Promise`, () => {
        expect(new Promise(() => {})).to.be.instanceOf(Promise)
        expect(new Promise(() => {}) instanceof Promise).to.be.equal(true)
      })
    })

    describe(`UnwrapPromise`, () => {
      it(`It Unwrap Promise of ONE level only (unlike Awaited) - 1 Level`, () => {
        type Input = Promise<"Promise resolved value">
        type Result = UnwrapPromise<Input>
        type Expected = "Promise resolved value"

        expectType<TypeEqual<Result, Expected>>(true)
      })

      it(`It Unwrap Promise of ONE level only (unlike Awaited) - 2 Levels`, () => {
        type Input = Promise<Promise<"Promise resolved value">>
        type Result = UnwrapPromise<Input>
        type Expected = Promise<"Promise resolved value">

        expectType<TypeEqual<Result, Expected>>(true)
      })

      it(`It Unwrap Promise of ONE level only (unlike Awaited) - 3 Levels`, () => {
        type Input = Promise<Promise<Promise<"Promise resolved value">>>
        type Result = UnwrapPromise<Input>
        type Expected = Promise<Promise<"Promise resolved value">>

        expectType<TypeEqual<Result, Expected>>(true)
      })

      it(`It Unwrap any other value, as value it self - 0 Promise Levels`, () => {
        type Input = "Some value"
        type Result = UnwrapPromise<Input>
        type Expected = "Some value"

        expectType<TypeEqual<Result, Expected>>(true)
      })
    })

    describe(`Zen Promises types`, () => {
      it(`z.type(new Promise(() => {})) === 'Promise'`, () => {
        expect(type(new Promise(() => {}))).to.equal('Promise')
      })

      it(`z.isPromise(new Promise(() => {})) === true`, () => {
        expect(isPromise(new Promise(() => {}))).to.equal(true)
      })

      it(`z.type(Promise) === 'class'`, () => {
        expect(type(Promise)).to.equal('class')
      })

      it(`z.classType(Promise) === 'systemClass'`, () => {
        expect(classType(Promise)).to.equal('systemClass')
      })

      it(`constructor(new Promise) === Promise`, () => {
        expect(constructor(new Promise(() => {}))).to.equal(Promise)
      })
    })
  })

  _.each(
    [
      [Promise, false],
      [new Promise((resolve) => resolve(null)), true],
      [{ then() {}, catch() {} }, false],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isPromise(value)).to.be.equal(expected)
      })
  )
})
