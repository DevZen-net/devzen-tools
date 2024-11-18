import { executeSuiteOnHandlers, ONLY, SKIP, SUITE } from '@neozen/speczen'
import { wrappedPropertyDecorators_ClassValidator_SUITE } from './wrappedPropertyDecorators-ClassValidator.SUITE'
import { getValidationErrorsString_SUITE } from './getValidationErrorsString.SUITE'
import { getValidatorsTypes_SUITE } from './getValidatorsTypes_SUITE'
import { LogZenFakeOptionsValidation_SpecHandler } from './specHandlers/LogZenFakeOptionsValidation.SpecHandler'
import { LogZenFakeOptionsValidation_SUITE } from './LogZenFakeOptionsValidation.SUITE'
import { genericValidZenInputExpected_SpecHandler } from './specHandlers/genericValidZenInputExpected.SpecHandler'
import { wrappedPropertyDecorators_ValidZen_SUITE } from './wrappedPropertyDecorators-ValidZen.SUITE'
import { ValidZen_GenericValidation_SpecHandler } from './specHandlers/ValidZen_Generic.SpecHandler'
import { OrAnd_SUITE } from './OrAnd.SUITE'

executeSuiteOnHandlers(
  {
    LogZenFakeOptionsValidation_SpecHandler,
    ValidZen_GenericValidation_SpecHandler,
  },

  SUITE('Root Suite', [
    LogZenFakeOptionsValidation_SUITE,
    SUITE(
      {
        specHandlers: genericValidZenInputExpected_SpecHandler,
        columns: ['description', 'testOptions', 'input', 'expected'],
      },
      [getValidationErrorsString_SUITE, getValidatorsTypes_SUITE]
    ),
    SUITE(
      {
        specHandlers: 'ValidZen_GenericValidation_SpecHandler',
        columns: [
          'description', // string
          'testOptions', // ValidZen_GenericValidation_SpecHandler.testOptions
          'instanceOrPlainObjectAndClassOrValidateFn', // InstanceType<any> | [Record<string, any>, ClassType<any>]  | (() => any)
          'expectedErrors?', // string
        ],

        specDataTransformer: {
          testOptions: {
            // act as testOptions defaults
            tinyLog: false,
            isStrictErrorDescriptionAllLines: true,
            isStrictIndentation: true,
          },
        },
      },
      [
        OrAnd_SUITE,
        wrappedPropertyDecorators_ClassValidator_SUITE,
        wrappedPropertyDecorators_ValidZen_SUITE,
      ]
    ),
  ]),
  {
    showSkipped: false,
    testRunnerKit: 'JEST',
    nestingLevel: 0, // @todo: nesting level gets deeper than needed, in simple "grouping" SUITES
  }
)
