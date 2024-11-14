import * as upath from 'upath'
import * as _ from 'lodash'
import { stdout } from 'test-console'

// local
import { pathReplacementDepth, resetDefaults } from './test-defaultOptions'
import { LogZen } from '../code'

// const _log = getTinyLog(false, 'LogZen-spec')

const thisFileRelativeFilename = upath
  .relative(process.cwd(), upath.trimExt(__filename))
  .split('/')
  .slice(pathReplacementDepth) // remove src/ cause we have a replacePath for it!
  .join('/')

describe('Will print with .willXXX, debug() & debugLevel:', () => {
  beforeAll(() => resetDefaults())
  let result
  let output

  describe('willXXX', () => {
    it(`returns true if options.logLevel allows, false otherwise`, () => {
      let l = new LogZen()
      expect(l.willLog()).toBe(true)
      expect(l.willDebug()).toBe(true)
      expect(l.willDebug(0)).toBe(true)
      expect(l.debug(0)).toBe(true)
      expect(l.willDebug(1)).toBe(false)
      expect(l.willSilly()).toBe(false)

      l = new LogZen({ logLevel: 'SiLlY' as any, debugLevel: 20 })
      expect(l.willSilly()).toBe(true)
      expect(l.willDebug(20)).toBe(true)
      expect(l.debug(20)).toBe(true)
      expect(l.willDebug(21)).toBe(false)

      l = new LogZen({ logLevel: 'waRN' as any, debugLevel: 50 })
      expect(l.willError()).toBe(true)
      expect(l.willWarn()).toBe(true)
      expect(l.willLog()).toBe(false)
      expect(l.willDebug()).toBe(false)
      expect(l.willDebug(50)).toBe(false)
      expect(l.debug(50)).toBe(false)
      expect(l.willDebug(0)).toBe(false)

      l = new LogZen({ logLevel: 'noNe' as any })
      expect(l.willError()).toBe(false)
      expect(l.willWarn()).toBe(false)
    })
  })

  describe('debug() & debugLevel:', () => {
    describe('Default instance has implicit debugLevel = 0', () => {
      let l
      beforeAll(() => {
        l = new LogZen({ colors: false })
      })
      it('prints debug() - debugLevel defaults to 0)', () => {
        output = stdout.inspectSync(() => (result = l.debug('default debug()')))

        expect([output, result]).toEqual([
          [`[DEBUG:?0|${thisFileRelativeFilename}]: default debug()\n`],
          [`default debug()`],
        ])
      })

      it('prints debug(0, ...)', () => {
        output = stdout.inspectSync(() => (result = l.debug(0, 'testing default debug(0)')))
        expect([output, result]).toEqual([
          [`[DEBUG:0|${thisFileRelativeFilename}]: testing default debug(0)\n`],
          [`testing default debug(0)`],
        ])
      })

      _.each([1, 2], (level) =>
        it(`Does NOT print debug(${level}) for level >= 1 & returns false`, () => {
          output = stdout.inspectSync(
            () => (result = l.debug(level, `testing default debug(${level})`))
          )

          expect([output, result]).toEqual([[], [`testing default debug(${level})`]])
        })
      )
    })

    describe(`debugLevel checks\n`, () => {
      let l
      beforeAll(() => {
        resetDefaults()
        l = new LogZen({
          loggerName: 'loggerName',
          header: {
            resolvedName: true,
          },
          colors: false,
          debugLevel: 30,
        })
      })

      _.each(
        [
          [0, true],
          [1, true],
          [30, true],
          [31, false],
        ],
        ([level, expectedResult]) => {
          describe(`Single debugLevel check i.e .debug(level = ${level}) - expectedResult is ${expectedResult}.`, () => {
            // describe(`Returns ${expectedResult} for ded(${level}) & doesnt print`, () => {
            beforeAll(() => {
              output = stdout.inspectSync(() => {
                result = l.debug(level)
              })
            })
            it(`checks debugLevel & returns boolean check result (${expectedResult} for ded(${level}))`, () => {
              expect(result).toBe(expectedResult)
            })
            it(`doesnt print, ${
              expectedResult ? 'even if check yielded true' : 'check yielded false anyway'
            }`, () => {
              expect(output).toEqual([])
            })
            describe(`remembers debugLevel check for all subsequent debugLevel-less .debug calls (so we can nest many debug after a single check)`, () => {
              const debugMsg1 = `debugLevel-less call #1, after having a .debug(${level})`
              const debugMsg2 = `debugLevel-less call #2, after having a .debug(${level})`
              beforeAll(() => {
                output = stdout.inspectSync(() => {
                  result = [l.debug(debugMsg1, 13)]
                  result.push(l.debug(debugMsg2, 42))
                })
              })
              if (expectedResult) {
                it(`with expectResults === true, its prints twice as "[DEBUG:!${level}]"`, () => {
                  expect([result, output]).toEqual([
                    [
                      [debugMsg1, 13],
                      [debugMsg2, 42],
                    ],
                    [
                      `[DEBUG:!${level}|loggerName|${thisFileRelativeFilename}]: debugLevel-less call #1, after having a .debug(${level}) 13\n`,
                      `[DEBUG:!${level}|loggerName|${thisFileRelativeFilename}]: debugLevel-less call #2, after having a .debug(${level}) 42\n`,
                    ],
                  ])
                })
              } else {
                it(`with expectResults === false, it doesnt print a single time for twice called`, () =>
                  expect([result, output]).toEqual([
                    [
                      [debugMsg1, 13],
                      [debugMsg2, 42],
                    ],
                    [],
                  ]))
              }
            })
          })

          describe(`With debugLevel check & printable messages - i.e debug(${level}, ...)`, () => {
            it(`with debugLevel check & passes with for debug(${level})`, () => {
              output = stdout.inspectSync(() => {
                result = [l.debug(level, `testing default debug(${level})`)]
                result.push(l.debug(level, `testing default debug(${level})`))
              })

              expect([result, output]).toEqual([
                [[`testing default debug(${level})`], [`testing default debug(${level})`]],
                expectedResult
                  ? [
                      `[DEBUG:${level}|loggerName|${thisFileRelativeFilename}]: testing default debug(${level})\n`,
                      `[DEBUG:${level}|loggerName|${thisFileRelativeFilename}]: testing default debug(${level})\n`,
                    ]
                  : [],
              ])
            })
          })
        }
      )
    })
  })
})
