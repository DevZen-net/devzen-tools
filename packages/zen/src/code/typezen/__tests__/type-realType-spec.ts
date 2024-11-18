import * as chai from 'chai'
import * as _ from 'lodash'
import { expectType } from 'ts-expect'
import {
  a_instance_withCommonProps,
  allTypesAndPossibleValues,
} from '../../../test-utils/test-data'
import { MANY_NAMES, RealTypeNames, SINGLE_NAMES } from '../../index'
import * as z from '../../index'
import { toStringSafe } from '../../utils'
import { TYPE_NAMES_ORDER } from '../type'

const { expect } = chai

describe('`z.type` & its associates:', () => {
  describe('`z.type` distinguishes all types', () => {
    for (const typeName in allTypesAndPossibleValues) {
      describe(`${typeName}`, () => {
        for (const value of allTypesAndPossibleValues[typeName]) {
          it(`${toStringSafe(value)}`, () => {
            expect(z.type(value)).to.equal(typeName)
          })
        }
      })
    }
  })

  it('lodash `_.isPlainObject(a_instance_withCommonProps) is false`', () => {
    expect(_.isPlainObject(a_instance_withCommonProps)).to.be.false // how bad is that ? We cant safely distinguish an {} from all others, if it is an instance.
  })
  it('lodash `_.isPlainObject(Object.create({})) is false`', () => {
    expect(_.isPlainObject(Object.create({}))).to.be.false // Thats even worse! We cant safely distinguish an {} from one with prototype!
  })

  it('isSetEqual(TYPE_NAMES, typesOrder)', () => {
    expect(z.isSetEqual(z.TYPE_NAMES, TYPE_NAMES_ORDER)).to.be.true
  })

  describe(`realType`, () => {
    expectType<RealTypeNames>('number')
    expectType<RealTypeNames>('string')
    expectType<RealTypeNames>('String')
    expectType<RealTypeNames>('Set')

    // @ts-expect-error
    expectType<RealTypeNames>('class')
    // @ts-expect-error
    expectType<RealTypeNames>('instance')
    // @ts-expect-error
    expectType<RealTypeNames>('function')
    // @ts-expect-error
    expectType<RealTypeNames>('realObject')

    // @ts-expect-error: Type 'function' is not assignable to type TrtypeName
    const wrong_T_REAL_TYPE_NAMES: RealTypeNames[] = SINGLE_NAMES
    // @ts-expect-error: Type 'realObject' is not assignable to type TrealTypeNames
    const wrong_T_REAL_TYPE_NAMES2: RealTypeNames[] = MANY_NAMES
  })
})
