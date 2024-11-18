import * as c from 'ansi-colors'
import * as deepmerge from 'deepmerge'
import * as _ from 'lodash'
import * as traverse from 'traverse'

// neozen
import * as z from '@neozen/zen'

// local
import { Spec } from './Spec'
import {
  ColumnsCmd,
  Skipy,
  Onlie,
  COLUMNS,
  TSpec,
  SuiteCmd,
  isFilter,
  Filter,
  TSpecBody_ExcludeAllCommandsButEach,
  TAny_ExcludeAllCommands,
  legitFilter,
  ISuite,
  EachCmd,
  EOnliesPriorities,
  ESkipiesPriorities,
  OnlieEnd,
  SkipyEnd,
  OnlieAbove,
  SkipyAbove,
  FilterEnd,
  FilterAbove,
  isFilterEnd,
  legitFilterEnd,
  isFilterAbove,
  legitFilterAbove,
  isFilterIgnore,
  legitFilterIgnore,
  FilterIgnore,
  OnlieMerge,
  SkipyMute,
  TSpecDataTransformer,
  TExpectedResultTransform,
  TSpecHandlerFunction,
  ExecutableSpec,
  Command,
} from './types'
import { objectToString } from './utils/objectToString'

import { getTinyLog } from './utils/tiny-log'

const _log = getTinyLog(false, 'Suite')

export type TSpecDataArray = TAny_ExcludeAllCommands[]

const HUGE_PRIOTITY = 999

export type GenerateSpecsOptions = {
  // invertOnly?: boolean // @todo: Not implemented
  // /**
  //  * Disable warnings
  //  */
  // noWarnings?: boolean // @todo: Not implemented

  // /**
  //  * Enable verbose reporting
  //  */
  // verbose?: boolean // @todo: Not implemented
  nestingLevel?: number
  showSkipped?: boolean
  testRunnerKit?: 'JEST' // | 'MOCHA' // @todo: implement mocha etc
}

const getTestRunner = ({
  title,
  fullTitle,
  isVisible,
  filter,
  nestingLevel,
  testRunnerKit = 'JEST',
}: {
  title: string
  fullTitle: string
  isVisible: boolean
  filter: Filter | FilterEnd | null
  nestingLevel: number
  testRunnerKit: 'JEST' // | 'MOCHA' | 'Jasmine' | 'AVA' | 'TAP' | 'Tape' | 'QUnit' |
}) => {
  let testRunner = {}

  if (testRunnerKit && testRunnerKit === 'JEST') {
    const describe = isVisible ? global.describe : global.describe.skip
    const it = isVisible ? global.it : global.it.skip
    _.pad
    const header = (restOfHandler: () => void) =>
      // prettier-ignore
      describe(c.underline.bold(`\n${_.repeat('', nestingLevel)}${c.bgBlackBright.greenBright(title)}`),
        () => restOfHandler())

    const headerFull = (restOfHandler: () => void) =>
      // prettier-ignore
      describe(c.underline.bold(`\n${_.repeat('', nestingLevel)}${c.bgBlackBright.greenBright(fullTitle)}`),
        () => restOfHandler())

    testRunner = { describe, it, header, headerFull }
  }

  return testRunner
}

/**
 * The Concrete Suite class, after all the parsing and handling of the raw SuiteCmd
 */
export class Suite<TSpecData> implements ISuite<TSpecData> {
  public __kind = 'Suite'

  // From ISuite  - why need re-declaring?
  specHandlers?: (string | TSpecHandlerFunction<TSpecData>)[]

  specDataTransformer?: TSpecDataTransformer<TSpecData>

  resultTransform?: TExpectedResultTransform // NOT IMPLEMENTED

  expectedTransform?: TExpectedResultTransform // NOT IMPLEMENTED

  fullTitle?: string

  title?: string

  group?: string | string[]

  filter?: Filter

  filterEnd?: FilterEnd

  filterIgnore?: FilterIgnore

  columnsCmd?: ColumnsCmd

  /**
   * An array of all nested Suites, Filters and Specs:
   * - Nested (concrete) Suite instances, pointing to their parent
   * - Filter instances with ExxxPriorities so we can filter
   * - "Proper" Spec instances
   *    - With `filter` embedded, removed from specData
   *    - SpecData converted to object (from array via Columns)
   *    - Having generated all the permutations of a Spec with EACH
   *
   * It all happens in .suiteCmdToConcrete()
   */
  public suiteArray?: (
    | Spec<TSpecData>
    | Filter
    | FilterEnd
    | FilterAbove
    | FilterIgnore
    | Suite<TSpecData>
  )[] = []

  constructor(
    suiteCmd: SuiteCmd<TSpecData>,
    private parentSuite: Suite<TSpecData> = null
  ) {
    this.suiteCmdToConcrete(suiteCmd)
  }

