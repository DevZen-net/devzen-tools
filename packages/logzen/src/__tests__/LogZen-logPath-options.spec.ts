import * as _ from 'lodash'
import { stdout } from 'test-console'

// local
import { pathReplacements, resetDefaults, testDefaultOptions } from './test-defaultOptions'
import { LogZen, Options, getTinyLog } from '../code'
import { PATHS_OPTIONS_KEY } from '../code/types'

// const _log = getTinyLog(false, 'LogZen-spec')

// const thisFileRelativeFilename = upath
//   .relative(process.cwd(), upath.trimExt(__filename))
//   .split('/')
//   .slice(pathReplacementDepth) // remove src/ because we have a replacePath for it!
//   .join('/')

describe('LogZen.updateLogPathOptions() pathReplacements', () => {
  // beforeEach(() => resetDefaults())

  it.each([
    ['./path/with/relative/dot', 'path/with/relative/dot'],
    ['path/with/ending/slash/', 'path/with/ending/slash'],
    ['./path/with/both/ending/slash/and/dot/', 'path/with/both/ending/slash/and/dot'],
  ])(`pathReplacements get added with sanitized paths = %s`, (path, expectedPath) => {
    resetDefaults()
    LogZen.addPathReplacements({ [path]: 'someReplacement' })
    //
    expect((LogZen as any)._pathReplacements).toEqual({
      ...pathReplacements,
      [expectedPath]: 'someReplacement',
    })
  })

  it(`pathReplacements get merged with existing ones`, () => {
    resetDefaults()
    _.each(
      [
        './path/with/relative/dot',
        'path/with/ending/slash/',
        './path/with/both/ending/slash/and/dot/',
      ],
      (path, i) => LogZen.addPathReplacements({ [path]: `someReplacement${i}` })
    )

    LogZen.addPathReplacements({
      '././path/with/ending/slash/': 'replaced replacement',
    })
    expect((LogZen as any)._pathReplacements).toEqual({
      ...pathReplacements,
      'path/with/relative/dot': 'someReplacement0',
      'path/with/ending/slash': 'replaced replacement',
      'path/with/both/ending/slash/and/dot': 'someReplacement2',
    })
  })
})

