import * as _ from 'lodash'

/**
 * Default options for [`z.getProp`](/functions/getProp.html)
 */
export const getProp_DefaultOptions: GetPropOptions & { separator: '/' } = {
  separator: '/',
  returnLast: false,
  inherited: false,
  // defaultKey: undefined,
  // stopDefaultKey: undefined,
  // terminateKey: undefined,
}

/**
 * Options interface for [`z.getProp`](/functions/getProp.html)
 */
export interface GetPropOptions {
  separator?: string
  defaultKey?: string
  stopDefaultKey?: string
  terminateKey?: string
  returnLast?: boolean
  fullResult?: boolean
  inherited?: boolean
}

const keyIn = (objectOrArray: any, key: string, inherited?: boolean): boolean =>
  inherited ? _.hasIn(objectOrArray, key) : _.has(objectOrArray, key)

/**
 * Gets a value from an Object, with a given path. If no valid path exists, `undefined` is returned.
 *
 * Example:
 *
 * ```
 * const o = { a: { b: { c: 'value at a/b/c' } } }
 *
 * z.getProp(o, '/a/b') // returns { c: 'value at a/b/c' }
 * z.getProp(o, 'a.b.c', {separator: '.'}) // returns 'value at a/b/c'
 * z.getProp(o, ['a', 'b', 'c'], {fullResult: true}) // returns ['value at a/b/c', ['a', 'b', 'c'], true]
 * ```
 *
 * There are several twists while walking the path and what should be returned, using the `options` param - see below.
 *
 * @param objectOrArray - The object or array to retrieve the value from.
 *
 * @param [path = ''] - A path representation, given either as:
 *
 * - a textual `string` path with a customized `separator`, eg `some/path/in/object/or/array`
 *
 * - a `string[]` of path names, eg `['some', 'path', 'in', 'object', 'or', 'array']`
 *
 * If it is a string, the separator can exist in the beginning and/or end of the string or even as extra in between, and it will be ignored (eg `/some/path/` is equivalent to `some/path`). If it is an array, empty/falsey keys (i.e `''`) are also ignored.
 *
 * @param [options = getProp_DefaultOptions] - the options object has the following keys (all optional):
 *
 *  - `separator: string = '/'` The separator to split a string path with. The defaultKey is `'/'`. If a path is an array, this is ignored.
 *
 *  - `defaultKey: string` The `defaultKey` to retrieve, if requested path key is not found. Rules are:
 *
 *    - If the path key is not found **at the specific path level**, then it attempts to retrieve the `defaultKey` of that level, instead of giving up.
 *
 *    - If `defaultKey` key is found, it continues as if the original requested not-found key was found, but using the value stored at that `defaultKey` key.
 *
 *    - Path walking continues as normal, as if the `defaultKey` value was the non-existent key value at this specific level.
 *
 *  - `stopDefaultKey: string` Similar to `defaultKey`, the `stopDefaultKey` is used if original not found, but then it stops walking and returns it. Rules are:
 *
 *     - If a path key is not found **at the specific path level**, then it attempts to retrieve the `stopDefaultKey` of that level, instead of giving up.
 *
 *     - If a value is found on `stopDefaultKey`, it stops walking and the returns that value (unlike `defaultKey` which continues walking).
 *
 *  - `terminateKey: string` terminates all further walking, even if the path key requested exists. Instead it returns the value stored at `terminateKey`)
 *
 *     Example: assume the following object, with `terminateKey = '|'` and `separator = '/'`:
 *
 *      ```
 *       {
 *         a: {
 *            b: {
 *              c: {
 *                d: 'Actual a/b/c/d Value'
 *              }
 *            },
 *            '|': 'The terminated Value'
 *          }
 *        }
 *      ```
 *
 *    with (a valid) path `'a/b/c/d'` the result will be `'The terminated Value'` instead of `'Actual a/b/c/d Value'`.
 *
 *
 *    **Note**: Precedence is `terminateKey`, `stopDefaultKey` & finally `defaultkey`:
 *
 *      - `terminateKey` (if it exists) is always returned and path walking stops (even if `pathKey` exists)
 *
 *      - if there is no `terminateKey` and the `pathKey` doesn't exist:
 *
 *        - it looks for `stopDefaultKey` and returns it, stopping further path walking
 *
 *        - otherwise, if `defaultkey` exists, it's used as the value, and it continues walking the path
 *
 *  - `returnLast: boolean = false` If `true`, it returns the last value found so far, instead of returning undefined, if a path key is not found. # @todo: spec it, not non-undefined, but existing key
 *
 *  - `fullResult: boolean = false` If `true`, then along with the value, it also returns the full walked path & whether the full path was waled as `['valueFound', ['path', 'toThe', 'foundValueKey'], true]`.
 *
 *  - `inherited: boolean = false` If `true`, it will also check for inherited keys, not just own keys in objects.
 *
 * @returns {any | [any, string[]], boolean} the value found, or `['valueFound', ['path', 'that', 'was', 'walked'], true]` if `fullResult` is true, that can be used as `const [value, walkedPath, isFound] = z.getProp(o, {fullResult: true})` and:
 *
 *  - `value` is the valid value is found, or the `lastValue` found if `returnLast` is true, or undefined otherwise
 *
 *  - `walkedPath` is the path walked, as an array of strings. You can easily check if `terminalKey` or `stopDefaultKey` was used via `_.last(walkedPath) === terminalKey` etc.
 *
 *  - `isFound` is true if the *full path* was walked (including substitutions via `defaultKey` & `stopDefaultKey`), false otherwise
 *
 * @todo: revise and use [Get from type-fest](https://github.com/sindresorhus/type-fest/blob/main/source/get.d.ts)
 */
