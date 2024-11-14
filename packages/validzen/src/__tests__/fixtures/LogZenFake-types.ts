import 'reflect-metadata'

import { Type } from 'class-transformer'
import * as _ from 'lodash'
import { InspectOptions } from 'util'
import { numberEnumToNumberVal } from '@devzen/zendash'

// local
import { OrAnd } from '../../code'
import { $Max, $Min } from '../../code/class-validator-ValidZen-wraps'
import { $IsNumberEnumKeyOrValue, $IsArrayWithAllowedValues } from '../../code'

import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator'

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

export type TOutputFn = (...argsToPrint: any[]) => void

export class Output {
  @IsOptional()
  out?: TOutputFn

  @IsOptional()
  error?: TOutputFn

  @IsOptional()
  log?: TOutputFn

  @IsOptional()
  info?: TOutputFn
}

export enum ELogLevel {
  NONE = 0,
  fatal = 1,
  critical = 2,
  error = 3,
  warn = 4,
  notice = 5,
  ok = 6,
  info = 7,
  log = 8,
  verbose = 9,
  debug = 10,
  trace = 11,
  silly = 12,
}

export const logLevelEnumToNumberVal = (logLevel: ELogLevel | keyof typeof ELogLevel) =>
  numberEnumToNumberVal(ELogLevel, logLevel)

export const logLevelMethodNames = _.reduce(
  ELogLevel,
  (acc, logLevel) => {
    if (_.isNumber(logLevel) && logLevel > 0) acc.push(ELogLevel[logLevel])
    return acc
  },
  []
).sort((a, b) => logLevelEnumToNumberVal(a) - logLevelEnumToNumberVal(b))

export const allLogMethodNames = [...logLevelMethodNames, 'table', 'dir']

export class Header {
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

   Default: `undefined` (i.e. `false`)
   */
  @IsOptional()
  @OrAnd('boolean', 'function')
  time?: boolean | (() => string)
}

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
  getters?: boolean | 'get' | 'set'

  @IsOptional()
  @OrAnd('boolean', 'function')
  sorted?: boolean | ((a: string, b: string) => number)
}

export class LogZenInspectOptions extends InspectOptionsClass {
  /**
   * If true, it inspects strings, producing quoted strings
   *
   * @default: undefined
   */
  @IsOptional()
  @IsBoolean()
  strings?: boolean
}

export class Options {
  @IsOptional()
  @IsString()
  loggerName?: string

  @OrAnd('undefined', 'string')
  loggerName2?: string

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
   *           WARN (src/examples-docs/validzen-examples-docs-tests-playground): Hello World
   *
   *         ```
   * With header: false, it just prints
   *
   *         ```
   *           Hello World"
   *         ```
   *
   * Default: header object with defaults
   */
  @IsOptional()
  @ValidateNested()
  @ValidateIf((o, value) => !_.isBoolean(value))
  @Type(() => Header)
  header?: boolean | Header

  /**
   * The `logLevel` to allow, i.e what logging severity is in effect.
   *
   * See [logLevel](/index.html#md:4-loglevel---choosing-what-severity-to-print)
   *
   * Default: undefined, but `debug` is implicitly enforced (hard coded)
   */
  // Solution 1 - it just works, with great description
  // Note: it has different ValidationErrors, cause of ValidZen adding itself - needs isStrictErrorDescriptionAllLines: false in ValidZen-options-validation.spec.ts
  // @IsOptional()
  // @IsNumberEnumKeyOrValue(ELogLevel)

  // Solution2: Works great, using @ValidZen & $IsNumberEnumKeyOrValue together!
  @OrAnd('undefined', $IsNumberEnumKeyOrValue(ELogLevel))
  logLevel?: ELogLevel | keyof typeof ELogLevel

  /**
   * The `debugLevel` is the debug-only severity to allow.
   *
   * It's an arbitrary number of a range of your choosing, but 0-100 is recommended.
   *
   * @see [debugLevel & traceLevel](/index.html#md:5-the-ldebug--ltrace-methods-amp-debuglevel--tracelevel)
   *
   * Defaults to undefined, so `l.debug('something')` with no debugLevel will print (if `logLevel` allows `debug`).
   */
  /*
  Solution 1: easy

    @IsOptional()
    @IsNumber()

  Solution 2: REUSE @ValidZen (and possibly wrapped decorators via wrapValidateByPropertyDecorator!)

    For example

       @ValidZen('number', 'undefined')

    Or even reuse logic in PropertyDecorators, like

       @ValidZen('undefined', 'number', $IsIn(['foo', 'bar']))

    WORKS! Value can be any number OR undefined OR 'foo' OR 'bar'! Nothing else!

    But only for ORs case, not ANDs!

    What if we wanted to have Max(100), but only for numbers?

        @Max(100)

    alone breaks, because it needs to be a number AND Max(100), and also Max(100) should matter only if it is a number!

    The wrapped version, with inject ValidateBy, works perfectly as expected here:

        @ValidZen('undefined', $Max(100))

    But the next one fails to capture requirements, and allows any number:

      @ValidZen('undefined', 'number', $Max(100)))

    Also, if we wanted a range, like 0-100, we couldn't do it.

    Ideally we would want to express ANDs in an easy way

        @ValidZen('undefined', ['number', $Max(100)])          // max 100, no min
        @ValidZen('undefined', ['number', $Max(100), $Min(0)]) // range 0-100

    where the inner array is an AND, and the outer array is always an OR.

    And a more advanced "No small and boring numbers allowed!" example:

        @ValidZen('undefined', ['number', [$isBigInt(), $IsPrimeNumber()]]) //

    which means "undefined, OR a number that is strictly either a bigint or a Prime".
    */
  @OrAnd('undefined', ['number', $Max(100), $Min(0)]) // needs ValidZen injected in class-validator
  // @ValidZen('undefined', 'number')
  debugLevel?: number

  /**
   * The [LogZenInspectOptions](/interfaces/LogZenInspectOptions.html) to use
   *
   * If false, it disables inspect completely
   */
  @IsOptional()
  @ValidateNested()
  @ValidateIf((o, value) => !_.isBoolean(value))
  @Type(() => LogZenInspectOptions)
  inspect?: LogZenInspectOptions | false

  /**
   * Add & maintain a list of kids loggers, using these Options.
   *
   * These kid loggers are fully managed by ValidZen, updating them via options and not programmatically.

   * **Kids rules are:**
   * - When path options merge, kids loggers Options from nested paths (eg `/my/app/nested/path`) are added to those in above paths (eg `/my/app`), not replacing those above (as it happens with other options).
   * - Kids can't have their own kids (i.e no nested kids / grandkids). This because it's not tested and could lead to unexpected results. It will throw an Error if trying to do so.
   * - When kids's options change, the kids are recreated with these new options (i.e no partial options merging with kids options)
   */

  @ValidateNested({ each: true }) // & @ValidateIf({each: true}) not working with nulls, see https://github.com/typestack/class-validator/issues/1382#issuecomment-1745802645
  // So we do "kids" manually inside validateOptions()
  @IsOptional()
  @IsArray()
  @Type(() => Options)
  // eslint-disable-next-line no-use-before-define
  kids?: (Omit<Options, 'kids'> | null)[] | null
}

export class OptionsAtConstructor extends Options {
  @IsOptional()
  @IsString()
  overrideCWD?: string
}

export class OptionsInternal extends OptionsAtConstructor {
  // name/key of logLevel in the ELogLevel, always string (or undefined)
  @IsOptional()
  @IsString()
  logLevelString?: string
}
