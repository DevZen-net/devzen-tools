import * as chai from 'chai'
import * as _ from 'lodash'
import { setProp } from '../setProp'

const { expect } = chai

describe('objects/setProp:', () => {
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
        dependencies: {
          depsVars: 'Bingo',
        },
      },
    },
  }

  describe('existent paths, with some value:', () => {
    it('overwrites primitives', () => {
      const oClone = _.cloneDeep(o)
      const isSet = setProp(oClone, '$/bundle/dependencies/depsVars', 'just_a_String')
      expect(oClone).to.deep.equal({
        $: {
          bundle: {
            anArray: [
              'arrayItem1',
              2,
              {
                arrayItem3: 3,
              },
            ],
            dependencies: {
              depsVars: 'just_a_String',
            },
          },
        },
      })
    })

    //      expect(isSet).to.be.true
    it('object overwritten, with sep at end & alt sep', () => {
      const oClone = _.cloneDeep(o)
      const isSet = setProp(
        oClone,
        '$.bundle.dependencies.',
        {
          anotherProperty: 'just_a_String',
        },
        {
          separator: '.',
        }
      )
      expect(oClone).to.deep.equal({
        $: {
          bundle: {
            anArray: [
              'arrayItem1',
              2,
              {
                arrayItem3: 3,
              },
            ],
            dependencies: {
              anotherProperty: 'just_a_String',
            },
          },
        },
      })
      expect(isSet).to.be.true
    })

    it('object, overwriting object property', () => {
      const oClone = _.cloneDeep(o)
      const isSet = setProp(
        oClone,
        '$.bundle.dependencies.',
        {
          anotherProperty: 'just_a_String',
        },
        {
          separator: '.',
        }
      )
      expect(oClone).to.deep.equal({
        $: {
          bundle: {
            anArray: [
              'arrayItem1',
              2,
              {
                arrayItem3: 3,
              },
            ],
            dependencies: {
              anotherProperty: 'just_a_String',
            },
          },
        },
      })
      expect(isSet).to.be.true
    })
    it('array item, overwriting object property', () => {
      const oClone = _.cloneDeep(o)
      const isSet = setProp(
        oClone,
        '$.bundle.anArray.2.arrayItem3',
        {
          '3_is_now': 33,
        },
        {
          separator: '.',
        }
      )
      expect(oClone).to.deep.equal({
        $: {
          bundle: {
            anArray: [
              'arrayItem1',
              2,
              {
                arrayItem3: {
                  '3_is_now': 33,
                },
              },
            ],
            dependencies: {
              depsVars: 'Bingo',
            },
          },
        },
      })
      expect(isSet).to.be.true
    })
  })

  describe('inexistent key paths:', () => {
    it('not setting by default', () => {
      const oClone = _.cloneDeep(o)
      // console.log('aaaa', JSON.stringify(oClone, null, 2))
      const isSet = setProp(oClone, '$/bundle/dependencies/depsVars/hi', {
        joke: {
          joke2: 'JOKER',
        },
      })
      expect(oClone).to.deep.equal(o)
      expect(isSet).to.be.false
    })

    describe('options.create:', () => {
      it('create new objects for inexistent paths, adding object properties', () => {
        const oClone = _.cloneDeep(o)
        const isSet = setProp(
          oClone,
          '$.bundle.dependencies.moreDeps.evenMoreDeps.',
          {
            property: 'just_a_String',
          },
          {
            create: true,
            separator: '.',
          }
        )
        expect(oClone).to.deep.equal({
          $: {
            bundle: {
              anArray: [
                'arrayItem1',
                2,
                {
                  arrayItem3: 3,
                },
              ],
              dependencies: {
                depsVars: 'Bingo',
                moreDeps: {
                  evenMoreDeps: {
                    property: 'just_a_String',
                  },
                },
              },
            },
          },
        })
        expect(isSet).to.be.true
      })
      it.skip('NOT overwritting primitives:', () => {
        const oClone = _.cloneDeep(o)
        const isSet = setProp(
          oClone,
          '$/bundle/dependencies/depsVars/newKey/',
          {
            property: 'just_a_String',
          },
          {
            create: true,
          }
        )
        expect(oClone).to.deep.equal({
          $: {
            bundle: {
              anArray: [
                'arrayItem1',
                2,
                {
                  arrayItem3: 3,
                },
              ],
              dependencies: {
                depsVars: 'Bingo',
              },
            },
          },
        })
        expect(isSet).to.be.false
      })
    })
    describe('options.overwrite:', () => {
      it('create new objects, overwritting primitives:', () => {
        const oClone = _.cloneDeep(o)
        const isSet = setProp(
          oClone,
          '$/bundle/dependencies/depsVars/newKey',
          {
            joke: {
              joke2: 'JOKER',
            },
          },
          {
            overwrite: true,
          }
        )
        expect(oClone).to.deep.equal({
          $: {
            bundle: {
              anArray: [
                'arrayItem1',
                2,
                {
                  arrayItem3: 3,
                },
              ],
              dependencies: {
                depsVars: {
                  newKey: {
                    joke: {
                      joke2: 'JOKER',
                    },
                  },
                },
              },
            },
          },
        })
        expect(isSet).to.be.true
      })
      it('create new objects, preserving `oldValue`', () => {
        const oClone = _.cloneDeep(o)
        const isSet = setProp(
          oClone,
          '$/bundle/dependencies/depsVars/newKey/anotherNewKey',
          {
            joke: {
              joke2: 'JOKER',
            },
          },
          {
            overwrite: '_oldValue',
          }
        )
        expect(oClone).to.deep.equal({
          $: {
            bundle: {
              anArray: [
                'arrayItem1',
                2,
                {
                  arrayItem3: 3,
                },
              ],
              dependencies: {
                depsVars: {
                  _oldValue: 'Bingo',
                  newKey: {
                    anotherNewKey: {
                      joke: {
                        joke2: 'JOKER',
                      },
                    },
                  },
                },
              },
            },
          },
        })
        expect(isSet).to.be.true
      })
    })
  })
})
