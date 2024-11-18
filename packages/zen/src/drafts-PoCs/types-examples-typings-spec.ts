// Examples / Use cases

// do something with product[key] but leads to error 'has type any because string cannot be used to query ...'

import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { ValueOf } from 'type-fest'
import { keys, loop } from '../code'
import { pojsoCommonProps, symbolProp, symbolProp2, TcommonStringProps_values, TcommonSymbolProps_values, tooBadSymbolProp, tooBadSymbolProp2 } from '../test-utils/test-data'

describe('Loopzen', () => {
  it('Loopzen', () => {
    Object.keys(pojsoCommonProps).forEach((key) => {
      expectType<TypeEqual<typeof key, string>>(true)

      const anyValue = pojsoCommonProps[key]
      expectType<TypeEqual<typeof anyValue, any>>(true)
    })

    type keyTypeStringOnly = 'stringProp' | 'tooBadProp' | 'stringProp2' | 'tooBadProp2' | 'stringProp3' | 'tooBadProp3'

    keys(pojsoCommonProps).forEach((key) => {
      // Symbol keys excluded: no symbol types
      expectType<TypeEqual<typeof key, keyTypeStringOnly>>(true)

      const realValueType = pojsoCommonProps[key]
      // Symbol values excluded: no bigint
      expectType<TypeEqual<typeof realValueType, TcommonStringProps_values>>(true)
    })

    type keyTypeIncludingSymbols =
      | 'stringProp'
      | 'tooBadProp'
      | 'stringProp2'
      | 'tooBadProp2'
      | 'stringProp3'
      | 'tooBadProp3'
      | typeof symbolProp
      | typeof tooBadSymbolProp
      | typeof symbolProp2
      | typeof tooBadSymbolProp2

    keys(pojsoCommonProps, { symbol: true }).forEach((key) => {
      // Symbol keys included: symbol types
      expectType<TypeEqual<typeof key, keyTypeIncludingSymbols>>(true)

      const realValueTypes = pojsoCommonProps[key]
      // Symbol values included: bigint
      expectType<TypeEqual<typeof realValueTypes, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
    })

    const isName =
      <W extends string, T extends Record<W, any>>(obj: T) =>
      (name: string): name is keyof T & W =>
        obj.hasOwnProperty(name)

    const typedKeys = Object.keys(pojsoCommonProps).filter(isName(pojsoCommonProps))
    type typedKeysType = ('stringProp' | 'tooBadProp' | 'stringProp2' | 'tooBadProp2' | 'stringProp3' | 'tooBadProp3')[]
    // | typeof symbolProp
    // | typeof tooBadSymbolProp
    // | typeof symbolProp2
    // | typeof tooBadSymbolProp2

    expectType<TypeEqual<typeof typedKeys, typedKeysType>>(true)

    // Looping: lodash _.each & z,loop()

    _.each(pojsoCommonProps, (value, key) => {
      expectType<TypeEqual<typeof value, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
    })

    for (const key in pojsoCommonProps) {
      const value = pojsoCommonProps[key]
      // @todo(222): WTF? why is value any, but these pass?
      expectType<TypeEqual<typeof value, string | number | string[]>>(true)
      expectType<TypeEqual<string | number | string[], typeof value>>(true)
      expectType<TypeEqual<string, typeof value>>(true)
      expectType<TypeEqual<typeof value, string>>(true)
      expectType<TypeEqual<any, typeof value>>(true)
      expectType<TypeEqual<typeof value, any>>(true)
    }

    // # loop()

    // no symbols

    for (const [value, key] of loop(pojsoCommonProps)) {
      // @ts-expect-error todo(333): missing bigint should be fine, cause we have no bigint in string props
      expectType<TypeEqual<typeof value, string | number | string[]>>(true)
      expectType<TypeEqual<typeof value, bigint | string | number | string[]>>(false)

      expectType<TypeEqual<typeof value, any>>(false)
    }

    // with symbols
    for (const [value, key] of loop(pojsoCommonProps, { symbol: true })) {
      expectType<TypeEqual<typeof value, TcommonSymbolProps_values | TcommonStringProps_values>>(true)
      expectType<TypeEqual<typeof value, TcommonSymbolProps_values | TcommonStringProps_values>>(true)

      expectType<TypeEqual<typeof value, TcommonSymbolProps_values | TcommonStringProps_values>>(true)
      expectType<TypeEqual<TcommonStringProps_values, TcommonStringProps_values>>(true)
      expectType<TypeEqual<TcommonStringProps_values, 'stringProp value' | 'tooBadPropValue - rejected by filter' | 22 | 13 | ['an', 'array prop value'] | ['tooBad', 'an', 'array prop value']>>(true)
      expectType<TypeEqual<TcommonStringProps_values, 'stringProp value' | 'tooBadPropValue - rejected by filter' | 22 | 13 | ['an', 'array prop value'] | ['tooBad', 'an', 'array prop value']>>(true)
    }
  })

  it(`Types equality for ValueOf / typeof array[number], with same values`, () => {
    // type Tbar = ['bar']
    // const bar: Tbar = ['bar'] as const
    const arr: ('foo' | ['bar'] | typeof Symbol.iterator)[] = ['foo', ['bar'], Symbol.iterator] // as const
    type Tarr = (typeof arr)[number]
    expectType<TypeEqual<Tarr, 'foo' | ['bar'] | typeof Symbol.iterator>>(true)

    const obj = { a: 'foo', b: ['bar'], c: Symbol.iterator } as {
      a: 'foo'
      b: ['bar']
      c: typeof Symbol.iterator
    }
    type Tobj = ValueOf<typeof obj>
    expectType<TypeEqual<Tobj, 'foo' | ['bar'] | typeof Symbol.iterator>>(true)

    // const obj2 = { a: 'foo', b: ['bar'], c: Symbol.iterator } as const
    // type Tobj2 = ValueOf<typeof obj2>
    // expectType<TypeEqual<Tobj2, 'foo' | ['bar'] | typeof Symbol.iterator>>(true)

    interface Iinterface {
      a: 'foo'
      b: ['bar']
      c: typeof Symbol.iterator
    }
    type Tinter = ValueOf<Iinterface>
    type Tinter2 = Exclude<Tinter, never>
    expectType<TypeEqual<Tobj, Tarr>>(true)
    expectType<TypeEqual<Tobj, Tinter>>(true)
    expectType<TypeEqual<Tobj, Tinter2>>(true)
  })
})
