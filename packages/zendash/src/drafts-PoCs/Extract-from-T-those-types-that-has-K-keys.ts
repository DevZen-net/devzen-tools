/** Extract from T those types that has K keys
 * https://github.com/microsoft/TypeScript/issues/44253#issuecomment-1269535891
 **/

type ExtractByKey<T, K extends keyof any> = T extends infer R
  ? K extends keyof R
    ? R
    : never
  : never

// test
// type Tnamed = { name: string }
interface Tnamed {
  name: string
  num: number
}
// All these fail
// type ExtractByKeyTest = ExtractByKey<'name' | 'age', Tnamed>
// type ExtractByKeyTest = ExtractByKey<Tnamed, string>
// expectType<TypeEqual<ExtractByKeyTest, string>>(true)
// expectType<TypeEqual<ExtractByKeyTest, number>>(true)
// expectType<TypeEqual<ExtractByKeyTest, 'name'>>(true)
// expectType<TypeEqual<ExtractByKeyTest, 'name' | 'age'>>(true)
// expectType<TypeEqual<ExtractByKeyTest, 'age'>>(true)
