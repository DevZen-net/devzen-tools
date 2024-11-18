import * as _ from 'lodash'
import { type } from './type'

/**
 *   Returns true if the two passed Sets or Arrays representing sets of items, are set-equal (i.e. they contain the same items, irrespective of items order).
 *
 *   By default, the comparison is done with strict equality (i.e `===`), but you can pass 1 or 2 custom comparators.
 *
 *   The second comparator:
 *
 *   * defaults to a `_.flip` version of the first one (which defaults to strict `===` equality)
 *
 *   * is used on the 2nd array, to check if it contains the item from the 1st array
 *
 *   Based on lodash _.differenceWith.
 *
 *   Examples:
 *
 *      // primitives
 *      z.isSetEqual([1, 2, 3], [3, 2, 1]) // true
 *      z.isSetEqual([1, 2, 3], [4, 3, 2, 1]) // false
 *      z.isSetEqual([1, 2, 3, 'John', 'Doe'], ['John', 3, 'Doe', 2, 1]) // true
 *
 *      // objects / refs
 *      z.isSetEqual([{ a: 1 }, { b: 2 }, { c: 3 }], [{ c: 3 }, { b: 2 }, { a: 1 }]) // false
 *      z.isSetEqual([{ a: 1 }, { b: 2 }, { c: 3 }], [{ c: 3 }, { b: 2 }, { a: 1 }], _.isEqual) // true
 *
 *      // custom comparator
 *      z.isSetEqual(
 *        [{ a: 1 }, { b: 2 }, { c: 3 }],
 *        [{ c: 3 }, { b: 2 }, { a: 1, extraPropButObjectIn1stArray_isLikeThis:111 }],
 *        z.isLike
 *      ) // true
 *
 *      z.isSetEqual(
 *        [{ a: 1, extraPropButObjectIn2ndArray_isFlipLikeThis:111  }, { b: 2 }, { c: 3 }],
 *        [{ c: 3 }, { b: 2 }, { a: 1}],
 *        _.flip(z.isLike)
 *      ) // true
 *
 *   @todo(222): typings / Generic args
 *
 *   @param set1 1st Array set
 *   @param set2 2nd Array set
 *   @param comparator1 Function used to compare items from the 1st array with items from the 2nd array
 *   @param comparator2 Function used to compare items from the 2nd array with items from the 1st array
 */
export const isSetEqual = (
  set1: any[] | Set<any>,
  set2: any[] | Set<any>,
  comparator1?: (a: any, b: any) => boolean,
  comparator2?: (a: any, b: any) => boolean
) => {
  // console.log('\nisSetEqual 1:', set1, )
  // console.log('isSetEqual 2:', set2)

  if (set1 === set2) return true

  const set1Type = type(set1)
  const set2Type = type(set2)

  if (set1Type !== set2Type)
    throw new Error(
      `z.isSetEqual(): Both sets must be of the *same* type (Array or Set), but got '${set1Type}' & '${set2Type}'`
    )

  if (set1Type !== 'Set' && set1Type !== 'Array')
    throw new Error(
      `z.isSetEqual(): Both sets must be of type (Array or Set), but got '${set1Type}' & '${set2Type}'`
    )

  if (type(set1) === 'Set') {
    set1 = [...set1]
    set2 = [...set2]
  }

  if (!comparator1) comparator1 = (a, b) => a === b
  if (!comparator2) comparator2 = _.flip(comparator1)

  return (
    _.isArray(set1) &&
    _.isArray(set2) &&
    set1.length === set2.length &&
    _.isEmpty(_.differenceWith(set1, set2, comparator1 as any)) &&
    _.isEmpty(_.differenceWith(set2, set1, comparator2 as any))
  )
}
