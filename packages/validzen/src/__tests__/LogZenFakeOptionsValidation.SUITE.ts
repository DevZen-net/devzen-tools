import { ONLY, ONLY_END, SUITE } from '@neozen/speczen'
import { isOk } from '@neozen/zen'

export const LogZenFakeOptionsValidation_SUITE = SUITE(
  {
    title: 'LogZenFake Options are validated with class-validator & internally',
    specHandlers: 'LogZenFakeOptionsValidation_SpecHandler',
    columns: [
      'title', // string
      'testOptions', // Options LogZenFakeOptionsValidation_SpecData.testOptions
      'options', // Options
      'expectedErrors?', // string
    ],

    specDataTransformer: {
      // testOptions defaults
      testOptions: {
        isStrictErrorDescriptionAllLines: true,
        isStrictIndentation: true,
      },
    },
  },
  [
    ['Empty options, no errors', {}, {}],
    [
      `nonExistentKey`,
      {},
      {
        inspect: {
          nonExistentKey: 'foobar',
        } as any,
      },
      `
ValidZen: Validation Errors:
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
`
        .split('\n')
        .filter(isOk)
        .join('\n'),
    ],
    ['Correct logLevel string, case-insensitive, no errors', {}, { logLevel: 'wArN' }],
    [
      'IsNumberEnumKeyOrValue: Wrong logLevel string in options',
      {},
      { logLevel: 'wrongLogLevel' },
      `
ValidZen: Validation Errors:
 - OrAnd (Property 'logLevel' failed)
   - OrAnd (undefined OR $IsNumberEnumKeyOrValue())
     - undefined (wrong type / check failed)
     - IsNumberEnumKeyOrValue (Property 'logLevel' equals 'wrongLogLevel' but it must be one of the following enum values (case-insensitive): 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, NONE, fatal, critical, error, warn, notice, ok, info, log, verbose, debug, trace, silly)
_______________________________________________________
at 'logLevel'
 - value = 'wrongLogLevel'
 - target = OptionsAtConstructor { logLevel: 'wrongLogLevel' }
 - class = '[class OptionsAtConstructor]'
`,
    ],
    [
      'IsNumberEnumKeyOrValue: Wrong logLevel number in options as key',
      {},
      { logLevel: 99 },
      `
ValidZen: Validation Errors:
 - OrAnd (Property 'logLevel' failed)
   - OrAnd (undefined OR $IsNumberEnumKeyOrValue())
     - undefined (wrong type / check failed)
     - IsNumberEnumKeyOrValue (Property 'logLevel' equals '99' but it must be one of the following enum values (case-insensitive): 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, NONE, fatal, critical, error, warn, notice, ok, info, log, verbose, debug, trace, silly)
_______________________________________________________
at 'logLevel'
 - value = 99
 - target = OptionsAtConstructor { logLevel: 99 }
 - class = '[class OptionsAtConstructor]'
`,
    ],
    [
      'whitelistValidation: Non-existent options key',
      {},
      { nonExistentKey: 'foobar' },
      `
ValidZen: Validation Errors:
 - whitelistValidation (property nonExistentKey should not exist)
_______________________________________________________
at 'nonExistentKey'
 - value = 'foobar'
 - target = OptionsAtConstructor { nonExistentKey: 'foobar' }
 - class = '[class OptionsAtConstructor]'
`,
    ],
    [
      'Nested: wrong value type',
      {},
      {
        inspect: {
          getters: 'getters-foobar' as any,
        },
      },
      `
ValidZen: Validation Errors:
 - OrAnd (Property 'getters' failed)
   - OrAnd (boolean OR $IsArrayWithAllowedValues())
     - boolean (wrong type / check failed)
     - IsArrayWithAllowedValues (Property 'getters' must be an Array with any among these Allowed Values: [ 'get', 'set' ])
_______________________________________________________
at 'getters'
 - value = 'getters-foobar'
 - target = LogZenInspectOptions { getters: 'getters-foobar' }
 - class = '[class LogZenInspectOptions]'
`,
    ],
    [
      'Nested: non Existent Key',
      {},
      {
        inspect: {
          nonExistentKey: 'foobar',
        },
      },
      `
ValidZen: Validation Errors:
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
`,
    ],
    //    // // ########## Kids
    [
      'Nested: options.kids must be an Array',
      {},
      {
        kids: {
          notKidNorArray: 123,
        },
      },
      `
ValidZen: Validation Errors:
 - isArray (kids must be an array)
   - whitelistValidation (property notKidNorArray should not exist)
_______________________________________________________
at 'kids.notKidNorArray'
 - value = 123
 - target = Options { notKidNorArray: 123 }
 - class = '[class Options]'
_______________________________________________________
at 'kids'
 - value = Options { notKidNorArray: 123 }
 - target = OptionsAtConstructor { kids: Options { notKidNorArray: 123 } }
 - class = '[class OptionsAtConstructor]'
`,
    ],
    [
      'Nested: options.kids can be null - no errors',
      {},
      {
        kids: null,
      }, // no errors
    ],
    [
      `Nested: options.kids array can contain null values, with kids with errors
              In LogZen we handle kids [] with nulls manually, cause of https://github.com/typestack/class-validator/issues/1382#issuecomment-1745802645
             `,
      {},
      {
        // @IsOptional()
        // @IsString()
        // loggerName?: string
        kids: [{ loggerName: 567 as any }], // @todo: add null
      },
      `
ValidZen: Validation Errors:
     - isString (loggerName must be a string)
_______________________________________________________
at 'kids.0.loggerName'
 - value = 567
 - target = Options { loggerName: 567 }
 - class = '[class Options]'
_______________________________________________________
at 'kids.0'
 - value = Options { loggerName: 567 }
 - target = [ Options { loggerName: 567 } ]
 - class = '[Function: Array]'
_______________________________________________________
at 'kids'
 - value = [ Options { loggerName: 567 } ]
 - target = OptionsAtConstructor { kids: [ Options { loggerName: 567 } ] }
 - class = '[class OptionsAtConstructor]'
`,
    ],
    [
      `Nested: options.kids array can contain null values, with kids with errors
          In LogZen we handle kids [] with nulls manually, cause of https://github.com/typestack/class-validator/issues/1382#issuecomment-1745802645
         `,
      {},
      {
        // @ValidZen('undefined', 'string')
        // loggerName2?: string
        kids: [{ loggerName2: 789 as any }], // @todo: add null
      },
      `
ValidZen: Validation Errors:
 - OrAnd (Property 'loggerName2' failed)
   - OrAnd (undefined OR string)
     - undefined (wrong type / check failed)
     - string (wrong type / check failed)
_______________________________________________________
at 'loggerName2'
 - value = 789
 - target = Options { loggerName2: 789 }
 - class = '[class Options]'
`,
    ],

    // //
    // //    // ########## Outputs NOT WORKING
    // //    SKIP
    // // NO ERRORS
    // // [
    // //   'Nested: options.output - a built-in output with no BuiltInOutputOptions needed, as array item 0 - NO ERRORS',
    // //   {
    // //     output: 'std',
    // //   },
    // // ],
    // //    SKIP
    // // [
    // //   'Nested: options.output - a built-in output, as array item 0 - NO ERRORS',
    // //   {
    // //     output: ['std'],
    // //   },
    // // ],
    // //    SKIP
    // //    [
    // //      'Nested: options.output - string that is not a built-in output',
    // //      {
    // //        output: 'wrong-output' as any,
    // //      },
    // //      `ValidZen: Validation Errors:
    // // - (checkbuiltInOutputsName) No such Built-In Outputs 'wrong-output'.
    // //   - Built-In Outputs are: [ 'console', 'consoleJSON', 'std', 'stdJSON', 'file', 'fileJSON' ]
    // // - Path = 'output'`,
    // //    ],
    // //    SKIP
    // //    [
    // //      'Nested: options.output - string that is not a built-in output, as array item 0',
    // //      {
    // //        output: ['wrong-output-at-0'] as any,
    // //      },
    // //      `ValidZen: Validation Errors:
    // // - (checkbuiltInOutputsName) No such Built-In Outputs 'wrong-output-at-0'.
    // //   - Built-In Outputs are: [ 'console', 'consoleJSON', 'std', 'stdJSON', 'file', 'fileJSON' ]
    // // - Path = 'output'`,
    // //    ],
    // //    SKIP
    // //    [
    // //      'Nested: options.output - a built-in output that requires BuiltInOutputsOptions that were not given',
    // //      {
    // //        output: ['file'] as any,
    // //      },
    // //      `ValidZen: Validation Errors:
    // // - (filenameCheckForFileOutputs): Using builtInOutputs.file, expected a string filename, got: undefined.
    // //    - The builtInOutputsOptions = BuiltInOutputsOptions {}.
    // //    - Should be {output: ['file', {filename: 'some/relative/path/output-filename.txt'}]}.
    // // - Path = 'output'`,
    // //    ],
    // // SKIP
    // //    [
    // //      'Nested: options.output - a built-in output with wrong BuiltInOutputsOptions',
    // //      {
    // //        output: ['file', 'filename'] as any,
    // //      },
    // //      `ValidZen: Validation Errors:
    // // - (transformAndValidateSyncFix): not a Real Object. Expecting any kind of object {} but got 'filename':
    // //   - Invalid Value = 'filename'
    // //   - Validation Class = '[class BuiltInOutputsOptions]'
    // // - Path = 'output'`,
    // //    ],
    // // SKIP
    // //    [
    // //      'Nested: options.output - a nonExistentKey in BuiltInOutputsOptions',
    // //      {
    // //        output: ['file', { nonExistentKey: 123 }] as any,
    // //      },
    // //      `ValidZen: Validation Errors:
    // // - (whitelistValidation) output.nonExistentKey: property nonExistentKey should not exist
    // //        ########### Validation Errors Details ###########:
    // //           - Path = 'output.nonExistentKey'
    // //           - Invalid Value = 123
    // //           - Invalid Object = BuiltInOutputsOptions { nonExistentKey: 123 }
    // //           - Validation Class = '[class BuiltInOutputsOptions]'`,
    // //    ],
    // // SKIP
    // //    [
    // //      'Nested: options.output - logInfo wrong type in BuiltInOutputsOptions',
    // //      {
    // //        output: ['std', { logInfo: 123 }] as any,
    // //      },
    // //      `ValidZen: Validation Errors:
    // // - (ValidZen) output.logInfo: All attempted validations failed. Property 'logInfo' can only be one of these valid types:
    // //   - boolean
    // //   - PropertyDecorator: @IsArrayWithAllowedValues() wrapped as validator function
    // //        ########### Validation Errors Details ###########:
    // //           - Path = 'output.logInfo'
    // //           - Invalid Value = 123
    // //           - Invalid Object = BuiltInOutputsOptions { logInfo: 123 }
    // //           - Validation Class = '[class BuiltInOutputsOptions]'
    // // - (IsArrayWithAllowedValues) output.logInfo: Property 'logInfo' must be an Array with any among these Allowed Values: [ 'lineNumber', 'logLevelMethod', 'logLevelString', 'logLevelNum', 'relativePath', 'absolutePath', 'resolvedName', 'resolvedCallName', 'loggerName', 'date', 'time' ]
    // //        ########### Validation Errors Details ###########:
    // //           - Path = 'output.logInfo'
    // //           - Invalid Value = 123
    // //           - Invalid Object = BuiltInOutputsOptions { logInfo: 123 }
    // //           - Validation Class = '[class BuiltInOutputsOptions]'`,
    // //    ],
    // // // SKIP
    // // [
    // //   'Nested: options.output - logInfo correct boolean type in BuiltInOutputsOptions - NO ERRORS',
    // //   {
    // //     output: ['std', { logInfo: true }] as any,
    // //   },
    // // ],
    // // SKIP
    // // [
    // //   'Nested: options.output - logInfo correct array type & contents in BuiltInOutputsOptions - NO ERRORS',
    // //   {
    // //     output: ['std', { logInfo: ['logLevelMethod', 'logLevelNum'] }] as any,
    // //   },
    // // ],
    // // SKIP
    // //    [
    // //      'Nested: options.output - logInfo correct array type & wrong contents in BuiltInOutputsOptions',
    // //      {
    // //        output: ['std', { logInfo: ['logLevelMethod', 'logInfo_wrong_value'] }] as any,
    // //      },
    // //      `ValidZen: Validation Errors:
    // // - (ValidZen) output.logInfo: All attempted validations failed. Property 'logInfo' can only be one of these valid types:
    // //   - boolean
    // //   - PropertyDecorator: @IsArrayWithAllowedValues() wrapped as validator function
    // //        ########### Validation Errors Details ###########:
    // //           - Path = 'output.logInfo'
    // //           - Invalid Value = [ 'logLevelMethod', 'logInfo_wrong_value' ]
    // //           - Invalid Object = BuiltInOutputsOptions { logInfo: [ 'logLevelMethod', 'logInfo_wrong_value' ] }
    // //           - Validation Class = '[class BuiltInOutputsOptions]'
    // // - (IsArrayWithAllowedValues) output.logInfo: Property 'logInfo' must be an Array with any among these Allowed Values: [ 'lineNumber', 'logLevelMethod', 'logLevelString', 'logLevelNum', 'relativePath', 'absolutePath', 'resolvedName', 'resolvedCallName', 'loggerName', 'date', 'time' ]
    // //        ########### Validation Errors Details ###########:
    // //           - Path = 'output.logInfo'
    // //           - Invalid Value = [ 'logLevelMethod', 'logInfo_wrong_value' ]
    // //           - Invalid Object = BuiltInOutputsOptions { logInfo: [ 'logLevelMethod', 'logInfo_wrong_value' ] }
    // //           - Validation Class = '[class BuiltInOutputsOptions]'`,
    // //    ],
    [
      'Testing OR & AND: debugLevel can be undefined, or a number of between 0 and 100',
      {},
      {
        debugLevel: 100,
      },
    ],
    [
      'Testing OR & AND: debugLevel can be undefined, or a number of between 0 and 100',
      {},
      {
        debugLevel: 101,
      },
      `ValidZen: Validation Errors:`,
    ],
    [
      'Testing OR & AND: debugLevel can be undefined, or a number of between 0 and 100',
      {},
      {
        debugLevel: -1,
      },
      `
ValidZen: Validation Errors:
 - OrAnd (Property 'debugLevel' failed)
   - OrAnd (undefined OR (number AND $Max() AND $Min()))
     - undefined (wrong type / check failed)
     - OrAnd (number AND $Max() AND $Min())
       - Min (debugLevel must not be less than 0)
_______________________________________________________
at 'debugLevel'
 - value = -1
 - target = OptionsAtConstructor { debugLevel: -1 }
 - class = '[class OptionsAtConstructor]'
`,
    ],
  ]
)
