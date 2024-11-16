// @ts-nocheck @todo(222): fix this!

/*{ @common-imports-in-tests-templates }*/

describe('unknown (null posing as unknown)', () => {
  const inputTitle = `null as unknown` // just for title
  describe(inputTitle, () => {
    const getInputVanilla = () => null as unknown
    const getInputWithExtraCommonProps = () => null as unknown

    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    const isInspectableNested = false // Map, Set, Array etc have NestedKeys that can be iterated, without affecting value - set this to `true`. On the other hand `Set.entries()`, `Map.entries()` and other Iterators/AsyncGenerators can't get iterated to inspect their keys (since they can't be restarted), so their NestedKeys do not exist. For these, along with POJSO/instances, Singles etc, set this to `false`.

    // ### Keys / Props ###

    type Texpected_nested_keys = unknown // POJSO/instances don't have NestedKeys, their props are the keys!
    const expected_nested_keys: Texpected_nested_keys[] = [] // POJSO/instances don't have NestedKeys, their props are the keys!

    // own enumerable props
    // Note: we're lying here, we're returning all props, including inherited // @todo(888): add link to ownKeyof issue
    type Texpected_stringOwnProps = unknown // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
    type Texpected_symbolOwnProps = unknown // set to TcommonSymbolProps, or change to other
    const expected_stringOwnProps: Readonly<Texpected_stringOwnProps[]> = [] // set to `commonStringProps`, or something else
    const expected_symbolOwnProps: Readonly<Texpected_symbolOwnProps[]> = [] // set to `commonSymbolProps`, or something else

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = unknown
    const expected_stringNonEnumerablesOwn = []
    type Texpected_symbolNonEnumerablesOwn = unknown
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = unknown
    const expected_stringNonEnumerablesInherited = []
    type Texpected_symbolNonEnumerablesInherited = unknown
    const expected_symbolNonEnumerablesInherited = []

    // top props
    const expected_stringNonEnumerablesInheritedTop = []
    type Texpected_stringNonEnumerablesInheritedTop = unknown
    const expected_stringNonEnumerablesInheritedTopHidden = []
    type Texpected_stringNonEnumerablesInheritedTopHidden = unknown

    // ### Values ###

    type Texpected_nested_items = unknown // if isInspectableNested is true, set the actual Nested Values type, eg Tvalues. If false, set to unknown.
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : [] // An array of the actual Nested Values of the value, eg array elements or Map values / Set keys  used. Leave as empty array, if `!isInspectableNested`

    // own enumerable props values

    // Note: we're lying here, we're returning all props, including inherited// @todo(888): add link to ownKeyof issue
    type Texpected_stringOwnProps_values = unknown // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
    type Texpected_symbolOwnProps_values = unknown // set to TcommonSymbolProps, or change to other
    const expected_stringOwnProps_values: Readonly<Texpected_stringOwnProps_values[]> = [] // set to `commonStringProps_values`, or something else
    const expected_symbolOwnProps_values: Readonly<Texpected_symbolOwnProps_values[]> = [] // set to `commonSymbolProps_values`, or something else

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = unknown
    const expected_stringNonEnumerablesOwn_values = []
    type Texpected_symbolNonEnumerablesOwn_values = unknown
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = unknown
    const expected_stringNonEnumerablesInherited_values = []
    type Texpected_symbolNonEnumerablesInherited_values = unknown
    const expected_symbolNonEnumerablesInherited_values = []
    // top values

    const expected_stringNonEnumerablesInheritedTop_values = []
    type Texpected_stringNonEnumerablesInheritedTop_values = unknown

    // # Defaults - overridden where needed
    // keys()
    type Texpected_keys = string
    const expected_keys = []
    // Iteration keys (i.e loop(), each() etc)

    type Texpected_iteration_keys = any
    const expected_iteration_keys: Texpected_iteration_keys[] = [null]

    // values()
    type Texpected_values = unknown
    const expected_values = []
    // Iteration values (i.e loop(), each() etc)

    // Iteration values
    type Texpected_iteration_items = any
    const expected_iteration_items = [getInputVanilla()]

    /*{ @all-typings-tests-vanilla }*/
    /*{ @all-typings-tests-options-wrong }*/
  })
})
