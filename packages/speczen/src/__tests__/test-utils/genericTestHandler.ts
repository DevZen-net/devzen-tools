import * as _ from 'lodash'
import * as _f from 'lodash/fp'
import { getTinyLog } from '../../code/utils/tiny-log'

export const resultSpecFromTitles = (
  specHandlerToExecutableSpecs: Record<string, string[]>
) => {
  return {
    inlineSpecHandlers: {},
    executableSpecsPerHandler: {
      ..._.mapValues(specHandlerToExecutableSpecs, (executableSpec) =>
        _.map(executableSpec, (specTitle) => ({
          specData: { descr: specTitle },
          isVisible: true,
        }))
      ),
    },
  }
}

export const titlesFromResultSpec = (resultSpec: any) =>
  _.mapValues(resultSpec, (handlerName) =>
    _.map(handlerName, _f.get('spec.title'))
  )

export const defaultSUITEOptions = {
  columns: ['descr'],
  title: 'defaultSuiteTitle',
  specHandlers: 'defaultSpecHandler',
  specDataTransformer: _.identity,
  // expectedTransform: _.identity, // NOT IMPLEMENTED YET
  // resultTransform: _.identity,
}

export const genericTestHandler = (
  title: string, // of genericTestHandler pseudo-suite
  {
    // options for whole genericTestHandler pseudo-suite ;-)
    tinyLog = false,
    resultAndExpectedPreprocess = _.identity,
  }: {
    tinyLog?: boolean
    resultAndExpectedPreprocess?: (any) => any
  } = {},
  tests: // i.e pseudo-specs
  (
    | [
        string, // pseudo-spec description
        () => Record<string, any>, // function that calls SUITE to get result (eg create a SuiteCmd, or generateSpecs etc)
        (
          | string // Error msg / throws!
          | Record<string, any>
        ), // expected Object (a concrete SuiteCmd, generatedSpecs etc)

        // pseudo-Spec options
        {
          tinyLogTest?: boolean
          resultAndExpectedPreprocessTest?: (any) => any
        }?,
      ]
    // run or not?
    | boolean
  )[]
) => {
  describe(`${title}`, () => {
    describe.each(tests.filter((t) => !!t) as any)(
      ``,
      (
        description: string,
        getResultFn,
        expected,
        { tinyLogTest, resultAndExpectedPreprocessTest } = {}
      ) => {
        if (resultAndExpectedPreprocessTest)
          resultAndExpectedPreprocess = resultAndExpectedPreprocessTest
        if (tinyLogTest) tinyLog = tinyLogTest

        const _log = getTinyLog(tinyLog, 'genericTestHandler')

        it(`${description}:`, async () => {
          if (_.isString(expected)) {
            // ERROR to match!
            _log(`${description}: THROWS`, '\n\nexpected Error:\n', expected)
            expect(() => getResultFn()).toThrow(expected)
          } else {
            // Object to Match
            const result = getResultFn()

            // prettier-ignore
            _log(`${description}:`, '\n\nexpected:\n', resultAndExpectedPreprocess(expected), `\n\nresult:\n`, resultAndExpectedPreprocess(result))
            // _log(`${description}:`, `\nresult:\n`, resultAndExpectedPreprocess(result))

            expect(result).toMatchObject(expected)
          }
        })
      }
    )
  })
}