  suiteCmdToConcrete(suiteCmd: SuiteCmd<TSpecData>) {
    _.extend(
      this,
      _.pick(suiteCmd, [
        'specHandlers',
        'specDataTransformer',
        'resultTransform', // NOT IMPLEMENTED
        'expectedTransform', // NOT IMPLEMENTED
        'title',
        'group',
        'columnsCmd',
        'filter',
        'filterEnd',
        'filterIgnore',
      ])
    )

    this.sanityChecksRetrieveColumnsSpecHandler(suiteCmd)

    // Go through each item in Suite array and handle it
    _.each(suiteCmd.suiteArray, (suiteItem, suiteItemIdx) => {
      // **** Suite ****
      if (suiteItem instanceof SuiteCmd) {
        // We have a Suite, handle it recursively, passing this as parentSuite
        const handledSuite = new Suite(suiteItem, this)
        this.suiteArray.push(handledSuite)
      }
      // **** Spec ****
      else if (_.isArray(suiteItem)) {
        this.handleSpec(suiteItem)
      }
      // **** Filter ****
      else if (isFilter(suiteItem)) {
        this.suiteArray.push(legitFilter(suiteItem)) // we need to know when we visit to filter things out
      }
      // **** FilterEnd ****
      else if (isFilterEnd(suiteItem)) {
        this.suiteArray.push(legitFilterEnd(suiteItem))
      }
      // **** FilterIgnore ****
      else if (isFilterIgnore(suiteItem)) {
        this.suiteArray.push(legitFilterIgnore(suiteItem))
      }
      // **** FilterAbove ****
      else if (isFilterAbove(suiteItem)) {
        if (suiteItemIdx === 0)
          // but not as 1st Item!
          throw new TypeError(
            `SpecZen: Suite::suiteCmdToConcrete: FilterAbove found as 1st item in SUITE array, but it should be after a Spec!`
          )

        this.suiteArray.push(legitFilterAbove(suiteItem))
      }

      // These Should not be here

      // **** Columns: Should not be here ****
      else if (suiteItem instanceof ColumnsCmd) {
        // We should have no more Columns, its a bug:
        throw new TypeError(
          `SpecZen: Suite::suiteCmdToConcrete: Columns found but we should have eliminated them - report bug! suiteArray: ${objectToString(
            suiteCmd.suiteArray
          )}`,
          { cause: suiteCmd.suiteArray }
        )
      }
      // **** Filters: Should not be here ****
      else if (suiteItem instanceof Filter) {
        // We should have no more Columns, it's a bug:
        throw new TypeError(
          `SpecZen: Suite::suiteCmdToConcrete: Filter found but we should have eliminated them - report bug! suiteArray: ${objectToString(
            suiteCmd.suiteArray
          )}`,
          { cause: suiteCmd.suiteArray }
        )
      } else {
        // console.log(suiteItem, z.type(suiteItem), suiteCmd.suiteArray)
        throw new TypeError(
          `SpecZen: Suite::suiteCmdToConcrete:! Unknown SUITE array item: ${objectToString(
            suiteItem
          )}, ${objectToString(suiteItem)}`,
          { cause: suiteItem }
        )
      }
    })
  }

  private sanityChecksRetrieveColumnsSpecHandler(
    suiteCmd: SuiteCmd<TSpecData>
  ) {
    // prettier-ignore
    if (!suiteCmd) throw new Error('SpecZen: Suite::suiteCmdToConcrete: No suite provided!')
    if (!_.isArray(suiteCmd.suiteArray))
      throw new Error(
        `SpecZen: Suite::suiteCmdToConcrete: suiteCmd.suiteArray is not an array! \nz.type(suiteCmd.suiteArray) = ${z.type(
          suiteCmd.suiteArray
        )}\nsuiteCmd = ${objectToString(suiteCmd)}`
      )

    // @todo: if (_.isEmpty(suiteCmd.suiteArray)) l.warn('SpecZen: Suite::suiteCmdToConcrete: Suite array is empty - add a Spec!')

    // Column Sanity checks:

    // Throw if there's any COLUMNS in wrong place,
    if (
      _.some(
        suiteCmd.suiteArray,
        (suiteItem) => suiteItem instanceof ColumnsCmd
      )
    )
      throw new TypeError(
        'SpecZen: Suite::suiteCmdToConcrete: Columns found but not in first 2 rows',
        { cause: suiteCmd }
      )

    // Throw if any COLUMNS without a call (although syntax prohibits it, for JS/coffee users)
    if (
      _.some(suiteCmd.suiteArray, (suiteItem) => suiteItem === (COLUMNS as any))
    )
      throw new TypeError(
        'SpecZen: Suite::suiteCmdToConcrete: Columns found without a call',
        {
          cause: suiteCmd,
        }
      )

    // Both options.columns & COLUMNS in same SUITE, throw
    if (suiteCmd.columns && suiteCmd.columnsCmd)
      throw new Error(
        `SpecZen: Suite::suiteCmdToConcrete: both columns in SUITEOptions & COLUMNS() in SUITE() found, remove one cause they conflict!\nsuiteCmd.columns = ${objectToString(
          suiteCmd.columns
        )}\nsuiteCmd.columnsCmd = ${objectToString(suiteCmd.columnsCmd)}`,
        { cause: suiteCmd }
      )

    const suiteContainsSpec = _.some(suiteCmd.suiteArray, _.isArray)

    // Retrieve Columns, from columnsCmd or a Columns carried along from a parent
    // Enforce being mandatory if any Specs are present, at the first Top Level Suite that has Specs
    if (!suiteCmd.columnsCmd) {
      if (suiteCmd.columns)
        this.columnsCmd = new ColumnsCmd({ columnsNames: suiteCmd.columns })
      else if (this.parentSuite?.columnsCmd)
        this.columnsCmd = this.parentSuite.columnsCmd
      else if (suiteContainsSpec)
        throw new Error(
          `COLUMNS(...columnNames) OR {columns: ['column', 'names']} is mandatory on Top Level SUITE that contains Specs. COLUMNS must be first item or 2nd item after Filter in the SUITEarray.\nsuiteCmd = ${objectToString(
            suiteCmd
          )}`,
          { cause: suiteCmd }
        )
    }

    // SpecHandlers are mandatory if any Specs are present, like COLUMNS
    if (!suiteCmd.specHandlers) {
      if (this.parentSuite?.specHandlers)
        this.specHandlers = this.parentSuite.specHandlers
      else if (suiteContainsSpec)
        throw new TypeError(
          'SpecZen: Suite::suiteCmdToConcrete: SpecHandlers is mandatory for SUITE that contains Specs, but missing in SUITE & its parents',
          { cause: suiteCmd }
        )
    }

    // Check if these exist, or inherit from immidiate parent
    // @todo(336): use real inheritance, not this hack? Object-inherit-from-Object, With prototypes?
    _.each(['title', 'group'], (prop) => {
      // console.log('prop', prop, ' valu=', suiteCmd[prop])
      if (!suiteCmd[prop] && this.parentSuite?.[prop]) {
        if (prop === 'title') {
          // title is missing - fake "inherit" from parent
          this.title = ` ^ ${this.parentSuite.title}`
        } else this[prop] = this.parentSuite[prop] // @todo: properly collect and inherit transformers, applying them in order
      }
    })

    this.fullTitle = this.parentSuite
      ? `${this.parentSuite.fullTitle} > ${this.title}`
      : (this.fullTitle = this.title)
  }

