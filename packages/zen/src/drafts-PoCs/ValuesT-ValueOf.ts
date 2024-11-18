import { keys } from '../code'
import { values } from '../code/loopzen/values'
import { a_Person } from '../test-utils/test-data'

const myOptions = {
  own: false,
  props: true,
  nonEnumerables: true,
  inherited: true,
} as const

const keys_ofPerso = keys(a_Person, myOptions)
const values_valueWithProps_No = values(a_Person, myOptions)
// type TvaluesResultActual = never

const res = values(a_Person, { symbol: true })
console.log(res)
