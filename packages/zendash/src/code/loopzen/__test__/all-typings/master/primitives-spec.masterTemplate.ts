// solving `error TS6200: Definitions of the following identifiers conflict with those in another file`
import { InsideValues } from '../../../../typezen/type-utils'

function dentifiersConflict1() {
  const getInputVanilla = () => {} // NOT USED - a placeholder
  const getInputWithExtraCommonProps = () => {} // NOT USED - a placeholder

  // ### This is the actual template for Primitives ###
  /*{ primitives-props-values BEGIN }*/

  let inputVanilla = getInputVanilla()
  let inputWithExtraCommonProps = getInputWithExtraCommonProps()

  const isInspectableNested = false // Map, Set, Array etc have NestedKeys that can be iterated, without affecting value - set this to `true`. On the other hand `Set.entries()`, `Map.entries()` and other Iterators/AsyncGenerators can't get iterated to inspect their keys (since they can't be restarted), so their NestedKeys do not exist. For these, along with POJSO/instances, Singles etc, set this to `false`.

  type IsInspectableNested = typeof isInspectableNested

  // ### Keys / Props ###

  type Texpected_nested_keys = never // POJSO/instances don't have NestedKeys, their props are the keys!
  const expected_nested_keys: Texpected_nested_keys[] = [] // POJSO/instances don't have NestedKeys, their props are the keys!

  type Texpected_nested_items = never // if isInspectableNested is true, set the actual Nested Values type, eg Tvalues. If false, set to never.
  const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : [] // An array of the actual Nested Values of the value, eg array elements or Map values / Set keys  used. Leave as empty array, if `!isInspectableNested`

  // own enumerable props
  // Note: we're lying here, we're returning all props, including inherited // @todo(888): add link to ownKeyof issue
  type Texpected_stringOwnProps = never // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
  type Texpected_symbolOwnProps = never // set to TcommonSymbolProps, or change to other
  const expected_stringOwnProps: Readonly<Texpected_stringOwnProps[]> = [] // set to `commonStringProps`, or something else
  const expected_symbolOwnProps: Readonly<Texpected_symbolOwnProps[]> = [] // set to `commonSymbolProps`, or something else

  // prototype / base-type props

  // own nonEnumerable props
  type Texpected_stringNonEnumerablesOwn = never
  const expected_stringNonEnumerablesOwn = []
  type Texpected_symbolNonEnumerablesOwn = never
  const expected_symbolNonEnumerablesOwn = []

  // inherited props
  type Texpected_stringNonEnumerablesInherited = never
  const expected_stringNonEnumerablesInherited = []
  type Texpected_symbolNonEnumerablesInherited = never
  const expected_symbolNonEnumerablesInherited = []

  // top props
  const expected_stringNonEnumerablesInheritedTop = []
  type Texpected_stringNonEnumerablesInheritedTop = never
  const expected_stringNonEnumerablesInheritedTopHidden = []
  type Texpected_stringNonEnumerablesInheritedTopHidden = never

  // own enumerable props values

  // Note: we're lying here, we're returning all props, including inherited// @todo(888): add link to ownKeyof issue
  type Texpected_stringOwnProps_values = never // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
  type Texpected_symbolOwnProps_values = never // set to TcommonSymbolProps, or change to other
  const expected_stringOwnProps_values: Readonly<Texpected_stringOwnProps_values[]> = [] // set to `commonStringProps_values`, or something else
  const expected_symbolOwnProps_values: Readonly<Texpected_symbolOwnProps_values[]> = [] // set to `commonSymbolProps_values`, or something else

  // prototype / base-type values

  // own nonEnumerables values
  type Texpected_stringNonEnumerablesOwn_values = never
  const expected_stringNonEnumerablesOwn_values = []
  type Texpected_symbolNonEnumerablesOwn_values = never
  const expected_symbolNonEnumerablesOwn_values = []

  // inherited values
  type Texpected_stringNonEnumerablesInherited_values = never
  const expected_stringNonEnumerablesInherited_values = []
  type Texpected_symbolNonEnumerablesInherited_values = never
  const expected_symbolNonEnumerablesInherited_values = []
  // top values

  const expected_stringNonEnumerablesInheritedTop_values = []
  type Texpected_stringNonEnumerablesInheritedTop_values = never

  // # Defaults - overridden where needed
  // keys()
  type Texpected_keys = never
  const expected_keys: Texpected_nested_keys[] = []
  // Iteration keys (i.e loop(), each() etc)

  // values()
  type Texpected_values = never
  const expected_values = []

  // Iteration keys & values (i.e loop(), each() etc)
  type Texpected_iteration_keys = null
  const expected_iteration_keys: Texpected_iteration_keys[] = [null]
  type Texpected_iteration_items = typeof inputVanilla
  const expected_iteration_items = [inputVanilla]

  // Callback keys / values (i.e map(), filter() etc)
  type Texpected_callback_keys = Texpected_iteration_keys
  const expected_callback_keys = expected_iteration_keys
  type Texpected_callback_items = Texpected_iteration_items
  const expected_callback_items = expected_iteration_items

  // When we map() or filter() etc, we can return a new type for the Internal items or keys, so we set it here. They can change for 2 reasons:
  // - We explicitly return a "new type", from map()/mapKeys()
  // - We get `never` as the internal value, if we map()/filter() etc with props: true
  // Otherwise, set to the original type
  type Texpected_internal_keys = never // @todo(888): fix this when testing mapKeys
  type Texpected_internal_items = InsideValues<typeof inputVanilla>
  /*{ primitives-props-values END }*/
}
