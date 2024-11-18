import * as chai from 'chai'
import * as _ from 'lodash'
import * as z from '../../index'

const { expect } = chai
describe('objects/getProp', () => {
  const o = {
    $: {
      bundle: {
        anArray: [
          'arrayItem1',
          2,
          {
            arrayItem3: 3,
          },
        ],
        anUndefinedValue: undefined,
        aNullValue: null,
        '*': {
          // defaultKey
          IamA: 'defaultValue at /$/bundle/*/IamA',
        },
        dependencies: {
          depsVars: 'Bingo',
        },
        objectWithInheritedProps: Object.create({
          inheritedProp: 'inheritedPropValue',
        }),
        someOtherKey: {
          '*': {
            notReached: 'defaultValue',
          },
          anUndefinedValue: undefined,
          '#': {
            IamA: {
              Stop: 'Value',
            },
          },
        },
        leadingToTerminate: {
          '|': {
            terminated: 'terminated value',
          },
          '#': 'defaultStopKeyValue',
          '*': 'defaultKeyValue',
          someKey: {
            someOtherKey: 'someValue',
          },
        },
      },
    },
  }
  describe('basic tests with default options: Retrieving value:', () => {
    it('primitive, with string path', () => {
      expect(z.getProp(o, '$/bundle/dependencies/depsVars')).to.equal('Bingo')
      expect(
        z.getProp(o, '$/bundle/dependencies/depsVars', { fullResult: true })
      ).to.deep.equal(['Bingo', ['$', 'bundle', 'dependencies', 'depsVars'], true])
    })
    it('primitive, with path as string[]', () => {
      expect(z.getProp(o, ['$', 'bundle', 'dependencies', 'depsVars'])).to.equal('Bingo')
    })
    it('primitive, with path as string[], with an empty path key at beginning & end and in between', () => {
      expect(z.getProp(o, ['', '$', 'bundle', '', 'dependencies', 'depsVars', ''])).to.equal(
        'Bingo'
      )
    })
    it('object, with string path', () => {
      expect(z.getProp(o, '$/bundle/dependencies')).to.equal(o.$.bundle.dependencies)
    })
    it('object, with separator at end', () => {
      expect(z.getProp(o, '$/bundle/dependencies/')).to.equal(o.$.bundle.dependencies)
    })
    it('object, with separator at beginning & end and in between', () => {
      expect(z.getProp(o, '/$/bundle//dependencies/')).to.equal(o.$.bundle.dependencies)
    })
    it('array item (3rd), with path as string', () => {
      expect(z.getProp(o, '$/bundle/anArray/2/')).to.equal(o.$.bundle.anArray[2])
    })

    it('property of (3rd) array item', () => {
      expect(z.getProp(o, '$/bundle/anArray/2/arrayItem3')).to.equal(
        // eslint-disable-next-line @typescript-eslint/dot-notation
        o.$.bundle.anArray[2]['arrayItem3']
      )
    })
    it('property of (3rd) array item, with path as (string|number)[]', () => {
      expect(z.getProp(o, ['$', 'bundle', 'anArray', 2, 'arrayItem3'])).to.equal(3)
    })
    it('object, with alternative sep', () => {
      expect(
        z.getProp(o, '.$.bundle.dependencies.', {
          separator: '.',
        })
      ).to.deep.equal({
        depsVars: 'Bingo',
      })
    })

    _.each([null, true, /./, () => {}], (invalidPath) => {
      it(`throws error with invalid path ${invalidPath} (not string, number, undefined)`, () => {
        expect(
          // @ts-ignore
          () => z.getProp(o, invalidPath)
        ).to.throw(`Zen: z.getProp Error: invalid path: ${invalidPath}`)
      })
    })

    describe('root value, i.e the objectOrArray it self', () => {
      _.each(['', '/', '//', undefined], (path) => {
        it(`root value, with path = ${path}`, () => {
          expect(z.getProp(o, path)).to.equal(o)
          expect(z.getProp(o, path, { fullResult: true })).to.deep.equal([o, [], true])
        })
      })
    })

    describe('inherited (non-own) props & values', () => {
      it('returns `undefined` & isFound = false & partial path, with inherited: false', () => {
        expect(
          z.getProp(o, '$/bundle/objectWithInheritedProps/inheritedProp', {
            fullResult: true,
          })
        ).to.deep.equal([undefined, ['$', 'bundle', 'objectWithInheritedProps'], false])
      })
      it('returns value` & isFound = true & full path, with inherited: true', () => {
        expect(
          z.getProp(o, '$/bundle/objectWithInheritedProps/inheritedProp', {
            fullResult: true,
            inherited: true,
          })
        ).to.deep.equal([
          'inheritedPropValue',
          ['$', 'bundle', 'objectWithInheritedProps', 'inheritedProp'],
          true,
        ])
      })
    })

    describe('non-existent keys:', () => {
      describe('on "single" value:', () => {
        it('returns `undefined` & isFound = false, for SINGLE non-existent key', () => {
          expect(z.getProp(o, '$/bundle/dependencies/depsVars/notfound')).to.equal(undefined)
          expect(
            z.getProp(o, '$/bundle/dependencies/depsVars/notfound', { fullResult: true })
          ).to.deep.equal([undefined, ['$', 'bundle', 'dependencies', 'depsVars'], false])
        })

        it('returns `undefined & isFound = false`, for MULTIPLE non-existent key', () => {
          expect(
            z.getProp(o, '$/bundle/dependencies/depsVars/stillNotFound/andMore')
          ).to.equal(undefined)
          expect(
            z.getProp(o, '$/bundle/dependencies/depsVars/stillNotFound/andMore', {
              fullResult: true,
            })
          ).to.deep.equal([undefined, ['$', 'bundle', 'dependencies', 'depsVars'], false])
        })
      })

      describe('on non-"single" value:', () => {
        it('returns `undefined` & isFound = false, for SINGLE non-existent key', () => {
          expect(z.getProp(o, '$/bundle/dependencies/notfound')).to.equal(undefined)
          expect(
            z.getProp(o, '$/bundle/dependencies/notfound', { fullResult: true })
          ).to.deep.equal([undefined, ['$', 'bundle', 'dependencies'], false])
        })

        it('returns `undefined`, with path having MULTIPLE non-existent keys', () => {
          expect(
            z.getProp(o, '$/bundle/dependencies/notfound/stillNotFound/andMore')
          ).to.equal(undefined)
        })
      })
    })
  })

  describe('*defaultKey*: exists in this path level while walking:', () => {
    describe('and **a non existent key** is in the current path level:', () => {
      it('returns the value stored at `defaultKey` & defaultKey in walkedPath & isFound = true', () => {
        expect(
          z.getProp(o, '$/bundle/someNonFoundKey/', {
            defaultKey: '*',
            fullResult: true,
          })
        ).to.deep.equal([
          {
            IamA: 'defaultValue at /$/bundle/*/IamA',
          },
          ['$', 'bundle', '*'],
          true,
        ])
      })

      it('is using the value stored at `defaultKey`, to continue walking the remaining of the path, returns defaultKey in walkedPath & isFound true', () => {
        expect(
          z.getProp(o, '$/bundle/someNonFoundKey/IamA', {
            defaultKey: '*',
            fullResult: true,
          })
        ).to.deep.equal([
          'defaultValue at /$/bundle/*/IamA',
          ['$', 'bundle', '*', 'IamA'],
          true,
        ])
      })

      it('continues walking the path, to another non-existing key, returns undefined, partial walkedPath with defaultKey & isFound = false', () => {
        expect(
          z.getProp(o, '$/bundle/someNonFoundKey/tooFar', {
            defaultKey: '*',
            fullResult: true,
          })
        ).to.deep.equal([undefined, ['$', 'bundle', '*'], false])
      })
    })

    describe('and an **existent key** is in the current path level:', () => {
      it(`is finding an existent key 'anArray' with an array Tvalues, it returns that array Tvalue`, () => {
        expect(
          z.getProp(o, '$/bundle/anArray', {
            defaultKey: '*',
            fullResult: true,
          })
        ).to.deep.equal([
          [
            'arrayItem1',
            2,
            {
              arrayItem3: 3,
            },
          ],
          ['$', 'bundle', 'anArray'],
          true,
        ])
      })

      it('is finding an existent key `aNullValue` with a `null` value, it returns that `null` value & full walked path', () => {
        expect(
          z.getProp(o, '$/bundle/aNullValue', {
            defaultKey: '*',
            fullResult: true,
          })
        ).to.deep.equal([null, ['$', 'bundle', 'aNullValue'], true])
      })

      it('is finding an existent key `anUndefinedValue` with `undefined` value, it returns that `undefined` value', () => {
        expect(
          z.getProp(o, '$/bundle/anUndefinedValue', {
            defaultKey: '*',
            fullResult: true,
          })
        ).to.deep.equal([undefined, ['$', 'bundle', 'anUndefinedValue'], true])
      })
    })
  })

  describe('retrieving value using *stopDefaultKey*:', () => {
    it('non existent key, but a stopDefaultKey key in its place & defaultKey which is ignored', () => {
      expect(
        z.getProp(o, '$/bundle/someOtherKey/someNonFoundKey/', {
          defaultKey: '*',
          stopDefaultKey: '#',
          fullResult: true,
        })
      ).to.deep.equal([
        {
          IamA: {
            Stop: 'Value',
          },
        },
        ['$', 'bundle', 'someOtherKey', '#'],
        true,
      ])
    })

    it('non existent key, but a stopDefaultKey key in its place & defaultKey which is ignored, stops walking', () => {
      expect(
        z.getProp(o, '$/bundle/someOtherKey/someNonFoundKey/IamA/Stop', {
          defaultKey: '*',
          stopDefaultKey: '#',
          fullResult: true,
        })
      ).to.deep.equal([
        {
          IamA: {
            Stop: 'Value',
          },
        },
        ['$', 'bundle', 'someOtherKey', '#'],
        true,
      ])
    })

    it('is finding an existent key `anUndefinedValue` with `undefined` value, it returns that `undefined` value', () => {
      expect(
        z.getProp(o, '$/bundle/someOtherKey/anUndefinedValue', {
          defaultKey: '*',
          stopDefaultKey: '#',
          fullResult: true,
        })
      ).to.deep.equal([undefined, ['$', 'bundle', 'someOtherKey', 'anUndefinedValue'], true])
    })
  })

  describe('retrieving value using *terminateKey*:', () => {
    it('non existent key, but a terminateKey in this level, returns terminateKey value, ignores defaultKey & defaultStopKey', () => {
      expect(
        z.getProp(o, '$/bundle/leadingToTerminate/someNonFoundKey/', {
          defaultKey: '*',
          stopDefaultKey: '#',
          fullResult: true,
          terminateKey: '|',
        })
      ).to.deep.equal([
        {
          terminated: 'terminated value',
        },
        ['$', 'bundle', 'leadingToTerminate', '|'],
        true,
      ])
    })

    it('existent key path, but found a terminateKey while walking, returns {terminateKey:value}', () => {
      expect(
        z.getProp(o, '$/bundle/leadingToTerminate/someKey/someOtherKey', {
          defaultKey: '*',
          stopDefaultKey: '#',
          fullResult: true,
          terminateKey: '|',
        })
      ).to.deep.equal([
        {
          terminated: 'terminated value',
        },
        ['$', 'bundle', 'leadingToTerminate', '|'],
        true,
      ])
    })
  })

  describe('retrieving value using *returnLast*, returns last value found in the partially valid path, and isFound = false:', () => {
    it('non-existent path key, last value was an object', () => {
      expect(
        z.getProp(o, '$/bundle/dependencies/someNonFoundKey/', {
          returnLast: true,
          fullResult: true,
        })
      ).to.deep.equal([
        {
          depsVars: 'Bingo',
        },
        ['$', 'bundle', 'dependencies'],
        false,
      ])
    })

    it('non-existent path key, last value was an `undefined`', () => {
      expect(
        z.getProp(o, '$/bundle/anUndefinedValue/someNonFoundKey', {
          returnLast: true,
          fullResult: true,
        })
      ).to.deep.equal([undefined, ['$', 'bundle', 'anUndefinedValue'], false])
    })

    it('existent path key, its value was `undefined`', () => {
      expect(
        z.getProp(o, '$/bundle/anUndefinedValue', {
          returnLast: true,
          fullResult: true,
        })
      ).to.deep.equal([undefined, ['$', 'bundle', 'anUndefinedValue'], true])
    })
  })
})
