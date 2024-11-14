// import { Filter } from '../../code/types'
// import { TAny } from '../../code/types-utilities'
// import { getTinyLog } from '../../code/utils/tiny-log'
// const _log = getTinyLog(false, 'LogZen')
//
// // ObjectWithAnyKeyExceptXxxHack
//
// // PoC #1 Fail - see https://github.com/microsoft/TypeScript/issues/33318
//
// type FilterExcluded = Exclude<any, Filter>
//
// // PoC #2 Fail & abandoned
// type ExcludedTypes =
//   | Filter
//   | typeof Filter
//
// type AnythingBut<AllowedType, Excluded> = // Type extends (infer R) ?
//   AllowedType extends Excluded ? never : AllowedType // FAILS
//
// // type AnythingBut2<AllowedType, Excluded> = // Type extends (infer R) ?
// //   AllowedType extends Excluded ? (infer Excluded) =>
// //     // Excluded extends AllowedType ? never : AllowedType : AllowedType // FAILS
// //   // Excluded : never  // FAILS
//
// type AnythingButAppSpecificTypesOLD = AnythingBut<TAny, ExcludedTypes>
//
// type AnythingBut3<T> = T extends ExcludedTypes ? never : T
// // see https://learntypescript.dev/09/l2-conditional-infer
// // See https://stackoverflow.com/questions/58594051/typescript-object-with-any-keys-except-one
//
// // Poc #3 ObjectWithAnyKeyExceptXxxHack - KINDA WORKS - looks promising, to exclude a type by a key (ExcludeByKey)
//
// /**
//  * **ObjectWithAnyKeyExceptXxxHack**
//  *
//  * A workaround/hack/PoC to overcome TypeScript limitation to Exclude specific types from any!
//  *
//  * For context
//  *
//  *    Exclude<any, SomeType>
//  *
//  * does not work as you can't Exclude from any
//  *
//  * See
//  * - Exclude<Any, Whatever> & follow ups https://github.com/microsoft/TypeScript/issues/33318
//  * - Negated Types https://github.com/microsoft/TypeScript/issues/4196
//  *
//  * Using "infer" with exclusions also doesnt work here ;-(
//  *
//  * But with this "ObjectWithAnyKeyExceptXxxHack" we can restrict exactly what "types" we dont want!
//  *
//  * The idea is to create a type union with a special non-applicaiton key having `never`. That special key also exists on the type we want to exclude: `AllowedTypes & { specialUnusedKeyInExcludedType?: never }`
//  *
//  * Scroll to TestCase & Suite types to see how this is used.
//  *
//  * @see Inspired by
//  * https://stackoverflow.com/questions/58594051/typescript-object-with-any-keys-except-one/61990500#61990500
//  *    &&
//  * https://stackoverflow.com/questions/58594051/typescript-object-with-any-keys-except-one/58594586#58594586
//  *
//  * Also relevant:
//  *   - https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion
//  *   - https://github.com/sindresorhus/type-fest/blob/main/source/includes.d.ts
//  *   - https://stackoverflow.com/questions/51442157/type-for-every-possible-string-value-except
//  *   - https://stackoverflow.com/questions/60067100/why-is-the-infer-keyword-needed-in-typescript
//  */
//
// // stackoverflow.com/questions/58594051 code:
// type ObjectWithAnyKeyExceptFoo = {
//   [key: string]: string
// } & { foo?: never };
//
// function acceptAnyKeyAcceptFoo(obj: ObjectWithAnyKeyExceptFoo) {}
//
// acceptAnyKeyAcceptFoo({}); // okay
// acceptAnyKeyAcceptFoo({ a: "123" }); // okay
// acceptAnyKeyAcceptFoo({ a: "123", foo: "oops" }); // error!
// //  ----------------------------> ~~~
// // Type 'string' is not assignable to type 'undefined'.
// acceptAnyKeyAcceptFoo({ a: "123", foo: undefined }); // error!
// //  ----------------> ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Type 'undefined' is not assignable to type 'string'.
//
// const a: ObjectWithAnyKeyExceptFoo = { b: "hey" }
//
//
// type BadDefn = {
//   [key: string]: string;
//   foo?: never; // error! <== @todo: FAILS to fail! Fails OK in here, same TS version: https://www.typescriptlang.org/play?#code/C4TwDgpgBA8gRgKwgY2AdQJbABYEEB2IA0hCAKIAeyEYwAYgPYNQC8UA3gLABQUUA2gGtSALigBnYACcM+AOYBdMZJnyeAXygAyDlABmTAPxj8EAG4QpUdQG4ePPQFd8qDA3xQAhsmq0CxUlwfGnomAAoGRDF4JFRMHH8ScioQxgYASg57bnVs719gRMDg2jSw9nV0mygAehqoBkFPEB58kKKQIIKy9i8xACIARgAmAGZ+6yra+sbm1pLCwiSu1PDezwGR8YAafSYBpjBxCcrquqhLKQYpAEIec6gAWmeX17f3j4A+KAA-P-v6gAVcDQADkKlkclBUAw4ig+AYwC84nEGDk+E8cAANtBgMxQJAoKDnAATCB6WQQEmggB08wKHRWpTWfSgQzG-V2BgYYlJ5MpJMmZ3ql2ud24Dw+Use3z+cvlCsVSp+AKgwMJxPwZIppmpMLhCKRnhRaIx2Nx+JBRIh8lp2WQ7kkrJiKHQWDwS1IlG6TFYujgA2wpBO2R4BOgACFPCSACLkjxsLi8ATCEDKaSQpQSDPyOzJ7nGeHmSzCi5SK63AFyqAAHmeUD5Oqp+vhiORqPRmJxUDx2dUcg02XDsCaIDjenwEccwAACgwTdiQABVLX83V+pN8ISiPuZ9P9qAAHwbq6bJLzfALJmLUjzuW4YatuCx4gYMFHU+AACUIABHRwYFIEDiGkG48Fuqb7nuu65uBew8kWFi3hoQA
// //~~~ <-- undefined is not assignable to string
// }
//
// type OkayDefnButPossiblyUndefined = {
//   [key: string]: string | undefined;
//   foo?: never;
// }
//
// type AlsoOkayButRequiresFoo = {
//   [key: string]: string;
//   foo: never;
// }
//
// // Code from https://stackoverflow.com/questions/58594051/typescript-object-with-any-keys-except-one/61990500#61990500
//
// type keyOmit<T, U extends keyof any> = T & { [P in U]?: never }
// //As with above the same behaviour is observed:
//
// type ObjectWithAnyKeyExceptFoo2 = keyOmit<{ [key: string]: string }, "foo">
//
// function acceptAnyKeyAcceptFoo2(obj: ObjectWithAnyKeyExceptFoo2) {}
//
// acceptAnyKeyAcceptFoo2({}) // okay
// acceptAnyKeyAcceptFoo2({ a: "123" }) // okay
// acceptAnyKeyAcceptFoo2({ a: "123", foo: "oops" }) // error!
// //  ----------------------------> ~~~
// // Type 'string' is not assignable to type 'undefined'.
// acceptAnyKeyAcceptFoo2({ a: "123", foo: undefined }) // error!
// //  ----------------> ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Type 'undefined' is not assignable to type 'string'
// // Also note that you can use this specific type the same as the built in 'Omit' type so you can omit many keys with this (my particular use case)
//
// type ObjectWithAnyKeyExceptFooOrBar = keyOmit<{ [key: string]: string }, "foo" | "bar">
//
// function acceptAnyKeyAcceptFooOrBar2(obj: ObjectWithAnyKeyExceptFooOrBar) {}
//
// acceptAnyKeyAcceptFooOrBar2({}) // okay
// acceptAnyKeyAcceptFooOrBar2({ a: "123" }) // okay
// acceptAnyKeyAcceptFooOrBar2({ a: "123", foo: "oops" }) // error!
// //  ---------------------------------> ~~~
// // Type 'string' is not assignable to type 'undefined'.
// acceptAnyKeyAcceptFooOrBar2({ a: "123", bar: "oops" }) // error!
// //  ---------------------------------> ~~~
// // Type 'string' is not assignable to type 'undefined'.
// acceptAnyKeyAcceptFooOrBar2({ a: "123", foo: "oops", bar: "2nd oops" }) // error!
// //  ---------------------------------> ~~~          ~~~
//
// // My code plays:
// type ObjectWithAnyKeyExcept_ObjectWithAnyKeyExceptXxxHack = {
//   [key: string]: any
// } & { ObjectWithAnyKeyExceptXxxHack?: never }
//
// type InstanceWithAnyKeyExcept_ObjectWithAnyKeyExceptXxxHack = {
//   new (args: any): any
//   [key: string]: any
// } & {
//   ObjectWithAnyKeyExceptXxxHack?: never
// }
//
// type ExcludeSpecificType =
//   TAny
//   | ObjectWithAnyKeyExcept_ObjectWithAnyKeyExceptXxxHack
//   // | InstanceType<InstanceWithAnyKeyExceptFoo>
//   // | ((any) => any) // @todo: etc add all
//
// class ClassWithAnyKeyExceptXxxHack {
//   ObjectWithAnyKeyExceptXxxHack: string
// }
//
// // // Should fail
// const a1: TAny | ObjectWithAnyKeyExcept_ObjectWithAnyKeyExceptXxxHack = new ClassWithAnyKeyExceptXxxHack()
// const a2: TAny | ObjectWithAnyKeyExcept_ObjectWithAnyKeyExceptXxxHack = {ObjectWithAnyKeyExceptXxxHack: 'works!'}
// const a3: TAny | ObjectWithAnyKeyExcept_ObjectWithAnyKeyExceptXxxHack = {a:1, ObjectWithAnyKeyExceptXxxHack: 'works!'}
//
// // Should not fail
// const b1: ExcludeSpecificType = {}
// const b2: ExcludeSpecificType = new Object()
// const b3: ExcludeSpecificType = Object.create({})
// const b4: ExcludeSpecificType = 124
// const b5: ExcludeSpecificType = `124`
// const b6: ExcludeSpecificType = true
// const b7: ExcludeSpecificType = () => {}
//
//
//
//
