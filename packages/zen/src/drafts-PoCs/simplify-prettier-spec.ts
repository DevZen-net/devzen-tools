import { expectType, TypeEqual } from 'ts-expect'
import type { Simplify, TypedArray, ValueOf } from 'type-fest'

// WIP NOT WORKING
export type SimplifyAll<Tinput> =
  | Exclude<
      ValueOf<
        {
          [KeyType in keyof { a: 'a' }]:
            | Exclude<{ [KeyType in keyof Tinput]: Tinput[KeyType] } & {}, never>
            | 'FOOBAR'
        } & {}
      >,
      never
    >
  | 'FOOO'

describe('Simplify PoC', () => {
  it('Simplify PoC', () => {
    interface SomeInterface {
      foo: number
      bar?: string
      baz: number | undefined
    }

    type SomeType = {
      foo: number
      bar?: string
      baz: number | undefined
    }

    it('Simplify PoC tests', () => {
      const literal = { foo: 123, bar: 'hello', baz: 456 }
      const someType: SomeType = literal
      const someInterface: SomeInterface = literal

      function fn(object: Record<string, unknown>): void {}

      fn(literal) // Good: literal object type is sealed
      fn(someType) // Good: type is sealed
      // @ts-expect-error
      fn(someInterface) // Error: Index signature for type 'string' is missing in type 'someInterface'. Because `interface` can be re-opened
      fn(someInterface as Simplify<SomeInterface>) // Good: transform an `interface` into a `type`

      // Test Simplify:
      interface PersonType {
        name: string
        age: number
      }

      type EmployeeType = PersonType & { role: string }
      type PrettyEmployee = Simplify<EmployeeType> // {name: string, age: number, role: string}

      expectType<TypeEqual<Simplify<PrettyEmployee>, PrettyEmployee>>(true)
      expectType<TypeEqual<Simplify<string>, string>>(true)
      expectType<TypeEqual<Simplify<number>, number>>(true)
      expectType<TypeEqual<Simplify<TypedArray>, TypedArray>>(true)
    })
  })
})
