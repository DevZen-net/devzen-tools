import * as chai from 'chai'
import * as _ from 'lodash'
import { manyTypesAndPossibleValues } from '../../../test-utils/test-data'
// local
import * as _z from '../../index'

const { expect } = chai

describe('_z.isRef ', () => {
  _.each(
    [
      [new Number(456), true],
      [new String('abc'), true],
      [new Boolean(true), true],

      [{}, true],
      [[], true],
      [() => {}, true],
      [new Date(), true],
      [new Set(), true],
      [new Map(), true],
      [new WeakMap(), true],
      [new WeakSet(), true],
      [new Error(), true],
      [new RegExp(''), true],
      [/aaa/, true],
      [new Int8Array(), true],
      [new Uint8Array(), true],
      [new Uint8ClampedArray(), true],
      [new Int16Array(), true],
      [new Uint16Array(), true],
      [new Int32Array(), true],
      [new Uint32Array(), true],
      [new Float32Array(), true],
      [new Float64Array(), true],
      [new DataView(new ArrayBuffer(1)), true],
      [new ArrayBuffer(1), true],
      [new Proxy({}, {}), true],
      [new Promise(() => {}), true],
      [new URL('http://example.com'), true],
      [new URLSearchParams(), true],
      [Symbol('a'), true],
      [Symbol.for('a'), true],

      // Not Refs
      [BigInt('123456'), false],
      [123_456, false],
      ['a string', false],
      [true, false],
      [null, false],
      [undefined, false],
    ],
    ([value, expected]) =>
      it(`for ${String(value)} returns ${expected}`, () => {
        expect(_z.isRef(value)).to.be.equal(expected)
      })
  )

  describe('_z.isRef correctly recognises "isMany" value types as NON-single:', () => {
    for (const typeName in manyTypesAndPossibleValues) {
      for (const value of manyTypesAndPossibleValues[typeName]) {
        it(`_z.isRef recognises '${typeName}' value ${String(value)} as a "isRef" Type`, () => {
          expect(_z.isRef(value)).to.be.true
        })
      }
    }
  })
})
