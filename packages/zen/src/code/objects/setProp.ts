import * as _ from 'lodash'
import { isRealObject } from '../typezen/isRealObject'

/**
 * Options interface for [`z.setProp`](../functions/setProp.html)
 */
export interface SetPropOptions {
  separator?: string
  create?: boolean
  overwrite?: boolean | string
}

/**
 * Default options for [`z.setProp`](../functions/setProp.html)
 */
export const setProp_DefaultOptions = {
  separator: '/',
  create: false,
  overwrite: false,
}

/**
 *  Sets a *value* to an *object*, to a given *path* that's either:
 *
 *  - a textual `string` path with a separator, eg `some/path/in/object`
 *
 *  - a `string[]` of path names, eg `['some', 'path', 'in', 'object']`
 *
 *  There are a few twists while walking the path - see `options` param below.
 *
 *  @param objectOrArray The Object or Array in which to set the `value` to.
 *
 *  @param paths either a path as a `string` (separated by separator) or a `(string|number)[]` array of path key names. @todo: test number[] too
 *
 *  @param value the value to set, can be anything
 *
 *  @param options options to use while walking the path:
 *
 *  - `separator: string = '/'` the separator to use when splitting the path string. Default is `/`
 *
 *  - `create: boolean = false` if truthy, it creates a new `{}` for missing paths. If falsey, if there is a non [`z.isRealObject`](../functions/isRealObject.html) while expanding the path, it doesn't create a new `{}` and it doesn't set the value. Default is `false`.
 *
 *  - `overwrite: string | boolean = false` if true (or truthy string), objects paths that don't exist are created, just like `create: true`. But also, non [`z.isRealObject`](../functions/isRealObject.html) values are replaced by a new `{}` that will 'hold' this new path. If it is a String, then a key/prop by that name is created on the new `{}`, holding the old value that was overwritten. Default is `false`.
 *
 *  - @todo: NOT IMPLEMENTED `merge` {boolean} If true, objects at the same path are `_.merge`, instead of overwritten.
 *
 * @returns {boolean} true if the value was set, false if it wasn't set (eg because of `create: false` or `overwrite: false`)
 */
export const setProp = (
  objectOrArray: object | any[],
  paths: string | string[],
  value: any,
  options: SetPropOptions = setProp_DefaultOptions
): boolean => {
  if (options !== setProp_DefaultOptions) _.defaults(options, setProp_DefaultOptions)

  if (!_.isArray(paths)) {
    if (_.isString(paths)) {
      paths = paths.split((options as any).separator).filter((pt) => !!pt)
    } else
      throw new TypeError(
        `z.setProp Error: invalid path: ${paths}. Use either an Array, eg ['path1', 'path2'] or separator-ed String, eg) 'path1.path2'`
      )
  }

  if (!_.isObject(objectOrArray))
    throw new TypeError(`z.setProp Error: invalid object: ${objectOrArray}`)

  let pathProp
  let newObj

  for (let pi = 0; pi < paths.length; pi++) {
    pathProp = paths[pi]
    if (!isRealObject(objectOrArray[pathProp])) {
      if (options.create || options.overwrite) {
        // either true or a string will do
        newObj = null
        // if there is no value
        if (_.isUndefined(objectOrArray[pathProp])) {
          newObj = {} // use this
        } else if (options.overwrite) {
          newObj = {} // use this
          if (_.isString(options.overwrite)) newObj[options.overwrite] = objectOrArray[pathProp] // preserve current value of `o[p]`
        }

        if (newObj) objectOrArray[pathProp] = newObj
      } else if (_.isUndefined(objectOrArray[pathProp])) return false // wont set value on inexistent path
    }
    if (pi < paths.length - 1) {
      // the last one is our {} to mutate
      objectOrArray = objectOrArray[pathProp]
    }
  }

  if (_.isObject(objectOrArray)) {
    objectOrArray[pathProp] = value
    return true
  } else {
    return false
  }
}
