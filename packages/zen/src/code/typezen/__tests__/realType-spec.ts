import * as chai from 'chai'
import * as _ from 'lodash'
import { allRealTypesAndPossibleValues } from '../../../test-utils/test-data'
import { toStringSafe } from '../../utils'

// local
import { realType, TYPE_TO_REAL_TYPE_FUNCTIONS } from '../realType'

const { expect } = chai

describe('`z.realType`:', () => {
  describe('`z.realType` recognises real-world types:', () => {
    const onlyRealTypesAndPossibleValues = _.omit(
      allRealTypesAndPossibleValues,
      _.keys(TYPE_TO_REAL_TYPE_FUNCTIONS)
    )

    for (const typeName in onlyRealTypesAndPossibleValues) {
      describe(`${typeName}`, () => {
        for (const value of onlyRealTypesAndPossibleValues[typeName]) {
          it(`${toStringSafe(value)}`, () => {
            expect(realType(value)).to.equal(typeName)
          })
        }
      })
    }
  })
})
