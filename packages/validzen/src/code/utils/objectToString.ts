import * as _z from '@neozen/zendash'
import * as _ from 'lodash'

const padding = (depth) => _.repeat('  ', depth)

/**
 * - Converts object to string, solving circular references that JSON.stringify() can't handle.
 * - Doesnt print "FooClass {foo: bar}" but instead prints "{foo: bar}", same for Array etc, unlike `node.inspect()` where you can't disable it!
 *
 * @todo(151): UGLY! found on stackoverflow, lost link ;-(
 *            Refactored slightly, but needs replacing with something better or refactor more & test!
 *
 * @param value
 *
 * @param depth
 * @returns string, unless its an non PropBag value, in which case it returns the value it self
 */
export const objectToString: any = (value, depth = 1): any | string => {
  if (_z.isSingle(value)) return value

  let result = ''
  if (typeof value === 'function') return value.toString()

  let checkLength: number
  let checkIdx = 0 // WTF is na?
  if (typeof value === 'object') {
    if (!objectToString.check) objectToString.check = []

    for (checkLength = objectToString.check.length; checkIdx < checkLength; checkIdx++) {
      if (objectToString.check[checkIdx] === value) return `({CircularRef: ${checkIdx})`
    }
    objectToString.check.push(value)
  }
  let propSeparator = padding(depth)

  // use custom toString() if exists
  if (
    _z.isRealObject(value) &&
    value.toString?.toString() !== 'function toString() { [native code] }'
  ) {
    result = `\n${propSeparator}${value.toString()}`
  } // visit each prop
  else
    for (const prop in value) {
      if (!Array.isArray(value)) propSeparator = `${padding(depth)}'${prop}':`

      if (typeof value[prop] == 'string') result += `\n${propSeparator}'${value[prop]}',`
      else if (typeof value[prop] == 'object')
        result += `\n${propSeparator}${objectToString(value[prop], depth + 1)},`
      else result += `\n${propSeparator}${value[prop]},`
    }

  if (typeof value == 'object') objectToString.check.pop()

  return Array.isArray(value)
    ? `[${result.slice(0, -1)}\n${padding(depth - 1)}]`
    : `{${result.slice(0, -1)}\n${padding(depth - 1)}}`
}
