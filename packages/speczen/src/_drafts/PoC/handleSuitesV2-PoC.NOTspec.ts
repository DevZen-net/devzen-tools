// import * as _ from 'lodash'
// // A PoC for nested Suites & TestCases > describe() & it()
//
// class TestCase {
//   __kind: 'TestCase'
//
//   handler?: (testCase: any) => any
//
//   testCaseData: Record<string, any> // | any[]
//
//   isVisible: boolean
// }
//
// class Suite {
//   __kind = 'Suite'
//
//   name: string
//
//   descr?: string
//
//   columns?: string[]
//
//   handler?: (testCase: any) => any
//
//   suiteData: (Suite | TestCase)[]
// }
//
// export const handleSuite = (suite: Suite) => {
//   // handleSuiteInJestRecursiveDeNesting(suite, {})
//   describe(`${suite.name}TOP LEVEL`, () => {
//     handleSuiteInJestRecursive(suite, {})
//   })
// }
//
// export const handleSuiteInJestRecursive = (
//   suite: Suite,
//   state: {
//     columns?: string[]
//     handler?: (testCaseData) => any
//     nestLevel?: number
//   }
// ) => {
//   // console.log(suite, state)
//   const currentColumns: string[] = suite.columns || state?.columns
//   if (!currentColumns) throw new Error('No columns')
//
//   const currentHandler: (testCaseData) => any = suite.handler || state?.handler
//   if (!currentHandler) throw new Error('No handler')
//
//   const nestLevel = state?.nestLevel || 0
//
//   _.each(suite.suiteData, (suiteOrTestCase: Suite | TestCase, idx) => {
//     if (!suiteOrTestCase) {
//       // if (strictMode) throw new Error('Empty Suite or TestCase found!')
//       describe('WARNING - EMPTY SUITE OR TESTCASE', () => {
//         it(`DO YOU HAVE ENA EXTRA COMMA?`, () => expect(true).toEqual(false))
//       })
//       return
//     }
//
//     if (suiteOrTestCase.__kind === 'Suite') {
//       describe(`${suiteOrTestCase.name} ${nestLevel}`, () => {
//         handleSuiteInJestRecursive(suiteOrTestCase, {
//           columns: currentColumns,
//           handler: currentHandler,
//           nestLevel: nestLevel + 1,
//         })
//       })
//     } else {
//       const testCase = suiteOrTestCase as TestCase
//       const { handler, testCaseData } = testCase
//       ;(testCase.isVisible ? it : it.skip)(
//         `${nestLevel} Test ${testCaseData.descr}`,
//         () => {
//           ;(handler || currentHandler)(testCaseData)
//         }
//       )
//     }
//   })
// }
//
// // export const handleSuiteInJestRecursiveDeNesting = (
// //   suite: Suite,
// //   state: {
// //     columns?: string[]
// //     handler?: (testCaseData) => any
// //     nestLevel?: number
// //   }
// // ) => {
// //   // console.log(suite, state)
// //   let currentColumns: string[] = suite.columns || state?.columns
// //   if (!currentColumns) throw new Error('No columns')
// //
// //   let currentHandler: (testCaseData) => any = suite.handler || state?.handler
// //   if (!currentHandler) throw new Error('No handler')
// //
// //   const nestLevel = state?.nestLevel || 0
// //   // Levels & descr are wrong, one level behind! Fuck it!
// //   let owesDeNesting = false
// //
// //   _.each(suite.suiteData, (suiteOrTestCase: Suite | TestCase, idx) => {
// //     if (suiteOrTestCase.__kind === 'Suite') {
// //       owesDeNesting = true
// //       describe(suiteOrTestCase.name + ' ' + nestLevel, () => {
// //         handleSuiteInJestRecursiveDeNesting(suiteOrTestCase, {
// //           columns: currentColumns,
// //           handler: currentHandler,
// //           nestLevel: nestLevel + 1,
// //         })
// //       })
// //     } else {
// //       const testCase = suiteOrTestCase as TestCase
// //       const { handler, testCaseData } = testCase
// //
// //       if (owesDeNesting) {
// //         console.log('denesting')
// //         owesDeNesting = false
// //         describe(suite.name + '(Continued) ' + nestLevel, () => {
// //           ;(testCase.isVisible ? it : it.skip)(
// //             `${nestLevel} Test ${testCaseData.descr}`,
// //             () => {
// //               ;(handler || currentHandler)(testCaseData)
// //             }
// //           )
// //         })
// //       }
// //       ;(testCase.isVisible ? it : it.skip)(`${nestLevel} Test ${testCaseData.descr}`, () => {
// //         ;(handler || currentHandler)(testCaseData)
// //       })
// //     }
// //   })
// // }
//
// const add = (a: number, b: number): number => a + b
// const deduct = (a: number, b: number): number => a - b
//
// // handleSuite(
// handleSuite(
//   // Top level is a always one Suite, with nested ones:
//   {
//     __kind: 'Suite',
//     name: 'Numbers',
//     columns: ['descr', 'result'],
//     handler: ({ input: [a, b], result }): void =>
//       expect(add(a, b)).toEqual(result),
//     suiteData: [
//       {
//         __kind: 'Suite',
//         name: 'Add small nums',
//         suiteData: [
//           // TestCases or nested Suites
//           {
//             __kind: 'TestCase',
//             isVisible: true,
//             testCaseData: {
//               descr: 'Add 3 to 10',
//               input: [3, 10],
//               result: 13,
//             },
//           },
//           {
//             __kind: 'Suite',
//             name: 'Add large nums',
//             handler: ({ input: [a, b], result }): void =>
//               expect(add(a, b) + 1 - 1).toEqual(result),
//             suiteData: [
//               // TestCases or nested Suites
//               {
//                 __kind: 'TestCase',
//                 isVisible: false,
//                 testCaseData: {
//                   descr: 'Add 3 to 1000',
//                   input: [3, 1000],
//                   result: 1003,
//                 },
//               },
//               {
//                 __kind: 'TestCase',
//                 isVisible: true,
//                 testCaseData: {
//                   descr: 'Add 13 & 1000',
//                   input: [13, 1000],
//                   result: 1013,
//                 },
//               },
//             ],
//           },
//           {
//             __kind: 'Suite',
//             name: 'Deduct nums!',
//             handler: ({ input: [a, b], result }): void =>
//               expect(deduct(a, b) + 1 - 1).toEqual(result),
//             suiteData: [
//               // TestCases or nested Suites
//               {
//                 __kind: 'TestCase',
//                 isVisible: true,
//                 testCaseData: {
//                   descr: '3000 - 1000',
//                   input: [3003, 1000],
//                   result: 2003,
//                 },
//               },
//               {
//                 __kind: 'TestCase',
//                 isVisible: true,
//                 testCaseData: {
//                   descr: '13000 - 100000',
//                   input: [1000, 500],
//                   result: 500,
//                 },
//               },
//             ],
//           },
//           {
//             __kind: 'TestCase',
//             isVisible: true,
//             testCaseData: {
//               descr: 'Add 13 & 10',
//               input: [13, 10],
//               result: 23,
//             },
//           },
//         ],
//       },
//     ],
//   }
// )
