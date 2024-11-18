import { isOk } from '@neozen/zendash'
import * as _ from 'lodash'
// local
import { LogZen, Options, getTinyLog } from '../code'
import { expectToThrow, trimEmptyLines, trimEndLines, trimLines } from '../docs/utils/test.utils'

const _log = getTinyLog(false, 'LogZen-options-validation.spec')

const isStrictErrorDescriptionAllLines = true
const isStrictIndentation = true

const indentate = isStrictIndentation ? _.flow(trimEmptyLines, trimEndLines) : trimLines

describe('LogZen Options Validation', () => {
  const logger = new LogZen()

  describe.each(<[string, Options | any, string?][]>[
    ['Empty options, no errors', {}],
    ['whitelistValidation - property nonExistentKey should not exist',
      {
        inspect: {
          nonExistentKey: 'foobar',
        } as any,
      }, `
LogZen: Options Validation: ValidZen: Validation Errors:
   - whitelistValidation (property nonExistentKey should not exist)
_______________________________________________________
at 'inspect.nonExistentKey'
 - value = 'foobar'
 - target = LogZenInspectOptions { nonExistentKey: 'foobar' }
 - class = '[class LogZenInspectOptions extends InspectOptionsClass]'
_______________________________________________________
at 'inspect'
 - value = LogZenInspectOptions { nonExistentKey: 'foobar' }
 - target = OptionsAtConstructor { inspect: LogZenInspectOptions { nonExistentKey: 'foobar' } }
 - class = '[class OptionsAtConstructor]'
 - path = ''
`.split('\n').filter(isOk).join('\n')

    ],

    ['Correct logLevel string, case-insensitive, no errors', { logLevel: 'wArN' }],
    [
      'Wrong logLevel string in options as key',
      { logLevel: 'wrongLogLevel' },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
 - OrAnd (Property 'logLevel' failed)
   - OrAnd (undefined OR $IsNumberEnumKeyOrValue())
     - undefined (wrong type / check failed)
     - IsNumberEnumKeyOrValue (Property 'logLevel' equals 'wrongLogLevel' but it must be one of the following enum values (case-insensitive): 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, NONE, fatal, critical, error, warn, notice, ok, info, log, verbose, debug, trace, silly)
_______________________________________________________
at 'logLevel'
 - value = 'wrongLogLevel'
 - target = OptionsAtConstructor { logLevel: 'wrongLogLevel' }
 - class = '[class OptionsAtConstructor]'
 - path = ''
`,
    ],
    [
      'Wrong logLevel number in options as key',
      { logLevel: 99 },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
 - OrAnd (Property 'logLevel' failed)
   - OrAnd (undefined OR $IsNumberEnumKeyOrValue())
     - undefined (wrong type / check failed)
     - IsNumberEnumKeyOrValue (Property 'logLevel' equals '99' but it must be one of the following enum values (case-insensitive): 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, NONE, fatal, critical, error, warn, notice, ok, info, log, verbose, debug, trace, silly)
_______________________________________________________
at 'logLevel'
 - value = 99
 - target = OptionsAtConstructor { logLevel: 99 }
 - class = '[class OptionsAtConstructor]'
 - path = ''
`,
    ],
    [
      'Non-existent options key',
      { nonExistentKey: 'foobar' },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
 - whitelistValidation (property nonExistentKey should not exist)
_______________________________________________________
at 'nonExistentKey'
 - value = 'foobar'
 - target = OptionsAtConstructor { nonExistentKey: 'foobar' }
 - class = '[class OptionsAtConstructor]'
 - path = ''
`,
    ],
    [
      'Wrong loggerName type',
      { loggerName: 123 },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
 - isString (loggerName must be a string)
_______________________________________________________
at 'loggerName'
 - value = 123
 - target = OptionsAtConstructor { loggerName: 123 }
 - class = '[class OptionsAtConstructor]'
 - path = ''
`,
    ],
    [
      'Nested: options.inspectOptions',
      {
        inspect: {
          colors: 'colors-foobar' as any,
        },
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
   - isBoolean (colors must be a boolean value)
_______________________________________________________
at 'inspect.colors'
 - value = 'colors-foobar'
 - target = LogZenInspectOptions { colors: 'colors-foobar' }
 - class = '[class LogZenInspectOptions]'
_______________________________________________________
at 'inspect'
 - value = LogZenInspectOptions { colors: 'colors-foobar' }
 - target = OptionsAtConstructor { inspect: LogZenInspectOptions { colors: 'colors-foobar' } }
 - class = '[class OptionsAtConstructor]'
 - path = ''
`,
    ],
    [
      'Nested: options.inspectOptions',
      {
        inspect: {
          nonExistentKey: 'foobar',
        },
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
   - whitelistValidation (property nonExistentKey should not exist)
_______________________________________________________
at 'inspect.nonExistentKey'
 - value = 'foobar'
 - target = LogZenInspectOptions { nonExistentKey: 'foobar' }
 - class = '[class LogZenInspectOptions]'
_______________________________________________________
at 'inspect'
 - value = LogZenInspectOptions { nonExistentKey: 'foobar' }
 - target = OptionsAtConstructor { inspect: LogZenInspectOptions { nonExistentKey: 'foobar' } }
 - class = '[class OptionsAtConstructor]'
 - path = ''
`,
    ],
    [
      'Nested: options.trace',
      {
        trace: {
          realTrace: 'realTrace-wrongValue' as any,
        },
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
   - isBoolean (realTrace must be a boolean value)
_______________________________________________________
at 'trace.realTrace'
 - value = 'realTrace-wrongValue'
 - target = TraceOptions { realTrace: 'realTrace-wrongValue' }
 - class = '[class TraceOptions]'
_______________________________________________________
at 'trace'
 - value = TraceOptions { realTrace: 'realTrace-wrongValue' }
 - target = OptionsAtConstructor { trace: TraceOptions { realTrace: 'realTrace-wrongValue' } }
 - class = '[class OptionsAtConstructor]'
 - path = ''`,
    ],
    [
      'Nested: options.header, wrong field type',
      {
        header: {
          timerPadding: 'timerPadding-wrongValue', // why `as any` not needed here?
        },
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
   - isNumber (timerPadding must be a number conforming to the specified constraints)
_______________________________________________________
at 'header.timerPadding'
 - value = 'timerPadding-wrongValue'
 - target = Header { timerPadding: 'timerPadding-wrongValue' }
 - class = '[class Header]'
_______________________________________________________
at 'header'
 - value = Header { timerPadding: 'timerPadding-wrongValue' }
 - target = OptionsAtConstructor { header: Header { timerPadding: 'timerPadding-wrongValue' } }
 - class = '[class OptionsAtConstructor]'
 - path = ''
`,
    ],

    //     // ########## Kids
    [
      'Nested: options.kids must be an Array',
      {
        kids: {
          notKidNorArray: 123,
        },
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
 - isArray (kids must be an array)
_______________________________________________________
at 'kids'
 - value = Options { notKidNorArray: 123 }
 - target = OptionsAtConstructor { kids: Options { notKidNorArray: 123 } }
 - class = '[class OptionsAtConstructor]'
 - path = ''
`,
    ],
    [
      'Nested: options.kids with wrong type in nested kid',
      {
        kids: [
          {
            loggerName: 456,
          },
        ],
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
     - isString (loggerName must be a string)
_______________________________________________________
at 'kids.0.loggerName'
 - value = 456
 - target = OptionsAtConstructor { loggerName: 456 }
 - class = '[class OptionsAtConstructor]'
 - path = 'kids.0'
`,
    ],
    [
      'Nested: options.kids can be null - no errors',
      {
        kids: null,
      }, // no errors
    ],
    [
      'Nested: options.kids array can contain null values - no errors',
      {
        kids: [{ loggerName: 'foo' }, null],
      }, // no errors
    ],
    [
      'Nested: options.kids array can contain null values, with kids with errors',
      {
        kids: [null, { loggerName: 567 as any }],
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
     - isString (loggerName must be a string)
_______________________________________________________
at 'kids.1.loggerName'
 - value = 567
 - target = OptionsAtConstructor { loggerName: 567 }
 - class = '[class OptionsAtConstructor]'
 - path = 'kids.1'
`,
    ],

    // ########## Outputs
    // NO ERRORS
    [
      'Nested: options.output - a built-in output with no BuiltInOutputOptions needed, as array item 0 - NO ERRORS',
      {
        output: 'std',
      },
    ],
    [
      'Nested: options.output - a built-in output, as array item 0 - NO ERRORS',
      {
        output: ['std'],
      },
    ],
    [
      'Nested: options.output - string that is not a built-in output',
      {
        output: 'wrong-output' as any,
      },
      `
LogZen: Options Validation:
 - checkbuiltInOutputsName (No such Built-In Outputs 'wrong-output': Built-In Outputs are: [ 'console', 'consoleJSON', 'std', 'stdJSON', 'file', 'fileJSON' ])
 - path = 'output'
`,
    ],
    [
      'Nested: options.output - string that is not a built-in output, as array item 0',
      {
        output: ['wrong-output-at-0'] as any,
      },
      `
LogZen: Options Validation:
 - checkbuiltInOutputsName (No such Built-In Outputs 'wrong-output-at-0': Built-In Outputs are: [ 'console', 'consoleJSON', 'std', 'stdJSON', 'file', 'fileJSON' ])
 - path = 'output'
`,
    ],
    [
      'Nested: options.output - a built-in output that requires BuiltInOutputsOptions that were not given',
      {
        output: ['file'] as any,
      },
      `
LogZen: Options Validation:
 - (filenameCheckForFileOutputs): Using builtInOutputs.file, expected a string filename, got: undefined.
    - The builtInOutputsOptions = BuiltInOutputsOptions {}.
    - Should be {output: ['file', {filename: 'some/relative/path/output-filename.txt'}]}.
 - path = 'output'
`,
    ],
    [
      'Nested: options.output - a built-in output with wrong BuiltInOutputsOptions',
      {
        output: ['file', 'filename'] as any,
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
 - (transformAndValidateSyncFix): not a Real Object. Expecting any kind of object {} but got 'filename':
   - Invalid Value = 'filename'
   - Validation Class = '[class BuiltInOutputsOptions]'
 - path = 'output'
`,
    ],
    [
      'Nested: options.output - a nonExistentKey in BuiltInOutputsOptions',
      {
        output: ['file', { nonExistentKey: 123 }] as any,
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
   - whitelistValidation (property nonExistentKey should not exist)
_______________________________________________________
at 'output.nonExistentKey'
 - value = 123
 - target = BuiltInOutputsOptions { nonExistentKey: 123 }
 - class = '[class BuiltInOutputsOptions]'
 - path = 'output'`,
    ],
    [
      'Nested: options.output - logInfo wrong type in BuiltInOutputsOptions',
      {
        output: ['std', { logInfo: 123 }] as any,
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
   - OrAnd (Property 'logInfo' failed)
     - OrAnd (boolean OR $IsArrayWithAllowedValues())
       - boolean (wrong type / check failed)
       - IsArrayWithAllowedValues (Property 'logInfo' must be an Array with any among these Allowed Values: [ 'lineNumber', 'logLevelMethod', 'logLevelString', 'logLevelNum', 'relativePath', 'absolutePath', 'resolvedName', 'resolvedCallName', 'loggerName', 'date', 'time' ])
_______________________________________________________
at 'output.logInfo'
 - value = 123
 - target = BuiltInOutputsOptions { logInfo: 123 }
 - class = '[class BuiltInOutputsOptions]'
 - path = 'output'
`,
    ],
    [
      'Nested: options.output - logInfo correct boolean type in BuiltInOutputsOptions - NO ERRORS',
      {
        output: ['std', { logInfo: true }] as any,
      },
    ],
    [
      'Nested: options.output - logInfo correct array type & contents in BuiltInOutputsOptions - NO ERRORS',
      {
        output: ['std', { logInfo: ['logLevelMethod', 'logLevelNum'] }] as any,
      },
    ],
    [
      'Nested: options.output - logInfo correct array type & wrong contents in BuiltInOutputsOptions',
      {
        output: ['std', { logInfo: ['logLevelMethod', 'logInfo_wrong_value'] }] as any,
      },
      `
LogZen: Options Validation: ValidZen: Validation Errors:
   - OrAnd (Property 'logInfo' failed)
     - OrAnd (boolean OR $IsArrayWithAllowedValues())
       - boolean (wrong type / check failed)
       - IsArrayWithAllowedValues (Property 'logInfo' must be an Array with any among these Allowed Values: [ 'lineNumber', 'logLevelMethod', 'logLevelString', 'logLevelNum', 'relativePath', 'absolutePath', 'resolvedName', 'resolvedCallName', 'loggerName', 'date', 'time' ])
_______________________________________________________
at 'output.logInfo'
 - value = [ 'logLevelMethod', 'logInfo_wrong_value' ]
 - target = BuiltInOutputsOptions { logInfo: [ 'logLevelMethod', 'logInfo_wrong_value' ] }
 - class = '[class BuiltInOutputsOptions]'
 - path = 'output'
`,
    ],
  ])(
    `Options are validated with class-validator & internally`,
    (title: string, options: any | Options, expectedErrors?: string) => {
      expectedErrors =
        isStrictErrorDescriptionAllLines || !expectedErrors
          ? indentate(expectedErrors)
          : indentate(expectedErrors).split('\n')[0]

      describe(`Testing ${title} with options ${JSON.stringify(options)} ${
        expectedErrors ? ' THROWS:' : ' NO ERRORS'
      }`, () => {
        it(`Instantiating via new LogZen(options):`, () => {
          const updateFn = () => new LogZen(options)

          if (expectedErrors)
            expectToThrow(
              updateFn,
              expectedErrors,
               _.flow(indentate, (str) =>
                str.replaceAll(/ extends.*]/g, ']')
              )
            )
          else expect(updateFn).not.toThrow()
        })

        it(`Updating LogZen via l.options(options):`, () => {
          const updateFn = () => logger.options(options)

          if (expectedErrors)
            expectToThrow(
              updateFn,
              expectedErrors,
               _.flow(indentate, (er) => er.replaceAll(/ extends.*]/g, ']').replaceAll('OptionsAtConstructor', 'OptionsInternal'))
            )
          else expect(updateFn).not.toThrow()
        })

        it(`Updating via LogZen.updateLogPathOptions({'/': options}):`, () => {
          const updateFn = () => LogZen.updateLogPathOptions({ '/': options })

          if (expectedErrors)
            expectToThrow(
              updateFn,
              expectedErrors,
               _.flow(indentate, (er) => er.replaceAll(/ extends.*]/g, ']').replaceAll('OptionsAtConstructor', 'Options'))
            )
          else expect(updateFn).not.toThrow()
        })
      })
    }
  )

  describe(`LogZen constructor`, () => {
    it(`works with all overloaded LogZen() variants:`, () => {
      expect(new LogZen('aLoggerName').options()).toMatchObject({ loggerName: 'aLoggerName' })

      expect(new LogZen('aLoggerName', 20).options()).toMatchObject({
        loggerName: 'aLoggerName',
        debugLevel: 20,
      })

      // @ts-ignore
      expect(() => new LogZen('aLoggerName', 12, 'error')).toThrow(
        `LogZen: Wrong params in constructor(string,number,string), in new LogZen('aLoggerName', 12, 'error')`
      )

      expect(new LogZen('aLoggerName', 'warn').options()).toMatchObject({
        loggerName: 'aLoggerName',
        logLevel: 'warn',
      })

      expect(new LogZen('aLoggerName', 'warn', 12).options()).toMatchObject({
        loggerName: 'aLoggerName',
        logLevel: 'warn',
        debugLevel: 12,
      })

      // @ts-ignore
      expect(() => new LogZen('aLoggerName', 'wrong-logLevel-1')).toThrow(
        `LogZen: Wrong constructor params: wrong string 'wrong-logLevel-1' as 2nd string parameter, interpreted as 'logLevel'.
Use strictly:
 - One of 'NONE', 'fatal', 'critical', 'error', 'warn', 'notice', 'ok', 'info', 'log', 'verbose', 'debug', 'trace', 'silly'.
 - OR a an integer that will be interpreted as 'debugLevel'.`
      )

      // @ts-ignore
      expect(() => new LogZen('aLoggerName', 'wrong-logLevel-2', 15)).toThrow(
        `LogZen: Wrong constructor params: wrong string 'wrong-logLevel-2' as 2nd string parameter, interpreted as 'logLevel'.
Use strictly:
 - One of 'NONE', 'fatal', 'critical', 'error', 'warn', 'notice', 'ok', 'info', 'log', 'verbose', 'debug', 'trace', 'silly'.
 - OR a an integer that will be interpreted as 'debugLevel'.`
      )

      expect(new LogZen({ output: ['std'] }, 12).options()).toMatchObject({
        output: ['std', {}],
        debugLevel: 12,
      })

      // @ts-ignore
      expect(() => new LogZen({ output: ['std'] }, 12, 'error').options()).toThrow(
        `LogZen: Wrong params in constructor(realObject,number,string), in new LogZen({ output: [ 'std' ] }, 12, 'error')`
      )

      expect(new LogZen({ output: ['std'] }, 'warn').options()).toMatchObject({
        output: ['std', {}],
        logLevel: 'warn',
      })

      // @ts-ignore
      expect(() => new LogZen({ output: ['std'] }, 'wrong-logLevel-3')).toThrow(
        `LogZen: Wrong constructor params: wrong string 'wrong-logLevel-3' as 2nd string parameter, interpreted as 'logLevel'.
Use strictly:
 - One of 'NONE', 'fatal', 'critical', 'error', 'warn', 'notice', 'ok', 'info', 'log', 'verbose', 'debug', 'trace', 'silly'.
 - OR a an integer that will be interpreted as 'debugLevel'.`
      )

      expect(new LogZen({ header: true }, 'warn', 12).options()).toMatchObject({
        header: true,
        logLevel: 'warn',
        debugLevel: 12,
      })

      // @ts-ignore
      expect(() => new LogZen({ output: ['std'] }, 'wrong-logLevel-4', 12)).toThrow(
        `LogZen: Wrong constructor params: wrong string 'wrong-logLevel-4' as 2nd string parameter, interpreted as 'logLevel'.
Use strictly:
 - One of 'NONE', 'fatal', 'critical', 'error', 'warn', 'notice', 'ok', 'info', 'log', 'verbose', 'debug', 'trace', 'silly'.
 - OR a an integer that will be interpreted as 'debugLevel'.`
      )
    })
  })

  describe(`Special cases`, () => {
    describe(`.options() validation`, () => {
      it(`Wrong value in .options():`, () => {
        expect(() => logger.options('foobar' as any)).toThrow(
          `LogZen: Wrong options value passed to \`.options()\` - expecting an \`Options\` object type, received: 'foobar'`
        )
      })

      it(`Accepts an OptionsInternal instance as options at .options():`, () => {
        expect(() => logger.options(logger.options({ logLevel: 'warn' }).options())).not.toThrow()
      })

      it(`Properly merges nested instances (eg Output) inside OptionsInternal instances at .options():`, () => {
        const l = new LogZen({
          logLevel: 'trace',
          overrideCWD: '/',
          output: {
            out: console.log,
            error: console.error,
          },
        })
        const opts = l.options({ output: { info: console.info } }).options()
        const finalOptions = l.options(opts).options()

        expect(finalOptions.output).toMatchObject({
          // from constructor
          out: console.log,
          error: console.error,
          // from options() update
          info: console.info,
        })
      })
    })

    it(`Wrong value in .updateLogPathOptions():`, () => {
      expect(() => LogZen.updateLogPathOptions({ '/': 'foobar' as any })).toThrow(
        `LogZen: validatePathOptionsValue(): wrong string value 'foobar' found at path '/'.
Use strictly:
 - One of 'NONE', 'fatal', 'critical', 'error', 'warn', 'notice', 'ok', 'info', 'log', 'verbose', 'debug', 'trace', 'silly'.
 - OR a string parsable as integer that will be interpreted as 'debugLevel' (works only at pathOptions).`
      )
      expect(() => LogZen.updateLogPathOptions({ '/': 'warn' })).not.toThrow()
      expect(() => LogZen.updateLogPathOptions({ '/': 100 })).not.toThrow()
      expect(() => LogZen.updateLogPathOptions({ '/': '100' as any })).not.toThrow()
    })
  })
})
