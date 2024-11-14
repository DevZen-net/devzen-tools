import { checkBox } from '../utils'

export const isBoxedString = (val): val is String => checkBox(String)(val)