  private handleSpec(suiteItemAsSpec: TSpec) {
    const specUserData = [...suiteItemAsSpec] as TSpec // as User defined, cloned

    const initialSpecData: TSpecDataArray = specUserData as TSpecDataArray // Cleaned from all commands, except Each
    const expandedSpecDatasWithFilter1st: TSpecDataArray[] =
      Suite.handleEach(initialSpecData)

    // Treat all expandedSpecData that EACH() generated, as a separate Spec
    _.each(expandedSpecDatasWithFilter1st, (specDataWithFilter1st) => {

      // If we have a FilterFilter/FilterEnd: inside the Spec array as 1st item, remove it,
      // and add it to the Spec below.
      let filter: Filter | FilterEnd = null
      if (isFilter(specDataWithFilter1st[0]) || isFilterEnd(specDataWithFilter1st[0])) {
        // Filter/FilterEnd: check & retrieve if we have filters, and in the right place (only 1st item!).
        filter = legitFilter(specDataWithFilter1st[0]) // store, if any
        if (filter) specDataWithFilter1st.shift() // remove it
        else {
          filter = legitFilterEnd(specDataWithFilter1st[0]) // store, if any
          if (filter) specDataWithFilter1st.shift() // remove it
        }
      }

      // we should have no more filters!
      // prettier-ignore
      if (_.some(specUserData, isFilter)) throw new TypeError(`SpecZen: Suite::suiteCmdToConcrete: Filter (ie SKIP/ONLY) found in wrong place, only first item in Spec can be a Filter`,{ cause: suiteItemAsSpec })
      // prettier-ignore
      if (_.some(specUserData, isFilterEnd)) throw new TypeError(`SpecZen: Suite::suiteCmdToConcrete: FilterEnd (ie SKIP_END/ONLY_END) found in wrong place, only first item in Spec can be a Filter`,{ cause: suiteItemAsSpec })
      // prettier-ignore
      if (_.some(specUserData, isFilterAbove)) throw new TypeError(`SpecZen: Suite::suiteCmdToConcrete: FilterAbove (eg ONLY_ABOVE / SKIP_ABOVE) found in in Spec`, { cause: suiteItemAsSpec })

      // Convert the real user's specData to object {} via this.columnsCmd.columnsNames
      const specData = specDataWithFilter1st // for clarity

      // Throw if we have more TestData than columns
      if (specData.length > this.columnsCmd.columnsNames.length) {
        throw new Error(`SpecZen: Suite::handleSpec: Too many SpecData params for columns: ${objectToString(this.columnsCmd.columnsNames)} specData: ${objectToString(specData)}. Suite title: '${this.title}'`.replaceAll('\n', ''), { cause: suiteItemAsSpec })
      }

      // Not corresponding params for column & optional columns
      // Throw if no corresponding TestData for a mandatory Column,
      // ignore only if columnName ends with '?' (ie optional)
      let specDataObj: TSpecData = <TSpecData>_.reduce(
        this.columnsCmd.columnsNames,
        (objAcc, columnName, colIdx: number) => {
          let isOptional = false
          if (columnName.endsWith('?')) {
            columnName = columnName.slice(0, -1)
            isOptional = true
          }

          // Have we exceeded the number of TestData columns? @todo(133): improve!
          if (colIdx >= specData.length) {
            if (isOptional) {
              return objAcc
            } else {
              throw new Error(
                `SpecZen: Suite::suiteCmdToConcrete: Missing specData for column "${columnName}". Suite title: "${
                  this.title
                }" fullTitle: "${this.fullTitle}" specData: "${objectToString(
                  specData
                )}"`
              )
            }
          }

          objAcc[columnName] = specData[colIdx]

          return objAcc
        },
        {}
      )

      // Apply All specDataTransformer(s), starting from top-level parent, all the way down to this instance:

      const specDataTranformers: TSpecDataTransformer<TSpecData>[] = []
      if (this.specDataTransformer)
        specDataTranformers.push(this.specDataTransformer)

      // visit all parents, grab their specDataTransformer
      let parentSuite = this.parentSuite
      while (parentSuite) {
        if (parentSuite.specDataTransformer)
          specDataTranformers.push(parentSuite.specDataTransformer)
        parentSuite = parentSuite.parentSuite
      }

      // Apply transformation, in reverse order than collected (this.specDataTransformer is last)
      for (const specDataTranformer of specDataTranformers.reverse()) {
        if (_.isFunction(specDataTranformer))
          specDataObj = specDataTranformer(specDataObj)
        else if (
          z.isRealObject(specDataTranformer)
        ) {
          specDataObj = deepmerge(
            _.cloneDeep(specDataTranformer),
            specDataObj,
            {
              isMergeableObject: _.isPlainObject, // we want this for Error objects and other instances
              // clone: false
            },
          )
        }
        // prettier-ignore
        else
          throw new TypeError(
            `SpecZen: Suite::suiteCmdToConcrete: specDataTransformer is neither a function nor an object: ${objectToString(
              this
            )}`
          )
      }

      // @todo: implement those
      // prettier-ignore
      if (this.expectedTransform) throw new Error(`SpecZen: Suite::suiteCmdToConcrete: expectedTransform is not implemented yet!`)
      // prettier-ignore
      if (this.resultTransform) throw new Error(`SpecZen: Suite::suiteCmdToConcrete: resultTransform is not implemented yet!`)

      // Create a Spec instance, and add the Filters to it
      this.suiteArray.push(new Spec(specDataObj, filter))
    })
  }

