import * as chai from 'chai'
import {
  manyTypesAndPossibleValues,
  singleTypesAndPossibleValues,
} from '../../../test-utils/test-data'
// local
import * as _z from '../../index'
import { each } from '../../index'

const { expect } = chai

// @todo: remove any / casting monsters

describe('_z.isMany:', () => {
  describe('_z.isMany correctly recognises Single (non-many) value types:', () => {
    each(singleTypesAndPossibleValues, (value, typeName) => {
      each((singleTypesAndPossibleValues as any)[typeName as any], (value) => {
        it(`_z.isMany recognises '${typeName as string}' value ${String(value)} as non-Many (i.e) Single Type`, () => {
          expect(_z.isMany(value)).to.be.false
        })
      })
    })
  })

  describe('_z.isMany correctly recognises "isMany" value types as NON-single:', () => {
    each(manyTypesAndPossibleValues, (value, typeName) => {
      each((manyTypesAndPossibleValues as any)[typeName as string], (value) => {
        it(`_z.isMany recognises '${typeName as string}' value ${String(value)} as a "Many" Type`, () => {
          expect(_z.isMany(value)).to.be.true
        })
      })
    })
  })
})
