/* eslint-disable @typescript-eslint/naming-convention */

import * as chai from 'chai'
import * as data from '../../../test-utils/test-data'
import * as z from '../../index'

const { expect } = chai

const o1 = {
  p1: 1,
}

const o2 = {
  p2: 2,
}

const o3 = {
  p3: 3,
}

const o4 = {
  p4: 4,
}

// genuinely disjoint
const a1_2 = [o1, o2]

const o1_2 = {
  p1: o1,
  p2: o2,
}

const a3_4 = [o3, o4]

const o3_4 = {
  p3: o3,
  p4: o4,
}

// genuinely non-disjoint
const a3_4_2 = [o3, o4, o2]

const o3_4_2 = {
  p3: o3,
  p4: o4,
  p5: o2,
}

const a3_4_a1_2 = [o3, o4, a1_2]

const o3_4_o1_2 = {
  p3: o3,
  p4: o4,
  p5: o1_2,
}

const a3_4_nested_o2 = [
  o3,
  o4,
  {
    a: {
      b: o2,
    },
  },
]

const o3_4_nested_o2 = {
  p3: o3,
  p4: o4,
  p5: {
    a: {
      b: o2,
    },
  },
}

const a3_4_nested_a1_2 = [
  o3,
  o4,
  {
    a: {
      b: a1_2,
    },
  },
]

const o3_4_nested_o1_2 = {
  p3: o3,
  p4: o4,
  p5: {
    a: {
      b: o1_2,
    },
  },
}
const {
  object,
  objectShallowClone1,
  objectShallowClone2,
  objectDeepClone1,
  inheritedShallowClone,
  inheritedDeepClone,
} = data