describe(`LogZen.updateLogPathOptions() - adds the options passed at the correct sanitized paths, for this path structure:
  / (root)
  ├── unstable
  │   ├── newApi
  │   │   ├── emergencyBuggyCode
  │   │   │   ├── verboseAndIrrelevant
  ├── stable
  │   ├── library`, () => {
  // prettier-ignore
  let result
  let output
  beforeAll(() => {
    resetDefaults()

    LogZen.updateLogPathOptions({
      '/': {
        // root, starting as critical
        debugLevel: 5,
        logLevel: 'critical',
        colors: false,
        inspect: { colors: false },
        kids: [{ loggerName: 'rootKid' }],
      },
      unstable: 20,
      './/unstable/newApi': {
        debugLevel: 30, // this will change to 40 below
        traceLevel: 10,
        logLevel: 'silly', // this will change todebug below
        kids: [{ loggerName: 'unstable_newApi_Kid' }],
      },
      '/unstable/newApi//emergencyBuggyCode/': {
        debugLevel: 60,
        logLevel: 'silly',
        colors: true,
        kids: null, // discard all inherited kids, we don't want any in this path
      },
      'unstable/newApi/emergencyBuggyCode/verboseAndIrrelevant': {
        debugLevel: 3,
        logLevel: 'ok',
        colors: false,
        inspect: { colors: true },
        kids: [{ loggerName: 'VerboseIrrelevant_Kid' }], // discarded all inherited kids in /unstable/newApi/emergencyBuggyCode, so that's the only that should remain
      },
      './stable/library/./': {
        debugLevel: 12,
        kids: [{ loggerName: 'stableLibrary_Kid' }],
      },
      '/stable/onlyMyKids': {
        kids: [{ loggerName: 'discardedKid' }, null, { loggerName: 'onlyMyKids' }], // null inside the array instructs LogZen to discard all inherited kids, keep onlyMyKids
      },
      './stable': undefined, // should not matter
    })

    // later on, update some of the above options, as we are responding to some emergency

    // for the whole BigApp
    LogZen.updateLogPathOptions({
      '/': 'warn', // update root with warn!
    })

    // and only for a specific path / module
    LogZen.updateLogPathOptions({
      'unstable/newApi': {
        debugLevel: 40,
        logLevel: 'debug' as any,
      },
    })

    // @todo: test with them also added via separate LogZen.updateLogPathOptions(), eg:

    // LogZen.updateLogPathOptions({'': {
    //   debugLevel: 5,
    //   logLevel: 'warn' as any,
    //   colors: false,
    // }})
    // LogZen.updateLogPathOptions({'unstable/': 20})
    // LogZen.updateLogPathOptions('unstable/newApi': {
    //   debugLevel: 40,
    //   logLevel: 'debug' as any,
    // }})
    // LogZen.updateLogPathOptions({'unstable/newApi/emergencyBuggyCode': {
    //   debugLevel: 60,
    //   logLevel: 'silly' as any,
    //   colors: true,
    //   kids: null,
    // }})
    // etc...
  })

  // prettier-ignore
  it('throws TypeError if debugLevel is not parsable Number', () => {
    // @ts-ignore-next-line
    expect(() => LogZen.updateLogPathOptions({'stable/library': 'blah012'})).toThrow(
      `LogZen: validatePathOptionsValue(): wrong string value 'blah012' found at path 'stable/library'.
Use strictly:
 - One of 'NONE', 'fatal', 'critical', 'error', 'warn', 'notice', 'ok', 'info', 'log', 'verbose', 'debug', 'trace', 'silly'.
 - OR a string parsable as integer that will be interpreted as 'debugLevel' (works only at pathOptions).`)
    // @ts-ignore-next-line
    expect(() => LogZen.updateLogPathOptions({'stable/library': 'blah012'})).toThrow(
      TypeError)
  })

  // prettier-ignore
  it('correctly sets LogZen._logPathOptions', () => {
    const expectedLogPathOptions = {
      [PATHS_OPTIONS_KEY]: { // root
        logLevel: 'warn',
        debugLevel: 5,
        colors: false,
        inspect: {colors: false},
        kids: [{loggerName: 'rootKid'}],
      },
      stable: {
        library: {
          [PATHS_OPTIONS_KEY]: {
            kids: [{loggerName: 'stableLibrary_Kid'}],
          },
        },
        onlyMyKids: {
          [PATHS_OPTIONS_KEY]: {
            kids: [{loggerName: 'discardedKid'}, null, {loggerName: 'onlyMyKids'}], // null instructs LogZen to discard all inherited kids, keep onlyMyKids. Note: we mustg keep the null at the beginning of the array in the logPathOptions, because it's the only way to instruct LogZen to discard all inherited kids when these options are used to blend effective Options at an instance.
          },
        },
      },
      unstable: {
        [PATHS_OPTIONS_KEY]: {debugLevel: 20},
        newApi: {
          [PATHS_OPTIONS_KEY]: {
            debugLevel: 40,
            logLevel: 'debug',
            kids: [{loggerName: 'unstable_newApi_Kid'}],
          },
          emergencyBuggyCode: {
            [PATHS_OPTIONS_KEY]: {
              debugLevel: 60,
              logLevel: 'silly',
              colors: true,
              kids: null, // discard all inherited kids, we don't want any in this path
            },
            verboseAndIrrelevant: {
              [PATHS_OPTIONS_KEY]: {
                colors: false,
                debugLevel: 3,
                inspect: {
                  colors: true,
                },
                logLevel: 'ok',
                kids: [{loggerName: 'VerboseIrrelevant_Kid'}], // that's the only that should remain at this path, cause  we discarded all inherited kids in /unstable/newApi/emergencyBuggyCode via null value
              },
            },
          },
        },
      },
    }
    // _log((LogZen as any)._logPathOptions)
    expect((LogZen as any)._logPathOptions).toMatchObject(expectedLogPathOptions)
  })

  // @todo: convert to describe([[], []], ()=>)
  // Cascading options
  const rootOptions = {
    debugLevel: 5,
    logLevel: 'warn',
    inspect: {
      colors: false,
    },
    colors: false,
    kids: [{ loggerName: 'rootKid' }],
  }
  // prettier-ignore
  _.each(
    [
      [`On root as empty string, it gets all the root options and kids`,
        '',
        rootOptions,
      ],
      [`On root as / it gets all the root options and kids`, '/', rootOptions],
      // [`On root with undefined as options, it only gets the root options and kids `, undefined, rootOptions],
      [`On partial path with no options, it only gets the root options and kids`, 'stable', rootOptions],
      [`On a not existent path, it gets only the root options`,
        'not/existent/path', rootOptions,
      ],
      [
        `On a partially not existent path, it gets only partial paths options`,
        'unstable/partially not/existent/path',
        {
          debugLevel: 20,
          logLevel: 'warn',
          inspect: {
            colors: false,
          },
          colors: false,
          kids: [
            {loggerName: 'rootKid'},
          ],
        },
      ],
      [
        `With a number as options, number becomes the debugLevel`,
        'unstable',
        { // effectiveOptions
          debugLevel: 20,
          logLevel: 'warn',
          inspect: {
            colors: false,
          },
          colors: false,
          kids: [
            {loggerName: 'rootKid'},
          ],
        },
      ],
      ['With updated logPathOption of specific path, the updated options get merged with the previous ones',
        'unstable/newApi',
        { // effectiveOptions
          debugLevel: 40,
          logLevel: 'debug',
          traceLevel: 10,
          inspect: {
            colors: false,
          },
          colors: false,
          kids: [{loggerName: 'rootKid'}, {loggerName: 'unstable_newApi_Kid'}],
        },
      ],
      [`With a path that isn't specified, it gets the closest parent options`,
        'unstable/newApi/not-specified/long/path',
        { // effectiveOptions
          debugLevel: 40,
          logLevel: 'debug',
          inspect: {
            colors: false,
          },
          colors: false,
          kids: [{loggerName: 'rootKid'}, {loggerName: 'unstable_newApi_Kid'}],
        },
      ],
      ['When kids: null, it discards all inherited kids, we dont have any in this path and kids stays as null',
        '/unstable/newApi/emergencyBuggyCode',
        {// effectiveOptions
          debugLevel: 60,
          logLevel: 'silly',
          colors: true,
          inspect: {
            colors: true,
          },
          kids: null, // discarded all previous kids
        },
        [ // collectedOptions
          { // root
            logLevel: 'warn',
            debugLevel: 5,
            colors: false,
            inspect: {colors: false},
            kids: [{loggerName: 'rootKid'}],
          },
          { // unstable
            debugLevel: 20,
          },
          { // unstable/newApi
            debugLevel: 40,
            logLevel: 'debug',
            traceLevel: 10,
            kids: [{loggerName: 'unstable_newApi_Kid'}],
          },
          { // unstable/newApi/emergencyBuggyCode
            debugLevel: 60,
            logLevel: 'silly',
            colors: true,
          },
        ],
      ],
      ['When null appears as the kids value in **a parent path**, it discards all inherited kids thus far. Children paths of this null-ed parent path, will have no inherited Kids, but only their own specified Kids',
        'unstable/newApi/emergencyBuggyCode/verboseAndIrrelevant',
        { // effective options
          debugLevel: 3,
          logLevel: 'ok' as any,
          colors: false,
          inspect: {
            colors: true,
          },
          kids: [{loggerName: 'VerboseIrrelevant_Kid'}], // discarded all inherited kids in /unstable/newApi/emergencyBuggyCode, that's the only that should remain
        },
        [ // collectedOptions
          {
            logLevel: 'warn',
            debugLevel: 5,
            colors: false,
            inspect: {colors: false},
          },
          {debugLevel: 20},
          {debugLevel: 40, logLevel: 'debug'},
          {debugLevel: 60, logLevel: 'silly', colors: true},
          {
            debugLevel: 3,
            logLevel: 'ok' as any,
            colors: false,
            inspect: {
              colors: true,
            },
          },
        ],
      ],
      [
        `With a kids Array with null inside that array, that instructs LogZen to discard all previously inherited kids, it keeps only the kids following the null`,
        'stable/onlyMyKids',
        { // effectiveOptions
          ...rootOptions,
          kids: [
            {loggerName: 'onlyMyKids'},
          ],
        },
        // []
        [ // collectedOptions
          { // root
            logLevel: 'warn',
            debugLevel: 5,
            colors: false,
            inspect: {colors: false},
            kids: [{loggerName: 'rootKid'}],
          },
          {}, // stable undefined means no options
          { // onlyMyKids
            kids: [{loggerName: 'discardedKid'}, null, {loggerName: 'onlyMyKids'}], // null inside the array instructs LogZen to discard all inherited kids, keep onlyMyKids
          },
        ],
      ],
      [`# Free to use for other test case`,
        'stable/library',
        { // effectiveOptions
          ...rootOptions,
          debugLevel: 12,
          kids: [
            {loggerName: 'rootKid'},
            {loggerName: 'stableLibrary_Kid'},
          ],
        },
      ],
    ] as any
    // ].slice(12,13) as any,
    ,
    ([description, path, effectiveOptions, collectedOptions]: [
      description: string,
      path: string,
      effectiveOptions: Options,
      collectedOptions?: Options[]
    ]) => {
      describe(`the options are correctly blended,`, () => {
        describe(`${description}, at path "/${path}"`, () => {
          if (collectedOptions)
            it(`correctly LogZen.collectPathOptions`, () => {
              expect((LogZen as any)._collectPathOptions(path)).toMatchObject(collectedOptions)
            })

          it(`correctly calculates LogZen.blendOptions for effectiveOptions`, () => {
            expect((LogZen as any)._blendOptions({options: (LogZen as any)._collectPathOptions(path)})).toMatchObject(
              effectiveOptions,
            )
          })

          describe(`instances created with this path,`, () => {
            const ll = new LogZen({
              overrideAbsolutePath: `/some/path/${  path}`,
              overrideCWD: '/some/path',
            })

            it(`has correct options,`, () => {
              expect(ll.options()).toMatchObject(effectiveOptions)
            })

            it(`has correct options.kids`, () => {
              if (_.isEqual(ll.options().kids, effectiveOptions.kids))
                expect(ll.options().kids).toEqual(effectiveOptions.kids)
              else
                expect(ll.options().kids).toMatchObject(effectiveOptions.kids || [])
            })
          })
        })
      })

      it(`has correct resolvedName for instances created`, () => {
        const ll = new LogZen({
          overrideAbsolutePath: `/some/path/./${  path}`,
          overrideCWD: '/some/path/.',
        })

        // _log((ll as any)._resolvedName)
        expect((ll as any)._resolvedName).toEqual(path && path.split('/').filter(p => !!p).join('/'))
      })
    },
  )

  describe('Update "kids" on instance options:', () => {
    let l: LogZen
    beforeAll(() => {
      l = new LogZen({
        overrideAbsolutePath: '/unstable/newApi/not-specified/long/path',
        overrideCWD: '/',
      })
    })

    it(`before updating, with a path that partially isn\'t specified, it gets the closest parent options`, () => {
      expect(l.options()).toMatchObject({
        kids: [{ loggerName: 'rootKid' }, { loggerName: 'unstable_newApi_Kid' }],
      })
    })

    it(`adds the instance kids to kids array`, () => {
      expect(
        l.options({
          kids: [{ loggerName: 'added_instance_Kid1' }, { loggerName: 'added_instance_Kid2' }],
        }).options()
      ).toMatchObject({
        kids: [
          { loggerName: 'rootKid' },
          { loggerName: 'unstable_newApi_Kid' },
          { loggerName: 'added_instance_Kid1' },
          { loggerName: 'added_instance_Kid2' },
        ],
      })
    })

    it(`with "null" as the "kids" value, it is discarding previous inherited kids, making kids null`, () => {
      expect(l.options({ kids: null }).options()).toMatchObject({
        kids: null,
      })
    })

    it(`with a null inside "kids" Array, its discarding previous inherited kids, keeping only kids on instance`, () => {
      expect(
        l.options({
          kids: [
            null,
            { loggerName: 'only_kept_instance_Kid1' },
            { loggerName: 'only_kept_instance_Kid2' },
          ],
        }).options()
      ).toMatchObject({
        kids: [
          { loggerName: 'only_kept_instance_Kid1' },
          { loggerName: 'only_kept_instance_Kid2' },
        ],
      })
    })
  })

  describe('`options refresh properly, when needed only', () => {
    let l: LogZen
    beforeEach(() => {
      resetDefaults()
      l = new LogZen({
        overrideAbsolutePath: '/unstable/newApi/emergencyBuggyCode',
        overrideCWD: '/',
      })
      const options: Options = {
        // @todo: name: 'FooBarModuleWithAnEmergency',
        debugLevel: 60,
        header: { resolvedFromCall: false },
        logLevel: 'warn',
        colors: true,
      }
      const options2: Options = {
        debugLevel: 70,
        logLevel: 'silly',
        colors: false,
      }
      LogZen.updateLogPathOptions({ 'unstable/newApi/emergencyBuggyCode': options })
      LogZen.updateLogPathOptions({ '/unstable/newApi/emergencyBuggyCode/': options2 })
    })

    it(`with updateLogPathOptions(), pathOptions have blended & updated properly on LogZen class`, () => {
      expect((LogZen as any)._logPathOptions).toMatchObject({
        unstable: {
          newApi: {
            emergencyBuggyCode: {
              [PATHS_OPTIONS_KEY]: {
                debugLevel: 70,
                header: { resolvedFromCall: false },
                logLevel: 'silly',
                colors: false,
              },
            },
          },
        },
      })
    })

    it(`after updateLogPathOptions(), internal private options have not yet refreshed on instance`, () => {
      expect((l as any)._options).toMatchObject(testDefaultOptions)
    })

    it(`after updateLogPathOptions(), internal options refresh on first logging`, () => {
      output = stdout.inspectSync(() => {
        result = l.silly(`options refresh on first logging`)
      })

      expect((l as any).options()).toMatchObject({
        logLevel: 'silly',
        colors: false,
      })

      expect(output).toEqual([
        '[SILLY|unstable/newApi/emergencyBuggyCode]: options refresh on first logging\n',
      ])
    })
  })
})
