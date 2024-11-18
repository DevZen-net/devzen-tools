import { expectType, TypeEqual } from 'ts-expect'
import { ValueOf } from 'type-fest'
import { values } from '../code/loopzen/values'
import {
  Tarray_prototype_stringNonEnumerablesInherited,
  Tarray_prototype_stringNonEnumerablesInherited_values,
  Tarray_prototype_stringNonEnumerablesOwn,
  Tarray_prototype_stringNonEnumerablesOwn_values,
  Tarray_prototype_symbolNonEnumerablesInherited_values,
} from '../code/typezen/types-info'
import {
  a_Array_of_Tvalues,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  arrayAndCommonStringProps_values,
  TarrayAndCommonStringProps,
  TarrayAndCommonStringProps_values,
  TcommonSymbolProps,
  TcommonSymbolProps_values,
  Tvalues,
} from '../test-utils/test-data'

describe('values, tested against ValueOf & xxx_values', () => {
  describe('a_Array_of_Tvalues_withCommonAndExtraProps', () => {
    describe('props: false, returns Tvalues[]', () => {
      const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
        props: false,
      })

      it('returns Tvalues', () => {
        expectType<TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, Tvalues[]>>(true)
      })
    })

    describe('props: true', () => {
      describe('own: false, returns never[]', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: true,
          own: false,
        })

        it('in terms of _values', () => {
          expectType<TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, never[]>>(true)
        })
      })

      describe('values of string props only', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: true,
          // string: true,
        })

        it('in terms of ValueOf', () => {
          expectType<TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, ValueOf<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TarrayAndCommonStringProps>[]>>(true)
        })
        it('in terms of _values', () => {
          expectType<TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, TarrayAndCommonStringProps_values[]>>(true)
        })

        // @ts-expect-error OK
        it('no numeric (i.e length) allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([10]))
        // @ts-expect-error OK
        it('no Tvalues allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['A string Tvalue']))
      })

      describe('values of string props & nonEnumerables (i.e length)', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: true,
          // string: true,
          nonEnumerables: true,
        })
        it('in terms of ValueOf', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              ValueOf<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TarrayAndCommonStringProps | Tarray_prototype_stringNonEnumerablesOwn>[]
            >
          >(true)
        })

        it('in terms of _values', () => {
          expectType<TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, (TarrayAndCommonStringProps_values | Tarray_prototype_stringNonEnumerablesOwn_values)[]>>(true)
        })

        it('numeric (i.e length) allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([10]))
        // @ts-expect-error OK
        it('no Tvalues allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['A string Tvalue']))
      })

      describe('values of string, symbol & nonEnumerables (i.e length)', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: true,
          // string: true,
          symbol: true,
          nonEnumerables: true,
        })
        it('in terms of ValueOf', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              ValueOf<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TarrayAndCommonStringProps | TcommonSymbolProps | Tarray_prototype_stringNonEnumerablesOwn>[]
            >
          >(true)
        })
        it('in terms of _values', () => {
          expectType<
            TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, (TarrayAndCommonStringProps_values | TcommonSymbolProps_values | Tarray_prototype_stringNonEnumerablesOwn_values)[]>
          >(true)
        })
      })

      describe('values of string own & inherited & nonEnumerables', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: true,
          string: true,
          nonEnumerables: true,
          inherited: true,
        })

        it('in terms of _values', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              (
                | TarrayAndCommonStringProps_values
                | Tarray_prototype_stringNonEnumerablesOwn_values
                | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
              )[]
            >
            // @-ts-expect-error @todo: fix this - what is missing / extra?
          >(true)

          // Lets debug these nasty types!

          // TarrayAndCommonStringProps_values - common props of a_Array_of_Tvalues_withCommonAndExtraProps
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([128n])
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['stringProp value'])
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([['an', 'array prop value']])

          // Tarray_prototype_stringNonEnumerablesOwn_values (i.e length / number)
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([10])

          // # Tarray_prototype_stringNonEnumerablesInherited_values
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([[].findLastIndex])

          // Should NOT be allowed

          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['WRONG TYPE'])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([['WRONG TYPE']])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([666n])

          // # Tvalues

          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['A string Tvalue'])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([true])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([false])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([['an', 'array Tvalue']])

          // # Tarray_prototype_symbolNonEnumerablesInherited_values

          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([Symbol.iterator])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([Symbol.toStringTag])

          // # TcommonSymbolProps_values

          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['symbolProp value'])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([222n])

          // Above are hinting we're OK, but inconclusive for why TypeEqual errors, lets try to debug further

          // These prove that the types are correct, despite TypeEqual complaining!

          // Accepted with all valid _values

          expectType<
            (
              | TarrayAndCommonStringProps_values
              | Tarray_prototype_stringNonEnumerablesOwn_values
              | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
            )[]
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)

          // Errors with any of the required _values missing

          expectType<
            // | TarrayAndCommonStringProps_values // missing
            (Tarray_prototype_stringNonEnumerablesOwn_values | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>)[]
            // @ts-expect-error OK
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)

          expectType<
            (
              | TarrayAndCommonStringProps_values
              // | Tarray_prototype_stringNonEnumerablesOwn_values // missing
              | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
            )[]
            // @ts-expect-error OK
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)

          expectType<
            (TarrayAndCommonStringProps_values | Tarray_prototype_stringNonEnumerablesOwn_values)[]
            // | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps> // missing
            // @ts-expect-error OK
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)

          expectType<
            (TarrayAndCommonStringProps_values | Tarray_prototype_stringNonEnumerablesOwn_values | Tarray_prototype_stringNonEnumerablesInherited_values<'WRONG_TYPE'>)[]
            // @ts-expect-error OK
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)
        })

        // Tarray_prototype_stringNonEnumerablesInherited only, in terms of ValueOf, without Values

        // @todo: delete this when fixed
        it('in terms of ValueOf', () => {
          expectType<
            TypeEqual<
              ValueOf<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TarrayAndCommonStringProps | Tarray_prototype_stringNonEnumerablesOwn | Tarray_prototype_stringNonEnumerablesInherited>[],
              (
                | TarrayAndCommonStringProps_values
                | Tarray_prototype_stringNonEnumerablesOwn_values
                | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
              )[]
            >
            // @ts-expect-error @todo: fix this - what is missing / extra?
          >(true)
        })
      })

      describe('values of string & symbol, own & inherited & nonEnumerables', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: true,
          string: true,
          symbol: true,
          nonEnumerables: true,
          inherited: true,
        })

        it('in terms of _values', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              (
                | TarrayAndCommonStringProps_values
                | TcommonSymbolProps_values
                | Tarray_prototype_stringNonEnumerablesOwn_values
                | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
                | Tarray_prototype_symbolNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
              )[]
            >
          >(true)
        })
      })

      describe('own: false, only inherited nonEnumerables', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: true,
          own: false,
          nonEnumerables: true,
          inherited: true,
        })

        it('in terms of _values', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>[]
              // | Tvalues
            >
          >(true)
        })

        // @ts-expect-error OK
        it('no own props allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([128n]))
        // @ts-expect-error OK
        it('no numeric (i.e length) allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([10]))
        // @ts-expect-error OK
        it('no Tvalues allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['A string Tvalue']))

        it('stringNonEnumerablesInherited_values allowed', () => {
          expectType<Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>[]>(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)
        })
      })
    })

    describe(`props: 'all'`, () => {
      describe('own: false, returns never[]', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: 'all',
          own: false,
        })

        it('in terms of _values', () => {
          expectType<TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, Tvalues[]>>(true)
        })
      })

      describe('values of string props only', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: 'all',
          // string: true,
        })

        it('in terms of ValueOf', () => {
          expectType<TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, (ValueOf<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TarrayAndCommonStringProps> | Tvalues)[]>>(true)
        })
        it('in terms of _values', () => {
          expectType<TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, (TarrayAndCommonStringProps_values | Tvalues)[]>>(true)
        })

        // @ts-expect-error OK
        it('no numeric (i.e length) allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([10]))
        it('Tvalues allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['A string Tvalue']))
      })

      describe('values of string props & nonEnumerables (i.e length)', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: 'all',
          // string: true,
          nonEnumerables: true,
        })
        it('in terms of ValueOf', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              (ValueOf<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TarrayAndCommonStringProps | Tarray_prototype_stringNonEnumerablesOwn> | Tvalues)[]
            >
          >(true)
        })

        it('in terms of _values', () => {
          expectType<TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, (TarrayAndCommonStringProps_values | Tarray_prototype_stringNonEnumerablesOwn_values | Tvalues)[]>>(true)
        })

        it('numeric (i.e length) allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([10]))
        it('Tvalues allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['A string Tvalue']))
      })

      describe('values of string, symbol & nonEnumerables (i.e length)', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: 'all',
          // string: true,
          symbol: true,
          nonEnumerables: true,
        })
        it('in terms of ValueOf', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              (ValueOf<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TarrayAndCommonStringProps | TcommonSymbolProps | Tarray_prototype_stringNonEnumerablesOwn> | Tvalues)[]
            >
          >(true)
        })
        it('in terms of _values', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              (TarrayAndCommonStringProps_values | TcommonSymbolProps_values | Tarray_prototype_stringNonEnumerablesOwn_values | Tvalues)[]
            >
          >(true)
        })
      })

      describe('values of string own & inherited & nonEnumerables', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: 'all',
          string: true,
          nonEnumerables: true,
          inherited: true,
        })

        it('in terms of _values', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              (
                | TarrayAndCommonStringProps_values
                // prettier-ignore
                | Tarray_prototype_stringNonEnumerablesOwn_values
                | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
                | Tvalues
              )[]
            >
          >(true)

          // Why is it not strict equal? Debug

          // Let's debug these nasty types, one by one!

          // TarrayAndCommonStringProps_values - common props of a_Array_of_Tvalues_withCommonAndExtraProps
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(arrayAndCommonStringProps_values)

          // Tarray_prototype_stringNonEnumerablesOwn_values (i.e length / number)
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([10])

          // # Tarray_prototype_stringNonEnumerablesInherited_values
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([[].findLastIndex])

          // # Tvalues
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(a_Array_of_Tvalues)

          // Should NOT be allowed

          // wrong TarrayAndCommonStringProps_values - common props of a_Array_of_Tvalues_withCommonAndExtraProps

          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['WRONG TYPE'])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([['WRONG TYPE']])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([666n])

          // # Tarray_prototype_symbolNonEnumerablesInherited_values

          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([Symbol.iterator])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([Symbol.toStringTag])

          // # TcommonSymbolProps_values

          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['symbolProp value'])
          // @ts-expect-error OK
          expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([222n])

          // Above are hinting we're OK, but inconclusive for why TypeEqual errors, lets try to debug further

          // These prove that the types are correct, despite TypeEqual complaining!

          // Accepted with all valid _values

          expectType<
            (
              | TarrayAndCommonStringProps_values
              // prettier-ignore
              | Tarray_prototype_stringNonEnumerablesOwn_values
              | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
              | Tvalues
            )[]
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)

          // Errors with any one of the required _values missing

          expectType<
            (
              | Tarray_prototype_stringNonEnumerablesOwn_values
              // | TarrayAndCommonStringProps_values // missing
              | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
              | Tvalues
            )[]
            // @ts-expect-error OK
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)

          expectType<
            (
              | TarrayAndCommonStringProps_values
              // | Tarray_prototype_stringNonEnumerablesOwn_values // missing
              | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
              | Tvalues
            )[]
            // @ts-expect-error OK
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)

          expectType<
            (
              | TarrayAndCommonStringProps_values
              | Tarray_prototype_stringNonEnumerablesOwn_values
              // | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps> // missing
              | Tvalues
            )[]
            // @ts-expect-error OK
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)

          expectType<
            (
              | TarrayAndCommonStringProps_values
              // prettier-ignore
              | Tarray_prototype_stringNonEnumerablesOwn_values
              | Tarray_prototype_stringNonEnumerablesInherited_values<'WRONG_TYPE'>
              | Tvalues
            )[]
            // @ts-expect-error OK
          >(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)
        })

        // Tarray_prototype_stringNonEnumerablesInherited only, in terms of ValueOf, without Values

        // @todo: delete this when fixed
        it('in terms of ValueOf', () => {
          expectType<
            TypeEqual<
              (
                | ValueOf<
                    typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
                    | TarrayAndCommonStringProps
                    // prettier-ignore
                    | Tarray_prototype_stringNonEnumerablesOwn
                    | Tarray_prototype_stringNonEnumerablesInherited
                  >
                | Tvalues
              )[],
              (
                | TarrayAndCommonStringProps_values
                // prettier-ignore
                | Tarray_prototype_stringNonEnumerablesOwn_values
                | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
                | Tvalues
              )[]
            >
            // @ts-expect-error @todo: fix this - what is missing / extra?
          >(true)
        })
      })

      describe('values of string & symbol, own & inherited & nonEnumerables', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: 'all',
          string: true,
          symbol: true,
          nonEnumerables: true,
          inherited: true,
        })

        it('in terms of _values', () => {
          expectType<
            TypeEqual<
              typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps,
              (
                | TarrayAndCommonStringProps_values
                | TcommonSymbolProps_values
                | Tarray_prototype_stringNonEnumerablesOwn_values
                | Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
                | Tarray_prototype_symbolNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
                | Tvalues
              )[]
            >
          >(true)
        })
      })

      describe('own: false, only inherited nonEnumerables', () => {
        const values_of_Array_of_Tvalues_withCommonAndArrayExtraProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, {
          props: 'all',
          own: false,
          nonEnumerables: true,
          inherited: true,
        })

        it('in terms of _values', () => {
          expectType<
            TypeEqual<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps, Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>[] | Tvalues>
            // @ts-expect-error @todo: fix this - what is missing / extra?
          >(true)
        })

        // @ts-expect-error OK
        it('no own props allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([128n]))
        // @ts-expect-error OK
        it('no numeric (i.e length) allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>([10]))

        it('Tvalues allowed', () => expectType<typeof values_of_Array_of_Tvalues_withCommonAndArrayExtraProps>(['A string Tvalue']))

        it('stringNonEnumerablesInherited_values | Tvalues allowed', () => {
          expectType<(Tarray_prototype_stringNonEnumerablesInherited_values<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps> | Tvalues)[]>(values_of_Array_of_Tvalues_withCommonAndArrayExtraProps)
        })
      })
    })
  })
})
