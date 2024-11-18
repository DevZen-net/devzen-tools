import * as _ from 'lodash'
import { ILoopOptions, loop } from '../loopzen/loop'
import { isRef } from '../typezen/isRef'
import { isStrictNumber } from '../typezen/isStrictNumber'

const hasProp = {}.hasOwnProperty

/**
 * Default options for [`z.getRefs`](/functions/getRefs.html)
 */
export const getRefs_DefaultOptions = {
  depth: true,
}

/**
 * Options type for [`z.getRefs`](/functions/getRefs.html)
 */
export interface GetRefsOptions extends ILoopOptions<any, any, any, any, any> {
  depth?: boolean | number
}

/**
 *  Gets a flat list of all references of an isMany value (Array, Object, Set, Map etc) & returns them as an array.
 *
 *  @param value The Object or Array to get all references
 *
 *  @param options `IgetRefsOptions` extends `IloopOptions`, to control the behavior of this function (which keys to consider etc), so you can pass any of these options to affect the comparison.
 *
 *  You can also use :
 *
 * `depth`: If `depth` is true, all references in nested Objects/Arrays are retrieved. If number, then it is the max depth to consider. If false or 0, only top-level references are considered. Default is true.
 *
 *  @param refsSet The Set to which all references are pushed. If not passed, a new Set is created and returned.
 *
 *  @returns Array of all references in the Object or Array
 */
export const getRefs = (
  value: any[] | object,
  options?: GetRefsOptions,
  refsSet: Set<any> = new Set(),
  _currentDepth = 0
): Set<any> => {
  options = _.extend({}, getRefs_DefaultOptions, options)
  // console.log('getRefs options', options)
  return getRefs_internal(value, options, refsSet, _currentDepth)
}

const getRefs_internal = (
  value: any[] | object | symbol,
  options: GetRefsOptions,
  refsSet: Set<any>,
  _currentDepth: number
) => {
  // console.log('###### getRefs_internal #####', value, _currentDepth)
  for (const [v] of loop(value, {
    ...options,
    props: _.isFunction(value) ? true : options.props,
  })) {
    // console.log('---- v =', v, _.isObject(v), _currentDepth)
    if (isRef(v) && !refsSet.has(v)) {
      // console.log('add v', v)

      refsSet.add(v)
      if (
        options.depth === true ||
        (isStrictNumber(options.depth) && options.depth > _currentDepth)
      ) {
        getRefs_internal(v, options, refsSet, _currentDepth + 1)
      }
    }
  }

  return refsSet
}
