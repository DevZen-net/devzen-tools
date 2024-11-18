import { expect } from 'chai'
import {
  a_Array_of_Tvalues,
  a_Function_withProps,
  a_GeneratorFunction_async_named,
  a_GeneratorFunction_named,
  get_plainAsyncIteratorPOJSO,
} from '../../../test-utils/test-data'
import { isEqual } from '../../objects/isEqual'
import { clone } from '../clone'
import {
  loop_each_map_clone_filter_take_SpecHandler,
  testFunctionOnly,
} from './loop-each-map-clone-filter-take.specHandler'
import { expectType, TypeEqual } from 'ts-expect';

describe('clone() - creates a new value (object, Array or anything else), with the input value contents verbatim', () => {
  ;(testFunctionOnly === 'clone' ? describe.only : describe)('clone()', () =>
    loop_each_map_clone_filter_take_SpecHandler(
      'clone',
      'Creates a perfect shallow clone of whatever value is given'
    )
  )

  describe(`clone throws on Iterators & Generators, cause they can't be restarted`, () => {
    const errorMsg = `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
    it(`Iterator`, () =>
      expect(() => clone(a_Array_of_Tvalues[Symbol.iterator]())).to.throw(errorMsg))

    it(`Generator`, () => expect(() => clone(a_GeneratorFunction_named())).to.throw(errorMsg))

    it(`AsyncIterator`, async () =>
      expect(() => clone(get_plainAsyncIteratorPOJSO())).to.throw(errorMsg))

    it(`AsyncGenerator`, async () =>
      expect(() => clone(a_GeneratorFunction_async_named())).to.throw(errorMsg))
  })

  describe('clone() on an other values', () => {
    it('typings smoke test', () => {
      const result = clone({ a: 1, b:2 } as const)
      expectType<TypeEqual<typeof result, { a: 1 | 2, b: 1 | 2 }>>(true)
    })

    describe(`Promise`, async () => {
      const promise = Promise.resolve(42)
      let mappedPromise // : Promise<number>
      before(() => {
        // mappedPromise = map(promise, _.identity)
        mappedPromise = clone(promise) // satisfies Promise<number>
      })

      it(`is not the same promise`, () => expect(mappedPromise).to.not.equal(promise))

      it(`resolves to the same value`, async () => {
        const result = await mappedPromise
        expect(result).to.be.a('number')
        expect(result).to.be.eql(42)
      })
    })

    describe(`Function, with props`, async () => {
      let mappedFn: any // Function
      before(
        () =>
          (mappedFn = clone(a_Function_withProps, {
            props: true,
            symbol: true,
          }))
      )

      it(`returns a function, not equal to original`, () => {
        expect(mappedFn).to.be.a('function')
        expect(mappedFn).to.not.equal(a_Function_withProps)
      })

      it(`returned function, returns same value as original`, () => {
        expect(mappedFn()).to.equal(a_Function_withProps())
      })

      it(`returned function has same props as original`, () => {
        expect(mappedFn.functionStringProp1).to.equal(a_Function_withProps.functionStringProp1)
        expect(mappedFn.functionNumberProp2).to.equal(a_Function_withProps.functionNumberProp2)
        expect(mappedFn[Symbol.for('functionSymbolProp')]).to.equal(
          (a_Function_withProps as any)[Symbol.for('functionSymbolProp')]
        )
      })
    })

    describe(`Primitives`, async () => {
      it(`null`, () => expect(clone(null)).to.equal(null))
      it(`undefined`, () => expect(clone(undefined)).to.equal(undefined))
      it(`NaN`, () => expect(isEqual(NaN, clone(NaN))).to.equal(true))
      it(`number`, () => expect(clone(42)).to.equal(42))
      it(`string`, () => expect(clone('42')).to.equal('42'))
      it(`bigint`, () => expect(clone(BigInt(42))).to.equal(BigInt(42)))
      it(`boolean`, () => expect(clone(true)).to.equal(true))
      it(`symbol`, () => expect(clone(Symbol.for('42'))).to.equal(Symbol.for('42')))
    })
  })
})
