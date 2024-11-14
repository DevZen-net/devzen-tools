import { expectType, TypeEqual } from 'ts-expect'
import { EmptyObject } from 'type-fest'
import { IKeysOptions } from '../code'
import { InspectableNested } from '../code/loopzen/keys'
import { a_Employee } from '../test-utils/test-data'

/**
 * Return the props of an object, based on the KeysOptions passed - follows 100% the `keys()` function. *
 * Note: still a skeleton, we replace NestedKeys & Props with proper calls later
 */
export type KeysSkeleton<Tinput, TkeysOptions extends IKeysOptions = {}> =
  // prettier stay here!
  | (Tinput extends InspectableNested
      ? TkeysOptions extends ({ props?: false | 'all' } & IKeysOptions) | undefined
        ? `NestedKeys`
        : never
      : never)
  | (TkeysOptions extends { props: true | 'all' } & IKeysOptions
      ? `Props`
      : Tinput extends InspectableNested
        ? never
        : `Props`)

// implicit props: false - no OR empty OR irrelevant options etc

type TestKeysArray_NoOptions = KeysSkeleton<Array<any>>
expectType<TypeEqual<TestKeysArray_NoOptions, 'NestedKeys'>>(true)

type TestKeysArray_emptyOptions = KeysSkeleton<Array<any>, {}> // EmptyObject
expectType<TypeEqual<TestKeysArray_emptyOptions, 'NestedKeys'>>(true)

type TestKeysArray_irrelevantOptions = KeysSkeleton<Array<any>, { own: true }> // EmptyObject
expectType<TypeEqual<TestKeysArray_irrelevantOptions, 'NestedKeys'>>(true)

// explicit props: false

type TestKeysArray_false = KeysSkeleton<Array<any>, { props: false }>
expectType<TypeEqual<TestKeysArray_false, 'NestedKeys'>>(true)

type TestKeysArray_false_own = KeysSkeleton<Array<any>, { props: false; own: true }>
expectType<TypeEqual<TestKeysArray_false_own, 'NestedKeys'>>(true)

// props: 'all'

type TestKeysArray_all = KeysSkeleton<Array<any>, { props: 'all' }>
expectType<TypeEqual<TestKeysArray_all, 'Props' | 'NestedKeys'>>(true)

type TestKeysArray_all_own = KeysSkeleton<Array<any>, { props: 'all'; own: true }>
expectType<TypeEqual<TestKeysArray_all_own, 'Props' | 'NestedKeys'>>(true)

// props: 'true' (i.e ONLY props)

type TestKeysArray_true = KeysSkeleton<Array<any>, { props: true }>
expectType<TypeEqual<TestKeysArray_true, 'Props'>>(true)

type TestKeysArray_true_own = KeysSkeleton<Array<any>, { props: true; own: true }>
expectType<TypeEqual<TestKeysArray_true_own, 'Props'>>(true)

// realObject: props only, no matter the options

type TestKeysInstance_all = KeysSkeleton<typeof a_Employee, { props: 'all' }>
expectType<TypeEqual<TestKeysInstance_all, 'Props'>>(true)

type TestKeysInstance_all_own = KeysSkeleton<
  typeof a_Employee,
  {
    props: 'all'
    own: true
  }
>
expectType<TypeEqual<TestKeysInstance_all_own, 'Props'>>(true)

type TestKeysInstance_true = KeysSkeleton<typeof a_Employee, { props: true }>
expectType<TypeEqual<TestKeysInstance_true, 'Props'>>(true)

type TestKeysInstance_true_own = KeysSkeleton<
  typeof a_Employee,
  {
    props: true
    own: true
  }
>
expectType<TypeEqual<TestKeysInstance_true_own, 'Props'>>(true)

type TestKeysInstance_false = KeysSkeleton<typeof a_Employee, { props: false }>
expectType<TypeEqual<TestKeysInstance_false, 'Props'>>(true)

type TestKeysInstance_false_own = KeysSkeleton<
  typeof a_Employee,
  {
    props: false
    own: true
  }
>
expectType<TypeEqual<TestKeysInstance_false_own, 'Props'>>(true)

// @ts-expect-error and that's correct
type TestKeysInstance_noOptions = KeysSkeleton<typeof a_Employee, undefined>
expectType<TypeEqual<TestKeysInstance_noOptions, 'Props'>>(true)

type TestKeysInstance_emptyOptions = KeysSkeleton<typeof a_Employee, {}>
expectType<TypeEqual<TestKeysInstance_emptyOptions, 'Props'>>(true)

// @ts-expect-error @todo(151): is this correct?
type TestKeysInstance_EmptyObject = KeysSkeleton<typeof a_Employee, EmptyObject>
expectType<TypeEqual<TestKeysInstance_EmptyObject, 'Props'>>(true)

type TestKeysInstance_irrelevantOptions = KeysSkeleton<typeof a_Employee, { own: true }>
expectType<TypeEqual<TestKeysInstance_irrelevantOptions, 'Props'>>(true)
