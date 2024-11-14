import { SUITE } from '@devzen/speczen'

import { getValidationErrorsString } from '../code'

export const getValidationErrorsString_SUITE = SUITE(`getValidationErrorsString`, [
  [
    'A ValidationErrors array with nested children',
    { tinyLog: false },
    getValidationErrorsString([
      {
        constraints: { OrAnd: `Property 'fooBar' failed` },
        property: 'fooBar',
        target: new (class FooBarHolder {
          fooBar = 'foobarValue'
        })(),
        value: -1,
        children: [
          {
            constraints: {
              OrAnd:
                'undefined OR (number AND $Min() AND ($Max() OR isMagicAge())) OR (string AND $IsIn())',
            },
            children: [
              { constraints: { undefined: 'wrong type / check failed' } },
              {
                constraints: { OrAnd: 'number AND $Min() AND ($Max() OR isMagicAge())' },
                children: [
                  {
                    constraints: { Min: 'undefined must not be less than 0' },
                    validationArgumentsConstraints: [0],
                  },
                ],
              },
              {
                constraints: { OrAnd: 'string AND $IsIn()' },
                children: [{ constraints: { string: 'wrong type / check failed' } }],
              },
            ],
          },
        ],
      },
    ]),

    ` - OrAnd (Property 'fooBar' failed)
   - OrAnd (undefined OR (number AND $Min() AND ($Max() OR isMagicAge())) OR (string AND $IsIn()))
     - undefined (wrong type / check failed)
     - OrAnd (number AND $Min() AND ($Max() OR isMagicAge()))
       - Min (undefined must not be less than 0)
     - OrAnd (string AND $IsIn())
       - string (wrong type / check failed)
_______________________________________________________
at 'fooBar'
 - value = -1
 - target = FooBarHolder { fooBar: 'foobarValue' }
 - class = '[class FooBarHolder]'`,
  ],
])
