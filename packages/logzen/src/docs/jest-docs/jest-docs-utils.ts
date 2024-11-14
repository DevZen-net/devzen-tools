import * as _z from '@devzen/zendash'
import * as _ from 'lodash'

type ExpectedResult = any | null
/**
 * @todo: refactor and move to SpecZen - same code in ValidZen
 * @param expectedStuff
 */
export const getExpectedStringsAndResult = (
  expectedStuff: null | string | [string, ExpectedResult] | [string[], ExpectedResult]
): [string[] | null, any] => {
  // if expectedStrings is null, we don't care about expectedStrings / no output
  let expectedStrings: string[] | null
  // if expectedResult is null, we don't care about expectedResult
  let expectedResult: any = null

  if (_.isArray(expectedStuff)) {
    ;[expectedStrings, expectedResult] = expectedStuff as [string[], ExpectedResult]
    expectedStrings = expectedStrings === null ? null : _z.arrayize(expectedStrings)
  } else {
    expectedStrings = [expectedStuff]
  }

  if (_.isUndefined(expectedResult)) expectedResult = null

  if (_.isArray(expectedStrings))
    expectedStrings = expectedStrings.map((es) => {
      if (_z.isRealObject(es)) return JSON.stringify(es)
      if (_.isString(es)) return es
      throw new Error(`getExpectedStuff: Unknown value for expectedStrings:${es}`)
    })

  return [expectedStrings, expectedResult]
}
