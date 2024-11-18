// Mixin / Inheritance problem with Typescript - string not assignable to string|number|symbol
// https://github.com/microsoft/TypeScript/issues/52907
type TModel = {
  User: {
    username: string
    password: string | undefined
  }
  APIKey: {
    privateKey: string
  }
}
type TProps<T extends keyof TModel> = Partial<TModel[T]>

type ConstructorSimple<T = {}> = new (...args: any[]) => T

class VingRecordFailing<T extends keyof TModel> {
  constructor(private props: TProps<T>) {}

  public set<K extends keyof TProps<T>>(_key: K) {}
}

function RoleMixinFailing<T extends ConstructorSimple>(Base: T) {
  return class RoleMixin extends Base {}
}

// @ts-expect-error: it should work - not working with TS 5.4.4
class UserRecordFailing extends RoleMixinFailing(VingRecordFailing<'User'>) {
  public set<K extends keyof TProps<'User'>>(_key: K) {}
}

// Solution - UGLY!

interface IConstructable<T = {}> {
  new (...args: any): T
}

type Wrap<T> = () => T
type Unwrap<T> = T extends infer U ? (U extends Wrap<infer V> ? V : never) : never
type Sneaky<T> = Unwrap<Wrap<never> & (T extends infer R2 ? Wrap<R2> : never)>

class VingRecord<T extends keyof TModel> {
  constructor(private props: TProps<T>) {}

  public set<K extends keyof TProps<T>>(_key: K, value: TProps<T>[K]) {}
}

function RoleMixin<T extends IConstructable>(Base: T) {
  class RoleMixin extends Base {}
  return RoleMixin as {
    new (...args: any): RoleMixin
    prototype: any
  } & T
}

class UserRecord extends RoleMixin(VingRecord<'User'>) {
  public set<K extends keyof TProps<'User'>>(_key: K, value: TProps<'User'>[K]) {}
}
new UserRecord({}).set('username', undefined)
