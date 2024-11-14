import { expectType, TypeEqual } from 'ts-expect'

interface TnamedNum {
  name: string
  num: number
}

type KeyofUnion<T> = T extends infer R ? keyof R : never

// they seem equal, so what's the benefit?
type KeyofInterface = keyof TnamedNum
type KeyofUnionTest = KeyofUnion<TnamedNum>
expectType<TypeEqual<KeyofUnionTest, KeyofInterface>>(true)
expectType<TypeEqual<KeyofUnionTest, 'name' | 'num'>>(true)
