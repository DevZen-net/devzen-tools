import {
  COLUMNS,
  EACH,
  ONLY,
  SKIP,
  SUITE,
  T_SUITEArray_ExcludeColumnsAndEach,
  TSpecBody_ExcludeAllCommandsButEach,
  TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore,
 ColumnsCmd } from '../../code/types'

import { FooClass } from './types-typings-passing-tests.prettier-ignore'

import { getTinyLog } from '../../code/utils/tiny-log'
const _log = getTinyLog(false, 'LogZen')

// @ts-expect-error
const noColumnError1: T_SUITEArray_ExcludeColumnsAndEach = new ColumnsCmd()
// @ts-expect-error
const noColumnError2: T_SUITEArray_ExcludeColumnsAndEach = COLUMNS('id', 'name')
// @ts-expect-error
const noColumnError3: T_SUITEArray_ExcludeColumnsAndEach = COLUMNS
// @ts-expect-error
const noColumnError4: T_SUITEArray_ExcludeColumnsAndEach = 'a'
// @ts-expect-error
const noColumnError5: T_SUITEArray_ExcludeColumnsAndEach = 1
// @ts-expect-error
const noColumnError6: T_SUITEArray_ExcludeColumnsAndEach = () => {}
// @ts-expect-error
const noColumnError7: T_SUITEArray_ExcludeColumnsAndEach = {}
// @ts-expect-error
const noColumnError8: T_SUITEArray_ExcludeColumnsAndEach = new FooClass()
// @ts-expect-error
const noColumnError9: T_SUITEArray_ExcludeColumnsAndEach = EACH('foo', 'bar')


// @ts-expect-error EACH without call, inside Spec
const noColumnError10: T_SUITEArray_ExcludeColumnsAndEach = [EACH]
// @ts-expect-error EACH without call in SUITE Array
const noColumnError11: T_SUITEArray_ExcludeColumnsAndEach = EACH
// @ts-expect-error EACH call inside Spec without args!
const noColumnError12: T_SUITEArray_ExcludeColumnsAndEach = [EACH()]
// @ts-expect-error EACH call in SUITE without args!
const noColumnError12: T_SUITEArray_ExcludeColumnsAndEach = EACH()

// @ts-expect-error
const noColumnError161: T_SUITEArray_ExcludeColumnsAndEach = SUITE

// Should PASS, not fail
const noColumnOK3: T_SUITEArray_ExcludeColumnsAndEach = SKIP
const noColumnOK4: T_SUITEArray_ExcludeColumnsAndEach = SKIP()
const noColumnOK5: T_SUITEArray_ExcludeColumnsAndEach = ONLY
const noColumnOK6: T_SUITEArray_ExcludeColumnsAndEach = ONLY()

const noColumnOK322: T_SUITEArray_ExcludeColumnsAndEach = [SKIP]
const noColumnOK422: T_SUITEArray_ExcludeColumnsAndEach = [SKIP()]
const noColumnOK522: T_SUITEArray_ExcludeColumnsAndEach = [ONLY]
const noColumnOK622: T_SUITEArray_ExcludeColumnsAndEach = [ONLY()]

const noColumnOK62: T_SUITEArray_ExcludeColumnsAndEach = [EACH([], [], [])]
const noColumnOK63: T_SUITEArray_ExcludeColumnsAndEach = SUITE([])

const noColumnOK11: T_SUITEArray_ExcludeColumnsAndEach = []
const noColumnOK12: T_SUITEArray_ExcludeColumnsAndEach = ['a', 1, () => {}, {}]


// TSpecBody_ExcludeAllCommandsButEach

// @ts-expect-error
const noCommandError2: TSpecBody_ExcludeAllCommandsButEach = SKIP()
// @ts-expect-error
const noCommandError3: TSpecBody_ExcludeAllCommandsButEach = SKIP
// @ts-expect-error
const noCommandError4: TSpecBody_ExcludeAllCommandsButEach = ONLY()
// @ts-expect-error
const noCommandError5: TSpecBody_ExcludeAllCommandsButEach = ONLY
// @ts-expect-error
const noCommandError6: TSpecBody_ExcludeAllCommandsButEach = COLUMNS('id', 'name')
// @ts-expect-error
const noCommandError7: TSpecBody_ExcludeAllCommandsButEach = COLUMNS
// @ts-expect-error
const noCommandError10: TSpecBody_ExcludeAllCommandsButEach = SUITE([])
// @ts-expect-error
const noCommandError11: TSpecBody_ExcludeAllCommandsButEach = SUITE
// @ts-expect-error
const noCommandError9: TSpecBody_ExcludeAllCommandsButEach = EACH

// Anything BUT Command (but EACH) works - Should PASS, NOT fail
const noCommandError8: TSpecBody_ExcludeAllCommandsButEach = EACH(['foo'], ['bar'])
const noCommandOK7: TSpecBody_ExcludeAllCommandsButEach = 'a'
const noCommandOK8: TSpecBody_ExcludeAllCommandsButEach = 1
const noCommandOK9: TSpecBody_ExcludeAllCommandsButEach = () => {}
const noCommandOK10: TSpecBody_ExcludeAllCommandsButEach = {}
const noCommandOK11: TSpecBody_ExcludeAllCommandsButEach = []
const noCommandOK12: TSpecBody_ExcludeAllCommandsButEach = ['a', 1, () => {}, {}]
const noCommandOK13: TSpecBody_ExcludeAllCommandsButEach = new FooClass()

// TExclusiveFiltersOrFilterEnds

// Spec-like
// @ts-expect-error
const exclusiveFiltersCantBeASpec1: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = ['readTest1', 23]
// @ts-expect-error
const exclusiveFiltersCantBeASpec2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = [SKIP, 'readTest1', 23]
// @ts-expect-error
const exclusiveFiltersCantBeASpec2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = ColumnsCmd
// @ts-expect-error
const exclusiveFiltersCantBeASpec2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = COLUMNS('id', 'name')
// @ts-expect-error
const exclusiveFiltersCantBeASpec2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = COLUMNS
// @ts-expect-error
const exclusiveFiltersCantBeASpec2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = EACH('foo', 'bar')
// @ts-expect-error
const exclusiveFiltersCantBeASpec2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = EACH
// @ts-expect-error
const exclusiveFiltersCantBeASpec2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = SUITE([])
// @ts-expect-error
const exclusiveFiltersCantBeASpec2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = SUITE

// Any random thing
// @ts-expect-error
const exclusiveFiltersCantBeAnything1: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = { fooProp: 'foo' }
// @ts-expect-error
const exclusiveFiltersCantBeAnything2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = new FooClass()
// @ts-expect-error
const exclusiveFiltersCantBeAnything3: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = {}
// @ts-expect-error
const exclusiveFiltersCantBeAnything4: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = {reason:'foo'}
// @ts-expect-error
const exclusiveFiltersCantBeAnything5: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = 1
// @ts-expect-error
const exclusiveFiltersCantBeAnything6: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = 'a'
// @ts-expect-error
const exclusiveFiltersCantBeAnything7: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = () => {}

// Any Filter - Should NOT fail
const exclusiveFiltersOK1: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = SKIP
const exclusiveFiltersOK2: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = SKIP()
const exclusiveFiltersOK3: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = ONLY
const exclusiveFiltersOK4: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = ONLY()


