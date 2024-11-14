import * as _z from '@devzen/zendash'
// import { aSimpleSet } from '@devzen/zendash/dist/test-utils/test-data'
// import * as ansiColors from 'ansi-colors'
import * as _ from 'lodash'
import { ELogLevel, getTinyLog, LogZen, Output } from '../code'
//
// LogZen.clearScreen()
//
//
// // const l = new LogZen()
// const l = new LogZen({
//   // output: 'stdJSON'
//   // output: 'consoleJSON'
//   // output: 'consolePOJSO' // @todo: implement this, or hardcore it below:
//   // inspect: {
//   //   compact: true,
//   //   showProxy: false
//   //   // showHidden: true,
//   //   // strings : true
//   // },
//   // inspect: false, // @todo: should turn off inspect, and print PoJSos without class info etc
//   // raw: true  // @todo: seems to fail to fulfill premises!
// })
// // const anArray = [1,2,3, 'array']
// // ;(l.options() as any).fakeArray = new Array(...anArray)
// // ;(l.options() as any).fakeArray.push((l.options() as any).fakeArray)
// // ;(l.options() as any).fakeCircular1 = l.options()
// //
// // console.log('console.log PoJSo', l.options())
// // console.log(anArray)
// // l.log(anArray)
// // console.log('console.log array:', anArray)
// // l.log('this is a string, followed by a number', 42, 'an array', anArray, 'and an PoJSo:',  l.options())
//
const l14_5 = new LogZen({
  // printMode: 'print',
  // // // colors: false,
  // // // stringColors: true,
  // loggerName: 'print',
  // header: { resolvedName: true },
  // print: {
  //   nesting: true,
  //   // colors: {
  //   //   // propKey: ansiColors.yellow,
  //   //   // string: ansiColors.white,
  //   // },
  //   // useToString: true,
  //   // objectProp: 'toString',
  //   // instanceClass: true,
  //   // maxItems: 3, // array items
  //   // maxProps: 3, // object props
  //   functionOrClass: 'name',
  //   // stringify: true,
  //   mapAsObject: true,
  //   // symbolFormat: 'none',
  //   stringify: false,
  //   // omitted: true
  //   inherited: true,
  //   // objects: {},
  //   symbolFormat: 'inside',
  // },
  inspect: {
    showProxy: true,
    showHidden: true,
    // compact: true,
    breakLength: 50,
  },
})
//
// l14_5.addKid({
//   printMode: 'inspect',
//   loggerName: 'inspect',
// })
//
// // Promises
// // const vm = require('vm');
// //
// // // const val2 = new Promise((resolve) => resolve('result'))
// // const val2 = new Promise((resolve, reject) => reject({ihave: 'reasons', very: 'complicated'}))
// //
// // const promiseResults = {}
// //
// // vm.runInNewContext(
// //   "p.then(() => promiseResults.status = 'fulfilled', () => promiseResults.status = 'rejected');",
// //   { p: val2, promiseResults },
// //   { microtaskMode: 'afterEvaluate' })
// //
// // console.log(val2, promiseResults)
//
// // for (const [idx, val] of _z.iterator(123, { strict: true })) {
// //   console.log(idx, val)
// // }
// //
//
// console.log(_.isNumber(NaN))
// console.log(_.isNumber(Number('foo')))
