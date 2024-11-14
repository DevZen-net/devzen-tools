import { SUITE } from '@devzen/speczen'
import { $IsIn, $Max, $Min } from '../code/class-validator-ValidZen-wraps'
import { getValidatorsTypes } from '../code/OrAnd'

export const getValidatorsTypes_SUITE = SUITE(`getValidatorsTypes`, [
  [
    'A getValidatorsTypes array with nested children',
    { tinyLog: false },
    getValidatorsTypes(
      [
        'undefined',
        [
          'number',
          $Min(0),
          [
            $Max(100, {
              message: 'Age must not be greater than 100, what are you, a Highlander?',
            }),
            function isMagicAge() {},
          ],
        ],

        ['string', $IsIn(['Highlander', 'Unborn'])],
      ],
      true
    ),
    `undefined OR (number AND $Min() AND ($Max() OR isMagicAge())) OR (string AND $IsIn())`,
  ],
])
