import * as chai from 'chai'
import * as _ from 'lodash'
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
import { isAsyncGenerator } from '../isAsyncGenerator'

const { expect } = chai

describe('isAsyncGenerator', () => {
  _.each(
    [
      // async generators only - true
      ['a_GeneratorFunction_async_named', a_GeneratorFunction_async_named, true],
      ['a_GeneratorFunction_async_anonymous', a_GeneratorFunction_async_anonymous, true],

      // false
      ['a_Function_normalNamed', a_Function_normalNamed, false],
      ['a_Function_normalAnonymous', a_Function_normalAnonymous, false],

      ['arrowFunction', a_Function_arrowNamed, false],
      ['a_Function_arrows_anonymous', a_Function_arrows_anonymous, false],

      ['asyncNormalFunction', a_Function_async_normal_named, false],
      ['a_Function_Async_normalAnonymous', a_Function_Async_normalAnonymous, false],

      ['a_Function_async_arrow_named', a_Function_async_arrow_named, false],
      ['a_Function_async_arrow_anonymous', a_Function_async_arrow_anonymous, false],

      ['a_GeneratorFunction_named', a_GeneratorFunction_named, false],
      ['a_GeneratorFunction_anonymous', a_GeneratorFunction_anonymous, false],
    ],
    ([descr, value, expected]: [string, any, boolean]) =>
      it(`${descr}: for ${value} returns ${expected}`, () => {
        expect(isAsyncGenerator(value())).to.be.equal(expected)
      })
  )
})
