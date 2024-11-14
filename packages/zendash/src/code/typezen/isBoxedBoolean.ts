import { checkBox } from '../utils'

export const isBoxedBoolean = (val): val is Boolean => checkBox(Boolean)(val)
