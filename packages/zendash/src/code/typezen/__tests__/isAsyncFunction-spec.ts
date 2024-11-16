import * as chai from 'chai'
import { expectType, TypeOf } from 'ts-expect'
import {
  a_Function_arrowNamed,
  a_Function_arrows_anonymous,
  a_Function_async_arrow_anonymous,
  a_Function_async_arrow_named,
  a_Function_async_normal_named,
  a_Function_Async_normalAnonymous,
  a_Function_normalAnonymous,
  a_Function_normalNamed,
  a_GeneratorFunction_anonymous,
  a_GeneratorFunction_async_anonymous,
  a_GeneratorFunction_async_named,
  a_GeneratorFunction_named,
} from '../../../test-utils/test-data'
import { AsyncFunction, isAsyncFunction } from '../isAsyncFunction'

const { expect } = chai

describe('isAsyncFunction & TypeGuard', () => {
  describe('should check true & match AsyncFunction Type Guard', () => {
    it('a_Function_async_normal_named', () => {
      expect(isAsyncFunction(a_Function_async_normal_named)).to.be.true
      if (isAsyncFunction(a_Function_async_normal_named)) {
        expectType<TypeOf<typeof a_Function_async_normal_named, AsyncFunction>>(true)
      }
    })
    it('a_Function_Async_normalAnonymous', () => {
      expect(isAsyncFunction(a_Function_Async_normalAnonymous)).to.be.true
      if (isAsyncFunction(a_Function_Async_normalAnonymous)) {
        expectType<TypeOf<typeof a_Function_Async_normalAnonymous, AsyncFunction>>(true)
      }
    })
    it('a_Function_async_arrow_named', () => {
      expect(isAsyncFunction(a_Function_async_arrow_named)).to.be.true
      if (isAsyncFunction(a_Function_async_arrow_named)) {
        expectType<TypeOf<typeof a_Function_async_arrow_named, AsyncFunction>>(true)
      }
    })
    it('a_Function_async_arrow_anonymous', () => {
      expect(isAsyncFunction(a_Function_async_arrow_anonymous)).to.be.true
      if (isAsyncFunction(a_Function_async_arrow_anonymous)) {
        expectType<TypeOf<typeof a_Function_async_arrow_anonymous, AsyncFunction>>(true)
      }
    })
  })
  describe('should check false & NOT match AsyncFunction Type Guard', () => {
    const expected = false
    it('a_GeneratorFunction_async_named', () => {
      expect(isAsyncFunction(a_GeneratorFunction_async_named)).to.equal(expected)
      if (isAsyncFunction(a_GeneratorFunction_async_named)) {
        expectType<TypeOf<typeof a_GeneratorFunction_async_named, AsyncFunction>>(false)
      }
    })
    it('a_GeneratorFunction_async_anonymous', () => {
      expect(isAsyncFunction(a_GeneratorFunction_async_anonymous)).to.equal(expected)
      if (isAsyncFunction(a_GeneratorFunction_async_anonymous)) {
        expectType<TypeOf<typeof a_GeneratorFunction_async_anonymous, AsyncFunction>>(false)
      }
    })
    it('a_Function_normalNamed', () => {
      expect(isAsyncFunction(a_Function_normalNamed)).to.equal(expected)
      if (isAsyncFunction(a_Function_normalNamed)) {
        expectType<TypeOf<typeof a_Function_normalNamed, AsyncFunction>>(false)
      }
    })
    it('a_Function_normalAnonymous', () => {
      expect(isAsyncFunction(a_Function_normalAnonymous)).to.equal(expected)
      if (isAsyncFunction(a_Function_normalAnonymous)) {
        expectType<TypeOf<typeof a_Function_normalAnonymous, AsyncFunction>>(false)
      }
    })
    it('a_Function_arrowNamed', () => {
      expect(isAsyncFunction(a_Function_arrowNamed)).to.equal(expected)
      if (isAsyncFunction(a_Function_arrowNamed)) {
        expectType<TypeOf<typeof a_Function_arrowNamed, AsyncFunction>>(false)
      }
    })

    it('a_Function_arrows_anonymous', () => {
      expect(isAsyncFunction(a_Function_arrows_anonymous)).to.equal(expected)
      if (isAsyncFunction(a_Function_arrows_anonymous)) {
        expectType<TypeOf<typeof a_Function_arrows_anonymous, AsyncFunction>>(expected)
      }
    })
    it('asyncGenerator', () => {
      expect(isAsyncFunction(a_GeneratorFunction_async_named())).to.equal(expected)
      if (isAsyncFunction(a_GeneratorFunction_async_named())) {
        const asyncGenerator = a_GeneratorFunction_async_named()
        expectType<TypeOf<typeof asyncGenerator, AsyncFunction>>(false)
      }
    })
    it('a_GeneratorFunction_anonymous', () => {
      expect(isAsyncFunction(a_GeneratorFunction_anonymous())).to.equal(expected)
      if (isAsyncFunction(a_GeneratorFunction_anonymous())) {
        const asyncGenerator = a_GeneratorFunction_anonymous()
        expectType<TypeOf<typeof asyncGenerator, AsyncFunction>>(false)
      }
    })
    it('a_GeneratorFunction_named', () => {
      expect(isAsyncFunction(a_GeneratorFunction_named())).to.equal(expected)
      if (isAsyncFunction(a_GeneratorFunction_named())) {
        const asyncGenerator = a_GeneratorFunction_named()
        expectType<TypeOf<typeof asyncGenerator, AsyncFunction>>(false)
      }
    })
  })
  describe('Special case: non-async but Promise-returning function (no harm)', () => {
    const promiseFunction = () => Promise.resolve()
    it('TypeGuard matches, but...', () => {
      if (isAsyncFunction(promiseFunction)) {
        expectType<TypeOf<typeof promiseFunction, AsyncFunction>>(true)
      }
    })
    it('...but `isAsyncFunction` returns false', () =>
      expect(isAsyncFunction(promiseFunction)).to.equal(false))
  })
})
