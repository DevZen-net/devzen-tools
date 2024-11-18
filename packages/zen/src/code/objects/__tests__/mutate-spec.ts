import * as chai from 'chai'
import * as _ from 'lodash'
import * as z from '../../index'

const { expect } = chai

describe('mutate :', () => {
  const simpleCalc = (v) => (v < 0 ? v + 10 : v + 20)

  it('mutate Object values', () => {
    const o = {
      a: 1,
      b: 2,
      c: -1,
    }
    expect(z.mutate(o, simpleCalc)).to.deep.equal({
      a: 21,
      b: 22,
      c: 9,
    })
  })

  it('arrayize if string', () => {
    const o = {
      key1: 'lalakis',
      key2: ['ok', 'yes'],
    }
    expect(z.mutate(o, z.arrayize, _.isString)).to.deep.equal({
      key1: ['lalakis'],
      key2: ['ok', 'yes'],
    })
  })

  describe('mutate arrays :', () => {
    it('mutate array with simplecalc', () => {
      const arr = [1, 2, -1]
      const result = z.mutate(arr, simpleCalc)
      expect(result).to.deep.equal([21, 22, 9])
      expect(result === arr).to.equal(true)
    })

    it('mutate array again with fltr', () => {
      const arr = [11, 2, -1]
      const result = z.mutate(arr, simpleCalc, (v) => v > 10) // fltr,
      expect(result).to.deep.equal([31, 2, -1])
      expect(result === arr).to.equal(true)
    })
  })
})
