import { expect } from 'chai'
import * as _ from 'lodash'
import * as _z from '../../index'
import { toStringSafe } from '../../utils'

const trues = [true, new Boolean(true)]
const truthies = [{}, [], 'aa', 1, -1, /./]
const truthyBoxedPrimitives = [new Boolean(true), new Number(1), BigInt(1), new String('aaa')]
const OKs = [...trues, ...truthies, truthyBoxedPrimitives]

// FALSE & FALSIES & BAD
const falses = [false, new Boolean(false)]
const falseyBoxedPrimitives = [
  new Boolean(false),
  new Number(0),
  new Number(-0),
  new String(''),
]
const falsies = [undefined, null, 0, NaN, '', BigInt(-0n), BigInt(0n), _z.NOTHING]
const baddies = [...falseyBoxedPrimitives, _z.NOTHING]
const allFalsifieds = [...falses, ...falseyBoxedPrimitives, ...falsies, ...baddies]

describe('TRUE & FALSE are not always straightforward in JS:', () => {
  describe('TRUE stuff:', () => {
    describe('_z.isTrue is quite strict:', () => {
      describe('true with any strict boolean | Boolean true', () =>
        _.each(trues, (v) =>
          it(`value:'${toStringSafe(v)}'`, () => expect(_z.isTrue(v)).to.be.true)
        ))

      describe('false with any truthies & all boxed primitives (except new Boolean(true))', () =>
        _.each(
          [
            ...truthies,
            ...truthyBoxedPrimitives, // except new Boolean(true)
          ],
          (v) =>
            it(`false for value:'${toStringSafe(v)}'`, () =>
              !_z.isEqual(v, new Boolean(true)) && expect(_z.isTrue(v)).to.be.false)
        ))

      describe(`false with any falsified:`, () =>
        _.each(allFalsifieds, (v) =>
          it(`false for value:'${toStringSafe(v)}'`, () => expect(_z.isTrue(v)).to.be.false)
        ))
    })

    describe(`_z.isTruthy is a bit dumb`, () => {
      describe(`true with any truthy (good)`, () =>
        _.each(truthies, (v) =>
          it(`true for value:'${toStringSafe(v)}'`, () => expect(_z.isTruthy(v)).to.be.true)
        ))

      describe(`false with any strictFalses & falsies (good)`, () =>
        _.each([...falses, ...falsies], (v) =>
          it(`false for value:'${toStringSafe(v)}'`, () => expect(_z.isTruthy(v)).to.be.false)
        ))

      describe(`true with falseyBoxedPrimitives (bad) - except new Boolean(false)`, () =>
        _.each(falseyBoxedPrimitives, (v) =>
          it(`false for value:'${toStringSafe(v)}'`, () =>
            !_z.isEqual(v, new Boolean(false)) && expect(_z.isTruthy(v)).to.be.true)
        ))
    })

    describe('_z.isOk', () => {
      describe('true with all strictTrues & all truthies', () =>
        _.each(OKs, (v) =>
          it(`*true* with truthy value:'${toStringSafe(v)}'`, () =>
            expect(_z.isOk(v)).to.be.true)
        ))

      describe('false with all bad & strictFalses', () =>
        _.each(allFalsifieds, (v) =>
          it(`*false*, with bad value:'${toStringSafe(v)}'`, () =>
            expect(_z.isOk(v)).to.be.false)
        ))
    })
  })

  describe('FALSE stuff:', () => {
    describe('_z.isFalse is quite strict', () => {
      describe('false only with strict boolean false & new Boolean(false)', () =>
        _.each(falses, (v) =>
          it(`value:'${toStringSafe(v)}'`, () => expect(_z.isFalse(v)).to.be.true)
        ))

      describe('false with any baddiesOnly or falsies (except new Boolean(false))', () =>
        _.each([...baddies, ...falsies], (v) =>
          it(`value:'${toStringSafe(v)}'`, () =>
            !_z.isEqual(v, new Boolean(false)) && expect(_z.isFalse(v)).to.be.false)
        ))

      describe('false with any OKs', () =>
        _.each(OKs, (v) =>
          it(`value:'${toStringSafe(v)}'`, () => expect(_z.isFalse(v)).to.be.false)
        ))
    })

    describe('_z.isFalsy', () => {
      describe('true with all strictFalses & all falsies', () =>
        _.each([...falses, ...falsies], (v) =>
          it(`*true* with falsy value:'${toStringSafe(v)}'`, () =>
            expect(_z.isFalsy(v)).to.be.true)
        ))

      describe('false with all OKs', () =>
        _.each(OKs, (v) =>
          it(`*false* with truthy value:'${toStringSafe(v)}'`, () =>
            expect(_z.isFalsy(v)).to.be.false)
        ))
    })

    describe('_z.isBad', () => {
      describe('false with all OKs', () =>
        _.each(OKs, (v) =>
          it(`*false* with value:'${toStringSafe(v)}'`, () => expect(_z.isBad(v)).to.be.false)
        ))

      describe('false with all allFalsifieds', () =>
        _.each(allFalsifieds, (v) =>
          it(`*true* with value:'${toStringSafe(v)}'`, () => expect(_z.isBad(v)).to.be.true)
        ))
    })
  })
})
