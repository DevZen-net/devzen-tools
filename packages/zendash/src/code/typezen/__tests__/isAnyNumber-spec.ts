import * as chai from 'chai'
import * as _ from 'lodash'
import { singleTypesAndPossibleValues } from '../../../test-utils/test-data'
// local
import * as _z from '../../index'

const { expect } = chai

const aNaN = Number('foo')
const aBoxedNaN = new Number(NaN)
const aBigInt1 = BigInt('123456789123456789')
const aBigInt2 = 123_456_789_123_456_789n
const aBigIntString =
  '123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789'
const aBoxedNumber = new Number(123)

describe('isAnyNumber & its usage:', () => {
  describe('`_z.isAnyNumber` recognises all "proper" numbers', () => {
    it('`_z.isAnyNumber` recognises all kinds of numbers, even if its a string', () => {
      expect(_z.isAnyNumber(123)).to.be.true
      expect(_z.isAnyNumber(123.456)).to.be.true
      expect(_z.isAnyNumber('123')).to.be.true
      expect(_z.isAnyNumber('123.456')).to.be.true
      expect(_z.isAnyNumber(Number('123'))).to.be.true
      expect(_z.isAnyNumber(new String('123'))).to.be.true
      expect(_z.isAnyNumber(aBoxedNumber)).to.be.true
      expect(_z.isAnyNumber(aBigIntString)).to.be.true
      expect(_z.isAnyNumber(Number.POSITIVE_INFINITY)).to.be.true
    })

    it('`_z.isAnyNumber` DOESNT allow ill-formed numbers, like NaNs', () => {
      expect(_z.isAnyNumber('foobar is NaN')).to.be.false
      expect(_z.isAnyNumber('123,456')).to.be.false
      expect(_z.isAnyNumber(Number('123,456'))).to.be.false
      expect(_z.isAnyNumber(new Number('123,456'))).to.be.false
      expect(_z.isAnyNumber(new Date() as any)).to.be.false
    })

    describe('`_z.isAnyNumber` & NaNs', () => {
      it('`_z.isAnyNumber` doesnt recognise plain NaN as a number', () => {
        expect(_z.isAnyNumber(aNaN)).to.be.false
      })
      it('`_z.isAnyNumber` doesnt recognise Boxed NaN as a number', () => {
        expect(_z.isAnyNumber(aBoxedNaN)).to.be.false
      })
      it('`lodash _.isNumber` considers NaN & boxed NaN as _.isNumber, unlike _z.isAnyNumber', () => {
        expect(_.isNumber(aNaN)).to.be.true
        expect(_.isNumber(aBoxedNaN)).to.be.true
        expect(_.isNaN(aNaN)).to.be.true
        expect(_.isNaN(aBoxedNaN)).to.be.true
      })
    })

    describe('`_z.isAnyNumber` & BigInt', () => {
      it('`_z.isAnyNumber` recognises BigInt as a number', () => {
        expect(_z.isAnyNumber(aBigInt1)).to.be.true
        expect(_z.isAnyNumber(aBigInt2)).to.be.true
        expect(_z.isAnyNumber(aBigIntString)).to.be.true
      })
      it('`lodash _.isNumber` considers NaN as a number, unlike _z.isAnyNumber', () => {
        expect(_.isNumber(aBigInt1)).to.be.false
        expect(_.isNumber(aBigInt2)).to.be.false
        expect(_.isNumber(aBigIntString)).to.be.false
      })
    })
  })

  describe('`_Β.isAnyNumber` recognises all types correctly:', () => {
    for (const typeName in singleTypesAndPossibleValues) {
      for (const value of singleTypesAndPossibleValues[typeName]) {
        const isNumberExamples = ['number', 'Number', 'bigint'].includes(typeName)

        it(`\`_z.isAnyNumber\` for '${typeName}' ${String(value)} returns ${isNumberExamples ? 'true' : 'false'}`, () => {
          if (isNumberExamples) {
            expect(_z.isAnyNumber(value)).to.be.true
          } else {
            expect(_z.isAnyNumber(value)).to.be.false
          }
        })
      }
    }
  })
})
