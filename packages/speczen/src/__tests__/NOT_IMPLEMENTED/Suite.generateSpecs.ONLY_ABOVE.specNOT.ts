// import * as _ from 'lodash'
// import { Suite } from '../code/Suite'
//
// import {
//   BREAKS,
//   COLUMNS,
//   NOPE,
//   EOnliesPriorities,
//   ESkipiesPriorities,
//   FOCUS,
//   ME,
//   ONLY,
//   SKIP,
//   SUITE,
//   TODO,
//   BREAKS_END,
//   NOPE_END,
//   FEAT_END,
//   FOCUS_END,
//   ONLY_END,
//   SKIP_END,
//   LOOK_END,
//   WIP,
//   LOOK,
//   ONLY_ABOVE,
//   WIP_ABOVE,
//   ME_ABOVE,
//   SKIP_MUTE, ONLY_MERGE,
// } from '../code/types'
// import {
//   defaultSUITEOptions,
//   genericTestHandler,
//   resultSpecFromTitles,
// } from './genericTestHandler'

// ********************************
// **** ABOVE, as below!    *******
// ********************************

// WIP
// ***** ONLY_ABOVE  *****
// genericTestHandler([
//   [
//     `ONLY_ABOVE in Nested SUITEs: ONLY applies in sequence GOING UP!`,
//     () =>
//       Suite.generateSpecs(
//         new Suite(
//           SUITE(defaultSUITEargs, [
//             ['Visible_CauseOf_ONLY_ABOVE_below'],
//             SUITE([['Visible_NestedInFocus1']]),
//             ONLY_ABOVE,
//             ['Skipped_CauseOf_ONLY_ABOVE_above'],
//             SUITE([['Skipped_Nested_CauseOf_ONLY_ABOVE_above']]),
//           ])
//         )
//       ),
//     {
//       defaultSpecHandler: resultSpecFromTitles(
//         'Visible_CauseOf_ONLY_ABOVE_below',
//         'Visible_NestedInFocus1'
//       ),
//     },
//   ],
// ])
