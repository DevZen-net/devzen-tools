import * as _ from 'lodash'
import * as upath from 'upath'
import { stdout } from 'test-console'
import { getProp } from '@devzen/zendash'

// local
import { LogZen, getTinyLog } from '../code'
import { ELogLevel, PATHS_OPTIONS_KEY } from '../code/types'
import { test_LogZenCreatedInSomeFile } from './test_LogZenCreatedInSomeFile'
import {
  test_LogZenDebugCalledInSomeFile,
  test_LogZenInfoCalledInSomeFile,
} from './test_LogZenCalledInSomeFile'
import { pathReplacementDepth, resetDefaults } from './test-defaultOptions'

const thisFileRelativeFilename = upath.relative(process.cwd(), upath.trimExt(__filename))

const thisFileRelativeFilenameWithReplacedPaths = upath
  .relative(process.cwd(), upath.trimExt(__filename))
  .split('/')
  .slice(pathReplacementDepth) // remove src/ cause we have a replacePath for it!
  .join('/')

const _log = getTinyLog(false, thisFileRelativeFilename)

describe('LogZen Head & Paths:', () => {
  let output

  beforeAll(() => resetDefaults())

  describe('Relative fileName where it was created:', () => {
    const l2 = new LogZen({
      logLevel: ELogLevel.info,
      colors: false,
    })
    it('in this file', () => {
      output = stdout.inspectSync(() => l2.info('message'))
      // console.log(output)
      expect(output).toEqual([`[INFO|${thisFileRelativeFilenameWithReplacedPaths}]: message\n`])
    })

    it('some other file', () => {
      output = stdout.inspectSync(() =>
        test_LogZenCreatedInSomeFile(
          'Print this text using LogZen, in an new instance created in some other file'
        )
      )
      expect(output).toEqual([
        `[INFO|${test_LogZenCreatedInSomeFile.relativeFilename}]: Print this text using LogZen, in an new instance created in some other file\n`,
      ])
    })
  })

  describe('Argument passed on constructing:', () => {
    it('1st argument', () => {
      const l2 = new LogZen({
        loggerName: 'My Custom LogZen',
        colors: false,
      })

      output = stdout.inspectSync(() => l2.debug('message'))
      expect(output).toEqual(['[DEBUG:?0|My Custom LogZen]: message\n'])
    })

    it('as logPath in options', () => {
      const l2 = new LogZen({
        loggerName: 'My Options LogZen',
        colors: false,
      })
      output = stdout.inspectSync(() => l2.info('My Options LogZen message'))
      expect(output).toEqual([`[INFO|My Options LogZen]: My Options LogZen message\n`])
    })
  })

  describe('LogZen.updateLogPathOptions()', () => {
    describe('replaces any [~] used in the logPath, with the calling relative filepath', () => {
      beforeEach(() => resetDefaults())
      const optionsAtLogPath = {
        debugLevel: 99,
        logLevel: ELogLevel.silly,
        colors: false,
      }
      _.each(
        [
          ['[~]', thisFileRelativeFilename],
          ['/[~]', thisFileRelativeFilename],
          ['[~]/', thisFileRelativeFilename],
          ['/[~]/', thisFileRelativeFilename],
          ['/[~]/..', upath.join(thisFileRelativeFilename, '..')],
          ['/[~]/..//', upath.join(thisFileRelativeFilename, '..')],
          ['[~]/foo', `${thisFileRelativeFilename}/foo`],
          ['/[~]/bar', `${thisFileRelativeFilename}/bar`],
          ['/[~]/bar/', `${thisFileRelativeFilename}/bar`],
          ['foo/[~]/bar', `/foo/${thisFileRelativeFilename}/bar`],
          ['/foo/[~]/bar', `/foo/${thisFileRelativeFilename}/bar`],
          ['/foo/[~]/bar/', `/foo/${thisFileRelativeFilename}/bar`],
        ],
        ([logPath, expectedPath]) => {
          it(`works with logPath: "${logPath}" => resolves to "${expectedPath}"`, () => {
            LogZen.updateLogPathOptions({ [logPath]: optionsAtLogPath })
            // _log( {thisFileRelativeFilename, expectedPath}, (LogZen as any)._logPathOptions,)
            expect(
              getProp((LogZen as any)._logPathOptions, `${expectedPath}/${PATHS_OPTIONS_KEY}`)
            ).toMatchObject(optionsAtLogPath)
          })
        }
      )
    })

    describe('can use logPathReplacements as part of the logPath', () => {
      beforeEach(() => {
        resetDefaults()
        LogZen.addPathReplacements({ 'src/__tests__': 'Source Tests' })
      })
      const optionsAtLogPath = {
        debugLevel: 99,
        logLevel: ELogLevel.silly,
        colors: true,
      }
      _.each(
        [
          ['Source Tests', 'src/__tests__'],
          ['Source Tests@', 'src/__tests__'],
          ['Source Tests@/', 'src/__tests__'],
          ['Source Tests@/foo', 'src/__tests__/foo'],
          ['Source Tests@/foo/', 'src/__tests__/foo'],
        ],
        ([logPath, expectedPath]) => {
          it(`works with logPath: "${logPath}" => resolves to "${expectedPath}"`, () => {
            LogZen.updateLogPathOptions({ [logPath]: optionsAtLogPath })
            _log({ thisFileRelativeFilename, expectedPath }, (LogZen as any)._logPathOptions)
            expect(
              getProp((LogZen as any)._logPathOptions, `${expectedPath}/${PATHS_OPTIONS_KEY}`)
            ).toMatchObject(optionsAtLogPath)
          })
        }
      )
    })
  })

  describe('Can optionally print filename it was called from:', () => {
    let llfc
    beforeEach(() => {
      resetDefaults()

      llfc = new LogZen({
        header: { resolvedFromCall: true },
        colors: false,
        logLevel: ELogLevel.debug,
      })
    })

    it('This file, omitted cause its the same', () => {
      const message = 'This file, omitted cause its the same'
      output = stdout.inspectSync(() => llfc.info(message))
      expect(output).toEqual([
        `[INFO|${thisFileRelativeFilenameWithReplacedPaths}]: ${message}\n`,
      ])
    })

    describe('Called from some other file', () => {
      describe('if header:{ resolvedFromCall: true}', () => {
        it('We get that other file on header if different', () => {
          output = stdout.inspectSync(() => test_LogZenInfoCalledInSomeFile('some text', llfc))
          expect(output).toEqual([
            `[INFO|${thisFileRelativeFilenameWithReplacedPaths}|=> ${test_LogZenInfoCalledInSomeFile.relativeFilename}]: some text\n`,
          ])
        })

        it('.debug() - complicated call stack', () => {
          output = stdout.inspectSync(() =>
            test_LogZenDebugCalledInSomeFile('some debug text in other file', llfc)
          )

          expect(output).toEqual([
            `[DEBUG:?0|${thisFileRelativeFilenameWithReplacedPaths}|=> ${test_LogZenInfoCalledInSomeFile.relativeFilename}]: some debug text in other file\n`,
          ])
        })
      })
    })
  })
})