export const getProp = (
  objectOrArray: any[] | object,
  path: string | number | (string | number)[] = '',
  options: GetPropOptions = getProp_DefaultOptions
): [any, string[], boolean] | any => {
  if (options !== getProp_DefaultOptions)
    options = _.defaults({}, options, getProp_DefaultOptions)

  const {
    separator,
    stopDefaultKey,
    terminateKey,
    defaultKey,
    returnLast,
    fullResult,
    inherited,
  } = options as GetPropOptions & {
    separator: string
  }

  // handle path
  if (!_.isArray(path)) {
    if (_.isString(path)) {
      path = path.split(separator)
    } else {
      if (_.isNumber(path)) {
        path = [`${path}`]
      } else {
        if (path === undefined) {
          return objectOrArray
        } else {
          throw new Error(`Zen: z.getProp Error: invalid path: ${path}`)
        }
      }
    }
  }

  // path is (string | number)[] below this

  const walkedPath: (string | number)[] = []
  let lastValue: any
  let isFound = true
  for (let pathKey of path) {
    pathKey = `${pathKey}`

    if (!pathKey) continue // ignore empty keys, go to next pathKey

    lastValue = objectOrArray

    // lets walk the path
    if (_.isObject(objectOrArray)) {
      // do we have the terminate key?
      if (terminateKey && keyIn(objectOrArray, terminateKey, inherited)) {
        objectOrArray = objectOrArray[terminateKey]
        walkedPath.push(terminateKey)
        break
      }

      // do we have a key to walk into?
      if (!keyIn(objectOrArray, pathKey, inherited)) {
        // original pathKey not found
        if (stopDefaultKey && keyIn(objectOrArray, stopDefaultKey, inherited)) {
          pathKey = stopDefaultKey
        } else {
          if (defaultKey && keyIn(objectOrArray, defaultKey, inherited)) {
            pathKey = defaultKey
          } else {
            // pathKey = undefined
            isFound = false
            // objectOrArray = undefined
            break
          }
        }
      }

      // we have a key to walk into
      objectOrArray = objectOrArray[pathKey]
      walkedPath.push(pathKey)

      if (pathKey === stopDefaultKey) break // and return it
    } else {
      // we have a single / primitive / scalar value, we can't walk anymore
      isFound = false
      break
    }
  }

  // finished walking the path
  const value = isFound ? objectOrArray : returnLast ? lastValue : undefined

  return fullResult ? [value, walkedPath, isFound] : value
}
