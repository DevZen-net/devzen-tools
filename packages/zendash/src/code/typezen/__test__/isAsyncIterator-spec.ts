import * as chai from 'chai'
import * as _ from 'lodash'
import { iteratorsGenerators } from '../../../test-utils/test-data'
import { isAsyncIterator } from '../isAsyncIterator'

const { expect } = chai

describe('isAsyncIterator', () => {
  _.each(
    [
      [iteratorsGenerators.AsyncIterator[0], true],
      [iteratorsGenerators.AsyncGenerator[0], true],

      [iteratorsGenerators.Iterator[0], false],
      [iteratorsGenerators.Generator[0], false],

      [undefined, false],
      [null, false],
      [1, false],
      ['foobar', false],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isAsyncIterator(value)).to.be.equal(expected)
      })
  )
})
