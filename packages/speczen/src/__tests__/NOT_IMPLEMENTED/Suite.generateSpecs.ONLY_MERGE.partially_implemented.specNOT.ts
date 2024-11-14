// // ******** maxFilters ********
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
//   SKIP_MUTE,
//   ONLY_MERGE,
//   FOCUS_MERGE,
// } from '../../code/types'
// import { Suite } from '../../code/Suite'
// import {
//   defaultSUITEOptions,
//   genericTestHandler,
//   resultSpecFromTitles,
//   titlesFromResultSpec,
// } from '../test-utils/genericTestHandler'
//
// // ***** ONLY_MERGE *****
// genericTestHandler(
//   `ONLY_MERGE: NOT IMPLEMENTED PROPERLY / PARTIAL & FLAWED, SO DONT USE
//        SOME OF THESE TESTS THAT WORK, ARE FISHY AND NEED TO BE REVISITED!
//
// Ignores or "merges" the priorities of any Onlies equal or higher to this priority (in all the Specs and nested Suites that follow), and treat them as a single priority, that will together form a larger & less exclusive group.
//
//      * For example \`ONLY_MERGE\`, will ignore ONLY priority & higher (eg FOCUS, SOLO & ME) and the highest exclusive group that would form to be **exclusively in focus**.
//      * Instead, it will form one groups of ONLY and higher, that includes:
//      *  - ALL Specs with ONLY and higher (including FOCUS, SOLO, ME) will be visible, since they form a new larger exclusive-group!
//      *  - BUT, the ones lower, (eg LOOK), will be still be excluded, cause LOOK is lower than the previous to FOCUS (which is ONLY).
//      *
//      * It acts as a temporary & local Onlie Max Priority (that is reset to the previous value, when the Suite ends).
//      * It is useful for example, when you want to focus on a specific Spec, but you want to ignore the higher priorities (eg FOCUS, SOLO, ME) that would form an exclusive group.
//    `,
//   [
//     [
//       `ONLY_MERGE: Simplest where ONLY & higher are merged into a single group`,
//       () =>
//         new Suite(
//           SUITE(ONLY_MERGE, defaultSUITEOptions, [
//             ONLY,
//             ['visible1'], // visible despite being in an ONLY block, cause ONLY is ignored, ie merged with higher priorities
//             [ONLY, 'visible2'],
//
//             FOCUS,
//             ['Visible_InFocus1'],
//           ])
//         ).generateSpecs(),
//       resultSpecFromTitles({
//         defaultSpecHandler: ['visible1', 'visible2', 'Visible_InFocus1'],
//       }),
//     ],
//
//     // BREAKS, but should work?
//     // [
//     //   `ONLY_MERGE: Simplest where ONLY & higher are merged. A lower priority appears in between, but is ignored`,
//     //   () =>
//     //
//     //       new Suite(
//     //         SUITE(ONLY_MERGE, defaultSUITEOptions, [
//     //
//     //           ONLY,
//     //           ['visible1'],
//     //
//     //           LOOK,
//     //           ['Skipped CauseOf ONLY and higher in exclusivity'],
//     //           LOOK_END,
//     //
//     //           ['Visible_Despite_of_FOCUS_below_as_part_of_ONLY_above1'],
//     //
//     //           FOCUS,
//     //           ['Visible_InFocus1'],
//     //         ])
//     //       ).generateSpecs(),
//     //     resultSpecFromTitles({defaultSpecHandler: [
//     //       'visible1',
//     //       'Visible_Despite_of_FOCUS_below_as_part_of_ONLY_above1',
//     //       'Visible_InFocus1'
//     //       ]
//     //   }),
//     // ],
//
//     [
//       `ONLY_MERGE: WIP....`,
//       () =>
//         new Suite(
//           SUITE(ONLY_MERGE, defaultSUITEOptions, [
//             ['Skipped Cause Of ONLY groups forming'],
//
//             ONLY, // Since ONLY & above priorities are ignored, ONLY is now the highest Onlie, so this is visible
//             ['visible1'],
//
//             SUITE(ONLY, [
//               ['visible2'], // Since FOCUS is in the ignored priorities, ONLY is now the highest Onlie, so this is visible
//
//               [FOCUS, 'visible3'], // FOCUS is still visible, as part of the new less exclusive ONLY group
//             ]),
//
//             SUITE(LOOK, [
//               ['SKipped, it has LOOK priority, not in our focus'],
//               [ONLY, 'visible4'], // Since FOCUS is ignored, ONLY is now the highest Onlie, so this is visible
//
//               [ME, 'visible5'], // ME is higher than ONLY, so still visible, but ignored in terms of stealing the exclusivity.
//               // Me is the highest of all in this Suite, so if it weren't for ONLY_MERGE, it would have stolen the exclusivity, and would have been the only visible Spec.
//             ]),
//
//             ['visible6'],
//             ONLY_END, // ***** ONLY block stops here (stops the above ONLY)
//
//             ['Skipped Cause ONLY group ENDed'],
//           ])
//         ).generateSpecs(),
//       resultSpecFromTitles({
//         defaultSpecHandler: [
//           'visible1',
//           'visible2',
//           'visible3',
//           'visible4',
//           'visible5',
//           'visible6',
//         ],
//       }),
//     ],
//     [
//       `ONLY_MERGE: ONLY ignore, without any ONLY in place, but only above it`,
//       () =>
//         new Suite(
//           SUITE(ONLY_MERGE, defaultSUITEOptions, [
//             ['Skipped Cause Of Onlies groups forming, not part in any'],
//
//             SUITE([
//               ['Skipped Cause Of Onlies groups forming, not part in any'],
//               [FOCUS, 'visible1'], // FOCUS is still visible, as part of the new less exclusive ONLY group
//             ]),
//
//             SUITE(LOOK, [
//               ['SKipped, it has LOOK priority, not in our focus'],
//               [ME, 'visible2'], // ME is higher than ONLY, so still visible, but ignored in terms of stealing the exclusivity.
//               // Me is the highest of all in this Suite, so if it weren't for ONLY_MERGE, it would have stolen the exclusivity, and would have been the only visible Spec.
//             ]),
//             ['Skipped Cause not part of any exclusive Onlie group'],
//           ])
//         ).generateSpecs(),
//       resultSpecFromTitles({
//         defaultSpecHandler: ['visible1', 'visible2'],
//       }),
//     ],
//     [
//       `ONLY_MERGE: Complicated examples with nested Suites & multiple Onlie levels`,
//       () =>
//         new Suite(
//           SUITE(ONLY_MERGE, defaultSUITEOptions, [
//             ['skippedCauseOfONLY/FOCUSbelow'],
//
//             ONLY, // ***** Only & higher priorities are ignored/merged and grouped together, so ONLY is included in this less-exclusive/more-inclusive group
//             ['visible1'],
//
//             SUITE(ONLY, [
//               ['Visible_Nested_Despite_of_FOCUS_below1'],
//
//               [FOCUS, 'Visible_NestedInFocus1'], // ***** FOCUS Spec is visible, ONLY is ignored
//             ]),
//
//             // LOOK, // ***** LOOK block starts here (and stops below) - should be ignored
//             // ['Skipped CauseOf ONLY and higher in exclusivity'],
//             // SUITE([
//             //   ['Skipped CauseOf ONLY and higher in exclusivity'],
//             // ]),
//             // LOOK_END, // ***** LOOK block stops here (stops the above LOOK) - should be ignored
//
//             ['Visible_Despite_of_FOCUS_below_as_part_of_ONLY_above1'],
//
//             FOCUS, // ***** FOCUS block starts here (and stops below) But no longer in effect, cause of FOCUS_MUTE
//             ['Visible_InFocus1'],
//             ['Visible_InFocus2'],
//             SUITE([['Visible_NestedInFocus1'], ['Visible_NestedInFocus2']]),
//             ['Visible_InFocus3'],
//             FOCUS_END, // ***** FOCUS block stops here (stops the above FOCUS)
//
//             ['Visible_Despite_of_FOCUS_above_as_part_of_ONLY_above2'],
//             [
//               ONLY,
//               'Visible_Despite_of_FOCUS_above_cause_of_ONLY_and_ignoreOnliesAbovePriority',
//             ],
//             ONLY_END, // ***** ONLY block stops here (stops the above ONLY)
//
//             ['Skipped Cause ONLY group ENDed'],
//           ])
//         ).generateSpecs(),
//       resultSpecFromTitles({
//         defaultSpecHandler: [
//           'visible1',
//           'Visible_Nested_Despite_of_FOCUS_below1',
//           'Visible_NestedInFocus1',
//           'Visible_Despite_of_FOCUS_below_as_part_of_ONLY_above1',
//           'Visible_InFocus1',
//           'Visible_InFocus2',
//           'Visible_NestedInFocus1',
//           'Visible_NestedInFocus2',
//           'Visible_InFocus3',
//           'Visible_Despite_of_FOCUS_above_as_part_of_ONLY_above2',
//           'Visible_Despite_of_FOCUS_above_cause_of_ONLY_and_ignoreOnliesAbovePriority',
//         ],
//       }),
//     ],
//   ],
//   titlesFromResultSpec
// )
