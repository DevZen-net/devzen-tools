// @-ts-nocheck
import { symbolProp, symbolProp2 } from '../../../../../test-utils/test-data'
/*{ @common-imports-in-tests-templates }*/

describe('Singles/Primitives', () => {
  const inputTitle = `symbol` // just for title
  describe(inputTitle, () => {
    const getInputVanilla = () => symbolProp
    const getInputWithExtraCommonProps = () => symbolProp2

    /*{ @primitives-props-values }*/
    /*{ @all-typings-tests-vanilla }*/
    /*{ @all-typings-tests-options-wrong }*/
  })
})
