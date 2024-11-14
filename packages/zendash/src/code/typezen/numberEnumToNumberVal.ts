import * as _ from 'lodash'

const isNormalNumber = (value: string | number): boolean =>
  _.isNumber(_.parseInt(`${value}`)) && !_.isNaN(_.parseInt(`${value}`))

/**
 * Returns the validated & existing `number value` part of a "numeric" enum (the right hand-side), given either side (the string or number part) of a "numeric" enum.
 *
 * Features / Notes:
 * - The number part can be given as a number or parseable string number.
 * - The string part can be given the exact string key, or lower, upper or capitalized form of the string. // @todo: make this optional
 * - It should maintain the right types of Enum / Enum keys, eg `keyof TEnumType` as a string
 *
 * * @see [`_z.numberEnumToStringKey()`](/functions/numberEnumToStringKey.html) for the reverse function
 *
 * @todo: Curry this function, maintain types:
 * - _.curry, return type is string, instead of keyof TEnumType
 * - @miyauci/curry not working at all, types are lost
 * - fails also https://stackoverflow.com/questions/74082800/how-to-define-overloaded-curry-function-in-typescript
 *
 * @param theEnum a numeric enum eg `enum AB {a: 1, b: 2}`
 *
 * @param value the value of the enum to convert to a number (eg `b` or `2` or `AB.a` or `AB.b`). Strings are considered in lower, upper & capitalized forms.
 *
 * @returns number
 */
export const numberEnumToNumberVal = <TEnumType extends Record<string, number | string>>(
  theEnum: TEnumType,
  value: string | number
): TEnumType[keyof TEnumType] | undefined => {
  if (isNormalNumber(value as any) && !_.isUndefined(theEnum[value])) {
    return ((value as any) * 1) as TEnumType[keyof TEnumType]
  }

  if (_.isString(value)) {
    const candidates = [value, _.toLower(value), _.toUpper(value), _.capitalize(value)]

    for (const cand of candidates) {
      if (isNormalNumber(theEnum[cand])) return _.parseInt(`${theEnum[cand]}`) as any
    }
  }

  return undefined
}

// Quick type testing:

// enum AB {
//   a = 1,
//   b = 2,
// }
//
// // v1: AB = numberEnumToNumberVal(AB, 'A')
// const v1 = numberEnumToNumberVal(AB, 'A')
// const v2 = numberEnumToNumberVal(AB, 1)
// const v3 = numberEnumToNumberVal(AB, 1)
//
// // const v1InEnum: string = AB[v1]
// const v1InEnum = AB[v1]
//
// const fun = (...vals: AB[]) => {
//   console.log('AB2', vals)
//   console.log('v1InEnum', v1InEnum)
// }
//
// if (2 === 2) fun(v1, v2, v3)
