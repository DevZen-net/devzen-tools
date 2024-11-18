import * as _ from 'lodash'
import { ILoopOptions, loop } from '../loopzen/loop'
import { type } from '../typezen/type'

/**
 * Default options for [`z.isDisjoint`](/functions/isDisjoint.html)
 */
export const isDisjoint_DefaultOptions = {
  equality: (v1: object, v2: object): boolean => v1 === v2,
}

/**
 * Options interface for [`z.isDisjoint`](/functions/isDisjoint.html)
 */
export interface IsDisjointOptions extends ILoopOptions<any, any, any, any, any> {
  // @todo: add IterarorOptions default generic types
  equality: (v1: object, v2: object) => boolean
}

/**
 * Returns true if there are no common values between the elements of the two Arrays or Sets (i.e their intersection is empty)
 *
 * @param arrayOrSet1 The first Array or Set
 *
 * @param arrayOrSet2 The second Array or Set
 *
 * @param options `TisDisjointOptions` extends `IloopOptions`, to control the behavior of this function (which keys/values to consider etc), so you can pass any of these options to affect the comparison.
 *
 *  You can also use:
 *
 *  - `equality` to change the default equality which is strict equality `===`. If you pass an equality function, it will be called with (v1, v2) and should return true if the two values are equal.
 *
 * @returns true if there are no common values, false if there are common values
 */
export const isDisjoint = (
  arrayOrSet1: any[] | Set<any>,
  arrayOrSet2: any[] | Set<any>,
  options?: IsDisjointOptions
) => {
  const set1Type = type(arrayOrSet1)
  const set2Type = type(arrayOrSet2)

  if (set1Type !== 'Set' && set1Type !== 'Array' && set2Type !== 'Set' && set2Type !== 'Array')
    throw new Error(
      `z.isSetEqual(): Both sets must be either of type (Array or Set), but got '${set1Type}' & '${set2Type}'`
    )

  options = _.extend({}, isDisjoint_DefaultOptions, options)
  const { equality } = options
  let found = false

  for (const [v1] of loop(arrayOrSet1, options)) {
    for (const [v2] of loop(arrayOrSet2, options)) {
      if (equality(v1, v2)) {
        found = true
        break
      }
    }
    if (found) break
  }

  return !found
}
