import * as _ from 'lodash'
import { ILoopOptions } from '../loopzen/loop'
import { getRefs } from './getRefs'
import { isDisjoint } from './isDisjoint'

/**
 * Default options for [`z.isRefDisjoint`](/functions/isRefDisjoint.html)
 */
export const isRefDisjoint_DefaultOptions = {
  depth: true,
}

/**
 * Options interface for [`z.isRefDisjoint`](/functions/isRefDisjoint.html)
 */
export interface IsRefDisjointOptions extends ILoopOptions<any, any, any, any, any> {
  depth?: boolean | number
}

/**
 *  Given two Property Bags (i.e any z.isRef, incl Objects, Arrays, Set, Maps, Symbols, Boxed primitives etc), it returns `true` if there are **NO common/shared References** in their entries/elements/properties.
 *
 *  Values like Arrays, Sets and Maps by default are compared by their "normal" contents, i.e their entries / elements. You can pass props: 'all' to compare them by their props as well.
 *
 *  @param oa1 The first Object (order doesn't matter)
 *
 *  @param oa2 The second Object
 *
 *  @param options TisRefDisjointOptions extends IloopOptions, to control the behavior of this function (which keys/values to consider etc).
 *
 *  You can also use :
 *
 *  * `depth: boolean = true` if true (default), then all nested references are considered. If number, then it is the max depth to consider. If false or 0, only top-level references are considered.
 */
export const isRefDisjoint = function (
  oa1: object,
  oa2: object,
  options?: IsRefDisjointOptions
) {
  let refs1: Set<any>
  let refs2: Set<any>
  options = _.extend({}, isRefDisjoint_DefaultOptions, options)

  if (oa1 === oa2) {
    return false
  } else {
    refs1 = getRefs(oa1, options)
    // refs1.unshift(oa1)
    refs2 = getRefs(oa2, options)
    // refs2.unshift(oa2)

    return isDisjoint(refs1, refs2)
  }
}
