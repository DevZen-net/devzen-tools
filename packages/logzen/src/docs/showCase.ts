import * as _ from 'lodash'
import { LogZen, ELogLevel } from '../code'
import { delaySecs } from './utils/test.utils'

// make some of src/docs/media
;(async () => {
  const obj: any = {
    withNested: async () => {},
    arrays: [
      1,
      2,
      {
        'with configurable': {
          depth: { 'and display rules': { of: { nested: class Props {} } } },
          colors: { on: { header: { and: { 'all values ': /.iamreexp/i } } } },
          and: 'more',
        },
        'The header': 'prints filename it was created and/or called from, but this can change!',
      },
    ],
  }
  obj.circular = obj

  const l = new LogZen({
    inspect: {
      breakLength: 100,
    },
    debugLevel: 10,
  })
  l.table(
    'LogZen pretty prints anything, like numbers',
    42,
    'and objects',
    obj,
    [{ even: 'with', tables: 'tabular data' }],
    ['even', 'tables']
  )

  // /////////////////////////////////////////////////////////////////////////////////////////////
  l.options({
    loggerName: 'ShowCase',
    header: { lineNumber: true, time: true, date: true },
  })
  l.timer()
  await delaySecs(0.1)
  l.warn(
    'LogZen has',
    _.size(ELogLevel) / 2 - 1,
    'Log Levels with distinct colors',
    {
      'and a Customisable': {
        '*** HEADER ***': {
          with: [
            '- Date + Time it was printed',
            '- LogLevel (method) that was used',
            '- the Timer in ms (how long it took since `l.timer()`)',
            '- Custom "ShowCase" name, instead of default filename',
            '- Line Number',
            '...and more',
          ],
        },
      },
    },
    '\n'
  )

  // /////////////////////////////////////////////////////////////////////////////////////////////
  l.options({
    loggerName: 'ShowCase Debug',
    inspect: {
      breakLength: 52,
    },
    header: {
      lineNumber: true,
      date: false,
      time: false,
    },
  })
  l.debug(
    10,
    `Debug has its own 'debugLevel'`,
    10,
    `next to LogLevel`,
    { trust: { me: { you: 'will love it!' } } },
    `\n`
  )

  // /////////////////////////////////////////////////////////////////////////////////////////////
  l.options({
    loggerName: `This 'loggerName' can be inferred from filename, or be custom!`,
    header: false,
    output: [
      'consoleJSON',
      { logInfo: ['relativePath', 'date', 'loggerName', 'resolvedName'] },
    ],
  })
  l.info(`LogZen can trivially print as JSON or into a file (or anything else)`, {
    'with loads': 'of "logInfo" meta data',
  })
})().catch((err) => console.error('Error in async function:', err))

// Shows the strong typing capabilities, if you have the right IDE:
if (1 === 1 + 1) {
  const l = new LogZen({ debugLevel: 10 })
  const { debug, debug1, ok, ok1 } = l

  const r1 = l.debug1(14) // returns never / throws error
  const r2 = l.debug1('foo', 'bar') // returns 'bar'
  const r3 = l.debug1(10, 'foo') // returns 'foo'
  const r4 = debug1(10, 'foo') // returns 'foo'

  const r5 = debug(5) // returns boolean (true) & remembers debugLevel for next call
  const r6 = l.debug('foo', 123, {}) // returns ['foo', 123, {}]
  const r7 = l.debug(5, 'bar') // returns ['bar']
  const r8 = l.debug(5) // returns boolean (true) & remembers debugLevel for next call

  const o1 = l.ok('info1', 'info2', 'info3') // returns ['info1', 'info2', 'info3']
  const o2 = ok('info1', 'info2', 'info3') // returns ['info1', 'info2', 'info3']
  const o3 = l.ok1(10) // returns 10
  const o4 = ok1(10, 'some ok') // returns 'some ok'
  const o5 = l.ok1(10, 'some ok', 'more ok') // returns 'more ok'
  const o6 = ok1(10, 'some ok', '4222', 'more ok', 20) // returns 20
}
