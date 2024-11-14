// /** choosing-Classes-Instances-Functions.PoC
//
// For background:
// @see https://stackoverflow.com/questions/70364964/difference-in-typescript-between-types-instancetypetypeof-myclass-and-myc/70368495#70368495
//
// */
// import {
//   COLUMNS,
//   Skip,
//   Only,
//   ONLY,
//   SKIP,
//   SUITE,
//   ClassType,
// } from '../../code/types'
// import { Columns, Filter } from '../../code/types'
// import { getTinyLog } from '../../code/utils/tiny-log'
// const _log = getTinyLog(false, 'LogZen')
//
// class A {
//   aField?: string
//   // constructor() {}
//   // foo() {}
// }
// class FooClass {
//   fooField: string
//   // constructor() {}
// }
//
// // 1 constructor function
// declare function factory1<T>(ctor: T): T
// const res = factory1(A) // typeof A: not what we expect - doesn't work because we actually return the type of the constructor function itself.
//
// // 2 with InstanceType // However, this implementation works:
// type Constructor = new (...args: any[]) => any
// declare function factory2<T2 extends Constructor>(ctor: T2): InstanceType<T2>
// const res2 = factory2(A) // A: what we expect
//
// // PASS
// const onlyInstancesPass21: A[] = [new A(), res2, { aField: 'aa' }]
// const allInstancesAndClass2: (A | ClassType<A> | InstanceType<typeof A>)[] = [
//   A,
//   new A(),
//   res2,
//   { aField: 'aa' },
// ]
// const onlyInstancesPass22: InstanceType<typeof A>[] = [
//   new A(),
//   res2,
//   { aField: 'aa' },
// ]
// const onlyInstancesPass23: InstanceType<ClassType<A>>[] = [
//   new A(),
//   res2,
//   { aField: 'aa' },
// ]
//
// // FAIL
//
// const onlyInstances21: A[] = [A, 'foo'] // <== should FAIL, A is not an instance, 'foo' also
// const onlyClassesPass24: ClassType<A>[] = [new A(), res2, { aField: 'aa' }]
// const failInstance23: A = new FooClass() // <== should FAIL
// const failInstancesAndClass22: (A | ClassType<A>)[] = { aField: 'aa' } // <== should FAIL
//
// // // 3 with generics WIP
// // type ConstructorG<T> = new (...args: any[]) => T;
// // declare function factory3<T3 extends ConstructorG<T3>>(ctor: T3): InstanceType<T3>;
// // const res3 = factory3(A); // A: what we expect
// // const allInstancesAndClass3: A | ClassType<A> = [A, new A(), res3];
//
// //
//
// //
// // declare function factory2<T extends Constructor<T>>(ctor: T): InstanceType<T>;
// // const res3 = factory2(A); // A: what we expect
// //
// // class B { }
// //
// // // ///// AnoDyNoS
// // // declare function factory3<T extends ClassType>(ctor: T): InstanceType<typeof T>;
// // //
// // // const res3 = factory3(A3); // A: what we expect
// //
// //
// // /// all instance of a class & Class it self
// // const allInstancesAndClass: A3 | ClassType<A3> = [A3, new A3(), B3];
// //
// //
// //
