import * as _z from '../../code/index'

// for (const [key, value] of _z.loop([{a:11, b:2}])) {


_z.isExact(1,2)

// for (const [key, value] of _z.loop([1,2])) {
const value = [1,2] as const

// @ts-expect-error because draft-PoCs is excluded from tsconfig.json
for (const [item, prop] of _z.loop(value)) {
  console.log(prop, item)
}

