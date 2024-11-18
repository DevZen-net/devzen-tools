import * as chai from 'chai'
import {
  manyTypesAndPossibleValues,
  singleTypesAndPossibleValues,
} from '../../../test-utils/test-data'
// local
import * as z from '../../index'

const { expect } = chai

describe('z.isSingle:', () => {
  describe('isSingle correctly recognises Single (non-many) value types:', () => {
    for (const typeName in singleTypesAndPossibleValues) {
      for (const value of singleTypesAndPossibleValues[typeName]) {
        it(`\`isSingle\` recognises all '${typeName}' as a Single Type`, () => {
          expect(z.isSingle(value)).to.be.true
        })
      }
    }
  })

  describe('isSingle correctly recognises "Many" value types as NON-single:', () => {
    for (const typeName in manyTypesAndPossibleValues) {
      for (const value of manyTypesAndPossibleValues[typeName]) {
        it(`\`isSingle\` recognises all '${typeName}' as a NON-Single Type`, () => {
          expect(z.isSingle(value)).to.be.false
        })
      }
    }
  })
})
