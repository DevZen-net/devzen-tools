// Note: this code has great ideas and works, but is experimental.
// It's also a bit messy, it needs refactoring.
// Ideally though, its ideas and specs, should be merged into printinspect, with the much more stable and battle tested [inspect](https://github.com/hildjj/node-inspect-extracted) @todo: merge into printinspect

// @todo: implement some features & get test ideas from https://www.npmjs.com/package/print

import * as ansiColors from 'ansi-colors'
import { StyleFunction } from 'ansi-colors'
import * as _ from 'lodash'
import { inspect } from './inspect'

import * as _z from '@devzen/zendash'
import { LogZenInspectOptions, PrintOptions } from './types'
import { colorsStrip } from './utils/misc'

export const printColorsDefaults: Record<string, StyleFunction> = {
  level: ansiColors.inverse,
  number: ansiColors.yellowBright,
  regexp: ansiColors.red,
  boolean: ansiColors.bgGreen.red,
  string: ansiColors.green,
  quote: ansiColors.yellow,
  squareBracket: ansiColors.magentaBright,
  curlyBracket: ansiColors.cyan,
  comment: ansiColors.grey,
  function: ansiColors.bgCyan,
  class: ansiColors.magenta,
  circular: ansiColors.bgRed.white,
  comma: ansiColors.whiteBright,
  propKey: ansiColors.cyan,
  map: ansiColors.bgBlueBright.white,
  set: ansiColors.bgBlack.white,
  symbol: ansiColors.bgMagenta.white,
  bigint: ansiColors.bgYellowBright.black,
  date: ansiColors.bgMagentaBright.white,
  arguments: ansiColors.bgBlue.white,
}

export const printColorsDummy: Record<string, StyleFunction> = {
  level: _.identity,
  number: _.identity,
  regexp: _.identity,
  boolean: _.identity,
  string: _.identity,
  quote: _.identity,
  squareBracket: _.identity,
  curlyBracket: _.identity,
  comment: _.identity,
  function: _.identity,
  class: _.identity,
  circular: _.identity,
  comma: _.identity,
  propKey: _.identity,
  map: _.identity,
  set: _.identity,
  symbol: _.identity,
  bigint: _.identity,
  date: _.identity,
  arguments: _.identity,
} as any // lie a bit

export const printOptionsDefaults: PrintOptions = {
  colors: {},
  nesting: false,
  argsFormat: 'array',
  symbolFormat: 'for',
  instanceClass: true,
  undefinedInJSON: '[Undefined]', // @todo: use double quotes? what abt null?
  emptyItem: '"[Empty item]"',
  objectProp: 'toString',
  inherited: false,
}

/**
 * Convert a Map to an Object, so it can be printed in a more user-friendly way.
 * It prints objects Map props, as objects or toString etc.
 *
 * @note: This  can't be extracted & generalised! Reason is we need to print() the keys, if these are _z.isRealObjects or Symbols or other Maps (!)
 *
 * @param data
 * @param printOptions
 * @param inspectOptions
 */
const mapToObject = <T = any>(
  data: Map<any, any>,
  printOptions: PrintOptions,
  inspectOptions: LogZenInspectOptions
): { [k: string]: T } => {
  const result = {}
  printOptions = {
    ...printOptions,
    nesting: false,
    stringify: false,
    useToString: printOptions.objectProp === 'toString',
  }

  for (const [prop, value] of data.entries()) {
    const propStr = _.isString(prop) ? prop : print(prop, printOptions, inspectOptions) // // we don't want props to be counted as seen objects

    result[propStr] = value // data.get(prop)
  }

  return result
}

/**
 * - Converts object, arrays, Map & Set to string, solving circular references that JSON.stringify() can't handle.
 * - Doesn't print "FooClass {foo: 'bar'}" but instead prints "{foo: 'bar'}" or "{__class__: FooClass, foo: 'bar'}", same for Array etc, unlike `node.inspect()` where you can't disable it!
 *
 * @param value
 *
 * @param PrintOptions options
 *
 * @returns string the string representation of the value
 */