describe('isRefDisjoint:', () => {
  it('recognises self as non disjoint:', () => {
    expect(z.isRefDisjoint(o1, o1)).to.be.false
  })
  describe('Arrays:', () => {
    describe('with deep=false (shallow):', () => {
      it('recognises disjoint:', () => {
        expect(z.isRefDisjoint(a1_2, a3_4)).to.be.true
        expect(z.isRefDisjoint(a3_4, a1_2)).to.be.true
      })
      it('recognises non-disjoint', () => {
        expect(z.isRefDisjoint(a1_2, a3_4_2)).to.be.false
        expect(z.isRefDisjoint(a3_4_2, a1_2)).to.be.false
      })
      describe('recognises disjoint:', () => {
        it('with nested shared reference', () => {
          expect(
            z.isRefDisjoint(a1_2, a3_4_nested_o2, {
              depth: false,
            })
          ).to.be.true
          expect(
            z.isRefDisjoint(a3_4_nested_o2, a1_2, {
              depth: false,
            })
          ).to.be.true
        })
        it('with one side being a shared reference', () => {
          expect(
            z.isRefDisjoint(a1_2, a3_4_nested_a1_2, {
              depth: false,
            })
          ).to.be.true
          expect(
            z.isRefDisjoint(a3_4_nested_a1_2, a1_2, {
              depth: false,
            })
          ).to.be.true
        })
      })
    })
    describe('with deep=true:', () => {
      it('recognises disjoint:', () => {
        expect(
          z.isRefDisjoint(a1_2, a3_4, {
            depth: true,
          })
        ).to.be.true
        expect(
          z.isRefDisjoint(a3_4, a1_2, {
            depth: true,
          })
        ).to.be.true
      })
      describe('recognises non-disjoint:', () => {
        it('with nested shared reference', () => {
          expect(
            z.isRefDisjoint(a1_2, a3_4_nested_o2, {
              depth: true,
            })
          ).to.be.false
          expect(
            z.isRefDisjoint(a3_4_nested_o2, a1_2, {
              depth: true,
            })
          ).to.be.false
        })
        it('with one side being a shared reference', () => {
          expect(
            z.isRefDisjoint(a1_2, a3_4_nested_a1_2, {
              depth: true,
            })
          ).to.be.false
          expect(
            z.isRefDisjoint(a3_4_nested_a1_2, a1_2, {
              depth: true,
            })
          ).to.be.false
        })
      })
    })
  })
  describe('Objects:', () => {
    describe('with deep=false (shallow):', () => {
      it('recognises disjoint:', () => {
        expect(z.isRefDisjoint(o1_2, o3_4)).to.be.true
        expect(z.isRefDisjoint(o3_4, o1_2)).to.be.true
      })
      it('recognises non-disjoint', () => {
        expect(z.isRefDisjoint(o1_2, o3_4_2)).to.be.false
        expect(z.isRefDisjoint(o3_4_2, o1_2)).to.be.false
      })
      describe('recognises disjoint:', () => {
        it('with nested shared reference', () => {
          expect(
            z.isRefDisjoint(o1_2, o3_4_nested_o2, {
              depth: false,
            })
          ).to.be.true
          expect(
            z.isRefDisjoint(o3_4_nested_o2, o1_2, {
              depth: false,
            })
          ).to.be.true
        })
        it('with one side being a shared reference', () => {
          expect(
            z.isRefDisjoint(o1_2, o3_4_nested_o1_2, {
              depth: false,
            })
          ).to.be.true
          expect(
            z.isRefDisjoint(o3_4_nested_o1_2, o1_2, {
              depth: false,
            })
          ).to.be.true
        })
      })
    })
    describe('with deep=true:', () => {
      it('recognises disjoint:', () => {
        expect(
          z.isRefDisjoint(o1_2, o3_4, {
            depth: true,
          })
        ).to.be.true
        expect(
          z.isRefDisjoint(o3_4, o1_2, {
            depth: true,
          })
        ).to.be.true
      })
      describe('recognises non-disjoint:', () => {
        it('with nested shared reference', () => {
          expect(
            z.isRefDisjoint(o1_2, o3_4_nested_o2, {
              depth: true,
            })
          ).to.be.false
          expect(
            z.isRefDisjoint(o3_4_nested_o2, o1_2, {
              depth: true,
            })
          ).to.be.false
        })
        it('with one side being a shared reference', () => {
          expect(
            z.isRefDisjoint(o1_2, o3_4_nested_o1_2, {
              depth: true,
            })
          ).to.be.false
          expect(
            z.isRefDisjoint(o3_4_nested_o1_2, o1_2, {
              depth: true,
            })
          ).to.be.false
        })
      })
    })
  })
  describe('Mixed Arrays & Objects:', () => {
    describe('with deep=false (shallow):', () => {
      it('recognises disjoint:', () => {
        expect(z.isRefDisjoint(o1_2, a3_4)).to.be.true
        expect(z.isRefDisjoint(o3_4, a1_2)).to.be.true
      })
      it('recognises non-disjoint', () => {
        expect(z.isRefDisjoint(o1_2, a3_4_2)).to.be.false
        expect(z.isRefDisjoint(o3_4_2, a1_2)).to.be.false
      })
      describe('recognises disjoint:', () => {
        it('with nested shared reference', () => {
          expect(
            z.isRefDisjoint(o1_2, a3_4_nested_o2, {
              depth: false,
            })
          ).to.be.true
          expect(
            z.isRefDisjoint(o3_4_nested_o2, a1_2, {
              depth: false,
            })
          ).to.be.true
        })
        it('with one side being a shared reference', () => {
          expect(
            z.isRefDisjoint([o1_2], o3_4_nested_o1_2, {
              depth: false,
            })
          ).to.be.true
          expect(
            z.isRefDisjoint([o3_4_nested_o1_2], o1_2, {
              depth: false,
            })
          ).to.be.true
        })
      })
    })
    describe('with deep=true:', () => {
      it('recognises disjoint:', () => {
        expect(
          z.isRefDisjoint(o1_2, a3_4, {
            depth: true,
          })
        ).to.be.true
        expect(
          z.isRefDisjoint(o3_4, a1_2, {
            depth: true,
          })
        ).to.be.true
      })
      describe('recognises non-disjoint:', () => {
        it('with nested shared reference', () => {
          expect(
            z.isRefDisjoint(o1_2, a3_4_nested_o2, {
              depth: true,
            })
          ).to.be.false
          expect(
            z.isRefDisjoint(o3_4_nested_o2, a1_2, {
              depth: true,
            })
          ).to.be.false
        })
        it('with one side being a shared reference', () => {
          expect(
            z.isRefDisjoint([o1_2], o3_4_nested_o1_2, {
              depth: true,
            })
          ).to.be.false
          expect(
            z.isRefDisjoint([o3_4_nested_o1_2], o1_2, {
              depth: true,
            })
          ).to.be.false
        })
      })
    })
  })
  describe('Cloned objects :', () => {
    describe('Without inherited properties:', () => {
      it.skip('recognises non-disjoint (shallow clones):', () => {
        expect(
          z.isRefDisjoint(objectShallowClone1, object, {
            depth: true,
            inherited: true,
          })
        ).to.be.false
        expect(
          z.isRefDisjoint(object, objectShallowClone1, {
            depth: true,
            inherited: true,
          })
        ).to.be.false
        expect(
          z.isRefDisjoint(objectShallowClone2, object, {
            depth: true,
            inherited: true,
          })
        ).to.be.false
        expect(
          z.isRefDisjoint(object, objectShallowClone2, {
            depth: true,
            inherited: true,
          })
        ).to.be.false
      })
      it('recognises disjoint (deep clones):', () => {
        expect(
          z.isRefDisjoint(objectDeepClone1, object, {
            depth: true,
            inherited: true,
          })
        ).to.be.true
        expect(
          z.isRefDisjoint(object, objectDeepClone1, {
            depth: true,
            inherited: true,
          })
        ).to.be.true
        expect(
          z.isRefDisjoint(objectDeepClone1, object, {
            depth: true,
            inherited: true,
          })
        ).to.be.true
        expect(
          z.isRefDisjoint(object, objectDeepClone1, {
            depth: true,
            inherited: true,
          })
        ).to.be.true
      })
    })
    describe('With inherited properties:', () => {
      it('recognises non-disjoint (shallow clones):', () => {
        expect(
          z.isRefDisjoint(inheritedShallowClone, object, {
            depth: true,
            inherited: true,
          })
        ).to.be.false
        expect(
          z.isRefDisjoint(object, inheritedShallowClone, {
            depth: true,
            inherited: true,
          })
        ).to.be.false
      })
      it('recognises disjoint (deep clones):', () => {
        expect(
          z.isRefDisjoint(inheritedDeepClone, object, {
            depth: true,
            inherited: true,
          })
        ).to.be.true
        expect(
          z.isRefDisjoint(object, inheritedDeepClone, {
            depth: true,
            inherited: true,
          })
        ).to.be.true
      })
    })
  })
})
