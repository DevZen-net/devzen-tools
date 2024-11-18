import { EACH, FOCUS, ME, ONLY, SKIP, SUITE } from '@neozen/speczen'
import * as _ from 'lodash'
import { $OrAnd } from '../code'

// local
import {
  Address,
  ageYearsOrAndValidator,
  Company,
  Person,
} from './fixtures/company-person-address'

export const OrAnd_SUITE = SUITE(
  {
    title: 'ValidZen OrAnd',
  },
  [
    SUITE(`As class Decorator, validate object`, [
      [
        'unknown object',
        {},
        {},
        `
ValidZen: Validation Errors:
 - unknownValue (an unknown value was passed to the validate function)
_______________________________________________________
at ''
 - value = undefined
 - target = {}
 - class = '[Function: Object]'
`,
      ],
      [
        'unknown value',
        {},
        'foobar',
        `
ValidZen: Validation Errors:
 - (transformAndValidateSyncFix): not a Real Object. Expecting any kind of object {} but got 'foobar':
   - Invalid Value = 'foobar'
   - Validation Class = 'undefined'
 - path = ''
    `,
      ],
      SUITE(`Simple OR Validation`, [
        [`Valid undefined or string: Address.street`, {}, [{ street: 'Foo Street' }, Address]],
        [`Valid undefined or string: Address.street`, {}, [{ street: undefined }, Address]],
        [
          `NOT Valid undefined or string: Address.street`,
          {},
          [{ street: 123 }, Address],
          `ValidZen: Validation Errors:
 - OrAnd (Property 'street' failed)
   - OrAnd (undefined OR string)
     - undefined (wrong type / check failed)
     - string (wrong type / check failed)
_______________________________________________________
at 'street'
 - value = 123
 - target = Address { street: 123 }
 - class = '[class Address]'`,
        ],
      ]),
      SUITE('Composed Complex Validation: ageYears', [
        ['Number in range: single Person', {}, _.extend(new Person(), { ageYears: 99 })],
        [
          'Number in range: multiple Persons, as instance',
          {},
          _.extend(new Company(), { employees: [{ ageYears: 99 }] }),
        ],
        [
          'Number in range: multiple Persons, as plain Object with Class',
          {},
          [{ employees: [{ ageYears: 99 }] }, Company],
        ],
        [
          `Value 'Highlander' in $IsIn in single Instance:`,
          {},
          _.extend(new Company(), { ceo: { ageYears: 'Highlander' } }),
        ],
        [`Value 'Unborn' in Plain Object + Class:`, {}, [{ ageYears: 'Unborn' }, Person]],
        [
          `Value 'Highlander' in $IsIn in multiple Instances:`,
          {},
          _.extend(new Company(), { employees: [{ ageYears: 'Highlander' }] }),
        ],
        [
          `Value 'Highlander' in $IsIn in multiple Objects:`,
          {},
          [
            {
              employees: [
                EACH({ ageYears: 'Highlander' }, { ageYearsWithNested$OrAnd: 'Highlander' }),
              ],
            },
            Company,
          ],
        ],
        // SpecZen EACH to the rescue, so we repeat the input data as both Instance & Plain Object + Class
        [
          `Testing single Person with invalid value, at decorator Min **without description**: {ageYears: -1}`,
          {},
          EACH(
            [[{ ceo: { ageYears: -1 } }, Company]], // SpecHandler handles [ plainObject, Class ]
            [_.extend(new Company(), { ceo: { ageYears: -1 } })]
          ),
          `
ValidZen: Validation Errors:
 - OrAnd (Property 'ageYears' failed)
   - OrAnd (undefined OR (number AND $Min() AND ($Max() OR isMagicAge())) OR (string AND $IsIn()))
     - undefined (wrong type / check failed)
     - OrAnd (number AND $Min() AND ($Max() OR isMagicAge()))
       - Min (ageYears must not be less than 0)
     - OrAnd (string AND $IsIn())
       - string (wrong type / check failed)
_______________________________________________________
at 'ageYears'
 - value = -1
 - target = Person { ageYears: -1 }
 - class = '[class Person]'
`, // @todo: where is path = ?
        ],
        [
          `Testing single Person with invalid value, with decorator Max with description: {ageYears: 101}`,
          {},
          EACH(
            [[{ employees: [{ ageYears: 101 }] }, Company]],
            [_.extend(new Company(), { ceo: { ageYears: 101 } })]
          ),
          `
ValidZen: Validation Errors:
 - OrAnd (Property 'ageYears' failed)
   - OrAnd (undefined OR (number AND $Min() AND ($Max() OR isMagicAge())) OR (string AND $IsIn()))
     - undefined (wrong type / check failed)
     - OrAnd (number AND $Min() AND ($Max() OR isMagicAge()))
       - OrAnd ($Max() OR isMagicAge())
         - Max (Age must not be greater than 100, what are you, a Highlander?)
         - isMagicAge() (failed / returned falsey)
     - OrAnd (string AND $IsIn())
       - string (wrong type / check failed)
_______________________________________________________
at 'ageYears'
 - value = 101
 - target = Person { ageYears: 101 }
 - class = '[class Person]'
`,
        ],
        [
          `Testing Nested $OrAnd {ageYearsWithNested$OrAnd: 101}`,
          {},
          EACH(
            [[{ employees: [{ ageYearsWithNested$OrAnd: 101 }] }, Company]],
            [_.extend(new Company(), { ceo: { ageYearsWithNested$OrAnd: 101 } })]
          ),
          `
ValidZen: Validation Errors:
 - OrAnd (Property 'ageYearsWithNested$OrAnd' failed)
   - OrAnd (undefined OR $OrAnd() OR $OrAnd())
     - undefined (wrong type / check failed)
     - OrAnd (Property 'ageYearsWithNested$OrAnd' failed)
       - OrAnd ((number AND $Min() AND $OrAnd()))
         - OrAnd (number AND $Min() AND $OrAnd())
           - OrAnd (Property 'ageYearsWithNested$OrAnd' failed)
             - OrAnd ($Max() OR isMagicAge())
               - Max (Age must not be greater than 100, what are you, a Highlander?)
               - isMagicAge() (failed / returned falsey)
     - OrAnd (Property 'ageYearsWithNested$OrAnd' failed)
       - OrAnd ((string AND $IsIn()))
         - OrAnd (string AND $IsIn())
           - string (wrong type / check failed)
_______________________________________________________
at 'ageYearsWithNested$OrAnd'
 - value = 101
 - target = Person { 'ageYearsWithNested$OrAnd': 101 }
 - class = '[class Person]'
`,
        ],
        [
          `Testing single Person with 'ageYears' with invalid value {ageYears: 'WrongString'}`,
          { tinyLog: false },
          EACH(
            [[{ employees: [{ ageYears: 'WrongString' }] }, Company]],
            [_.extend(new Company(), { ceo: { ageYears: 'WrongString' } })]
          ),
          `
ValidZen: Validation Errors:
 - OrAnd (Property 'ageYears' failed)
   - OrAnd (undefined OR (number AND $Min() AND ($Max() OR isMagicAge())) OR (string AND $IsIn()))
     - undefined (wrong type / check failed)
     - OrAnd (number AND $Min() AND ($Max() OR isMagicAge()))
       - number (wrong type / check failed)
     - OrAnd (string AND $IsIn())
       - IsIn (ageYears must be one of the following values: Highlander, Unborn)
_______________________________________________________
at 'ageYears'
 - value = 'WrongString'
 - target = Person { ageYears: 'WrongString' }
 - class = '[class Person]'
`,
        ],
      ]),
    ]),
    SUITE(`As simple Validator Function against a "naked" value`, [
      [
        'Number in range',
        {},
        // @ts-ignore
        () => ageYearsOrAndValidator(99),
      ],
      [
        `string 'Highlander', in $IsIn:`,
        {},
        // @ts-ignore
        () => ageYearsOrAndValidator('Highlander'),
      ],
      [
        // ME,
        `decorator Min **without description**`,
        {},
        // @ts-ignore
        () => ageYearsOrAndValidator(-1, 'ageYears'),
        [
          {
            // @todo: replace undefined with identifier/variable/field name
            //        eg constraints: { OrAnd: "Property 'ageYears' failed" },
            constraints: { OrAnd: "Property 'undefined' failed" },
            property: undefined,
            target: undefined,
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
        ],
      ],
      SKIP('Change to simple validator function mode'),
      [
        `Testing single Person with invalid value, with decorator Max with description: {ageYears: 101}`,
        {},
        _.extend(new Company(), { ceo: { ageYears: 101 } }),
        `
ValidZen: Validation Errors:
 - OrAnd (Property 'ageYears' failed)
   - OrAnd (undefined OR (number AND $Min() AND ($Max() OR isMagicAge())) OR (string AND $IsIn()))
     - undefined (wrong type / check failed)
     - OrAnd (number AND $Min() AND ($Max() OR isMagicAge()))
       - OrAnd ($Max() OR isMagicAge())
         - Max (Age must not be greater than 100, what are you, a Highlander?)
         - isMagicAge() (failed / returned falsey)
     - OrAnd (string AND $IsIn())
       - string (wrong type / check failed)
_______________________________________________________
at 'ageYears'
 - value = 101
 - target = Person { ageYears: 101 }
 - class = '[class Person]'
`,
      ],
      [
        `Testing single Person with 'ageYears' with invalid value {ageYears: 'WrongString'}`,
        {},
        _.extend(new Company(), { ceo: { ageYears: 'WrongString' } }),
        `
ValidZen: Validation Errors:
 - OrAnd (Property 'ageYears' failed)
   - OrAnd (undefined OR (number AND $Min() AND ($Max() OR isMagicAge())) OR (string AND $IsIn()))
     - undefined (wrong type / check failed)
     - OrAnd (number AND $Min() AND ($Max() OR isMagicAge()))
       - number (wrong type / check failed)
     - OrAnd (string AND $IsIn())
       - IsIn (ageYears must be one of the following values: Highlander, Unborn)
_______________________________________________________
at 'ageYears'
 - value = 'WrongString'
 - target = Person { ageYears: 'WrongString' }
 - class = '[class Person]'
`,
      ],
    ]),
    SUITE(`Type / Conformity tests`, [
      SUITE(`boolean`, [
        [`boolean true`, {}, () => $OrAnd('boolean')(true, 'dummyPropKey')],
        [`boolean false`, {}, () => $OrAnd('boolean')(false, 'dummyPropKey')],
        [
          `boolean fail`,
          {},
          () => $OrAnd('boolean')('false', 'dummyPropKey'),
          [
            {
              children: [
                {
                  children: [{ constraints: { boolean: 'wrong type / check failed' } }],
                  constraints: { OrAnd: 'boolean' },
                },
              ],
              constraints: { OrAnd: "Property 'undefined' failed" },
              property: undefined,
              target: undefined,
              value: 'false',
            },
          ],
        ],
      ]),
      SUITE(`booleanString`, [
        [`booleanString 'true'`, {}, () => $OrAnd('booleanString')('true', 'dummyPropKey')],
        [`booleanString 'false'`, {}, () => $OrAnd('booleanString')('false', 'dummyPropKey')],
        [
          `boolean fail`,
          {},
          () => $OrAnd('booleanString')(true, 'dummyPropKey'),
          [
            {
              children: [
                {
                  children: [{ constraints: { booleanString: 'wrong type / check failed' } }],
                  constraints: { OrAnd: 'booleanString' },
                },
              ],
              constraints: { OrAnd: "Property 'undefined' failed" },
              property: undefined,
              target: undefined,
              value: true,
            },
          ],
        ],
      ]),
      SUITE(`JSON`, [
        [`JSON`, {}, () => $OrAnd('JSON')('{"is_json": true}', 'dummyPropKey')],
        [
          `JSON fail`,
          {},
          () => $OrAnd('JSON')(`{'is_json': false}`, 'dummyPropKey'),
          [
            {
              children: [
                {
                  children: [{ constraints: { JSON: 'wrong type / check failed' } }],
                  constraints: { OrAnd: 'JSON' },
                },
              ],
              constraints: { OrAnd: "Property 'undefined' failed" },
              property: undefined,
              target: undefined,
              value: `{'is_json': false}`,
            },
          ],
        ],
      ]),
      SUITE(`decimal`, [
        [`decimal`, {}, () => $OrAnd('decimal')(1.23, 'dummyPropKey')],
        [
          `decimal fail`,
          {},
          () => $OrAnd('decimal')(123, 'dummyPropKey'),
          [
            {
              children: [
                {
                  children: [{ constraints: { decimal: 'wrong type / check failed' } }],
                  constraints: { OrAnd: 'decimal' },
                },
              ],
              constraints: { OrAnd: "Property 'undefined' failed" },
              property: undefined,
              target: undefined,
              value: 123,
            },
          ],
        ],
      ]),
      SUITE(`hash_crc32`, [
        [`hash_crc32`, {}, () => $OrAnd('hash_crc32')('DA8D634A', 'dummyPropKey')],
        [
          `hash_crc32 fail`,
          {},
          () => $OrAnd('hash_crc32')('NOT_CRC', 'dummyPropKey'),
          [
            {
              children: [
                {
                  children: [{ constraints: { hash_crc32: 'wrong type / check failed' } }],
                  constraints: { OrAnd: 'hash_crc32' },
                },
              ],
              constraints: { OrAnd: "Property 'undefined' failed" },
              property: undefined,
              target: undefined,
              value: 'NOT_CRC',
            },
          ],
        ],
      ]),
      SUITE(`MACAddress`, [
        SUITE(`MACAddress strict`, [
          [`MACAddressStrict`, {}, () => $OrAnd('MACAddressStrict')('13:50:56:C0:00:08', 'dummyPropKey')],
          [`MACAddressStrict`, {}, () => $OrAnd('MACAddressStrict')('13-50-56-C0-00-08', 'dummyPropKey')],
          [`MACAddressStrict`, {}, () => $OrAnd('MACAddressStrict')('13 50 56 C0 00 08', 'dummyPropKey')],
          [`MACAddressStrict`, {}, () => $OrAnd('MACAddressStrict')('135056C00008', 'dummyPropKey'),
            [
              {
                children: [
                  {
                    children: [{ constraints: { MACAddressStrict: 'wrong type / check failed' } }],
                    constraints: { OrAnd: 'MACAddressStrict' },
                  },
                ],
                constraints: { OrAnd: `Property 'undefined' failed` },
                property: undefined,
                target: undefined,
                value: '135056C00008',
              },
            ]
          ],
        ]),
        SUITE(`MACAddress loose`, [
          [`MACAddress`, {}, () => $OrAnd('MACAddress')('13-50-56-C0-00-08', 'dummyPropKey')],
          [`MACAddress`, {}, () => $OrAnd('MACAddress')('13:50:56:C0:00:08', 'dummyPropKey')],
          [`MACAddress`, {}, () => $OrAnd('MACAddress')('13 50 56 C0 00 08', 'dummyPropKey')],
          [`MACAddress`, {}, () => $OrAnd('MACAddress')('135056C00008', 'dummyPropKey'), ],
          [
            `MACAddress fail`,
            {},
            () => $OrAnd('MACAddress')('00-10-50-56-C0-00-08', 'dummyPropKey'),
            [
              {
                children: [
                  {
                    children: [{ constraints: { MACAddress: 'wrong type / check failed' } }],
                    constraints: { OrAnd: 'MACAddress' },
                  },
                ],
                constraints: { OrAnd: `Property 'undefined' failed` },
                property: undefined,
                target: undefined,
                value: '00-10-50-56-C0-00-08',
              },
            ],
          ],
        ]),
      ]),
      SUITE(`pass-only Type / Conformity tests`, [
        [
          `hash_md5`,
          {},
          () => $OrAnd('hash_md5')('6b03fbaac4bab7758de5b70d95731bba', 'dummyPropKey'),
        ],
        [
          `hash_sha512`,
          {},
          () =>
            $OrAnd('hash_sha512')(
              '21ff80ed49fba04428626b5506b4f05ed8150557e8030fc3149a4f592c1c54ab09d9d2f0e97ae8c62e75d92e80944814cbfd799b4d28e90699614b67b26aeba3',
              'dummyPropKey'
            ),
        ],
        [`email`, {}, () => $OrAnd('email')('a@foo.com', 'dummyPropKey')],
        SUITE(`empty`, [
          [`string`, {}, () => $OrAnd('empty')('', 'dummyPropKey')],
          [`array`, {}, () => $OrAnd('empty')([], 'dummyPropKey')],
          [`object`, {}, () => $OrAnd('empty')({}, 'dummyPropKey')],
        ]),
        [`function`, {}, () => $OrAnd('function')(() => {}, 'dummyPropKey')],
        [`hexColor`, {}, () => $OrAnd('hexColor')('ABCD', 'dummyPropKey')],
        [`map`, {}, () => $OrAnd('map')(new Map(), 'dummyPropKey')],
        [`map`, {}, () => $OrAnd('weakMap')(new WeakMap(), 'dummyPropKey')],
        [`native`, {}, () => $OrAnd('native')(String.raw, 'dummyPropKey')],
        [`null`, {}, () => $OrAnd('null')(null, 'dummyPropKey')],
        [`numberString`, {}, () => $OrAnd('numberString')('1.23', 'dummyPropKey')],
        [`primitive`, {}, () => $OrAnd('primitive')(123, 'dummyPropKey')],
        [`realObject`, {}, () => $OrAnd('realObject')(new (class Foo {})(), 'dummyPropKey')],
        [`semVer`, {}, () => $OrAnd('semVer')('1.2.3', 'dummyPropKey')],
        [`symbol`, {}, () => $OrAnd('symbol')(Symbol('a'), 'dummyPropKey')],
        [`creditCard`, {}, () => $OrAnd('creditCard')('4165490041030558', 'dummyPropKey')],
      ]),
      SUITE(`Non Existent Type / Conformity`, [
        [
          `Non Existent Type`,
          {},
          // @ts-expect-error
          () => $OrAnd('Non Existent Type')('anything'),
          `ValidZen: Unknown base type validator name: "Non Existent Type". Allowed types are BIC, EAN, FQDN, HSL, IBAN, ISBN10, ISBN13, ISBN, ISIN, ISO31661Alpha2, ISO31661Alpha3, ISO4217CurrencyCode, ISRC, JSON, JWT, MACAddress, MACAddressStrict, RFC3339, UUID3, UUID4, UUID5, UUID, alpha, alphanumeric, arguments, array, ascii, awsARN, awsRegion, base32, base58, base64, bigint, boolean, booleanString, btcAddress, buffer, creditCard, dataURI, date, dateString, dayjs, decimal, defined, duration, element, email, empty, error, ethereumAddress, false, finite, firebasePushId, fullWidth, function, halfWidth, hash_crc32, hash_crc32b, hash_md4, hash_md5, hash_ripemd128, hash_ripemd160, hash_sha1, hash_sha256, hash_sha384, hash_sha512, hash_tiger128, hash_tiger160, hash_tiger192, hexColor, hexadecimal, int, latLong, latitude, locale, longitude, lowercase, magnetURI, map, militaryTime, mimeType, mongoId, multibyte, native, negative, nil, null, number, numberString, object, objectLike, octal, ok, plainObject, port, positive, primitive, realObject, regExp, rgbColor, safeInteger, semVer, set, single, string, surrogatePair, symbol, timeZone, true, typedArray, undefined, variableWidth, weakMap, weakSet`,
        ]
      ]),
    ]),
  ]
)
