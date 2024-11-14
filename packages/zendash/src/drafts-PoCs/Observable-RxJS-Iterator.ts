// See https://github.com/LPegasus/async-iterator-from-rx/blob/main/src/index.ts

// GitHub Co-pilot:

// // Can we convert an RxJS stream into an AyncGenerator? What problems might it have? Show examples.
//
// // Yes, you can convert an RxJS Observable into an AsyncGenerator. However, there are a few things to consider:
// //
// //   1. Error Handling: AsyncGenerators do not have a built-in mechanism for handling errors. If an error occurs in the Observable, it needs to be handled properly, otherwise it might cause the AsyncGenerator to stop prematurely.
// //
// // 2. Completion: Observables can complete, but AsyncGenerators do not have a built-in mechanism for signaling completion. You need to ensure that the AsyncGenerator stops yielding values when the Observable completes.
// //
// // 3. Backpressure: AsyncGenerators inherently support backpressure because they only generate a new value when `.next()` is called. However, Observables do not support backpressure out of the box. You might need to use specific operators to handle backpressure.
// //
// //   Here is an example of how you can convert an Observable to an AsyncGenerator:
// //
//
// import { Observable } from 'rxjs';
//
// async function* fromObservable<T>(observable: Observable<T>): AsyncGenerator<T, void, unknown> {
//   const iterator = {
//     [Symbol.asyncIterator]() {
//       return this;
//     },
//     next() {
//       return new Promise((resolve, reject) => {
//         observable.subscribe({
//           next: value => resolve({ value, done: false }),
//           error: reject,
//           complete: () => resolve({ value: undefined, done: true })
//         });
//       });
//     }
//   };
//   yield* iterator;
// }
//
// // Usage
// import { of } from 'rxjs';
//
// const observable = of(1, 2, 3, 4, 5);
// const asyncGenerator = fromObservable(observable);
//
// (async () => {
//   for await (const value of asyncGenerator) {
//     console.log(value); // logs 1, 2, 3, 4, 5
//   }
// })();
//
// // In this example, we create an AsyncGenerator that subscribes to the Observable and yields the values. When the Observable completes, the AsyncGenerator also completes. If an error occurs in the Observable, the promise is rejected and the error can be caught in the AsyncGenerator.
//
// // Can you revise it to use an Async Generator instead?
//
// async function* fromObservable2<T>(observable: Observable<T>): AsyncGenerator<T, void, unknown> {
//   let resolve: (value?: { value: T, done: false } | { value: undefined, done: true }) => void;
//   let reject: (reason?: any) => void;
//
//   const promise = new Promise<{ value: T, done: false } | { value: undefined, done: true }>((res, rej) => {
//     resolve = res;
//     reject = rej;
//   });
//
//   const subscription = observable.subscribe({
//     next: value => resolve({ value, done: false }),
//     error: reject,
//     complete: () => resolve({ value: undefined, done: true })
//   });
//
//   try {
//     while (true) {
//       const result = await promise;
//       yield result.value;
//       if (result.done) {
//         break;
//       }
//     }
//   } finally {
//     subscription.unsubscribe();
//   }
// }
//
// // Usage
// import { of } from 'rxjs';
//
// const observable = of(1, 2, 3, 4, 5);
// const asyncGenerator = fromObservable(observable);
//
// (async () => {
//   for await (const value of asyncGenerator) {
//     console.log(value); // logs 1, 2, 3, 4, 5
//   }
// })();
//
// // Bing Co-Pilot
//
// // Certainly! Let’s explore how to convert an RxJS stream into an AsyncGenerator and discuss potential challenges. I’ll provide examples to illustrate the process.
// //
// //   Converting an RxJS Stream to an AsyncGenerator
// // Approach 1: Using Promises and await
// //   One way to achieve this conversion is by using await within a Promise. Here’s an example:
// //
// //   JavaScript
//
// const defer = () => new Promise((resolve) => setTimeout(resolve, 0))
//
// async function* getData(observable) {
//   let nextData = defer()
//   const sub = observable.subscribe({
//     next(data) {
//       const n = nextData
//       nextData = defer()
//       n.resolve(data)
//     },
//     error(err) {
//       nextData.reject(err)
//     },
//     complete() {
//       const n = nextData
//       nextData = null
//       n.resolve()
//     },
//   })
//
//   try {
//     for (;;) {
//       const value = await nextData
//       if (!nextData) break
//       yield value
//     }
//   } finally {
//     sub.unsubscribe()
//   }
// }
//
// // Example usage
// ;(async function example() {
//   for await (const data of getData(foo)) {
//     console.log('data received:', data)
//   }
//   console.log('done')
// })()
// // AI-generated code. Review and use carefully. More info on FAQ.
// //   In this approach, we use a defer function to create a new Promise each time a value is received. The await nextData line ensures that we yield the data when available.
// //
// //   Approach 2: Handling Batches
// // The first approach may not handle cases where the observable generates several values in one batch. To address this, we can accumulate values and yield them as a batch:
//
// async function* getData(observable) {
//   let values = []
//   let error = null
//   let done = false
//
//   observable.subscribe(
//     (data) => values.push(data),
//     (err) => (error = err),
//     () => (done = true)
//   )
//
//   for (;;) {
//     if (values.length) {
//       for (const value of values) {
//         yield value
//       }
//       values = []
//     }
//     if (error) throw error
//     if (done) return
//     await defer()
//   }
// }
//
// // AI-generated code. Review and use carefully. More info on FAQ.
// //   In this version, we accumulate values in an array and yield them when available. The error and done flags ensure proper handling.
// //
// //   Potential Challenges
// // Backpressure: If the observable produces data faster than the consumer can handle, backpressure can occur. Consider implementing a buffer or rate-limiting mechanism.
// //   Unsubscribing: Properly unsubscribing from the observable is crucial to avoid memory leaks. The finally block in the first example demonstrates this.
// //   Error Handling: Ensure that errors from the observable are propagated correctly. The second example handles errors explicitly.
// //   Remember that these approaches are simplified for demonstration purposes. Real-world scenarios may require additional considerations based on your specific use case.
