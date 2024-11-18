import { TSpecHandlerFunction } from '@neozen/speczen'
import { ValidZenValidator } from '../../code/OrAnd'
import { ValidZenValidationError } from '../../code/types'
import { internalNodeUtilInspect } from '../../code/utils/internalNodeUtilInspect'
import { getTinyLog } from '../../code/utils/tiny-log'

export type getValidationErrorsString_SpecHandler_type = {
  description: string
  testOptions: { tinyLog: boolean }
  input: ValidZenValidationError[] | ValidZenValidator[]
  expected: string
}

export const genericValidZenInputExpected_SpecHandler: TSpecHandlerFunction<
  getValidationErrorsString_SpecHandler_type
> = ({
  testRunner: { it, headerFull },
  specData: {
    description,
    testOptions: { tinyLog },
    input,
    expected,
  },
}) => {
  const _log = getTinyLog(tinyLog, 'genericValidZenInputExpected_SpecHandler')

  headerFull(() => {
    it(`Converts input ${internalNodeUtilInspect(input)} \n  to  \n${expected}`, () => {
      _log(`${description}} input = `, input, '\n\nexpected:\n', expected)
      expect(input).toEqual(expected)
    })
  })
}
