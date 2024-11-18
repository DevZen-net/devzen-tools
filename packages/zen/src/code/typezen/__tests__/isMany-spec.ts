import * as chai from 'chai'
import {
  manyTypesAndPossibleValues,
  singleTypesAndPossibleValues,
} from '../../../test-utils/test-data'
// local
import * as z from '../../index'
import { each } from '../../index'

const { expect } = chai

// @todo: remove any / casting monsters

describe('z.isMany:', () => {
  describe('z.isMany correctly recognises Single (non-many) value types:', () => {
    each(singleTypesAndPossibleValues, (value, typeName) => {
      each((singleTypesAndPossibleValues as any)[typeName as any], (value) => {
        it(`z.isMany recognises '${typeName as string}' value ${String(value)} as non-Many (i.e) Single Type`, () => {
          expect(z.isMany(value)).to.be.false
        })
      })
    })
  })

  describe('z.isMany correctly recognises "isMany" value types as NON-single:', () => {
    each(manyTypesAndPossibleValues, (value, typeName) => {
      each((manyTypesAndPossibleValues as any)[typeName as string], (value) => {
        it(`z.isMany recognises '${typeName as string}' value ${String(value)} as a "Many" Type`, () => {
          expect(z.isMany(value)).to.be.true
        })
      })
    })
  })
})