  /**
   * Given a single Spec, expand it to an array of Specs, for every EACH arg X  every EACH() call
   *
   * We treat EACH at Spec's ROOT differently than EACH inside a Spec's parameter Value (i.e in a nested object, array):
   * - If it is in root, every arg in EACH(...args) must be an array, representing the Spec parameters that will be added to the Spec params, potentially pushing other params defined in Columns towards the end!
   * - If it is nested inside a parameter value, each arg represents a single value to be used for expanding the Spec, so it can be anything and is used as is.
   *
   * @param spec
   * @returns a flat list of Specs, for all permutations of all EACH() args X calls. Inteleaved we might have Filters & FilterEnds
   */
  private static handleEach(
    spec: TSpecBody_ExcludeAllCommandsButEach[]
  ): TSpecDataArray[] {
    const expandedSpecs: TSpecDataArray[] = []

    _.each(Suite.handleEachRoot(spec), (expandedSpec) => {
      const expandedNestedEachSpecs = Suite.handleEachNested(expandedSpec)
      expandedSpecs.push(...expandedNestedEachSpecs)
    })

    return expandedSpecs
  }

  private static handleEachNested(
    spec: TSpecBody_ExcludeAllCommandsButEach[]
  ): TSpecDataArray[] {
    const expandedSpecs: TSpecDataArray[] = []
    // _log('>>>>>>> ENTERING handleEachNested(spec = ', spec)

    let eachCmd: EachCmd = null
    traverse.forEach(spec, function (specNestedValue) {
      if (specNestedValue instanceof EachCmd) {
        eachCmd = specNestedValue

        // check we're not inside an instance (i.e non _.isPlainObject or _.Array) in the whole this.path
        // prettier-ignore
        _.each(this.path, (_pathItem, pathIdx) => {
          const path = this.path.slice(0, pathIdx + 1)
          const pathValue = traverse.get(spec, path)
          if (!_.isPlainObject(pathValue) && !_.isArray(pathValue) && !(pathValue instanceof EachCmd)) {
            throw new TypeError(
              `SpecZen: Error: EACH() called in a nested object or array, that has an Instance as a parent. This is NOT IMPLEMENTED!
Offending:
- Instance path: ${objectToString(path)}
- Instance Value: ${objectToString(pathValue)}
- Instance Class: ${objectToString(pathValue.constructor.name)}`, { cause: pathValue })
          }
        })

        let filter
        _.each(eachCmd.eachArguments, (eachArgument, eachArgumentIdx) => {
          if (isFilter(eachArgument) || isFilterEnd(eachArgument)) {
            filter = _.isFunction(eachArgument) ? eachArgument() : eachArgument
            return // end loop for eachArgument, it's just a filter - we'll add it as 1st item on the Spec array
          }

          // clone Spec, but dont clone Instances!
          const expandedSpec = deepmerge({}, spec, {
            isMergeableObject: _.overSome(_.isPlainObject, _.isArray), // we want this for Error objects and other instances and EachCmd itself
          })

          // If we have a filter:
          //  - add OR replace this filter to expandedSpec
          //  - if adding, inc 1 to traverse's path array index
          let path = null
          if (filter) {
            // _log('We have an active filter', filter)
            if (isFilter(expandedSpec[0]) || isFilterEnd(expandedSpec[0])) {
              expandedSpec[0] = filter // replace
            } else {
              // add
              expandedSpec.unshift(filter)
              const pathIdx = Number(this.path[0])

              if (_.isNumber(pathIdx) && !_.isNaN(pathIdx))
                path = [`${pathIdx + 1}`, ...this.path.slice(1)]
            }
          }

          traverse.set(expandedSpec, path || this.path, eachArgument)

          // Maybe we have another EACH() call in each of the new expandedSpec, so recurse:
          const expandedSpecs2 = Suite.handleEachNested(expandedSpec)
          expandedSpecs.push(...expandedSpecs2)
        })

        // Stop traversing this branch, we recurse above for remaining EACHes
        this.stop()
      }
    })

    if (!eachCmd) expandedSpecs.push(spec) // base case - return spec as-is - otherwise we added all the expanded ones below!

    // _log('###### Returning for spec = \n', spec, '\n\n   expandedSpecs =', expandedSpecs)
    return expandedSpecs
  }

