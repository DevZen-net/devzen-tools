import { checkBox } from '../utils'

export const isBoxedNumber = (val): val is Number => checkBox(Number)(val)
