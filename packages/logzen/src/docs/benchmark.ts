import * as c from 'ansi-colors'
import * as _ from 'lodash'
import { Options, LogZen } from '../code'

const l = new LogZen()

const benchmarkIterations = 100 * 1000
const clearScreen = true

interface IBenchSuite {
  title: string
  logZenOptions: Options
  results: {
    consoleLogDuration?: number
    logZenDuration?: number
  }
}
const benchSuites: IBenchSuite[] = [
  {
    title: 'inspect: false (interpolation via console.log), console output',
    logZenOptions: { inspect: false, output: 'console' },
    results: {},
  },
  {
    title: 'inspect ON (no interpolation), console output',
    logZenOptions: { output: 'console' },
    results: {},
  },
  {
    title: 'inspect: false (interpolation via console.log), std output',
    logZenOptions: { inspect: false, output: 'std' },
    results: {},
  },
  {
    title: 'inspect ON (no interpolation), std output',
    logZenOptions: { output: 'std' },
    results: {},
  },
]

l.clearScreen()

const obj = { has: [43, { great: 'features' }] }
_.each(benchSuites, (suite) => {
  l.warn('\n\n##### Benchmark:', suite.title, '#####')

  l.info('\n\n##### console.log #####')
  l.timer()
  for (let i = 0; i < benchmarkIterations; i++) {
    console.log(
      'LOG (dist/docs/benchmark): %d +%d for %s that %o to help debugging.',
      i,
      10,
      'LogZen',
      obj,
      'It as so many goodies',
      { foo: 'bar' }
    )
  }
  const consoleLogDuration = l.timerEnd()
  if (clearScreen) l.clearScreen()

  // LogZen
  const l_bench = new LogZen(suite.logZenOptions)

  l.info('\n\n##### logzen.log #####')
  l.timer()
  for (let i = 0; i < benchmarkIterations; i++) {
    l_bench.log(
      '%d +%d for %s that %o to help debugging.',
      i,
      10,
      'LogZen',
      obj,
      'It as so many goodies',
      { foo: 'bar' }
    )
  }
  const logZenDuration = l.timerEnd()
  if (clearScreen) l.clearScreen()

  suite.results.consoleLogDuration = consoleLogDuration
  suite.results.logZenDuration = logZenDuration
})

l.log('\n\n##### Benchmark results - iterations:', benchmarkIterations, '#####')
_.each(benchSuites, ({ title, logZenOptions, results }) => {
  const { consoleLogDuration, logZenDuration } = results

  l.log('\n\n##### Benchmark:', title, ', options =', logZenOptions)
  l.ok('console.log took:', consoleLogDuration.toLocaleString('en-US'), 'ms')
  l.ok('logZen .log took:', logZenDuration.toLocaleString('en-US'), 'ms')

  const diffPercent = ((logZenDuration - consoleLogDuration) / consoleLogDuration) * 100

  l.ok(
    `LogZen l.log is ${Math.abs(diffPercent).toFixed(2)}% ${
      diffPercent > 0 ? c.red('slower') : c.green('faster')
    } than console.log`
  )
})
