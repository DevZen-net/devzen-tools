// eslint-disable-next-line import/no-extraneous-dependencies
import * as chai from 'chai'
import * as _ from 'lodash'
import * as z from '../code/index'

const { expect } = chai

// Mimic & extend http://api.qunitjs.com/category/assert/
// A STRICT comparison assertion, like qunits strictEqual.

export const equal = function (a, b) {
  expect(a).to.equal(b)
}

export const notEqual = function (a, b) {
  expect(a).to.not.equal(b)
}

// A boolean assertion, equivalent to CommonJS’s assert.ok() and JUnit’s assertTrue(). Passes if the first argument is truthy.
export const ok = function (a) {
  expect(a).to.be.ok
}

export const notOk = function (a) {
  expect(a).to.be.not.ok
}

export const tru = function (a) {
  expect(a).to.be.true
}

export const fals = function (a) {
  expect(a).to.be.false
}

/* using z.isXXX to construct some helpers */
// helper z.isEqual & z.isLike that prints the path where discrepancy was found
export const are = function (name, asEqual = true) {
  return function (a, b) {
    let path
    const isEq = z[name](a, b, {
      path: (path = []),
      allProps: true,
      exclude: ['inspect'],
    })
    if (asEqual) {
      if (!isEq) {
        console.warn(
          `Discrepancy, expected \`true\` from z.${name} \n at path:`,
          path.join('.'),
          '\n left value =',
          z.getProp(a, path),
          '\n right value =',
          z.getProp(b, path),
          '\n left Object = \n',
          a,
          '\n right Object = \n',
          b
        )
      }
      expect(isEq).to.be.true
    } else {
      if (isEq) {
        console.warn(`Discrepancy, expected \`false\` from z.${name}, but its \`true\`.`)
      }
      expect(isEq).to.be.false
    }
  }
}

export const createEqualSet = function (
  asEqual: boolean,
  comparator: (a, b) => boolean = (a, b) => a === b,
  deduplicate = true // deduplicate arrays
) {
  return function (result, expected) {
    // allow flexibility for testing, to compare Array & Set for set equality
    result = _.isArray(result) ? (deduplicate ? [...new Set(result)] : result) : [...result]
    expected = _.isArray(expected)
      ? deduplicate
        ? [...new Set(expected)]
        : expected
      : [...expected]

    const isEq = z.isSetEqual(result, expected, comparator)
    if (asEqual) {
      if (!isEq) {
        console.warn(
          '\n createEqualSet z.isSetEqual expected `true`',
          `\nexpected =`,
          expected,
          `\nresult =`,
          result,
          '\n result \\ expected \n',
          _.differenceWith(result, expected, comparator),
          '\n expected \\ result \n',
          _.differenceWith(expected, result, comparator)
        )
      }
      expect(isEq).to.be.true
      return true
    } else {
      if (isEq) {
        console.warn('\n z.isSetEqual expected `false`, got `true`', `\nresult =`, result)
      }
      expect(isEq).to.be.false
      return true
    }
  }
}

export const equalSetStrict = createEqualSet(true)
export const notEqualSetStrict = createEqualSet(false)
export const equalSetDeep = createEqualSet(true, _.isEqual)
export const notEqualSetDeep = createEqualSet(false, _.isEqual)

// A deep recursive comparison assertion, working on primitive types, arrays, objects, regular expressions, dates and functions.
export const deepEqual = are('isEqual')
export const notDeepEqual = are('isEqual', false)
export const exact = are('isExact')
export const notExact = are('isExact', false)
export const iqual = are('isIqual')
export const notIqual = are('isIqual', false)
export const ixact = are('isIxact')
export const notIxact = are('isIxact', false)
export const like = are('isLike')
export const notLike = are('isLike', false)
export const likeBA = (a, b) => like(b, a) // reverse a,b

export const notLikeBA = function (a, b) {
  return notLike(b, a) // reverse a,b
}

const specHelpers = {
  equal,
  notEqual,
  tru,
  fals,
  ok,
  notOk,
  deepEqual,
  notDeepEqual,
  exact,
  notExact,
  iqual,
  notIqual,
  ixact,
  notIxact,
  like,
  notLike,
  likeBA,
  notLikeBA,
  equalSetStrict,
  notEqualSetStrict,
  equalSetDeep,
  notEqualSetDeep,
}

global.specHelpers = specHelpers
global.spH = specHelpers