export const print = (
  value: any,
  printOptions: PrintOptions = {},
  inspectOptions: LogZenInspectOptions = {}
): string => {
  return printInternal(value, printOptions, inspectOptions, new WeakMap())
}

const printInternal = (
  value: any,
  printOptions: PrintOptions = {},
  inspectOptions: LogZenInspectOptions = {},
  refs: WeakMap<object, string>,
  currentDepth: number = 0,
  path: (string | number | symbol)[] = []
): string => {
  printOptions = _.defaults({}, printOptions, printOptionsDefaults)

  const {
    instanceClass,
    useToString,
    nesting,
    functionOrClass,
    mapAsObject,
    setAsArray,
    depth,
    maxItems,
    maxProps,
    omitted,
    stringify,
    undefinedInJSON,
    symbolFormat,
    dateFormat,
    argsFormat,
    transform,
    emptyItem,
    inherited,
  } = printOptions

  inspectOptions = { ...inspectOptions, colors: false }

  let strip = (str: string) => str // dummy
  if (printOptions.colors === false) {
    // @ts-ignore-next-line
    ansiColors.enabled = false
    strip = colorsStrip
  }

  const colors = _.extend(
    {},
    printColorsDefaults,
    _.clone(printOptions.colors || printColorsDummy)
  )

  const padding = (depth) => (nesting ? _.repeat('  ', depth) : '')
  const quote = stringify ? '"' : `'`
  let newLine = nesting ? '\n' : ''
  let propSeparator = padding(currentDepth + 1)

  if (currentDepth === 0 && _.isFunction(transform)) {
    const transformResult = transform(
      value,
      undefined,
      colors.quote(quote),
      undefined,
      _.clone(path),
      _z.type(value),
      undefined
    )
    if (transformResult === false) return `` // go to next item
    if (_.isString(transformResult)) return strip(transformResult) // return as is, with no quotes
    // otherwise continue
  }

  if (_.isFunction(value)) {
    // a class is also a function
    const inspectValue = inspect(value, inspectOptions)
    const colorFn = _.startsWith(inspectValue, '[class') ? colors.class : colors.function

    const quoteFn = stringify ? quote : ''

    return strip(
      colors.quote(quoteFn) +
        colorFn(
          functionOrClass === 'body'
            ? value
                .toString()
                .split('\n')
                .join((stringify ? '\\n' : '\n') + padding(currentDepth))
                .replaceAll(stringify ? `"` : ``, stringify ? `\\"` : ``)
                .replaceAll(stringify ? `\n` : '', stringify ? `\\n` : '')
            : functionOrClass === 'name'
              ? value.name
              : (quoteFn ? '' : colors.quote(quote)) +
                inspectValue +
                (quoteFn ? '' : colors.quote(quote))
        ) +
        colors.quote(quoteFn)
    )
  }

  let resultAsIs = false
  let result = ''
  let owedResult = '' // from previous item(s)

  if (_z.isSingleOrWeak(value)) {
    if (_.isString(value)) {
      const quoteStr = (stringify && currentDepth !== 0) || currentDepth !== 0 ? quote : ''
      const quoteStrColor = quoteStr ? colors.quote(quoteStr) : ''
      result += `${quoteStrColor}${colors.string(
        quoteStr ? value.replaceAll(quoteStr, `\\` + quoteStr).replaceAll(`\n`, `\\n`) : value
      )}${quoteStrColor}`
    } else if (_.isNumber(value)) {
      result += `${colors.number(value + '')}`
    } else if (_.isSymbol(value)) {
      const _symbolFormat = symbolFormat || 'for' // default
      const symbolLabel = value
        .toString()
        .slice(7, -1)
        .replaceAll(`` + quote, `\\` + quote)
        .replaceAll(`\n`, `\\n`)
      const outsideQuote = stringify || _symbolFormat === 'outside' ? colors.quote(quote) : ''
      const insideQuote =
        ['for', 'inside'].includes(_symbolFormat) && !_.isFinite(Number(symbolLabel))
          ? colors.quote(`'`)
          : ``
      const symbolPrint = `Symbol${
        _symbolFormat === 'for' ? '.for' : ''
      }(${insideQuote}${symbolLabel}${insideQuote})`

      result += `${outsideQuote}${colors.symbol(symbolPrint)}${outsideQuote}`
    } else if (_.isBoolean(value)) {
      result += `${colors.boolean(value + '')}`
    } else if (_z.isBigInt(value)) {
      result += `${stringify ? quote + '[BigInt ' : ''}${colors.bigint(value.toString())}${
        stringify ? ']' + quote : ''
      }`
    } else if (_.isUndefined(value)) {
      const undefinedQuote = undefinedInJSON === 'null' ? '' : colors.quote(quote)
      result += stringify ? undefinedQuote + undefinedInJSON + undefinedQuote : 'undefined'
    } else if (_.isRegExp(value)) {
      const regExpStr = stringify ? `"[RegExp: ` + value + `]"` : value + ''
      result += `${colors.regexp(regExpStr)}`
    } else if (_.isDate(value)) {
      let _dateFormat = dateFormat || 'new'
      let date = value

      if (_.startsWith(_dateFormat, '@')) {
        _dateFormat = _dateFormat.slice(1)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      }

      if (_dateFormat === 'new') {
        const quoteNewDate = stringify ? colors.quote(quote) : ''
        result +=
          quoteNewDate +
          colors.date(
            `new Date(` +
              value.getFullYear() +
              ', ' +
              value.getMonth() +
              ', ' +
              value.getDate() +
              ', ' +
              value.getHours() +
              ', ' +
              value.getMinutes() +
              ', ' +
              value.getSeconds() +
              ', ' +
              value.getMilliseconds() +
              `)`
          ) +
          quoteNewDate
      } else {
        if (_.isFunction(value[_dateFormat]))
          result +=
            colors.quote(quote) + colors.date(value[_dateFormat]()) + colors.quote(quote)
        else
          throw new Error(
            `LogZen: print: dateFormat '${_dateFormat}' is not a valid Date method`
          )
      }
    } else if (_.isWeakSet(value) || _.isWeakMap(value)) {
      result +=
        colors.quote(quote) +
        '[' +
        (_.isWeakSet(value)
          ? colors.set(`WeakSet { <items unknown> }`)
          : colors.map(`WeakMap { <items unknown> }`)) +
        ']' +
        colors.quote(quote)
    } else result += value

    return strip(result)
  }

  currentDepth = currentDepth + 1

  // Check if we've seen this object before, i.e circular ref
  if (typeof value === 'object') {
    let refPath: string = refs.get(value)
    if (refPath)
      return strip(
        colors.circular(`${colors.quote(quote)}[Circular: ${refPath}]${colors.quote(quote)}`)
      )

    refs.set(
      value,
      '~' +
        path
          .map((pathProp) => {
            if (_.isString(pathProp) || _.isNumber(pathProp)) return pathProp
            if (_.isSymbol(pathProp))
              return printInternal(
                pathProp,
                { ...printOptions, stringify: false },
                inspectOptions,
                refs
              )

            throw new Error('LogZen: print: unknown type of pathProp = ' + pathProp)
          })
          .join('.')
    )
  }

  if (_.isMap(value)) {
    const mapWithMaxProps = new Map(_z.take(value, maxProps))
    const omittedCount = value.size - mapWithMaxProps.size

    if (mapAsObject) {
      let mapValue: any = mapToObject(mapWithMaxProps, printOptions, inspectOptions)
      if (stringify) mapValue = { 'new Map(Object.entries({}))': mapValue }

      result += colors.map(
        `${stringify ? '' : 'new Map(Object.entries('}${printInternal(
          mapValue,
          printOptions,
          inspectOptions,
          refs,
          currentDepth - 1, // (stringify ? 2 : 1)
          path
        )}${stringify ? '' : '))'}`
      )
    } else
      result +=
        colors.quote(stringify ? '"' : '`') +
        colors.map(inspect(mapWithMaxProps, inspectOptions)) +
        colors.quote(stringify ? '"' : '`')

    if (omitted && omittedCount > 0 && !stringify)
      result += colors.comment(
        ` /* OMITTED ${omittedCount} Map props - maxProps = ${maxProps} */`
      )
    resultAsIs = true
  } else if (_.isSet(value)) {
    const setWithMaxItems = new Set(_z.take(value, maxItems))
    const omittedCount = value.size - setWithMaxItems.size

    if (setAsArray) {
      let setValue: any = [...setWithMaxItems.values()]
      if (stringify) setValue = { 'new Set([])': setValue }

      result += colors.set(
        `${stringify ? '' : 'new Set('}${printInternal(
          setValue,
          printOptions,
          inspectOptions,
          refs,
          currentDepth - 1, // (stringify ? 2 : 1)
          path
        )}${stringify ? '' : ')'}`
      )
    } else {
      result +=
        colors.quote(stringify ? '"' : '`') +
        colors.set(inspect(setWithMaxItems, inspectOptions)) +
        colors.quote(stringify ? '"' : '`')
    }

    if (omitted && omittedCount > 0 && !stringify)
      result += colors.comment(
        ` /* OMITTED ${omittedCount} Set items - maxItems = ${maxItems} */`
      )
    resultAsIs = true
  } else if (
    // use custom toString() if exists
    useToString &&
    _z.isRealObject(value) &&
    value.toString?.toString() !== 'function toString() { [native code] }'
  ) {
    const quoteToString = stringify || useToString === 'quoted' ? colors.quote(quote) : ``
    let valueToString = value.toString()

    if (quoteToString)
      valueToString = valueToString.replaceAll(quoteToString, `\\` + quoteToString)

    // @todo: why magic number 3 ?
    result = `${padding(currentDepth - 3)}${quoteToString}${valueToString}${quoteToString}`

    resultAsIs = true
  } else if (currentDepth > depth) {
    const omittedStr = stringify
      ? _.isArray(value)
        ? `"OMITTED depth = ${depth}"`
        : `"OMITTED": "depth = ${depth}"`
      : `/* OMITTED depth = ${depth} */`

    result += colors.comment(omittedStr)
    newLine = ''
  } else if (_.isArray(value) || _.isArguments(value) || _z.isRealObject(value)) {
    // We have a property bag ({} or []) - visit each prop and get its result
    let itemsCount = 0
    // https://stackoverflow.com/questions/47372305/iterate-through-object-properties-with-symbol-keys
    let previousIdx: number = null
    // @ts-ignore @todo: remove ts-ignore
    for (const [item, prop] of _z.loop(value, { inherited, symbol: true })) {
      // pass LoopOptions

      // check for sparse arrays
      if (_.isArray(value)) {
        const emptyItems = Number(prop) - previousIdx
        if (previousIdx !== null && emptyItems > 1)
          if (stringify)
            owedResult += _.times(
              Number(prop) - previousIdx - 1,
              (t) => (t === 0 ? '' : propSeparator) + emptyItem + ','
            ).join(newLine)
          else owedResult += `/* ${Number(prop) - previousIdx - 1} empty items */ `

        previousIdx = Number(prop)
      }

      if (itemsCount !== 0) path.pop()
      path.push(prop as any) // @todo(111): fix any

      let transformResult: boolean | string = true
      if (_.isFunction(transform)) {
        const realProp = _.isArray(value) ? Number(prop) : prop
        transformResult = transform(
          item as any, // @todo(111): fix any
          realProp as any, // @todo(111): fix any
          colors.quote(quote),
          value,
          _.clone(path),
          _z.type(item),
          _z.type(value)
        )
        if (transformResult === false) continue // go to next item
      }
      // now it's either _.isString(transformResult)) OR transformResult === true

      itemsCount++

      // add props?
      if (_z.isRealObject(value) || (_.isArguments(value) && argsFormat === 'object')) {
        const propRegExp = /^(([a-zA-Z_][a-zA-Z0-9_]*)|[0-9]+)$/ // @see https://mathiasbynens.be/notes/javascript-properties
        let quotePropOpen: string
        let quotePropClose: string

        let propTempStr
        if (_.isSymbol(prop)) {
          quotePropOpen = stringify ? '' : '['
          quotePropClose = stringify ? '' : ']'
          propTempStr = printInternal(
            prop,
            printOptions,
            inspectOptions,
            refs,
            currentDepth,
            path
          )
        } else {
          if (_.isString(prop)) {
            quotePropOpen = propRegExp.test(prop) && !stringify ? `` : quote
            quotePropClose = quotePropOpen
            propTempStr = prop.replaceAll(`` + quote, `\\` + quote).replaceAll(`\n`, `\\n`) // @todo: replace with escape function ;-)
          } else {
            propTempStr = prop
          }
        }

        propTempStr = colors.propKey(propTempStr)

        propTempStr = Object.hasOwn(value, prop as any) ? propTempStr : propTempStr // ansiColors.dim(propTempStr)

        propSeparator = `${padding(currentDepth)}${quotePropOpen}${propTempStr}${quotePropClose}: `
      }

      if (!_.isString(transformResult)) {
        // instance class handling: add a virtual discriminator key (eg __class__ or __kind__)
        if (instanceClass && _z.isInstance(value) && itemsCount === 1) {
          let classKeyAndValue: string
          if (_.isFunction(instanceClass)) {
            classKeyAndValue = instanceClass(value)
          } else {
            const discriminatorKey = _.isString(instanceClass) ? instanceClass : '__class__'
            const quoteInstance = stringify ? quote : ''
            classKeyAndValue = `${quoteInstance}${discriminatorKey}${quoteInstance}: ${quoteInstance}${value.constructor.name}${quoteInstance}`
          }

          result =
            result +
            newLine +
            padding(currentDepth) +
            colors.class(classKeyAndValue) +
            colors.comma(`,`) +
            (nesting ? `` : ` `)
        }

        if (_.isArray(value)) {
          if (itemsCount > maxItems) {
            if (omitted && !stringify)
              result += `${newLine}${padding(currentDepth) || ' '}${colors.comment(
                `/* OMITTED ${
                  value.length - itemsCount + 1
                } array items - maxItems = ${maxItems} */ `
              )}`
            break
          }
        } else {
          // object or arguments
          if (itemsCount > maxProps) {
            if (omitted && !stringify)
              result += `${newLine}${padding(currentDepth) || ' '}${colors.comment(
                `/* OMITTED ${
                  _.keys(value).length - itemsCount + 1
                } object props - maxProps = ${maxProps} */`
              )}`
            break
          }
        }
      }

      if (itemsCount !== 1) {
        result += colors.comma(',') + (nesting ? `` : ` `)
        result += owedResult ? newLine + propSeparator + owedResult : ''
        owedResult = ''
      }

      result += `${newLine}${propSeparator}${
        _.isString(transformResult)
          ? transformResult
          : printInternal(item, printOptions, inspectOptions, refs, currentDepth, path)
      }`
    }
  } else throw new Error('LogZen: print: unknown type of value = ' + value)

  let valuePrint = `${result}${newLine}${newLine ? padding(currentDepth - 1) : ''}`
  if (_.isArguments(value)) {
    valuePrint = colors.arguments(valuePrint)
    if (!stringify)
      valuePrint = colors.comment(`/* arguments as ${argsFormat} */ `) + valuePrint
  }

  return strip(
    _.isArray(value) || (_.isArguments(value) && argsFormat === 'array')
      ? colors.squareBracket(`[`) + valuePrint + colors.squareBracket(`]`)
      : resultAsIs
        ? result
        : colors.curlyBracket(`{`) +
          (nesting ? '' : ' ') +
          valuePrint +
          (nesting ? '' : ' ') +
          colors.curlyBracket(`}`)
  )
}
