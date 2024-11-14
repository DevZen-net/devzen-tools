// @-ts-nocheck
/*{ @common-imports-in-tests-templates }*/

describe('Singles/Primitives', () => {
  const inputTitle = `string` // just for title
  describe(inputTitle, () => {
    const getInputVanilla = () => 'some string'
    const getInputWithExtraCommonProps = () => 'some other string'

    /*{ @primitives-props-values }*/
    /*{ @all-typings-tests-vanilla }*/
    /*{ @all-typings-tests-options-wrong }*/
  })
})
