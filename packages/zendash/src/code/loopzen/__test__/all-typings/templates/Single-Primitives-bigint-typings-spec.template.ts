// @-ts-nocheck
/*{ @common-imports-in-tests-templates }*/

describe('Singles/Primitives', () => {
  const inputTitle = `Bigint` // just for title
  describe(inputTitle, () => {
    const getInputVanilla = () => 123n
    const getInputWithExtraCommonProps = () => BigInt(456n)

    /*{ @primitives-props-values }*/
    /*{ @all-typings-tests-vanilla }*/
    /*{ @all-typings-tests-options-wrong }*/
  })
})
