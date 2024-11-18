import * as upath from 'upath'
import * as _ from 'lodash'
import { stderr, stdout } from 'test-console'
import { type } from '@neozen/zendash'

// local
import { inspect } from '../code/inspect'
import { pathReplacementDepth, resetDefaults } from './test-defaultOptions'
import { LogZen, ELogLevel } from '../code'

const thisFileRelativeFilename = upath
  .relative(process.cwd(), upath.trimExt(__filename))
  .split('/')
  .slice(pathReplacementDepth) // remove src/ cause we have a replacePath for it!
  .join('/')

describe('Inspect printing', () => {
  beforeEach(() => resetDefaults())

  let output
  let result

  const anObject: any = {
    anUndefined: undefined,
    anArrowFunction: () => null,
    aFunction: function fname() {},
    asyncFunction: async () => {},
    anRegExp: /([^"+fo{}])/g,
    anArray: [
      {
        nested: 42,
      },
      43,
      'foo',
      undefined,
      '/([^"+fo{}])/g',
      function fname2() {},
    ],
  }

  anObject.circular = anObject
  anObject.anArray.push(anObject)

  const anObjectString = `<ref *1> {
  anUndefined: undefined,
  anArrowFunction: [Function: anArrowFunction],
  aFunction: [Function: fname],
  asyncFunction: [AsyncFunction: asyncFunction],
  anRegExp: /([^"+fo{}])/g,
  anArray: [ { nested: 42 }, 43, 'foo', undefined, '/([^"+fo{}])/g', [Function: fname2], [Circular *1] ],
  circular: [Circular *1]
}`

  describe('basic features', () => {
    it('prints .error on stderr only', () => {
      const l3 = new LogZen({
        logLevel: ELogLevel.error,
        colors: false,
      })

      const errOutput = stderr.inspectSync(() =>
        l3.error('Some error', { error: 'foobar error' })
      )
      expect(errOutput).toEqual([
        `[ERROR|${thisFileRelativeFilename}]: Some error { error: 'foobar error' }\n`,
      ])

      const stdOutput = stdout.inspectSync(() =>
        l3.error('error printed on console.error', { foo: 'bar7' })
      )
      expect(stdOutput).toEqual([])
    })

    it('By default it prints with colors', () => {
      const cl = new LogZen()
      output = stdout.inspectSync(() =>
        cl.info('msg8', {
          foo: 'bar8',
          number: 23,
        })
      )
      expect(output).toEqual([
        `[\x1B[90mINFO\x1B[39m|\x1B[90m\x1B[7m__tests__/LogZen-simple-printing.spec\x1B[27m\x1B[39m]: \x1B[90mmsg8\x1B[39m { foo: \x1B[32m'bar8'\x1B[39m, number: \x1B[33m23\x1B[39m }\n`
      ])
    })

    it('prints on console with inspect and returns the args passed', () => {
      const l = new LogZen({ colors: false })
      const fooBar = { foo: 'bar' }
      output = stdout.inspectSync(() => {
        result = l.warn('the message', fooBar)
      })

      expect([output, result]).toEqual([
        [`[WARN|${thisFileRelativeFilename}]: the message { foo: 'bar' }\n`],
        [`the message`, { foo: 'bar' }],
      ])

      expect(result[1]).toBe(fooBar)
    })

    it('strips & preserves new lines before 1st message arg', () => {
      const l = new LogZen({
        colors: false,
      })
      output = stdout.inspectSync(() => {
        l.log('\n\n\nthe 1st message', '\nanother message', { foo: 'bar' })
        l.debug('\n\nthe 1st message', '\n\n\nanother message', {
          foo: 'bar',
        })
        l.info('\n\n\nthe 1st message', '\nanother message', { foo: 'bar' })
      })

      expect(output).toEqual([
        `\n\n\n[LOG|${thisFileRelativeFilename}]: the 1st message \nanother message { foo: 'bar' }\n`,
        `\n\n[DEBUG:?0|${thisFileRelativeFilename}]: the 1st message \n\n\nanother message { foo: 'bar' }\n`,
        `\n\n\n[INFO|${thisFileRelativeFilename}]: the 1st message \nanother message { foo: 'bar' }\n`,
      ])
    })
  })

  describe(`Prints only on allowed levels`, () => {
    _.each(
      // prettier-ignore
      [
        ELogLevel.info, // number 7
        '7',
        ELogLevel[ELogLevel.info], // 'info'
        'InfO', // case insensitive
      ],

      (logLevel: any) =>
        it(`prints only on allowed logLevel, which can be numeric or text (${inspect(
          logLevel
        )})`, () => {
          const infoLog = new LogZen({
            logLevel,
            colors: false,
          })

          output = stdout.inspectSync(() => infoLog.verbose('msg', { foo: 'bar' }))
          expect(output).toEqual([])

          output = stdout.inspectSync(() => infoLog.info('msg1', { foo: 'bar1' }))
          expect(output).toEqual([`[INFO|${thisFileRelativeFilename}]: msg1 { foo: 'bar1' }\n`])

          output = stdout.inspectSync(() => infoLog.warn('msg2', { foo: 'bar2' }))
          expect(output).toEqual([`[WARN|${thisFileRelativeFilename}]: msg2 { foo: 'bar2' }\n`])
        })
    )

    _.each(['DEBUG', undefined], (level) =>
      it(`defaults to 'debug' for undefined`, () => {
        const ll = new LogZen({ colors: false, logLevel: level as any })

        output = stdout.inspectSync(() => ll.debug('wrong_logLevel', { foo: 'bar3' }))
        expect(output).toEqual([
          `[DEBUG:?0|${thisFileRelativeFilename}]: wrong_logLevel { foo: 'bar3' }\n`,
        ])

        output = stdout.inspectSync(() => ll.trace('wrong_logLevel', { foo: 'bar4' }))
        expect(output).toEqual([])
      })
    )

    _.each([ELogLevel.NONE, 'NONE', 'none', 'NoNe'], (level) =>
      it(`prints nothing with console level ${level}`, () => {
        const ll = new LogZen({ logLevel: level as any })

        output = stdout.inspectSync(() => ll.fatal('msg5', { foo: 'bar5' }))
        expect(output).toEqual([])

        output = stdout.inspectSync(() => ll.info('msg6', { foo: 'bar6' }))
        expect(output).toEqual([])
      })
    )
  })

  describe('Printing different values', () => {
    let l
    beforeAll(() => {
      l = new LogZen({
        colors: false,
      })
    })

    _.each(
      [
        { input: 'a string', expected: 'a string' },
        { input: '', expected: '' },

        { input: () => null, expected: '[Function: input]' },
        { input: async () => null, expected: '[AsyncFunction: input]' },

        {
          input: 42.314,
          expected: '42.314',
        },
        {
          input: null,
          expected: 'null',
        },
        {
          input: undefined,
          expected: 'undefined',
        },
        {
          input: true,
          expected: 'true',
        },
        {
          input: /([^"+b{}])/g,
          expected: '/([^"+b{}])/g',
        },
        {
          input: function aFunction() {},
          expected: '[Function: aFunction]',
        },
        {
          input: (() => {
            const aSet = new Set()
            aSet.add({ foo: 'fooVal' })
            return aSet
          })(),
          expected: `Set(1) { { foo: 'fooVal' } }`,
        },
        {
          input: (() => {
            const aMap = new Map()
            aMap.set('aMapKey1', { foo: 'fooVal' })
            return aMap
          })(),
          expected: `Map(1) { 'aMapKey1' => { foo: 'fooVal' } }`,
        },
        {
          input: anObject,
          expected: anObjectString,
        },
      ],
      ({ input, expected }) =>
        it(`it outputs '${type(input)}' as : ${expected}`, () => {
          output = stdout.inspectSync(() => {
            l.warn(input)
          })
          expect(output[0]).toEqual(`[WARN|${thisFileRelativeFilename}]: ${expected}\n`)
        })
    )
  })
})
