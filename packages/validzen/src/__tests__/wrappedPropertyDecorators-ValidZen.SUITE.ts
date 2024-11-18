import { EACH, FOCUS, ME, ONLY, SKIP, SUITE } from '@neozen/speczen'
import { $IsArrayWithAllowedValues, $IsNumberEnumKeyOrValue } from '../code'

const fooBarObject = { foo: 'bar' }

enum TestEnum {
  foo = 1,
  bar = 2,
}

const IsArrayWithAllowedValuesValidator = $IsArrayWithAllowedValues(['foobar', fooBarObject])
const IsNumberEnumKeyOrValueValidator = $IsNumberEnumKeyOrValue(TestEnum)

export const wrappedPropertyDecorators_ValidZen_SUITE = SUITE(
  'ValidZen WrappedPropertyDecorators as simple Validator Function against a "naked" value',
  [
    SUITE(`$IsArrayWithAllowedValues`, [
      [
        'String in valid values',
        {},
        // @ts-ignore
        () => IsArrayWithAllowedValuesValidator(['foobar']),
      ],
      [
        'Object identity in valid values',
        {},
        // @ts-ignore
        () => IsArrayWithAllowedValuesValidator([fooBarObject]),
      ],
      [
        'Multiple in valid values',
        {},
        // @ts-ignore
        () => IsArrayWithAllowedValuesValidator(['foobar', fooBarObject]),
      ],

      [
        `Non existent value`,
        { tinyLog: false },
        // @ts-ignore
        () => IsArrayWithAllowedValuesValidator(['Non existent value'], 'fooValue'),
        [
          {
            value: ['Non existent value'],
            target: undefined,
            constraints: {
              // @todo: replace undefined with identifier/variable/field name
              //        eg { IsArrayWithAllowedValues: Property 'fooValue' must be one of the following values: foobar, [object Object]' }
              IsArrayWithAllowedValues: `Property 'undefined' must be an Array with any among these Allowed Values: [ 'foobar', { foo: 'bar' } ]`,
            },
            property: undefined,
            validationArgumentsConstraints: [['foobar', { foo: 'bar' }]],
          },
        ],
      ],
    ]),
    SUITE(`$IsNumberEnumKeyOrValue`, [
      [
        'String in valid values',
        {},
        // @ts-ignore
        () => IsNumberEnumKeyOrValueValidator('foo'),
      ],
      [
        'Number side in valid values',
        {},
        // @ts-ignore
        () => IsNumberEnumKeyOrValueValidator(1),
      ],

      [
        `Non existent value`,
        { tinyLog: false },
        () => IsNumberEnumKeyOrValueValidator('Non existent value', 'enumValuePropKey'),
        [
          {
            value: 'Non existent value',
            target: undefined,
            constraints: {
              // @todo: replace undefined with identifier/variable/field name
              //        eg { IsNumberEnumKeyOrValue: Property 'enumValuePropKey' ....
              IsNumberEnumKeyOrValue: `Property 'undefined' equals 'Non existent value' but it must be one of the following enum values (case-insensitive): 1, 2, foo, bar`,
            },
            property: undefined,
            validationArgumentsConstraints: [
              {
                '1': 'foo',
                '2': 'bar',
                bar: 2,
                foo: 1,
              },
              ['1', '2', 'foo', 'bar'],
            ],
          },
        ],
      ],
    ]),
  ]
)
