import 'reflect-metadata'
import { TypeNames } from '@neozen/zen'
import * as ansiColors from 'ansi-colors'

import { Type } from 'class-transformer'
import * as _ from 'lodash'
import { InspectOptions } from './inspect'
import { numberEnumToNumberVal, numberEnumToStringKey } from '@neozen/zen'
import {
  OrAnd,
  $IsArrayWithAllowedValues,
  IsNumberEnumKeyOrValue,
  $IsNumberEnumKeyOrValue,
} from '@neozen/validzen'
// import { $Min, $Max } from '@neozen/validzen/dist/code/class-validator-ValidZen-wraps' // needs ValidateBy injection - see ValidZen

import {
  IsArray,
  IsBoolean, IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { printOptionsDefaults } from './print'

// import { getTinyLog } from './utils/tiny-log' // NOTE: creates circular dependency!
// const _log = getTinyLog(false, 'code/types')

/**
 * The type of `logInfo` in [TOutputFn](/types/TOutputFn.html) function, accessed as `this.logInfo` inside that function call
 *
 * @see [`BuiltInOutputsOptions`](/classes/BuiltInOutputsOptions.html)
 */
export interface IOutputLogInfo {
  lineNumber?: number
  logLevelMethod?: string
  logLevelString?: string
  logLevelNum?: number
  relativePath?: string
  absolutePath?: string
  resolvedName?: string
  resolvedCallName?: string
  loggerName?: string
  date?: string
  time?: string
}

export const outputLogInfoKeys = [
  'lineNumber',
  'logLevelMethod',
  'logLevelString',
  'logLevelNum',
  'relativePath',
  'absolutePath',
  'resolvedName',
  'resolvedCallName',
  'loggerName',
  'date',
  'time',
]

/**
 * Type of options for built-in outputs, when used in the `[buildInOutputName, options]` array.
 *
 * Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 *
 * @see [Builtin Outputs](/index.html#md:76-builtin-outputs)
 */
export class BuiltInOutputsOptions {
  /**
   * Weather to pass `logInfo` in your outputFn (and which props).
   * It is passed `this.logInfo` on outputFn.
   * Used only on xxxJSON BuiltIn outputs (and maybe your own custom outputs :)
   *
   *  - `true` / `undefined`: print all props
   *
   *  - `(keyof IOutputLogInfo)[]` (i.e `string[]`): `_.pick` only these keys
   *
   * @default: undefined, all props
   */
  @IsOptional()
  // Multiple values: boolean OR ManyOf outputLogInfoKeys

  // Solution 0: NOT WORKING - see https://github.com/typestack/class-validator/issues/160
  // @IsArray({ each: true }) // not just any array! Must contain outputLogInfoKeys
  // @IsString({ each: true }) // not just any string! Must be one of outputLogInfoKeys
  // @IsBoolean({ each: true }) // that's optional!

  // Solution 1: Gives great description, but lacks 'boolean'.
  // Also, it needs ValidateIf hack, and cant scale & be reused, check for more types etc;-(
  // @IsArrayWithAllowedValues(outputLogInfoKeys)
  // @ValidateIf((o, value) => !_.isBoolean(value))

  // Solution 2: REUSE decorator via wrapValidateByPropertyDecorator!
  @OrAnd('boolean', $IsArrayWithAllowedValues(outputLogInfoKeys))
  logInfo?: boolean | (keyof IOutputLogInfo)[]

  /**
   * Filename as a string, relative path from CWD.
   * Required on all fileXXX BuiltIn outputs.
   */
  @IsOptional()
  @IsString()
  filename?: string

  /**
   * If `true`, overwrite existing file at `filename`, if it already exists
   *
   * @default: undefined, which means to append to existing file
   */
  @IsOptional()
  @IsBoolean()
  overwriteFile?: boolean
}

/**
 * Built-in output names - choose one of these.
 *
 * For example `{output: 'consoleJSON'}`
 *
 * or `{output: ['file', {filename: 'relative/path/output-filename.txt', overwriteFile: true}]}`
 */
export type TBuiltInOutputNames =
  | 'std'
  | 'console'
  | 'stdJSON'
  | 'consoleJSON'
  | 'file'
  | 'fileJSON'

/**
 * The type of `outputFn` functions in `options.output` (of type [Output](/classes/Output.html))
 *
 * The `outputFn` function receives:
 *
 * - `argsToPrint`: an Array of args that should be printed.
 *
 *   - Args have already passed through `l.inspect(), if `options.inspect` is truthy, otherwise the args are verbatim.
 *
 *   - The 1st item is Header, in a printable string format, if `options.header`.
 *
 * - `this`: the context is an object with two props:
 *
 *   - `instance`: this LogZen instance calling the `outputFn`
 *
 *   - `logInfo`: a convenience object of type [`IOutputLogInfo`](/interfaces/IOutputLogInfo.html) with meta log info, like "relativePath", "logLevelNum", "resolvedName" etc. Useful for JSON printing or constructing your own custom Header etc.
 *
 * **NOTE: Remember to NOT USE ArrowFunctions (i.e `() => {}`), if you need to use `this` context**.
 *
 * @see [Custom Output - Redirecting & Transforming output](/index.html#md:7-custom-output---redirecting-amp-transforming-output)
 */
export type TOutputFn = (...argsToPrint: any[]) => void

/**
 * The type of `options.output` in [Options](/classes/options.html)
 *
 * Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 *
 * @see [Custom Output - Redirecting & Transforming output](/index.html#md:7-custom-output---redirecting-amp-transforming-output)
 */
export class Output {
  /**
   * Mandatory - enforced in code, but only in final blended output that has a _.merge of all outputs in effective options!
   * It is optional in any individual options.output.
   */
  @IsOptional()
  out?: TOutputFn

  /**
   * Mandatory - enforced in code, but only in final blended output that has a _.merge of all outputs in effective options!
   * It is optional in any individual options.output.
   */
  @IsOptional()
  error?: TOutputFn

  /** @optional */
  @IsOptional()
  fatal?: TOutputFn

  /** @optional */
  @IsOptional()
  critical?: TOutputFn

  /** @optional */
  @IsOptional()
  notice?: TOutputFn

  /** @optional */
  @IsOptional()
  trace?: TOutputFn

  /** @optional */
  @IsOptional()
  warn?: TOutputFn

  /** @optional */
  @IsOptional()
  log?: TOutputFn

  /** @optional */
  @IsOptional()
  ok?: TOutputFn

  /** @optional */
  @IsOptional()
  info?: TOutputFn

  /** @optional */
  @IsOptional()
  verbose?: TOutputFn

  /** @optional */
  @IsOptional()
  debug?: TOutputFn

  /** @optional */
  @IsOptional()
  silly?: TOutputFn

  /** Extra non logLevel method
   * @optional
   */
  @IsOptional()
  table?: TOutputFn

  /** Extra non logLevel method
   * @optional
   */
  @IsOptional()
  dir?: TOutputFn
}

/**
 * Enum holds all logLevels as lowercase string, eg 'fatal', 'critical' etc. and the corresponding numeric value.
 *
 * @see [LogLevel - Choosing What Severity To Print](/index.html#md:4-loglevel---choosing-what-severity-to-print)
 */
export enum ELogLevel {
  /** Set `logLevel` to 'NONE' in your App to disable all logging. */
  NONE = 0,

  /** The service/app is going to stop or become unusable soon. */
  fatal = 1,

  /** Service/App in critical condition, an operator should look into it. */
  critical = 2,

  /** Error in particular request/operation, but the service continues servicing other requests. */
  error = 3,

  /** Something looks fishy, like an operation taking too long or having too few/many results, but system still functional. */
  warn = 4,

  /** Something noticeable happened that is perhaps useful or imperative to know about. */
  notice = 5,

  /** Some operation finished and was OK, we might care about that. */
  ok = 6,

  /** Some extraneous info about some operation, eg operation finished */
  info = 7,

  /** Extra, casual logging we almost shouldn't care about */
  log = 8,

  /** Verbose logging that should be looked at rarely / when we have issues */
  verbose = 9,

  /** Only for debugging, like entering and leaving some function / subsystem with input and results. The `debugLevel` can further control the granularity. If `logLevel` ends up as undefined in effective options, `debug` is the implicit default. */
  debug = 10,

  /** Prints the call stack when printing, similar to `console.trace`. Use `traceLevel` in effect to control its granularity. */
  trace = 11,

  /** Temporary silly / development only messages, so they can easily be found & removed */
  silly = 12,
}

/**
 * Helper to convert the string (or numeric) value of [`ELogLevel`](/enums/ELogLevel.html) to its numeric value (right hand side).
 * The string value is case-insensitive.
 *
 * @param logLevel the string (or numeric) value of ELogLevel
 *
 * @return numeric value of the [`ELogLevel`](/enums/ELogLevel.html)
 */
export const logLevelEnumToNumberVal = (logLevel: ELogLevel | keyof typeof ELogLevel) =>
  numberEnumToNumberVal(ELogLevel, logLevel)

/**
 * Helper to convert the numeric (or the string key) value of [`ELogLevel`](/enums/ELogLevel.html) to its string key (left hand side)
 * The string key value is case-insensitive.
 *
 * @param logLevel the numeric (or string key) value of ELogLevel
 *
 * @return number the string key of the [`ELogLevel`](/enums/ELogLevel.html)
 */
export const logLevelEnumToStringKey = (
  logLevel: ELogLevel | keyof typeof ELogLevel
): keyof typeof ELogLevel => numberEnumToStringKey(ELogLevel, logLevel)

/**
 * The LogLevel descriptions as an object `{[logLevelName: string]: string}` eg `LogLevelDescriptions.NONE` is `"Set logLevel to 'NONE' in your App to disable all logging."`
 *
 * @see [LogLevel - Choosing What Severity To Print](/index.html#md:4-loglevel---choosing-what-severity-to-print)
 */
export const LogLevelDescriptions = {
  NONE: "Set `logLevel` to 'NONE' in your App to disable all logging.",
  fatal: 'The service/app is going to stop or become unusable soon.',
  critical: 'Service/App in critical condition, an operator should look into it.',
  error:
    'Error in particular request/operation, but the service continues servicing other requests.',
  warn: 'Something looks fishy, like an operation taking too long or having too few/many results, but system still functional',
  notice: 'Something noticeable happened that is perhaps useful or imperative to know about.',
  ok: 'Some operation finished and was OK, we might care about that.',
  info: 'Some extraneous info about some operation, eg operation finished',
  log: "Extra, casual logging we almost shouldn't care about",
  verbose: 'Verbose logging that should be looked at rarely / when we have issues',
  debug:
    'Only for debugging, like entering and leaving some function / subsystem with input and results. The `debugLevel` can further control the granularity. If `logLevel` ends up as undefined in effective options, `debug` is the implicit default.',
  trace:
    'Prints the call stack when printing, similar to `console.trace`. Use `traceLevel` in effect to control its granularity.',
  silly: 'Temporary silly / development only messages, so they can easily be found & removed',
}

/**
 * A `string[]` with all logLevel log methods names eg `['fatal', 'critical', 'error', 'warn', ..., 'silly']`, ordered by severity (lower index = higher severity)
 *
 * @see [LogLevel - Choosing What Severity To Print](/index.html#md:4-loglevel---choosing-what-severity-to-print)
 */
export const logLevelMethodNames = _.reduce(
  ELogLevel,
  (acc, logLevel) => {
    if (_.isNumber(logLevel) && logLevel > 0) acc.push(ELogLevel[logLevel])
    return acc
  },
  []
).sort((a, b) => logLevelEnumToNumberVal(a) - logLevelEnumToNumberVal(b))

/**
 * A `string[]` with all logging methods names, including `table` & `dir` eg `['fatal', 'critical', 'error', 'warn', ..., 'silly', 'table', 'dir']`
 *
 * @see [LogLevel - Choosing What Severity To Print](/index.html#md:4-loglevel---choosing-what-severity-to-print)
 */
export const allLogMethodNames = [...logLevelMethodNames, 'table', 'dir']

/**
 * The type of `options.header` in [`Options`](/classes/options.html)
 *
 * Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 *
 * @see [Header Options - Print the info you want](/index.html#md:9-header-options---print-the-info-you-want)
 */
export class Header {
  /**
   Leave a new line after Header

   @default: `undefined` (i.e. `false`)
   */
  @IsOptional()
  @IsBoolean()
  newLine?: boolean

  /**
   Print `resolvedName` (eg `{MyLogger@/some/path}`) even if instance has a `loggerName` (and has been used on header).

   The `resolvedName` is the name found on `pathReplacements`, or the plain `relativePath` itself otherwise.

   @default: `undefined` (i.e. `false`)
   */
  @IsOptional()
  @IsBoolean()
  resolvedName?: boolean

  /**
   Print resolved path from where a `.log()` & all sibling `.xxx()` are called.

   Uses filename where it is called from on Header, but ONLY if different to loggerName.

   Resolves via `pathReplacements`.

   Incurs small extra processing for each `.log()` operation.

   @default: `undefined` (i.e. `false`)
   */
  @IsOptional()
  @IsBoolean()
  resolvedFromCall?: boolean

  /**
   Print `lineNumber` from where a `l.log()` / `l.xxx()` is called

   @default: `undefined` (i.e. `false`)
   */
  @IsOptional()
  @IsBoolean()
  lineNumber?: boolean

  /**
   If `true`, it prints current Date, eg:

   ```
   2023-07-08 LOG (src/docs/temp): Hello Date Time!
   ```

   Using `new Date().toISOString().slice(0, 10)`

   You can override passing a string returning function, eg

   ```
   date: () => new Date().toLocaleDateString(),
   ```

   @default: `undefined` (i.e. `false`)
   */
  @IsOptional()
  @OrAnd('boolean', 'function')
  date?: boolean | (() => string)

  /**
   If true, it print current Time, eg

   ```
   18:25:04 LOG (src/docs/temp): Hello Date Time!
   ```

   Using `(new Date).toLocaleTimeString()`.

   You can override passing a string returning function, eg

   ```
   time: () => new Date().toLocaleTimeString(),
   ```

   @default: `undefined` (i.e. `false`)
   */
  @IsOptional()
  @OrAnd('boolean', 'function')
  time?: boolean | (() => string)

  /**
   How many chars to use for padding the milliseconds duration of `.timer()`.

   @default 6
   */
  @IsOptional()
  @IsNumber()
  timerPadding?: number
}

/**
 * Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 *
 * @see interface InspectOptions below
 */
export class InspectOptionsClass implements InspectOptions {
  /**
   * If set to `true`, getters are going to be inspected as well.
   *
   * If set to `'get'` only getters without setter are going
   * to be inspected.
   *
   * If set to `'set'` only getters having a corresponding
   * setter are going to be inspected.
   *
   * This might cause side effects depending on the getter function.
   *
   * @default `false`
   */
  @IsOptional()
  @OrAnd('boolean', $IsArrayWithAllowedValues(['get', 'set']))
  getters?: 'get' | 'set' | boolean

  @IsOptional()
  @IsBoolean()
  showHidden?: boolean

  @IsOptional()
  @OrAnd('number', 'null')
  depth?: number | null

  @IsOptional()
  @IsBoolean()
  colors?: boolean

  @IsOptional()
  @IsBoolean()
  customInspect?: boolean

  @IsOptional()
  @IsBoolean()
  showProxy?: boolean

  /**
   * Specifies the maximum number of characters to include when formatting.
   *
   * Set to `null` or `Infinity` to show all elements.
   *
   * Set to `0` or negative to show no characters.
   *
   * @default 10000
   */
  @IsOptional()
  @OrAnd('number', 'null')
  maxArrayLength?: number | null

  /**
   * Specifies the maximum number of characters to include when formatting.
   *
   * Set to `null` or `Infinity` to show all elements.
   *
   * Set to `0` or negative to show no characters.
   *
   * @default 10000
   */
  @IsOptional()
  @OrAnd('number', 'null')
  maxStringLength?: number | null

  @IsOptional()
  @IsNumber()
  breakLength?: number

  /**
   * Setting this to `false` causes each object key to be displayed on a new line. It will also add new lines to text that is longer than `breakLength`.
   *
   * If set to a number, the most `n` inner elements are united on a single line as long as all properties fit into `breakLength`.
   *
   * Short array elements are also grouped together. Note that no text will be reduced below 16 characters, no matter the `breakLength` size.
   *
   * For more information, see the example below.
   *
   * @default `true`
   */
  @IsOptional()
  @OrAnd('boolean', 'number')
  compact?: boolean | number

  @IsOptional()
  @OrAnd('boolean', 'function')
  sorted?: boolean | ((a: string, b: string) => number)

  @IsOptional()
  @IsBoolean()
  numericSeparator?: boolean
}

/**
 * The type of `options.inspect` in [Options](/classes/options.html)
 *
 * Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 *
 * It extends [InspectOptions](https://github.com/hildjj/node-inspect-extracted/blob/main/types/util.d.ts) from 'node-inspect-extracted' (should be same as [nodejs InspectOptions](https://nodejs.org/docs/latest-v20.x/api/util.html#utilinspectobject-showhidden-depth-colors)) to add LogZen specific options.
 */
export class LogZenInspectOptions extends InspectOptionsClass {
  /**
   * If true, it also inspects top-level strings, producing quoted strings & respecting inspect.maxStringLength
   *
   * @default: undefined / false
   */
  @IsOptional()
  @IsBoolean()
  strings?: boolean
}

/**
 *  PrintOptions, when printMode="print".
 *
 *  Note: these work only with printMode="print", ignored otherwise
 *
 *  Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 */
export class PrintOptions {
  /**
   Whether to use the toString() method, but only if a custom one exists on objects.

   @default: undefined, i.e false
   */
  @IsOptional()
  @OrAnd('undefined', 'boolean', (v) => v === 'quoted')
  useToString?: boolean | 'quoted' // @todo: | 'always' | 'alwaysQuoted'

  /**
   Whether to print the function 'body' (using toString()), just the name, or the default inspect message `[Function: functionName]` as a string.

   @default: undefined / hard coded behaviour is 'inspect'
   */
  @IsOptional()
  @IsIn(['body', 'name', 'inspect'])
  functionOrClass?: 'body' | 'name' | 'inspect'

  /**
   Whether to use nesting of each item in new line, when printing objects / arrays

   @default: undefined, i.e false
   */
  @IsOptional()
  @IsBoolean()
  nesting?: boolean

  /**
   Whether to use stringify on objects i.e convert them to JSON in a safe way, using 'json-stringify-safe'.

   @default: undefined, i.e false
   */
  @IsOptional()
  @IsBoolean()
  stringify?: boolean

  /**
   * Max depth level of object/array nesting to consider, all levels higher are ignored.
   *
   * A string to detail this is added in the place - see inspect!
   */
  @IsOptional()
  @IsNumber()
  depth?: number

  /**
   * Max number of items to consider in Arrays / Sets (at their root level).
   * Remaining items are omitted (use omitted: true to print comment)
   */
  @IsOptional()
  @IsNumber()
  maxItems?: number

  /**
   * Max number of props to consider in Objects/Maps (at their root level).
   * Props order is as retrieved by JS, there's no sorting.
   * Remaining props are omitted (use omitted: true to print comment)
   */
  @IsOptional()
  @IsNumber()
  maxProps?: number

  @IsOptional()
  @IsBoolean()
  omitted?: boolean

  /**
   * Print Map as an Object, or as a string
   *
   * true: print an object, that can be copy-pasted eg
   *
   *        `new Map(Object.entries({ aa: 11, bb: 4 }))`
   *
   * false: print a string, using inspect eg
   *
   *        `Map(2) { 'aa' => 11, 'bb' => 4 }`
   */
  @IsOptional()
  @IsBoolean()
  mapAsObject?: boolean

  /**
   * Print Set as an Array, or as a string
   *
   *    true: print an Array that can de dehydrated, eg `new Set([1, 2, 3]) /* OMITTED 1 Set items - maxItems = 3...
   *    false: print as a string, using inspect eg `Set(3) { 1, 2, 3 }` /* OMITTED 1 Set items - maxItems = 3...
   */
  @IsOptional()
  @IsBoolean()
  setAsArray?: boolean

  /**
   * Print the class of the instance (i.e the constructor), as an artificial key (a.k.a discriminator).
   *
   * * false / undefined (default) - do not add a fake object key to indicate class
   *
   * * true: use "__class__" as prop key, the class / constructor itself as value, eg
   *  {
   *    __class__: Person
   *    name: 'Angelos
   *  }
   *
   * * string, eg "__kind__" or "constructor": use this string as the prop key, as above, eg:
   *
   * With options:
   *  {
   *    print: {
   *      instanceClass: '__kind__'
   *    }
   *  }
   *
   * We print
   *  {
   *    __kind__: Person
   *    name: 'Angelos'
   *  }
   *
   * * function, accepting (instance, constructor, object, prop), and producing the whole line of the class info.
   *
   * For example with options:
   *
   * {
   *   print: {
   *     instanceClass: (__, constructor) => `__theClass__: '${constructor.name}'`
   *   }
   * }
   *
   * We print
   *
   * {
   *    __theClass__: 'Person'
   *    name: 'Angelos'
   * }
   */
  @IsOptional()
  @OrAnd('undefined', 'boolean', 'string', 'function')
  instanceClass?: boolean | string | ((instance: object) => string)

  /**
   * What to replace undefined, when outputing JSON-like via print.stringify
   *
   * For example 'null' or '[Undefined]'. If it is 'null' then no quotes are added.
   *
   * @default: '[Undefined]'
   */
  @IsOptional()
  @IsString()
  undefinedInJSON?: string

  /**
   * Selects how to format a Symbol.
   *
   * For a `Symbol('label')` we can print:
   * - 'for' (default): `Symbol.for('label')` (or `"Symbol.for('label')"`) in stringify
   * - 'outside': `'Symbol(label)'` (or `"Symbol(label)"`) in stringify
   * - 'inside': `Symbol('label')` (or `"Symbol('label')"`) in stringify
   * - 'none': `Symbol(label)` (or `"Symbol(label)"`) in stringify
   *
   * If 'label' is a number, the inside quotes are omitted.
   */
  @IsOptional()
  @IsString()
  @IsIn(['for', 'outside', 'inside', 'none'])
  symbolFormat?: 'for' | 'outside' | 'inside' | 'none'

  /**
   * How to format Date object values
   *
   * With `new Date(2023, 11, 31, 23, 58, 59, 250)`
   *
   * - 'new' - outputs `new Date(2023, 11, 31, 23, 58, 59, 250)`
   * - any other string, eg 'toLocaleString' or 'toISOString' - call this method on the date object!
   *
   * Start any of these with '@' (eg '@toISOString') to adjust timezone minutes offset (@see https://stackoverflow.com/questions/43591771/new-date-has-wrong-time-in-node-js/71262913#71262913)
   *
   * @default: 'new'
   */
  @IsOptional()
  @IsString()
  dateFormat?: 'new' | 'toLocaleString' | 'toISOString' | 'toDateString' | 'toTimeString' | 'toLocaleDateString' | 'toLocaleTimeString' |
    '@new' | '@toLocaleString' | '@toISOString' |
    '@toDateString' | '@toTimeString' | '@toLocaleDateString' | '@toLocaleTimeString' | string

  /**
   * What to print instead of `null`, for empty items in sparse arrays, when stringify: true
   *
   * It receives no quotes, so use `"myEmptyLabel"` (with double quotes) for strings, since this is meant for JSON.
   *
   * If it is false, nothing is printed, which will make your Arrays indexes correspond to the wrong value (but they look better!). Also keep in mind that comments on {stringify: false} are off, so with `false` no information will convey the Array was sparse!
   *
   * @default: "[Empty item]"
   */
  @IsOptional()
  @IsString()
  emptyItem?: string | false

  /**
   * How to format arguments pseudo-array (received in function () {})
   *
   * Eg for value (function(a, b, c) { return arguments })(1, 'foo', {prop: 'val'})
   *
   * - 'array' - as array eg `[1, 'foo', {prop: 'val'}]` - default
   * - 'object' - as object eg `{'0': 1, '1': 'foo', '2': { prop: 'val'}}`
  */
  @IsOptional()
  @IsString()
  @IsIn(['array', 'object'])
  argsFormat?: 'array' | 'object'

  @IsOptional()
  @IsString()
  @IsIn(['object', 'toString'])
  objectProp?: 'object' | 'toString'

  @IsOptional()
  colors?: false | {
    level?: ansiColors.StyleFunction
    number?: ansiColors.StyleFunction
    regexp?: ansiColors.StyleFunction
    boolean?: ansiColors.StyleFunction
    string?: ansiColors.StyleFunction
    quote?: ansiColors.StyleFunction
    squareBracket?: ansiColors.StyleFunction
    curlyBracket?: ansiColors.StyleFunction
    comment?: ansiColors.StyleFunction
    function?: ansiColors.StyleFunction
    class?: ansiColors.StyleFunction
    circular?: ansiColors.StyleFunction
    comma?: ansiColors.StyleFunction
    propKey?: ansiColors.StyleFunction
    map?: ansiColors.StyleFunction
    set?: ansiColors.StyleFunction
    symbol?: ansiColors.StyleFunction
    bigint?: ansiColors.StyleFunction
    date?: ansiColors.StyleFunction
    arguments?: ansiColors.StyleFunction
  }

  /**
   * @default: false
   */
  @IsOptional()
  @IsIn([true, false]) // @todo: , 'noMethods'])
  inherited?: boolean // | 'noMethods'

  /**
   * A callback to transform a value or filter object props / array items.
   *
   * Its behavior depends on the returned value from `transform()`:
   * - string: use this string as the printed result for this value, instead of the builtin way. It doesn't include quotes, so anything can go here. If you need quotes (returning an actual string), use 'quote' param that caters for JSON
   * - false: omit value completely, prints empty string in its place. If value is also an object property, the prop also is omitted (i.e filtering props / values)
   * - true/anything else: use default/builtin handling for this value
   */
  @IsOptional()
  @OrAnd('undefined', 'function')
  transform?: TprintTransformFunction
}

export type TprintTransformFunction = (
  /**
   * The value to be printed
   */
  value: any,
  /**
   * The prop/key name if in an object or array index
   */
  propIdx: undefined | string | number | symbol,
  /**
   * The quote used: if in stringify/JSON mode, we use `"`, otherwise `'`
   */
  quote: string,
  /**
   * The parent object/array, if any
   */
  parent: undefined | any[] | Record<any, any>,
  /**
   * An array of paths, from root object eg ['person', 'name']
   */
  path: (string | symbol | number)[],
  /**
   * The type of the value, eg 'number', 'string', 'bigint', 'array', 'object' etc
   */
  type: TypeNames,

  /**
   * The type of the value of the parent, eg 'array', 'object'
   */
  parentType: TypeNames,
) => string | boolean

/**
 * The type of `options.trace` in [`Options`](/classes/options.html)
 *
 * Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 */
export class TraceOptions {
  /**
   * Skip the nodejs internal stack frames, like
   *     at Module._compile (node:internal/modules/cjs/loader:1254:14)
   *     at Object..js (node:internal/modules/cjs/loader:1308:10)
   *     at Module.load (node:internal/modules/cjs/loader:1117:32)
   *     at Function._load (node:internal/modules/cjs/loader:958:12)
   *
   * @default: true
   */
  @IsOptional()
  @IsBoolean()
  omitInternals?: boolean

  /**
   * Maximum number of stack frames to print.
   *
   * @default: 5
   */
  @IsOptional()
  @IsNumber()
  maxStackDepth?: number

  /**
   * If true, it suppresses LogZen's trace output. Useful in case your Custom Output uses the real console.trace
   *
   * @default: undefined, i.e false
   */
  @IsOptional()
  @IsBoolean()
  realTrace?: boolean
}

/**
 * The LogZen Options *interface*
 *
 * Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 *
 * @see [Cascading Options](/index.html#md:6---cascading-options-instanceconstructor-options-logpathoptions-and-defaultoptions)
 */
export class Options {
  /**
   * You can pass a custom name, eg "My LogZen".
   *
   * It can be a "path" where it resides, physically or conceptually
   *
   *    eg `/controllers/customer.controller`
   *
   * Note that the physical (relative) path is automatically printed on the Header, if loggerName is not present.
   *
   * It's best to leave this undefined and use [PathReplacements](/index.html#md:3---path-replacements)
   *
   * @default: undefined, in which case the Header prints the resolved filename where LogZen is created in.
   */
  @IsOptional()
  @IsString()
  loggerName?: string

  /**
   * Where & how to print / output log messages and info.
   *
   * @see [Custom Output docs](/index.html#md:7-custom-output---redirecting-amp-transforming-output)
   */
  @IsOptional() // multiple types, done manually in validateOptions() - see https://github.com/typestack/class-validator/issues/160
  output?: Output | TBuiltInOutputNames | [TBuiltInOutputNames, BuiltInOutputsOptions?]

  /**
   * Customize Header options, or disable with `header: false`
   *
   * Possible values:
   *
   *  - true: prints a default header
   *
   *  - [Header](/classes/Header.html) object: Header enabled with separate settings within.
   *
   * - false: Header is disabled
   *
   * Example:
   *
   * Issuing a `l.warn('Hello World')` will output something like:
   *
   *         ```
   *           WARN (src/examples-docs/logzen-examples-docs-tests-playground): Hello World
   *
   *         ```
   * With header: false, it just prints
   *
   *         ```
   *           Hello World"
   *         ```
   *
   * @default: header object with defaults
   */
  @IsOptional()
  @ValidateNested()
  @ValidateIf((o, value) => !_.isBoolean(value))
  @Type(() => Header)
  header?: boolean | Header

  /**
   * If using LogZen wrapped (eg subclass, proxy etc) inside another MyLogger,
   * it will resolve to wrong filepath, e.g. the wrapped MyLogger as the path it as created.
   *
   * Adjust accordingly ;-)
   */
  @IsOptional()
  @IsNumber()
  stackDepthCreated?: number

  /**
   * If using LogZen wrapped (eg Proxied) inside another MyLogger,
   * it will report itself (i.e the wrapped MyLogger) as the path
   * it was called to `l.log()` from (eg  via `options.header.resolvedFromCall`).
   *
   * Adjust accordingly ;-)
   */
  @IsOptional()
  @IsNumber()
  stackDepthCalled?: number

  /**
   * The `logLevel` to allow, i.e what logging severity is in effect.
   *
   * See [logLevel](/index.html#md:4-loglevel---choosing-what-severity-to-print)
   *
   * @default: undefined, but `debug` is implicitly enforced (hard coded)
   */
  // Solution 1 - it just works, with great description
  // Note: it has different ValidationErrors, cause of ValidZen adding itself - needs isStrictErrorDescriptionAllLines: false in options-validation-LogZenFake.spec.ts
  // @IsOptional()
  // @IsNumberEnumKeyOrValue(ELogLevel)

  // Solution2: Works great, using @OrAnd & $IsNumberEnumKeyOrValue together!
  @OrAnd('undefined', $IsNumberEnumKeyOrValue(ELogLevel))
  logLevel?: ELogLevel | keyof typeof ELogLevel

  /**
   * Configure the `logLevel` of the table() method.
   *
   * @default: ELogLevel.LOG
   */
  @IsOptional()
  @IsNumberEnumKeyOrValue(ELogLevel)
  tableLogLevel?: ELogLevel | keyof typeof ELogLevel

  /**
   * The `debugLevel` is the debug-only severity to allow.
   *
   * It's an arbitrary number of a range of your choosing, but 0-100 is recommended.
   *
   * @see [debugLevel & traceLevel](/index.html#md:5-the-ldebug--ltrace-methods-amp-debuglevel--tracelevel)
   *
   * @default undefined, so `l.debug('something')` with no debugLevel will print (if `logLevel` allows `debug`).
   */
  /*
  Solution 1: easy

    @IsOptional()
    @IsNumber()

  Solution 2: REUSE @OrAnd (and possibly wrapped decorators via wrapValidateByPropertyDecorator!)

    For example

       @OrAnd('number', 'undefined')

    Or even reuse logic in PropertyDecorators, like

       @OrAnd('undefined', 'number', $IsIn(['foo', 'bar']))

    WORKS! Value can be any number OR undefined OR 'foo' OR 'bar'! Nothing else!

    But only for ORs case, not ANDs!

    What if we wanted to have Max(100), but only for numbers?

        @Max(100)

    alone breaks, because it needs to be a number AND Max(100), and also Max(100) should matter only if it is a number!

    The wrapped version, with inject ValidateBy, works perfectly as expected here:

        @OrAnd('undefined', $Max(100))

    But the next one fails to capture requirements, and allows any number:

      @OrAnd('undefined', 'number', $Max(100)))

    Also, if we wanted a range, like 0-100, we couldn't do it.

    Ideally we would want to express ANDs in an easy way

        @OrAnd('undefined', ['number', $Min(0), $Max(100)]) // range 0-100

    where the outer array starts as an OR and inner array is an AND (and goes on alternating)

     For example to express "No small and boring numbers allowed!" :

        @OrAnd('undefined', ['number', [$isBigInt(), $IsPrimeNumber()]]) //

    which means "undefined, OR a number that is strictly either a bigint or a Prime".
    */
  // @OrAnd('undefined', ['number', $Min(0),  $Max(100)]) // needs ValidZen's ValidateBy injected in class-validator
  @OrAnd('undefined', 'number')
  debugLevel?: number

  /**
   * The `traceLevel` is the \`.trace()\`-only granular severity to allow.
   *
   * It's an arbitrary number of a range of your choosing, but 0-100 is recommended.
   *
   * @see [debugLevel & traceLevel](/index.html#md:5-the-ldebug--ltrace-methods-amp-debuglevel--tracelevel)
   *
   * @default undefined, so `l.trace('something')` with no \`traceLevel\` will print (if \`logLevel\` allows trace\`trace\`).
   */
  @OrAnd('undefined', 'number')
  traceLevel?: number

  /**
   * Whether to use colors in the whole output.
   *
   * It also turns off stringColors.
   *
   * If `inspect.colors` is missing in an atomic options set or update, it inherits this one (if present).
   *
   * @default: `true`
   */
  @IsOptional()
  @IsBoolean()
  colors?: boolean

  /**
   * Whether to use the LogLevel color on (top level) strings
   *
   * @default: `true`
   */
  @IsOptional()
  @IsBoolean()
  stringColors?: boolean

  /**
   * The [TraceOptions](/classes/TraceOptions.html) to use
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => TraceOptions)
  trace?: TraceOptions

  /**
   * The [LogZenInspectOptions](/classes/LogZenInspectOptions.html) to use
   *
   * If false, it disables inspect completely, and uses print
   */
  @IsOptional()
  @ValidateNested()
  @ValidateIf((o, value) => !_.isBoolean(value))
  @Type(() => LogZenInspectOptions)
  inspect?: LogZenInspectOptions | boolean

  /**
   * The [PrintOptions](/classes/PrintOptions.html) to use, if inspect is false
   */
  @IsOptional()
  @ValidateNested()
  @ValidateIf((o, value) => !_.isBoolean(value))
  @Type(() => PrintOptions)
  print?: PrintOptions

  @IsOptional()
  @IsString()
  @IsIn(['inspect', 'print'])
  printMode?: 'inspect' | 'print'

  /**
   Whether to pass the raw values of the argsToLog, without any formatting (inspect, colors, console interpolation etc).

   Disables all relevant options (colors, inspect & console style interpolation).

   Useful for JSON output.

   @default: undefined, i.e false
   */
  @IsOptional()
  @IsBoolean()
  raw?: boolean

  /**
   * Add & maintain a list of kids loggers, using these Options.
   *
   * These kid loggers are [fully managed by LogZen](/#md:122--automatically-managed-via-cascading-options), updating them via options and not programmatically.
   *
   * **Kids rules are:**
   *
   * - When path options merge, kids loggers Options from nested paths (eg `/my/app/nested/path`) are added to those in above paths (eg `/my/app`), not replacing those above (as it happens with other options).
   *
   * - Null is a special value: if {kids: null} or {kids: [null, {loggerName: 'a kid'}]}, are not inheriting those before the null, up in the chain to root.
   *
   * - Kids can't have their own kids (i.e no nested kids / grandkids). This because it's not tested and could lead to unexpected results. It will throw an Error if trying to do so.
   *
   * - When kids's options change, the kids are recreated with these new options (i.e no partial options merging with kids options)
   *
   * @see [Kid Instances - inherit parent options & echo log methods](/#md:12-kid-instances---inherit-parent-options-amp-echo-log-methods)
   * @see [**Automatically Managed**, via Cascading Options](/#md:122--automatically-managed-via-cascading-options)
   */

  // @ValidateNested({ each: true }) & @ValidateIf({each: true}) not working with nulls, see https://github.com/typestack/class-validator/issues/1382#issuecomment-1745802645
  // So we do "kids" manually inside validateOptions()
  @IsOptional()
  @IsArray()
  @Type(() => Options)
  // eslint-disable-next-line no-use-before-define
  kids?: (Omit<Options, 'kids'> | null)[] | null
}

/**
 * Extends [Options](/classes/options.html) to override absolutePath & CWD. All other relative paths are calculated from these.
 *
 * Useful for virtual FS / testing. You can pass such options only on constructor.
 *
 * Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 */
export class OptionsAtConstructor extends Options {
  /**
   * Override the calculation of the `absolutePath` instance property, by default set to the absolute filepath of the file where LogZen is instantiated.
   *
   * Useful for debugging or defining your own virtual structure.
   *
   * Note: works only on constructor options!
   *
   * Also see `overrideCWD`
   *
   * @default: undefined
   */
  @IsOptional()
  @IsString()
  overrideAbsolutePath?: string

  /**
   * Override the value of we get from process.cwd(), used to calculate the relativePath from absolutePath & resolve the resolvedName (via pathReplacements).
   *
   * Note: works only on constructor options!
   *
   * Also see `absolutePath`
   *
   * @default: undefined
   */
  @IsOptional()
  @IsString()
  overrideCWD?: string

  @IsOptional()
  @IsBoolean()
  _isKid?: boolean
}

/**
 * Internal options, used by LogZen
 *
 * Adds `logLevelNumber` & `logLevelString` to the internal Options object (which is also the result of `l.options()`)
 *
 * Note: it is a class only for validation purposes via [class-validator](https://github.com/typestack/class-validator), but it's not meant to be instantiated.
 */
export class OptionsInternal extends OptionsAtConstructor {
  // value of logLevel in the ELogLevel, always numeric (or undefined)
  @IsOptional()
  @IsNumber()
  logLevelNumber?: number

  // name/key of logLevel in the ELogLevel, always string (or undefined)
  @IsOptional()
  @IsString()
  logLevelString?: string
}

/**
 * Parameter type of [LogZen.updateLogPathOptions()](/classes/LogZen.html#updateLogPathOptions)
 */
export type TLogPathOptions = {
  [logPath: string]: Options | keyof typeof ELogLevel | number
}

/**
 * Parameter type of [LogZen.addPathReplacements()](/classes/LogZen.html#addPathReplacements)
 */
export type TPathReplacements = { [path: string]: string }

/**
 * The built-in default options used by LogZen
 *
 * **Don't mutate** - use [`LogZen.updateLogPathOptions()`](/classes/LogZen.html#updateLogPathOptions) instead.
 */
export const defaultOptions: OptionsInternal = {
  // debugLevel: 0,     // implicit, not need to be set
  colors: true,
  stringColors: true,
  output: 'console', // @note: 'console' works fine, but Jest tests fail and need 'std'

  stackDepthCreated: 0,
  stackDepthCalled: 0,

  header: {},

  trace: {
    omitInternals: true,
    maxStackDepth: 5,
    realTrace: false,
  },

  tableLogLevel: ELogLevel.log,

  inspect: {
    strings: false,
    colors: true,
    breakLength: 150,
    maxArrayLength: 30,
    maxStringLength: 500,
    depth: 10,
    compact: 50,
  },

  print: _.clone(printOptionsDefaults)
}

/**
 * All \`l.xxx()\` log methods (eg \`.log()\`, \`l.warn()\` etc use this type
 *
 * @see [**LogLevel and log() methods** - Choosing What Severity To Print](/index.html#md:4-loglevel---choosing-what-severity-to-print)
 *
 * @param argsToPrint the args to print
 *
 * @returns the args to print, passed through verbatim.
 */
export type TlogMethod = (...argsToPrint: any[]) => any[]

/**
 * @ignore
 */
export type TwillLogMethod = () => boolean

/**
 * All `.xxx1()` methods (eg `.log1()`, `l.warn1()` etc, with a variation for `.debug1()` & `.trace1()`) use this type for the receiving args to print.
 *
 * The last arg is returned as a generic type.
 *
 * @see [**Args Pass through** - log anywhere, even inside function calls](/index.html#md:11-args-pass-through---log-anywhere-even-inside-function-calls)
 *
 * @see [**LogLevel and log() methods** - Choosing What Severity To Print](/index.html#md:4-loglevel---choosing-what-severity-to-print)
 * @ignore
 */
export type TLog1MethodArgsToReturnLastArg<TLastArg> = [...any[], TLastArg]

/**
 * All `.xxx1()` methods (eg `.log1()`, `l.warn1()`) etc use this method type
 *
 * @see [**Args Pass through** - log anywhere, even inside function calls](/index.html#md:11-args-pass-through---log-anywhere-even-inside-function-calls)
 *
 * @see [**LogLevel and log() methods** - Choosing What Severity To Print](/index.html#md:4-loglevel---choosing-what-severity-to-print)
 *
 * @param argsToPrint the args to print. The last arg is returned & is the generic type of the method.
 *
 * @returns lastArg to print, passed through verbatim.
 * @ignore
 */
/* prettier-ignore */
export type Tlog1Method =
  (<TLastArg>(lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, lastArg: TLastArg) => TLastArg) &
  (<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, a20: any, lastArg: TLastArg) => TLastArg)

export const PATHS_OPTIONS_KEY = '__PATHS_OPTIONS__'