  private static handleEachRoot(
    spec: TSpecBody_ExcludeAllCommandsButEach[]
  ): TSpecDataArray[] {

    const expandedSpecs: TSpecDataArray[] = []

    // Find if we have an EACH in the Spec's ROOT
    const eachIdx = _.findIndex(spec, (specItem) => specItem instanceof EachCmd)
    if (eachIdx > -1) {
      // We have at least one EACH in Spec's ROOT. We'll expand the Spec to multiple Specs
      //  - one for each arg in EACH(...args)
      //  - repeated for EACH() call in the Spec's ROOT
      const eachCmd = spec[eachIdx] as EachCmd

      let filterArray = []

      _.each(eachCmd.eachArguments, (eachArgument, eachTestArgIdx) => {
        if (isFilter(eachArgument) || isFilterEnd(eachArgument)) {
          filterArray = [
            _.isFunction(eachArgument) ? eachArgument() : eachArgument,
          ]
          return
        } else if (!_.isArray(eachArgument)) {
          throw new TypeError(
            `SpecZen: Error: EACH() called in Spec's root, with a non-array arg. Each arg in root Spec's EACH(...args) must be an array, of Spec parameters that will be added to the Spec params, potentially pushing other params defined in Columns towards the end!
Offending each argument: ${objectToString(eachArgument)}
EachTestArguments = ${objectToString(eachCmd.eachArguments)}`,
            { cause: this }
          )
        }

        // We now have an eachArgumentArray, possibly with filter
        const eachArgumentArray: any[] = [...eachArgument] // clone it

        // Do we have a filter a Spec inside the User Data Array?
        // Then all generated Specs will have it, as we add a Filter instance in the result Array!

        if (isFilter(eachArgumentArray[0]) || isFilterEnd(eachArgumentArray[0])) {
          filterArray[0] =
            _.isFunction(eachArgumentArray[0]) ? eachArgumentArray[0]() : eachArgumentArray[0]

          eachArgumentArray.shift() // remove from front
        }

        // Check we have no more Filters / Commands in here!
        for (const specDataItem of eachArgumentArray)
          // prettier-ignore
          if (specDataItem instanceof Command || isFilter(specDataItem) || isFilterEnd(specDataItem)) throw new TypeError(`SpecZen: Suite::suiteCmdToConcrete: user's specData Array contains a Filter or other Command - this is not allowed! Only a Filter is allowed, but only in 1st place, which is already treated!\nOffending Command = ${objectToString(specDataItem)}\neachArgument = ${objectToString(eachArgument)}`,{ cause: { spec, Command: specDataItem } })

        const expandedSpec = [
          ...filterArray, // vanishes if empty ;-)
          ...spec.slice(0, eachIdx),
          ...eachArgumentArray, // arguments to EACH() are always arrays of values
          ...spec.slice(eachIdx + 1),
        ]

        // We might have more EACH() calls, recurse!
        const expandedSpecs2 = Suite.handleEachRoot(expandedSpec)

        expandedSpecs.push(...expandedSpecs2)
      })
    } else {
      return [spec]
    }

    return expandedSpecs
  }

