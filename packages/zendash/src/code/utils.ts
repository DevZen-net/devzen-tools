import * as _ from 'lodash'
// Copied from https://github.com/hildjj/node-inspect-extracted/blob/main/src/internal/util/types.js

export const getConstructorName = (val: any) => {
  if (!val || typeof val !== 'object') {
    throw new Error('Invalid object')
  }
  if (val.constructor && val.constructor.name) {
    return val.constructor.name
  }
  const str = Object.prototype.toString.call(val)
  // e.g. [object Boolean]
  const m = str.match(/^\[object ([^\]]+)]/)
  if (m) {
    return m[1]
  }
  return 'Object'
}

export const constructorNamed = (val: any, ...name: any[]) => {
  // Pass in names rather than types, in case SharedArrayBuffer (e.g.) isn't in your browser
  for (const n of name) {
    const typ = (global as any)[n]
    if (typ && val instanceof typ) {
      return true
    }
  }
  // instanceOf doesn't work across vm boundaries, so check the whole
  // inheritance chain
  while (val) {
    if (typeof val !== 'object') {
      return false
    }
    if (name.includes(getConstructorName(val))) {
      return true
    }
    val = Object.getPrototypeOf(val)
  }
  return false
}

export const checkBox = (cls: any) => {
  return (val: any) => {
    if (!constructorNamed(val, cls.name)) {
      return false
    }
    try {
      cls.prototype.valueOf.call(val)
    } catch {
      return false
    }
    return true
  }
}

// @todo: make resursive, for nested Symbols
export const toStringSafe = (val: any) =>
  _.isSymbol(val)
    ? String(val)
    : typeof val === 'function'
      ? String(val)
      : typeof val === 'object'
        ? Object.prototype.toString.call(val)
        : val

export const filterTrue = () => true
export const filterFalse = () => false
