import { expect } from 'chai'
import * as _ from 'lodash'
import { IsEqual } from 'type-fest'
import { keys, typeIsTrue } from '../../index'

/*
ownKeyof or keyofOwn

Aim is to extract Prototype / constructor only keys (types) and exclude instance/own keys
NOT WORKING YET!

@todo: see https://refine.dev/blog/typescript-classes/#introduction

Search terms: own keyof prototype instance properties

Might be related to:
- 3/5 [Support for Object.hasOwn (lib.d.ts and narrowing)](https://github.com/microsoft/TypeScript/issues/44253)
- 2/5 [https://github.com/microsoft/TypeScript/issues/52907](https://github.com/microsoft/TypeScript/issues/52907)

// And some comments
- 5/5 https://github.com/microsoft/TypeScript/issues/44181#issuecomment-849844142
 */

describe(`Extract Type Keys from Parent class & Child sub class `, () => {
  describe(`Simple MyClass`, () => {
    class MyClass {
      constructor(public instanceValuePropArg: string = 'instanceValuePropArg value') {}
      instanceValueProp = 'instanceValueProp value' // member variable
      instanceMethod = () => {} // methods - on instance & bound on instance

      myClassPrototypeMethod() {} // method on prototype - not part of the instance (& not bound), hence not retrieved by `Object.keys(instance)`

      // static / class members - They are not part of the instance or the prototype.
      // They belong to class itself, retrieved only by `Object.keys(MyClass)` - see below
      static myClassStaticProp = 'myClassStaticProp value'
      static myClassStaticMethod(staticMethodArg) {}
      static myClassStaticMethodArrow = (staticMethodArg) => {}
    }

    const myClassInstance = new MyClass('myClassInstance')

    type ResultedMyClassInstanceProps =
      | 'instanceValuePropArg'
      | 'instanceValueProp'
      | 'instanceMethod'
      // @todo: This should NOT be in own keys - it's stored in prototype - see below
      | 'myClassPrototypeMethod'

    const myClassInstanceProps: ResultedMyClassInstanceProps[] = [
      'instanceValuePropArg',
      'instanceValueProp',
      'instanceMethod',

      // @todo: This is NOT stored in the instance, it's inherited / in the prototype.
      //        Hence they are NOT retrieved by `Object.keys(instance)` et al, rightly so!
      //        BUT, they are in the ResultedMyClassInstanceProps, which is not ideal!
      // 'myClassPrototypeMethod',
    ]

    type ResultedMyClassStaticProps = 'myClassStaticProp' | 'myClassStaticMethod' | 'myClassStaticMethodArrow' | 'prototype'

    describe(`Keys of MyClass instance, prototype & class`, () => {
      it(`MyClass instance Props (keyof MyClass)`, () => {
        type MyClassInstanceProps = keyof MyClass
        typeIsTrue<IsEqual<MyClassInstanceProps, ResultedMyClassInstanceProps>>()
      })
      it(`MyClass prototype Props (keyof typeof MyClass.prototype) - same as keyof MyClass
             keyof MyClass === keyof typeof MyClass.prototype, but that's wrong!`, () => {
        type MyClassPrototypeProps = keyof typeof MyClass.prototype
        typeIsTrue<IsEqual<MyClassPrototypeProps, ResultedMyClassInstanceProps>>()

        // @todo: a discrepancy: MyClassPrototypeProps === ResultedMyClassInstanceProps, but prototype is actually empty (it's __proto__ holds the actual functions?)
        expect(MyClass.prototype).to.deep.equal({})
        expect(_.keys(MyClass.prototype)).to.deep.equal([])

        expect(MyClass.prototype.myClassPrototypeMethod).to.be.a('function')

        type MyClassInstanceProps = keyof MyClass

        // @todo: that's awful: MyClassPrototypeProps is same as MyClassInstanceProps!
        typeIsTrue<IsEqual<MyClassInstanceProps, MyClassPrototypeProps>>()
      })
      it(`myClassInstance instance Props (keyof typeof myClassInstance) & runtime tests`, () => {
        type MyClassInstanceProps = keyof typeof myClassInstance
        typeIsTrue<IsEqual<MyClassInstanceProps, ResultedMyClassInstanceProps>>()

        expect(_.keys(myClassInstance)).to.deep.equal(myClassInstanceProps) // same as Object.keys()
        expect(Object.getOwnPropertyNames(myClassInstance)).to.deep.equal(myClassInstanceProps)
      })

      describe(`MyClass static props (keyof typeof MyClass)`, () => {
        type MyClassStaticProps = keyof typeof MyClass
        typeIsTrue<IsEqual<MyClassStaticProps, ResultedMyClassStaticProps>>()

        it('_.keys / Object.keys / z.keys give only static props on the class, not its prototype chain. Hence `myStaticMethod` is not returned', () => {
          expect(_.keys(MyClass)).to.deep.equal([
            // 'myClassStaticMethod', // missing, cause it's in the class's prototype
            'myClassStaticProp',
            'myClassStaticMethodArrow',
          ])

          expect(Object.keys(MyClass)).to.deep.equal([
            // 'myClassStaticMethod', // missing, cause it's in the class's prototype
            'myClassStaticProp',
            'myClassStaticMethodArrow',
          ])

          expect(keys(MyClass)).to.deep.equal([
            // 'myClassStaticMethod', // missing, cause it's in the class's prototype
            'myClassStaticProp',
            'myClassStaticMethodArrow',
          ])
        })
        it('static prototype method `myClassStaticMethod` exists in the prototype chain (but Object.hasOwn() returns true, which is a bit flawed!)', () => {
          expect(MyClass.myClassStaticMethod).to.be.a('function')
          expect(Object.hasOwn(MyClass, 'myClassStaticMethod')).to.equal(true)
        })
        it(`Object.getOwnPropertyNames gives all static props, including the prototype`, () => {
          expect(Object.getOwnPropertyNames(MyClass)).to.deep.equal([
            // these are missing from ResultedMyClassStaticProps!
            'length', // "number of parameters expected by the function", cause class is a function!
            'name', // a.k.a function name, i.e MyClass.name === "MyClass"

            // these are OK & make sense
            'prototype',
            'myClassStaticMethod',
            'myClassStaticProp',
            'myClassStaticMethodArrow',
          ])

          expect(MyClass.name).to.equal('MyClass')
          expect(MyClass.length).to.equal(0)
        })
      })
    })
  })

  describe(`With Symbols & Inheritance`, () => {
    const parentSymbolInstanceProp: unique symbol = Symbol.for('parentSymbolInstanceProp')
    const parentSymbolInstanceMethodProp: unique symbol = Symbol.for('parentSymbolInstanceMethodProp')
    const parentSymbolPrototypeMethodProp: unique symbol = Symbol.for('parentSymbolPrototypeMethodProp')

    class ParentClass {
      constructor(public parentInstanceValuePropArg: string = 'parentInstanceValuePropArg value') {}

      // member variables
      parentInstanceValueProp = 'parentKey value';
      [parentSymbolInstanceProp] = 'parentSymbolKey value'

      // methods - instance
      parentInstanceMethod = () => {};
      [parentSymbolInstanceMethodProp] = () => {}

      // methods - prototype. They are not part of the instance, hence not retrieved by Object.keys(instance)
      parentPrototypeMethod() {}
      [parentSymbolPrototypeMethodProp]() {}

      // static / class members - They are not part of the instance, belong to class it self, retrieved only by Object.keys(ParentClass)
      static parentStaticProp = 'parentStaticProp value'
      static parentStaticMethod(staticMethodArg) {}
      static parentStaticMethodArrow = (staticMethodArg) => {}
    }

    const aParentInstance = new ParentClass('parentName')

    type ResultedParentClassInstanceProps =
      | 'parentInstanceValuePropArg'
      | 'parentInstanceValueProp'
      | typeof parentSymbolInstanceProp
      | 'parentInstanceMethod'
      | typeof parentSymbolInstanceMethodProp
      // @todo: These should not here with `ownKeyof`, they are in prototype chain - see below
      | 'parentPrototypeMethod'
      | typeof parentSymbolPrototypeMethodProp

    const allParentClassInstanceProps: ResultedParentClassInstanceProps[] = [
      'parentInstanceValuePropArg',
      'parentInstanceValueProp',
      parentSymbolInstanceProp,
      'parentInstanceMethod',
      parentSymbolInstanceMethodProp,

      // @todo: These are NOT in the instance, they are in prototype.
      //        Hence they are not retrieved by Object.keys(instance) et al, righly so
      //        BUT, they are in the ResultedParentClassInstanceProps, which is not ideal!
      // 'parentPrototypeMethod',
      // parentSymbolPrototypeMethodProp,
    ]

    const stringParentClassInstanceProps = allParentClassInstanceProps.filter((key) => !_.isSymbol(key))
    const symbolParentClassInstanceProps = allParentClassInstanceProps.filter((key) => _.isSymbol(key))

    type ResultedParentClassStaticProps = 'parentStaticProp' | 'parentStaticMethod' | 'parentStaticMethodArrow' | 'prototype'

    describe(`Keys of ParentClass instance, prototype & class`, () => {
      it(`ParentClass instance Props (keyof ParentClass)`, () => {
        type ParentClassInstanceProps = keyof ParentClass
        typeIsTrue<IsEqual<ParentClassInstanceProps, ResultedParentClassInstanceProps>>()
      })
      it(`ParentClass prototype Props (keyof typeof ParentClass.prototype) - same as keyof ParentClass
             keyof ParentClass === keyof typeof ParentClass.prototype, but that's wrong!`, () => {
        type ParentClassPrototypeProps = keyof typeof ParentClass.prototype
        typeIsTrue<IsEqual<ParentClassPrototypeProps, ResultedParentClassInstanceProps>>()

        // @todo: a small discrepancy: ParentClassPrototypeProps === ResultedParentClassInstanceProps, but prototype is actually empty (it's __proto__ holds the actual functions?)
        expect(ParentClass.prototype).to.deep.equal({})
        expect(_.keys(ParentClass.prototype)).to.deep.equal([])
        expect(ParentClass.prototype.parentPrototypeMethod).to.be.a('function')

        type ParentClassInstanceProps = keyof ParentClass
        // @todo: that's awful: ParentClassPrototypeProps is same as ParentClassInstanceProps!
        typeIsTrue<IsEqual<ParentClassInstanceProps, ParentClassPrototypeProps>>()
      })
      it(`aParentInstance instance Props (keyof typeof aParentInstance) & runtime tests`, () => {
        type ParentClassInstanceProps = keyof typeof aParentInstance
        typeIsTrue<IsEqual<ParentClassInstanceProps, ResultedParentClassInstanceProps>>()

        expect(_.keys(aParentInstance)).to.deep.equal(stringParentClassInstanceProps) // same as Object.keys()
        expect(Object.getOwnPropertyNames(aParentInstance)).to.deep.equal(stringParentClassInstanceProps)
        expect(Object.getOwnPropertySymbols(aParentInstance)).to.deep.equal(symbolParentClassInstanceProps)
      })

      describe(`ParentClass static props (keyof typeof ParentClass)`, () => {
        type ParentClassStaticProps = keyof typeof ParentClass
        typeIsTrue<IsEqual<ParentClassStaticProps, ResultedParentClassStaticProps>>()

        it('_.keys / Object.keys / z.keys give only static props on the class, not its prototype chain. Hence `parentStaticMethod` is not returned', () => {
          expect(_.keys(ParentClass)).to.deep.equal([
            // 'parentStaticMethod', // missing, cause it's in the class's prototype
            'parentStaticProp',
            'parentStaticMethodArrow',
          ])

          expect(Object.keys(ParentClass)).to.deep.equal([
            // 'parentStaticMethod', // missing, cause it's in the class's prototype
            'parentStaticProp',
            'parentStaticMethodArrow',
          ])

          expect(keys(ParentClass)).to.deep.equal([
            // 'parentStaticMethod', // missing, cause it's in the class's prototype
            'parentStaticProp',
            'parentStaticMethodArrow',
          ])
        })
        it('static prototype method `parentStaticMethod` exists in the prototype chain (but Object.hasOwn() returns true, which is a bit flawed!)', () => {
          expect(ParentClass.parentStaticMethod).to.be.a('function')
          expect(Object.hasOwn(ParentClass, 'parentStaticMethod')).to.equal(true)
        })
        it(`Object.getOwnPropertyNames gives all static props, including the prototype`, () => {
          expect(Object.getOwnPropertyNames(ParentClass)).to.deep.equal([
            // these are missing from ResultedParentClassStaticProps!
            'length', // "number of parameters expected by the function", cause class is a function!
            'name', // a.k.a function name, i.e MyClass.name === "MyClass"

            // these are OK & make sense
            'prototype',
            'parentStaticMethod',
            'parentStaticProp',
            'parentStaticMethodArrow',
          ])

          expect(ParentClass.name).to.equal('ParentClass')
          expect(ParentClass.length).to.equal(0) // Optional argument
        })
      })
    })
    describe(`Keys of ChildClass instance, prototype & class`, () => {
      // # Child Class

      const childSymbolInstanceProp: unique symbol = Symbol.for('childSymbolInstanceProp')
      const childSymbolInstanceMethodProp: unique symbol = Symbol.for('childSymbolInstanceMethodProp')
      const childSymbolPrototypeMethodProp: unique symbol = Symbol.for('childSymbolPrototypeMethodProp')

      class ChildClass extends ParentClass {
        constructor(public childInstanceValuePropArg: string) {
          super(childInstanceValuePropArg)
        }

        // member variables
        childInstanceValueProp = 'childKey value';
        [childSymbolInstanceProp] = 'childSymbolKey value'

        // methods - instance
        childInstanceMethod = () => {};
        [childSymbolInstanceMethodProp] = () => {}

        // methods - prototype. They are not part of the instance, hence not retrieved by Object.keys(instance)
        childPrototypeMethod() {}
        [childSymbolPrototypeMethodProp]() {}

        // static / class members - They are not part of the instance, belong to class it self, retrieved only by Object.keys(ChildClass)
        static childStaticProp = 'childStaticProp value'
        static childStaticMethod(staticMethodArg) {}
        static childStaticMethodArrow = (staticMethodArg) => {}
      }

      const aChildInstance = new ChildClass('childName')

      type ResultedChildClassInstanceProps =
        // These are inherited & actually part of the instance, hence they are "own" keys
        | ResultedParentClassInstanceProps

        // Child's own props
        | 'childInstanceValuePropArg'
        | 'childInstanceValueProp'
        | typeof childSymbolInstanceProp
        | 'childInstanceMethod'
        | typeof childSymbolInstanceMethodProp

        // @todo: These should not here with `ownKeyof`, they are in prototype chain - see below
        | 'childPrototypeMethod'
        | typeof childSymbolPrototypeMethodProp

      const allChildClassInstanceProps: ResultedChildClassInstanceProps[] = [
        // These are inherited & actually part of the instance, hence they are "own" keys
        ...allParentClassInstanceProps,

        // Child's own props
        'childInstanceValuePropArg',
        'childInstanceValueProp',
        childSymbolInstanceProp,
        'childInstanceMethod',
        childSymbolInstanceMethodProp,

        // @todo: These are NOT in the instance, they are in prototype.
        //        Hence they are not retrieved by Object.keys(instance) et al, righly so
        //        BUT, they are in the ResultedChildClassInstanceProps, which is not ideal!
        // 'childPrototypeMethod',
        // childSymbolPrototypeMethodProp,
      ]

      const symbolChildClassInstanceProps = allChildClassInstanceProps.filter((key) => _.isSymbol(key))
      const stringChildClassInstanceProps = allChildClassInstanceProps.filter((key) => !_.isSymbol(key))

      type ResultedChildClassStaticProps =
        | 'childStaticProp'
        | 'childStaticMethodArrow'
        // @todo: These should not be here with `ownKeyof`, as they are inherited from ParentClass / prototype chain
        | 'prototype'
        | 'childStaticMethod'
        | ResultedParentClassStaticProps

      it(`ChildClass instance Props (keyof ChildClass)`, () => {
        type ChildClassInstanceProps = keyof ChildClass
        typeIsTrue<IsEqual<ChildClassInstanceProps, ResultedChildClassInstanceProps>>()
      })
      it(`ChildClass prototype Props (keyof typeof ChildClass.prototype) - same as keyof ChildClass
            keyof ChildClass === keyof typeof ChildClass.prototype, but that's wrong!`, () => {
        type ChildClassPrototypeProps = keyof typeof ChildClass.prototype
        typeIsTrue<IsEqual<ChildClassPrototypeProps, ResultedChildClassInstanceProps>>()

        // @todo: a discrepancy: ChildClassPrototypeProps, but prototype is empty (it's __proto__ holds the actual functions?)
        expect(ChildClass.prototype).to.deep.equal({})
        expect(_.keys(ChildClass.prototype)).to.deep.equal([])

        // here they are!
        expect(ChildClass.prototype.parentPrototypeMethod).to.be.a('function')
        expect(ChildClass.prototype.childPrototypeMethod).to.be.a('function')

        type ChildClassInstanceProps = keyof ChildClass
        // @todo: that's awful: ChildClassPrototypeProps is same as ChildClassInstanceProps!
        typeIsTrue<IsEqual<ChildClassInstanceProps, ChildClassPrototypeProps>>()
      })
      it(`aChildInstance instance Props (keyof typeof aChildInstance) & runtime tests`, () => {
        type ChildClassInstanceProps = keyof typeof aChildInstance
        typeIsTrue<IsEqual<ChildClassInstanceProps, ResultedChildClassInstanceProps>>()

        expect(keys(aChildInstance)).to.deep.equal(stringChildClassInstanceProps) // same as Object.keys()
        expect(_.keys(aChildInstance)).to.deep.equal(stringChildClassInstanceProps) // same as Object.keys()
        expect(Object.getOwnPropertyNames(aChildInstance)).to.deep.equal(stringChildClassInstanceProps)
        expect(Object.getOwnPropertySymbols(aChildInstance)).to.deep.equal(symbolChildClassInstanceProps)
      })

      describe(`ChildClass static props (keyof typeof ChildClass)`, () => {
        type ChildClassStaticProps = keyof typeof ChildClass
        typeIsTrue<IsEqual<ChildClassStaticProps, ResultedChildClassStaticProps>>()

        it('_.keys / Object.keys / z.keys give only static props on the class, not its prototype chain. Hence `childStaticMethod` is not returned', () => {
          expect(_.keys(ChildClass)).to.deep.equal([
            // 'childStaticMethod', // missing, cause it's in the class's prototype
            'childStaticProp',
            'childStaticMethodArrow',
          ])

          expect(Object.keys(ChildClass)).to.deep.equal([
            // 'childStaticMethod', // missing, cause it's in the class's prototype
            'childStaticProp',
            'childStaticMethodArrow',
          ])

          expect(keys(ChildClass)).to.deep.equal([
            // 'childStaticMethod', // missing, cause it's in the class's prototype
            'childStaticProp',
            'childStaticMethodArrow',
          ])
        })
        it('static prototype method `childStaticMethod` exists in the prototype chain (but Object.hasOwn() returns true, which is a bit flawed!)', () => {
          expect(ChildClass.childStaticMethod).to.be.a('function')
          expect(Object.hasOwn(ChildClass, 'childStaticMethod')).to.equal(true)
        })
        it(`Object.getOwnPropertyNames gives all static props, including the prototype`, () => {
          expect(Object.getOwnPropertyNames(ChildClass)).to.deep.equal([
            // these are missing from ResultedChildClassStaticProps!
            'length', // "number of parameters expected by the function", cause class is a function!
            'name', // a.k.a function name, i.e MyClass.name === "MyClass"

            // these are OK & make sense
            'prototype',
            'childStaticMethod',
            'childStaticProp',
            'childStaticMethodArrow',
          ])

          expect(ChildClass.name).to.equal('ChildClass')
          expect(ChildClass.length).to.equal(1) // Not optional
        })
      })
    })
  })
})