  maxFilters({ deep = true }: { deep?: boolean } = {}) {
    let maxOnlie: Onlie | OnlieAbove = null
    let maxSkipy: Skipy | SkipyAbove = null

    const getMaxFilters = (
      filter: Filter | FilterAbove | null,
      maxFilter: Filter | FilterAbove | null
    ): Filter | FilterAbove | null => {
      if (!maxFilter) return filter
      if (!filter) return maxFilter
      else if (filter.priority > maxFilter.priority) return filter
      else return maxFilter
    }

    _.each(this.suiteArray, (suiteItem) => {
      // A Spec, has its own filters
      if (suiteItem instanceof Spec) {
        if (suiteItem.filter instanceof Onlie) {
          maxOnlie = getMaxFilters(suiteItem.filter, maxOnlie)
        } else if (suiteItem.filter instanceof Skipy) {
          maxSkipy = getMaxFilters(suiteItem.filter, maxSkipy)
        }
      }
      // @todo(132): code has become un-DRY - DRY it!
      // Filters
      // An Onlie, in the Suite Array
      else if (suiteItem instanceof Onlie) {
        maxOnlie = getMaxFilters(suiteItem, maxOnlie)
      }
      // A Skipy, in the Suite Array
      else if (suiteItem instanceof Skipy) {
        maxSkipy = getMaxFilters(suiteItem, maxSkipy)
      }

      // Filters Above
      // An OnlieAbove, in the Suite Array
      else if (suiteItem instanceof OnlieAbove) {
        maxOnlie = getMaxFilters(suiteItem, maxOnlie)
      }
      // A Skipy, in the Suite Array
      else if (suiteItem instanceof SkipyAbove) {
        maxSkipy = getMaxFilters(suiteItem, maxSkipy)
      }

      // A Suite - check its own filters & then recursively find the Max
      else if (suiteItem instanceof Suite) {
        const suite = suiteItem
        if (suite.filter)
          if (suite.filter instanceof Onlie)
            maxOnlie = getMaxFilters(maxOnlie, suite.filter)
          else if (suite.filter instanceof Skipy)
            maxSkipy = getMaxFilters(maxSkipy, suite.filter)

        const { maxOnlie: maxOnlie2, maxSkipy: maxSkipy2 } = suite.maxFilters()
        maxOnlie = getMaxFilters(maxOnlie, maxOnlie2)
        maxSkipy = getMaxFilters(maxSkipy, maxSkipy2)
      }
    })

    return { maxOnlie, maxSkipy }
  }

