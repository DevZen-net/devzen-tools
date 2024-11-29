import { numberEnumToNumberVal } from './numberEnumToNumberVal'

/**
 * Returns the validated & existing enum "string key" part of a "numeric" enum (the string at left hand side), given either side (the string or number part) of a "numeric" enum.
 *
 * Features / Notes:
 * - The number part can be given as a number or parseable string number.
 * - The string part can be given the exact string key, or lower, upper or capitalized form of the string. // @todo: make this optional
 * - It should maintain the right types of Enum / Enum keys, eg `keyof TEnumType` as a string
 *
 * @see [`z.numberEnumToNumberVal()`](../functions/numberEnumToNumberVal.html) for the reverse function
 *
 * @todo: Curry this function, maintain types:
 *  - `_.curry`, return type is string, instead of keyof `TEnumType`
 *  - @miyauci/curry not working at all, types are lost
 *  - fails also https://stackoverflow.com/questions/74082800/how-to-define-overloaded-curry-function-in-typescript
 *
 * @param theEnum a numeric enum eg `enum AB {a: 1, b: 2}`
 *
 * @param value the value of the `enum` to convert to a `number` (eg `B` or `2` or `'2'` or `AB.a` or `AB.b`). Strings are considered in lower, upper & capitalized forms.
 *
 * @returns keyof `TEnumType` as a `string`
 */
export const numberEnumToStringKey = function <
  TEnumType extends Record<string, string | number>,
>(theEnum: TEnumType, value: string | number): keyof TEnumType | undefined {
  const numberPart = numberEnumToNumberVal(theEnum, value)
  return (theEnum as any)[numberPart] as any // @todo: if `as keyof TEnumType` used, we get TS2536: Type TEnumType[keyof TEnumType] cannot be used to index type TEnumType
}

// Quick type testing:

// enum AB {
//   a1 = 'aaa',
//   a = 1,
//   b = 2,
// }
// // v1: "a1" | "a" | "b" = numberEnumToStringKey(AB, 'A')
// const v1 = numberEnumToStringKey(AB, 'A')
// const v2 = numberEnumToStringKey(AB, 1)
// // const v3 = numberEnumToStringKey(AB)(1) // curried
//
// // const v1InEnum: AB = AB[v1]
// const v1InEnum = AB[v1]
//
// const fun = (...val: (keyof typeof AB)[]) => {
//   console.log('aaaa2', val)
//   console.log('v1InEnum', v1InEnum)
// }
//
// if (2 === 2) fun(v1, v2)
