import 'reflect-metadata'
import { Type } from 'class-transformer'
import { Max, Min, ValidateNested } from 'class-validator'
import { $IsArrayWithAllowedValues, OrAnd } from '../../code'
import { $IsIn, $Max, $Min } from '../../code/class-validator-ValidZen-wraps'
import { $OrAnd } from '../../code/OrAnd'

const isMagicAge = (value: any) => value === 1984

export class Address {
  @OrAnd('undefined', 'string')
  street?: string

  @OrAnd('undefined', $IsArrayWithAllowedValues(['Athens', 'London']))
  city?: string

  @OrAnd(
    'undefined',
    ['number', $Min(0), $Max(5000)],
    ['string', $IsArrayWithAllowedValues(['No Street', 'No Numbering'])]
  )
  streetNumber?: number | string

  // postCode?: string
}

export class Person {
  @OrAnd(
    'undefined',
    [
      'number',
      $Min(0),
      [
        $Max(100, {
          message: 'Age must not be greater than 100, what are you, a Highlander?',
        }),
        isMagicAge,
      ],
    ],

    ['string', $IsIn(['Highlander', 'Unborn'])]
  )
  ageYears: number | string

  @OrAnd(
    'undefined',
    $OrAnd([ // AND
      'number',
      $Min(0),
      $OrAnd( // OR
        $Max(100, {
          message: 'Age must not be greater than 100, what are you, a Highlander?',
        }),
        isMagicAge,
      ),
    ]),

    $OrAnd(['string', $IsIn(['Highlander', 'Unborn'])]) // AND
  )
  ageYearsWithNested$OrAnd: number | string

  @ValidateNested()
  @Type(() => Address)
  homeAddress?: Address
}

export class Company {
  @ValidateNested()
  @Type(() => Person)
  ceo?: Person

  @ValidateNested({ each: true })
  @Type(() => Person)
  employees?: Person[]
}

export const ageYearsOrAndValidator = $OrAnd(
  'undefined',

  [
    'number',
    $Min(0),
    [
      $Max(100, {
        message: 'Age must not be greater than 100, what are you, a Highlander?',
      }),
      isMagicAge,
    ],
  ],

  ['string', $IsIn(['Highlander', 'Unborn'])]
)