  /**
   *  GENERATES ARRAYS OF TEST CASES,
   *
   *  Grouped by "SpecHandlers", eg "readSpecHandler" or "AddNumbers", as defined in SUITE({specHandlers})   *
   *
   *  Example output
   *
   *     // const exampleResult = {
   *     //   readSpecHandler: [
   *     //     {
   *     //       isVisible: false,
   *     //       spec: {
   *     //         title: `Throws NOT_FOUND if personId really doesnt exists, with SuperAdmin / NO AuthZen`,
   *     //         user: 'superAdminEmployee',
   *     //         instance: { id: 999 },
   *     //         statusAndErrors: [
   *     //           'HttpStatus.NOT_FOUND',
   *     //           `ApiZen: NOT_FOUND (404): Person with ids [999]`,
   *     //         ],
   *     //       },
   *     //       meta: {
   *     //         header: `        - API: tests: Document: Read: Throws NOT_FOUND if personId really doesnt exists, with SuperAdmin / NO AuthZen`,
   *     //         specPrint: `
   *     //       user: 'superAdminEmployee'
   *     //       instance: { id: 999 }
   *     //       statusAndErrors: ['HttpStatus.NOT_FOUND', 'ApiZen: NOT_FOUND (404): Person with ids [999]']
   *     //     `,
   *     //         other: `specHandlers: 'READ', blah`,
   *     //         fullDescribe: 'All the above',
   *     //         etc: 'etc',
   *     //       },
   *     //     },
   *     //   ],
   *     // }
   */
  generateSpecs(
    {
      // Set by user
      // noWarnings,
      showSkipped = false,
      testRunnerKit = 'JEST',
      nestingLevel = 0,
    }: GenerateSpecsOptions = {},
    {
      // Set by Suite - internal
      executableSpecsPerHandler = {},
      inlineSpecHandlers = {},
      maxOnlie = null,
      // maxSkipy = null,
      onlie = null,
      skipy = null,
      onlieEnd = null,
      onlieIgnore = null,
      skipyIgnore = null,

      // NOT IMPLEMENTED
      onlieAbove = null,
      skipyAbove = null,
    }: {
      // eg: {divide: [ {isVisible, specData: {a:4, b:2, result: 2}, {isVisible, ...} ]
      executableSpecsPerHandler?: {
        [specHandlerName: string]: ExecutableSpec<TSpecData>[]
      }

      // eg: {divide: (executableSpec) => { ... }}
      inlineSpecHandlers?: Record<string, TSpecHandlerFunction<TSpecData>>
      maxOnlie?: Onlie | OnlieAbove
      // maxSkipy?: Skipy | SkipyAbove
      onlie?: Onlie
      skipy?: Skipy
      onlieAbove?: OnlieAbove
      skipyAbove?: SkipyAbove
      onlieEnd?: OnlieEnd
      onlieIgnore?: OnlieMerge
      skipyIgnore?: SkipyMute
    } = {} // @ todo: make type & fix {} with defaults
  ): {
    executableSpecsPerHandler: {
      [specHandlerName: string]: ExecutableSpec<TSpecData>[]
    }
    inlineSpecHandlers: Record<string, TSpecHandlerFunction<TSpecData>>
  } {
    const suite = this // @todo lose that

    // / Find the maximum ONLY & SKIP priority, BUT only in the Root suite
    if (!maxOnlie) ({ maxOnlie } = suite.maxFilters())

    // Check and bring in effect Suite's own filters, filterEnds, and filterIgnores
    if (suite.filter) {
      if (suite.filter instanceof Onlie) onlie = suite.filter
      else if (suite.filter instanceof Skipy) skipy = suite.filter
    }
    if (suite.filterEnd) {
      if (suite.filterEnd instanceof OnlieEnd) onlieEnd = suite.filterEnd
      else if (
        suite.filterEnd instanceof SkipyEnd &&
        suite.filterEnd.priority <= (skipy?.priority || 0)
      )
        skipy = null
    }
    if (suite.filterIgnore) {
      if (suite.filterIgnore instanceof OnlieMerge)
        onlieIgnore = suite.filterIgnore
      else if (suite.filterIgnore instanceof SkipyMute)
        skipyIgnore = suite.filterIgnore
    }

    // Store the Suite's specHandler(s) to result, if it doesnt exist.
    // @todo: SpecZen warns/errors when using the same `SpecHandler` in non-nested suites (check where it's coming from, if there's parent/grantparent suite) NOT IMPLEMENTED.
    // @todo: SpecZen errors if a `SpecHandler` hasn't been used (using a getter & timer?) NOT IMPLEMENTED.
    // @todo: SpecZen errors if a `SpecHandler` requested is missing (using a getter) NOT IMPLEMENTED.

    // If specHandler is a string, just create an entry in executableSpecsPerHandler pointing to an empty array for ExecutableSpecs
    // If it's a function, retrieve name and also store in inlineSpecHandlers

    _.each(suite.specHandlers, (specHandler) => {
      if (_.isFunction(specHandler)) {
        const specHandlerName = specHandler.name
        // prettier-ignore
        if (!specHandlerName) throw new Error(`SpecZen: Suite::generateSpecs: SpecHandler is a function but has no name!`)

        // prettier-ignore
        if (inlineSpecHandlers[specHandlerName] && inlineSpecHandlers[specHandlerName] !== specHandler)
          throw new Error(`SpecZen: Suite::generateSpecs: SpecHandler name collision: ${specHandlerName}! ${specHandler} NOT SAME AS ${inlineSpecHandlers[specHandlerName]}`)

        inlineSpecHandlers[specHandlerName] = specHandler
        executableSpecsPerHandler[specHandlerName] ||= []
      } else if (_.isString(specHandler))
        executableSpecsPerHandler[specHandler] ||= []
      else
        throw new TypeError(
          `SpecZen: Suite::generateSpecs: invalid SpecHandler is neither a function nor a string: ${objectToString(
            specHandler
          )}`
        )
    })

    // // Find if we have a FilterAbove in the Suite Array, and bring into effect
    // _.find(suite.suiteArray, (suiteItem) => {
    //
    // })

    // Process each item in the Suite & ultimately generate the Specs.
    // They will be grouped by SpecHandlers, like in example above ^^^

    // Also handle and found Filters (Onlies & Skipies) and FilterEnds (OnlieEnds & SkipyEnds) and FilterAboves (OnlieAbove & SkipyAbove)
    _.each(suite.suiteArray, (suiteItem) => {
      // We are sure all Suites have SpecHandlers, and all Specs have a Filter, it was done in suiteCmdToConcrete()

      // **** Spec ****
      if (suiteItem instanceof Spec) {
        // _log('Spec: ', suiteItem, { onlie, onlieEnd, maxOnlie, onlieIgnore })

        const spec = suiteItem
        let isVisible = true // start optimistically

        // ONLIE

        if (maxOnlie) {
          // If a maxOnlie exists (from anywhere in our Suites), all Specs start as NON visible, unless...
          isVisible = false

          // Unless, we have an `onlieEnd` in effect that cancels that maxOnlie priority!
          if (onlieEnd) isVisible = onlieEnd.priority >= maxOnlie.priority

          // Unless we have `onlieIgnore` in effect, which means we are ignoring the Onlies higher of that priority
          if (onlieIgnore) isVisible = onlieIgnore.priority >= maxOnlie.priority

          // If onlie in effect in the SUIT, Spec will be VISIBLE:
          // - if that onlie, has reached the maxOnlie priority, therefore we're participating in this exclusive ONLY group!
          // - BUT unless we have an OnlieEnd in effect that cancels that ONLY priority!
          // - And unless we have `onlieIgnore` in effect, which means we are ignoring the Onlies above that priority
          if (onlie) {
            isVisible = onlieEnd
              ? onlieEnd.priority > (onlieIgnore?.priority || onlie.priority)
              : onlie.priority >= (onlieIgnore?.priority || maxOnlie.priority)
          }

          // If Spec has their own Onlie, at the max priority, then it is visible
          // They are not affected by OnlieEnd in Suite, a Spec has its own mind (for both Onlie & Skipy)!

          // But they are affected by `onlieIgnore` in effect, which means we are ignoring the priorities of Onlies above that priority. When we XXX_MUTE, we are ignoring the Onlies of XXX & higher priority, grouping them together as one larger, less-exclusive /more icnlusivegroup!
          if (spec.filter instanceof Onlie) {
            // Only the Onlies above at max priority are visible
            isVisible =
              spec.filter.priority >=
              (onlieIgnore?.priority || maxOnlie.priority)
          }
        }

        // SKIPY

        // If skipy is in effect in Suite, all Specs start as NOT visible
        if (skipy) {
          isVisible = false

          // Unless we are ignoring SKIP, then all Specs equal or higher are visible
          if (skipy.priority >= (skipyIgnore?.priority || HUGE_PRIOTITY))
            isVisible = true
        }

        // Finally, if Spec it self has own SKIP, it's a skip (unless we're ignoring)!
        if (
          spec.filter instanceof Skipy &&
          spec.filter.priority < (skipyIgnore?.priority || HUGE_PRIOTITY)
        ) {
          isVisible = false
        }

        // If Spec has an SkipyEnd, it cancels SKIP and above
        if (spec.filter instanceof SkipyEnd) {
          isVisible = spec.filter.priority >= (skipy?.priority | 0)
        }

        // Add the Spec to ALL specHandlers in result
        if (showSkipped || (!showSkipped && isVisible))
          _.each(suite.specHandlers, (specHandler) => {
            // What filter is active?
            // @todo: fully & correctly expose the non-visibility reason. We need what Skipies or Onlies are in effect, **closest** to this this Spec, with priority to Skipies, and then Onlies.
            //  So, if a Spec is under a BREAKS('Broken since APIv2') but we also have an active SKIP or ONLY, we still should care **more** about the BREAKS, and show it!
            const filter = spec.filter || skipy || onlie

            executableSpecsPerHandler[
              _.isFunction(specHandler) ? specHandler.name : specHandler
            ].push({
              // an executableSpec
              isVisible,
              filter,
              testRunner: getTestRunner({
                isVisible,
                filter,
                title: suite.title,
                fullTitle: suite.fullTitle,
                nestingLevel,
                testRunnerKit,
              }),
              specData: spec.specData,
              // meta: {},
              suiteTitle: suite.title,
              suiteFullTitle: suite.fullTitle,
              nestingLevel,
            })
          })
      }
      // **** Filter, FilterEnd, & WIP FilterAbove ****
      // Filter: Onlie/Skipy in the array, comes "into effect"
      // It applies to all Specs & SUITEs that follow, until another ONLY/SKIP or ONLY_END/SKIP_END changes it!
      else if (isFilter(suiteItem)) {
        if (suiteItem instanceof Onlie) {
          onlie = suiteItem
          onlieEnd = null // @todo: check if we need to reset onlieEndInSuite
        } else if (suiteItem instanceof Skipy) {
          if (!skipy) skipy = suiteItem
          // If we already have a skippy,
          // we care about the new one, only if it is of lower priority.
          else if (suiteItem.priority < skipy.priority) skipy = suiteItem
          /*
           @todo: Is the above right?
           Why care only about the lower priority one?
           Do we need to keep track of all the Filters * FilterEnds that have gone by?
           The existing tests dont seem to require this, they work OK!
           */
        }
      }
      // FilterEnd:
      else if (isFilterEnd(suiteItem)) {
        if (suiteItem instanceof OnlieEnd) onlieEnd = suiteItem
        else if (
          suiteItem instanceof SkipyEnd && // SkipyEnd cancels a Skipy of same or higher priority
          suiteItem.priority <= (skipy?.priority || 0)
        )
          skipy = null
      }

      // FilterIgnore: OnlieMerge / SkipyMute ignores a Filter priority of same or higher priority completely,
      else if (isFilterIgnore(suiteItem)) {
        if (suiteItem instanceof OnlieMerge) onlieIgnore = suiteItem
        else if (suiteItem instanceof SkipyMute) skipyIgnore = suiteItem
      }

      // FilterAbove: OnlieAbove / SkipyAbove in the array, comes "into effect"
      else if (isFilterAbove(suiteItem)) {
        if (suiteItem instanceof OnlieAbove) onlieAbove = suiteItem
        else if (suiteItem instanceof SkipyAbove) skipyAbove = suiteItem
      }

      // **** Suite ****
      else if (suiteItem instanceof Suite) {
        // We have a Suite, handle it recursively
        suiteItem.generateSpecs(
          {
            showSkipped,
            nestingLevel: nestingLevel + 1,
            testRunnerKit,
            // invertOnly,
            // noWarnings,
          },

          // @todo: hide these in a private method
          {
            executableSpecsPerHandler,
            inlineSpecHandlers,
            maxOnlie,
            // maxSkipy,
            onlie,
            skipy,
            onlieEnd,
            skipyIgnore,
            onlieIgnore,
          }
        )
      }
    })

    return { executableSpecsPerHandler, inlineSpecHandlers }
  }
}
