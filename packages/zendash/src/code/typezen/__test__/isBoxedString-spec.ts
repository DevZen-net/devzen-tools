import * as chai from 'chai'
import * as _ from 'lodash'
import { isBoxedString } from '../isBoxedString'

const { expect } = chai

describe('isBoxedString', () => {
  _.each(
    [
      ['normal string', false],
      [new String('boxed string'), true],
      [new String('boxed string').toString(), false],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isBoxedString(value)).to.be.equal(expected)
      })
  )
})
