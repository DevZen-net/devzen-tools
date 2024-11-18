import { EACH, FOCUS, ME, ONLY, SKIP, SUITE } from '@neozen/speczen'
import * as _ from 'lodash'
import { $Equals, $IsIn, $Max, $Min } from '../code/class-validator-ValidZen-wraps'

const fooBarObject = { foo: 'bar' }

const isInValidator = $IsIn(['foobar', fooBarObject])
const minValidator = $Min(42)
const maxValidator = $Max(64)
const equalsValidator = $Equals(fooBarObject, {
  // message: 'Value is not equal'
})

export const wrappedPropertyDecorators_ClassValidator_SUITE = SUITE(
  'ClassValidator WrappedPropertyDecorators as simple Validator Function against a "naked" value',
  [
    SUITE(`$IsIn`, [
      [
        'String in valid values',
        {},
        // @ts-ignore
        () => isInValidator('foobar'),
      ],
      [
        'Object identity in valid values',
        {},
        // @ts-ignore
        () => isInValidator(fooBarObject),
      ],

      [
        `Non existent value`,
        { tinyLog: false },
        // @ts-ignore
        () => isInValidator('Non existent value', 'fooValue'),
        [
          {
            value: 'Non existent value',
            target: undefined,
            constraints: {
              // @todo: replace undefined with identifier/variable/field name
              //        eg { IsIn: 'fooValue must be one of the following values: foobar, [object Object]' }
              IsIn: 'undefined must be one of the following values: foobar, [object Object]',
            },
            property: undefined,
            validationArgumentsConstraints: [['foobar', { foo: 'bar' }]],
          },
        ],
      ],
    ]),
    SUITE(`$Min`, [
      [
        'Valid value',
        {},
        // @ts-ignore
        () => minValidator(42), // @todo: remove requirement for propertyKey
      ],
      [
        `Invalid value`,
        { tinyLog: false },
        () => minValidator(41, 'minValue'), // @todo: prepertyKey not working
        [
          {
            value: 41,
            target: undefined,
            constraints: {
              // @todo: replace undefined with identifier/variable/field name
              //        eg { IsIn: minValue must be one of the following values: foobar, [object Object]' }
              Min: 'undefined must not be less than 42',
            },
            property: undefined,
            validationArgumentsConstraints: [42],
          },
        ],
      ],
    ]),
    SUITE(`$Max`, [
      [
        'Valid value',
        {},
        // @ts-ignore
        () => maxValidator(64), // @todo: remove requirement for propertyKey
      ],
      [
        `Invalid value`,
        { tinyLog: false },
        () => maxValidator(165, 'maxValue'), // @todo: prepertyKey not working
        [
          {
            value: 165,
            target: undefined,
            constraints: {
              // @todo: replace undefined with identifier/variable/field name
              //        eg { IsIn: minValue must be one of the following values: foobar, [object Object]' }
              Max: 'undefined must not be greater than 64',
            },
            property: undefined,
            validationArgumentsConstraints: [64],
          },
        ],
      ],
    ]),
    SUITE(`$Equals`, [
      [
        'Valid value',
        {},
        // @ts-ignore // @todo: remove requirement for propertyKey
        () => equalsValidator(fooBarObject),
      ],
      [
        `Invalid value`,
        { tinyLog: false },
        // _.clone(fooBarObject) also fails
        () => equalsValidator({ wrong: 'object' }, 'equalsValue'), // @todo: propertyKey not working
        [
          {
            value: { wrong: 'object' },
            target: undefined,
            constraints: {
              // @todo: replace undefined with identifier/variable/field name
              Equals: 'undefined must be equal to [object Object]',
            },
            property: undefined,
            validationArgumentsConstraints: [fooBarObject],
          },
        ],
      ],
    ]),
  ]
)
