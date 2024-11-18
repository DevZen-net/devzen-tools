import * as chai from 'chai'
import * as _ from 'lodash'
import { singleTypesAndPossibleValues } from '../../../test-utils/test-data'
// local
import * as z from '../../index'

const { expect } = chai

const aNaN = Number('foo')
const aBoxedNaN = new Number(NaN)
const aBigInt1 = BigInt('123456789123456789')
const aBigInt2 = 123_456_789_123_456_789n
const aBigIntString =
  '123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789'
const aBoxedNumber = new Number(123)

describe('isAnyNumber & its usage:', () => {
  describe('`z.isAnyNumber` recognises all "proper" numbers', () => {
    it('`z.isAnyNumber` recognises all kinds of numbers, even if its a string', () => {
      expect(z.isAnyNumber(123)).to.be.true
      expect(z.isAnyNumber(123.456)).to.be.true
      expect(z.isAnyNumber('123')).to.be.true
      expect(z.isAnyNumber('123.456')).to.be.true
      expect(z.isAnyNumber(Number('123'))).to.be.true
      expect(z.isAnyNumber(new String('123'))).to.be.true
      expect(z.isAnyNumber(aBoxedNumber)).to.be.true
      expect(z.isAnyNumber(aBigIntString)).to.be.true
      expect(z.isAnyNumber(Number.POSITIVE_INFINITY)).to.be.true
    })

    it('`z.isAnyNumber` DOESNT allow ill-formed numbers, like NaNs', () => {
      expect(z.isAnyNumber('foobar is NaN')).to.be.false
      expect(z.isAnyNumber('123,456')).to.be.false
      expect(z.isAnyNumber(Number('123,456'))).to.be.false
      expect(z.isAnyNumber(new Number('123,456'))).to.be.false
      expect(z.isAnyNumber(new Date() as any)).to.be.false
    })

    describe('`z.isAnyNumber` & NaNs', () => {
      it('`z.isAnyNumber` doesnt recognise plain NaN as a number', () => {
        expect(z.isAnyNumber(aNaN)).to.be.false
      })
      it('`z.isAnyNumber` doesnt recognise Boxed NaN as a number', () => {
        expect(z.isAnyNumber(aBoxedNaN)).to.be.false
      })
      it('`lodash _.isNumber` considers NaN & boxed NaN as _.isNumber, unlike z.isAnyNumber', () => {
        expect(_.isNumber(aNaN)).to.be.true
        expect(_.isNumber(aBoxedNaN)).to.be.true
        expect(_.isNaN(aNaN)).to.be.true
        expect(_.isNaN(aBoxedNaN)).to.be.true
      })
    })

    describe('`z.isAnyNumber` & BigInt', () => {
      it('`z.isAnyNumber` recognises BigInt as a number', () => {
        expect(z.isAnyNumber(aBigInt1)).to.be.true
        expect(z.isAnyNumber(aBigInt2)).to.be.true
        expect(z.isAnyNumber(aBigIntString)).to.be.true
      })
      it('`lodash _.isNumber` considers NaN as a number, unlike z.isAnyNumber', () => {
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

        it(`\`z.isAnyNumber\` for '${typeName}' ${String(value)} returns ${isNumberExamples ? 'true' : 'false'}`, () => {
          if (isNumberExamples) {
            expect(z.isAnyNumber(value)).to.be.true
          } else {
            expect(z.isAnyNumber(value)).to.be.false
          }
        })
      }
    }
  })
})
