import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { Simplify } from 'type-fest'
import { keys } from '../code'

describe('Typed keys PoC', () => {
  it('Typed keys PoC', () => {
    // ### Object.keys typed & other JS blues
    //
    // Background:
    // - https://github.com/Microsoft/TypeScript/issues/12936
    // - https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript/76139008#76139008

    /** Zen stance:

   Assume we have a `function sendLetterToPerson(person: Person) {}`, we should only care about `Person`'s keys, `Person`'s functionality.

   Our function should not care about other keys that may be present in the object, eg if the `person` is actually an `Employee` or `Customer` instance.

   It should not try to get `Employee.salary` or `Customer.loyaltyProgram`, because it's not part of the `Person` interface. If it deals only with `Person.name` & `Person.address`, which are fine for purpose of sending a letter, all will be fine!

   We could enforce this via type-fest's [InvariantOf](https://github.com/sindresorhus/type-fest/blob/main/source/invariant-of.d.ts), but it still misses the purpose. Because **we should be able** to pass sub-instances to our functions, and that's fine, without sacrificing keys typings. If those functions act only on what they know, we should be fine!

   So, the rule is: just don't bother with extra keys you might receive, just ignore them!
   */
    // #########################
    // Example from https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript/55012175#55012175

    // Consider some type like this:
    interface Point {
      x: number
      y: number
    }

    // You write some code like this:
    function fn(k: keyof Point) {
      if (k === 'x') {
        console.log('X axis')
      } else if (k === 'y') {
        console.log('Y axis')
      } else {
        // throw new Error('This is impossible') // Zen: This should never happen! Why bother with extra keys? It is absolutely possible, and fine to pass sub-instances to our functions, as long as we dont moan about extra stuff they might have. It's a principle in OO programming, to be able to pass sub-instances to functions that expect the parent type, without loosing typing!
      }
    }

    // Let's ask a question:
    //
    // In a well-typed program, can a legal call to fn hit the error case?
    //
    //   The desired answer is, of course, "No". But what does this have to do with Object.keys?
    //
    //   Now consider this other code:
    //
    interface NamedPoint extends Point {
      name: string
    }

    const origin: NamedPoint = { name: 'origin', x: 0, y: 0 }
    // Note that according to TypeScript's type system, all NamedPoints are valid Points.
    //
    // Now let's write a little more code:

    function doSomething(pt: Point) {
      // Original code
      for (const k of Object.keys(pt)) {
        // A valid call if Object.keys(pt) returns (keyof Point)[]
        // @ts-expect-error
        fn(k)
      }

      // Zen keys() code
      for (const k of keys(pt)) {
        // A valid call with z.keys:
        expectType<TypeEqual<typeof k, keyof Point>>(true)
        expectType<TypeEqual<typeof k, 'x' | 'y'>>(true)
        fn(k)
      }
    }

    // Throws an exception
    doSomething(origin)

    // Our well-typed program just threw an exception!
    //
    // Something went wrong here! By returning keyof T from Object.keys, we've violated the assumption that keyof T forms an exhaustive list, because having a reference to an object doesn't mean that the type of the reference isn't a supertype of the type of the value.
    //
    // Basically, (at least) one of the following four things can't be true:
    //
    // keyof T is an exhaustive list of the keys of T
    // A type with additional properties is always a subtype of its base type
    //   It is legal to alias a subtype value by a supertype reference
    // Object.keys returns keyof T
    // Throwing away point 1 makes keyof nearly useless, because it implies that keyof Point might be some value that isn't "x" or "y".
    //
    // Throwing away point 2 completely destroys TypeScript's type system. Not an option.
    //
    // Throwing away point 3 also completely destroys TypeScript's type system.
    //
    // Throwing away point 4 is fine and makes you, the programmer, think about whether or not the object you're dealing with is possibly an alias for a subtype of the thing you think you have.
    //
    // The "missing feature" to make this legal but not contradictory is Exact Types, which would allow you to declare a new kind of type that wasn't subject to point #2. If this feature existed, it would presumably be possible to make Object.keys return keyof T only for Ts which were declared as exact.
    //
    // Addendum: Surely generics, though?
    //   Commentors have implied that Object.keys could safely return keyof T if the argument was a generic value. This is still wrong. Consider:

    class Holder<T> {
      value: T

      constructor(arg: T) {
        this.value = arg
      }

      getKeys(): (keyof T)[] {
        // Proposed: This should be OK
        // @ts-expect-error
        return Object.keys(this.value)
      }
    }

    const MyPoint = { name: 'origin', x: 0, y: 0 }
    const holderForcedType = new Holder<{ x: number; y: number }>(MyPoint)
    // Value 'name' inhabits variable of type 'x' | 'y'
    const v1: 'x' | 'y' = holderForcedType.getKeys()[0]

    const holderWithNotForcedType = new Holder(MyPoint)
    // or this example, which doesn't even need any explicit type arguments:
    const v2: 'x' | 'y' | 'name' = holderWithNotForcedType.getKeys()[0]

    function getKey<T>(x: T, y: T): keyof T {
      // Proposed: This should be OK
      // @ts-expect-error
      return Object.keys(x)[0]
    }

    const obj1 = { name: '', x: 0, y: 0 }
    const obj2 = { x: 0, y: 0 }
    // Value "name" inhabits variable with type "x" | "y"
    const s: 'x' | 'y' = getKey(obj1, obj2)

    // #########################

    /**
     * Converts object keys to their string literal types.
     */
    type ToStringKey<T> = `${Extract<keyof T, string | number>}`

    /**
     * Returns the names of the _typed_ enumerable string properties and methods of an object.
     *
     * Note: Limiting Object.keys to a specific type may lead to inconsistencies between type-checking and runtime behavior.
     * Use this function when you are certain of the objects keys.
     */
    const getTypedKeys = Object.keys as <T extends object>(
      obj: T
      // Using `ToStringKey` because Object.keys returns all keys as strings.
    ) => Array<ToStringKey<T>>

    // Test getTypedKeys - string[] vs ("a" | "b")[] - see https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript/55012175#55012175
    const implicitlyTypedObj = { a: 'foo', b: 'bar' }
    const constObj = { a: 'foo', b: 'bar' } as const

    const keysObject = Object.keys(implicitlyTypedObj) // string[]
    expectType<TypeEqual<typeof keysObject, string[]>>(true)
    const keysLodash = _.keys(implicitlyTypedObj) // string[]
    expectType<TypeEqual<typeof keysLodash, string[]>>(true)
    const keysTyped = getTypedKeys(implicitlyTypedObj) // ("a" | "b")[]
    expectType<TypeEqual<typeof keysTyped, ('a' | 'b')[]>>(true)

    /**
     * Returns an array of _typed_ values of the enumerable properties of an object.
     */
    const getTypedValues = Object.values as <T extends object>(obj: T) => Array<T[keyof T]>

    // Test getTypedValues - string[]
    const valuesObject = Object.values(implicitlyTypedObj) // number[]
    expectType<TypeEqual<typeof valuesObject, string[]>>(true)
    const valuesLodash = _.values(implicitlyTypedObj) // number[]
    expectType<TypeEqual<typeof valuesLodash, string[]>>(true)
    const valuesImplicitTyped = getTypedValues(implicitlyTypedObj) // number[]
    expectType<TypeEqual<typeof valuesImplicitTyped, string[]>>(true)

    // With const object - ('foo' | 'bar')[], NOT readonly ["foo", "bar"]
    const valuesObjectConst = Object.values(constObj)
    expectType<TypeEqual<typeof valuesObjectConst, ('foo' | 'bar')[]>>(true)
    const valuesLodashConst = _.values(constObj)
    expectType<TypeEqual<typeof valuesLodashConst, ('foo' | 'bar')[]>>(true)
    const valuesTypedConst = getTypedValues(constObj)
    expectType<TypeEqual<typeof valuesTypedConst, ('foo' | 'bar')[]>>(true)

    /**
     * Returns an array of _typed_ key/values of the enumerable properties of an object.
     *
     * Note: Limiting Object.entries to a specific type may lead to inconsistencies between type-checking and runtime behavior.
     * Use this function when you are certain of the objects keys.
     */
    const getTypedEntries = Object.entries as <T extends object>(
      obj: T
      // Using `ToStringKey` because Object.entries returns all keys as strings.
    ) => Array<[ToStringKey<T>, T[keyof T]]>

    /** *
     * # Exact @see https://github.com/Microsoft/TypeScript/issues/12936#issuecomment-1701604038
     *
     * Primary use-case is when you're creating a new type from expressions and you'd like the
     * // language to support you in ensuring no new properties are accidentally being added.
     * // Especially useful when the assigned together types may come from other parts of the application
     * // and the result may be stored somewhere where extra fields are not useful.
     *
     * FLAWED & NOT WORKING
     */
    type Exact<T> = T & { readonly _exact: unique symbol }

    // @todo(222): not working
    function toExact<T extends {}>(obj: T /*, allowedKeys: (keyof T)[]*/): Exact<T> {
      // const r = {} as Exact<T>
      //
      // // @todo(111): why do we need to copy? We only need the type, not cloning!
      // allowedKeys.forEach(key => {
      //   (r[key] as any) = obj[key]
      // })

      // return r
      return obj as Exact<T>
    }

    // Test Exact

    interface User {
      username: string
      email: string
    }

    // Plain User
    // @ts-expect-error
    const user: User = { username: 'x', email: 'y', foo: 'z' } //=> Currently errors when `foo` is unknown.

    const fnUser = (user: User) => user.username + user.email
    fnUser(toExact({ username: 'x', email: 'y', foo: 'z' })) // WRONG: should fail!

    type ExactUser = Exact<User>

    const exactUser_legit: Exact<User> = toExact<User>({
      username: 'x',
      email: 'y',
    })
    const exactUser_legit2: Simplify<ExactUser> = toExact<User>({
      username: 'x',
      email: 'y',
    })

    // @ts-expect-error: errors if we pass a POJSO, without the Exact type treatment
    const exactUser_notExact_value: Exact<User> = { username: 'x', email: 'y' }

    // @ts-expect-error: ΟΚ
    const exactUserFoo: Exact<User> = { username: 'x', email: 'y', foo: 'z' } //=> Still errors with `foo` unknown.
    // @ts-expect-error: ΟΚ
    const exactUserFoo2: ExactUser = { username: 'x', email: 'y', foo: 'z' } //=> Still errors with `foo` unknown.

    const user3: User = Object.assign({ username: 'x' }, { email: 'y', foo: 'z' }) //=> NO ERROR, but foo is wrong

    // @ts-expect-error: GOOD! foo is unknown (but error is TS2322: _exact is declared here.
    const user4: Exact<User> = Object.assign(
      { username: 'x' },
      {
        email: 'y',
        foo: 'z',
      }
    )

    // @ts-expect-error: GOOD! foo is unknown (but error is TS2322: _exact is declared here.
    const user5: ExactUser = Object.assign(
      { username: 'x' },
      {
        email: 'y',
        foo: 'z',
      }
    )

    // @ts-expect-error: foo is unknown - Still errors - @todo: shouldnt this work?
    const userNotExact: Exact<User> = Object.assign({ username: 'x' }, { email: 'y' })

    // Lets make it work! @todo: still NOT working!

    const allowedKeys = ['username' as const, 'email' as const] as const

    // This is fine
    const userExact: Exact<User> = toExact(Object.assign({ username: 'x' }, { email: 'y' }))

    // @todo: shouldnt these error? @ts-expect-error: foo is unknown
    const userExactShouldError: Exact<User> = toExact<User>(
      Object.assign({ username: 'x' }, { email: 'y', foo: 'bar' })
    )
    // @todo: shouldnt these error? @ts-expect-error: foo is unknown
    const userExactShouldError2: Exact<User> = toExact({
      username: 'x',
      email: 'y',
      foo: 'bar',
    })

    const userExactShouldError3: Exact<User> = toExact<User>({
      username: 'x',
      email: 'y',
      // @ts-expect-error: OK, foo is unknown
      foo: 'bar',
    })

    // @todo: try Opaque / Invariant from type-fest
  })
})
