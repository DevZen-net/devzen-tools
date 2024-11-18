import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { BaseType, findKey, NOTHING } from '../code'
import { find } from '../code/loopzen/find'
import { reduce } from '../code/loopzen/reduce'
import { a_Array_of_Tvalues_withCommonAndArrayExtraProps, Tvalues } from './test-data'

// props  copied/mapped of map()

const options = {
  props: 'all',
  // props: true,
  // nonEnumerables: true
} as const

// const inputValue = a_Array_of_Tvalues_withCommonAndArrayExtraProps
const inputValue = [1, 2, 3]

const asyncGenerator = async function* () {
  yield 1
  yield 2
  yield 3
}

// find

const resFind = find(111, (item, idxKey, input, count) => {
  return true
})

console.log(resFind)



