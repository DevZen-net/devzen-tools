// Original https://github.com/microsoft/TypeScript/issues/44253#issuecomment-1097202653

import { IsEqual } from 'type-fest'
import { typeIsTrue } from '../code'

export type SetRequired<BaseType, Keys extends keyof BaseType> = BaseType &
  Omit<BaseType, Keys> &
  Required<Pick<BaseType, Keys>>

interface ObjectConstructor {
  hasOwn<BaseType, Key extends keyof BaseType>(
    record: BaseType,
    key: Key
  ): record is SetRequired<BaseType, Key>
  hasOwn<Key extends PropertyKey>(record: object, key: Key): record is { [K in Key]: unknown }
}

declare var Object: ObjectConstructor

////////////////////////////////////////////////////////////////////////////////

export function test_indexed(obj: { [key: PropertyKey]: string }) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<string, typeof obj.foo>>()
  }
}

export function test_object(obj: object) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<unknown, typeof obj.foo>>()
  }
}

export function test_optional(obj: { foo?: number }) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<number, typeof obj.foo>>()
  }
}

export function test_required(obj: { foo: number }) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<number, typeof obj.foo>>()
  }
}

export function test_Object(obj: Object) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<unknown, typeof obj.foo>>()
  }
}

interface test_Interface {
  foo?: string
}
export function test_interface(obj: test_Interface) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<string, typeof obj.foo>>()
  }
}

class test_Class {
  foo?: string
}
export function test_class(obj: test_Class) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<string, typeof obj.foo>>()
  }
}

export function test_union(obj: { foo: string } | { bar: string }) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<string, typeof obj.foo>>()
  }
}

export function test_intersection(obj: { foo: { bar: string } } & { foo: { baz: number } }) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<{ bar: string } & { baz: number }, typeof obj.foo>>()
  }
}

export function test_record(obj: Record<string, string>) {
  if (Object.hasOwn(obj, 'foo')) {
    typeIsTrue<IsEqual<string, typeof obj.foo>>()
  }
}

export function test_union_tagged(obj: { a: string; b: string } | { c: string; d: string }) {
  if (Object.hasOwn(obj, 'a')) {
    typeIsTrue<IsEqual<string, typeof obj.b>>()
  }
}

export function test_missing_key(obj: { foo: string }) {
  if (Object.hasOwn(obj, 'bar')) {
    typeIsTrue<IsEqual<unknown, typeof obj.bar>>()
  }
}
