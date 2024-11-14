import * as _ from 'lodash'
import { Options, getTinyLog } from '../code'
import { blendOptions } from '../code/blendOptions'
import { OptionsInternal } from '../code/types'

const _log = getTinyLog(false, 'blendOptions.spec')

describe('blendOptions.spec', () => {
  _.each(
    [
      [
        'Nested options and colors in inspect',
        [
          {
            colors: false,
            logLevel: 7,
          },
          {
            colors: true,
            logLevel: 5,
            header: true,
            inspect: {
              colors: false,
            },
          },
          {
            colors: true,
            logLevel: 2,
            header: {
              resolvedName: true,
            },
          },
        ],

        // effectiveOptions
        {
          colors: true,
          inspect: {
            colors: true,
          },
          header: {
            resolvedName: true,
          },
          logLevel: 2,
        },
      ],
      [
        'Nested options and disabled header',
        [
          {
            colors: true,
            logLevel: 7,

            header: { resolvedFromCall: true },
            inspect: {
              colors: true,
            },
          },
          {
            colors: false, // will also override inspect.colors & stringColors
            header: false,
            stackDepthCalled: 0,
            inspect: {
              breakLength: 150,
              maxArrayLength: 30,
              maxStringLength: 500,
              depth: 10,
              compact: 50,
            },
          },
        ],

        // effectiveOptions
        {
          colors: false,
          stringColors: false,
          logLevel: 7,
          header: false,
          stackDepthCalled: 0,
          inspect: {
            colors: false,
            breakLength: 150,
            maxArrayLength: 30,
            maxStringLength: 500,
            depth: 10,
            compact: 50,
          },
        },
      ],
      [
        'Root level colors overrides inspect.colors',
        [
          {
            colors: true,
            inspect: {
              colors: true,
            },
          },
          {
            colors: false, // will also override inspect.colors
            inspect: {
              breakLength: 150,
            },
          },
          {
            colors: true, // will also override inspect.colors
            inspect: {
              compact: 50,
            },
          },
        ],

        // effectiveOptions
        {
          colors: true,
          inspect: {
            colors: true,
            breakLength: 150,
            compact: 50,
          },
        },
      ],

      [
        `Kids are concatenated in nested levels order.
         If \`kids: null\` is encountered, previous kids are discarded
         If \`kids: undefined\` or \`kids: []\` is encountered, previous kids are NOT discarded`,
        [
          {
            header: { resolvedFromCall: true },
            colors: false,
            inspect: false,
            kids: [{ loggerName: 'topLevelKid1' }, { loggerName: 'topLevelKid2' }],
          },
          {
            kids: null, // DO discard previous kids
          },
          {
            kids: [{ loggerName: 'midLevelKid1' }, { loggerName: 'midLevelKid2' }],
          },
          {
            kids: undefined, // DO NOT discard previous kids
          },
          {
            colors: false,
            kids: [{ loggerName: 'midLevelKid3' }, { loggerName: 'midLevelKid4' }],
          },
          {
            kids: [], // DO NOT discard previous kids
          },
          {
            colors: true,
            kids: [{ loggerName: 'bottomLevelKid1' }, { loggerName: 'bottomLevelKid2' }],
          },
        ],

        // effectiveOptions
        {
          header: { resolvedFromCall: true },
          colors: true,
          inspect: false,
          kids: [
            // {loggerName: 'topLevelKid1'}, // discarded
            // {loggerName: 'topLevelKid2'}, // discarded
            { loggerName: 'midLevelKid1' },
            { loggerName: 'midLevelKid2' },
            { loggerName: 'midLevelKid3' },
            { loggerName: 'midLevelKid4' },
            { loggerName: 'bottomLevelKid1' },
            { loggerName: 'bottomLevelKid2' },
          ],
        },
      ],
    ] as any,
    // ].slice(0, 99) as any,

    ([description, options, expectedEffectiveOptions]: [string, Options[], OptionsInternal]) =>
      describe(`blendOptions correctly blended options:`, () => {
        it(`${description}`, () => {
          const effectiveOptions = blendOptions({ options })
          expect(expectedEffectiveOptions).toEqual(effectiveOptions)
        })
      })
  )
})
