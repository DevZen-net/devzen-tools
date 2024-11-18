// See https://github.com/microsoft/TypeScript/issues/54585

import { IsEqual } from 'type-fest'
import { typeIsTrue } from '../code'

type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T

type Class<T, Arguments extends unknown[] = any[]> = Constructor<T, Arguments> & {
  prototype: T
}

type Class2<T, Arguments extends unknown[] = any[]> = Omit<
  Constructor<T, Arguments>,
  'prototype'
> & { prototype: T }

export type Class_TypeFest<T, Arguments extends unknown[] = any[]> = {
  prototype: Pick<T, keyof T>
  new (...arguments_: Arguments): T
}

type NumberStringType = {
  repeatForward(s: string, n: number): string
  repeatBack(n: number, s: string): string
}

type X_Class = Pick<Class<NumberStringType>, keyof Class<NumberStringType>>
typeIsTrue<IsEqual<X_Class, { prototype: NumberStringType }>>()

type X_Class2 = Pick<Class2<NumberStringType>, keyof Class2<NumberStringType>>
typeIsTrue<IsEqual<X_Class2, { prototype: NumberStringType }>>()

type X_Class_TypeFest = Pick<
  Class_TypeFest<NumberStringType>,
  keyof Class_TypeFest<NumberStringType>
>
typeIsTrue<IsEqual<X_Class_TypeFest, { prototype: NumberStringType }>>()
