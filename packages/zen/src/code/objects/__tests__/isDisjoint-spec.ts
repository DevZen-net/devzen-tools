import * as chai from 'chai'
import * as _ from 'lodash'
import * as z from '../../index'

const { expect } = chai

describe('isDisjoint:', () => {
  describe('with primitives:', () => {
    describe('arrays:', () => {
      it('recognises disjoint:', () => {
        expect(z.isDisjoint([1, 2, 3], [4, 5, 6, '1'])).to.be.true
        expect(_.intersection([1, 2, 3], [4, 5, 6, '1'])).to.be.an('array').and.is.empty
      })
      it('recognises non disjoint:', () => {
        expect(z.isDisjoint([1, 2, 3], [4, 2, 5])).to.be.false
        expect(_.intersection([1, 2, 3], [4, 2, 5])).to.deep.equal([2])
      })
    })

    describe('Set', () => {
      it('recognises disjoint:', () => {
        expect(z.isDisjoint(new Set([1, 2, 3]), new Set([4, 5, 6, '1']))).to.be.true
      })
      it('recognises non disjoint:', () => {
        expect(z.isDisjoint(new Set([1, 2, 3]), new Set([4, 2, 5]))).to.be.false
      })
    })

    describe('mixed Array & Set', () => {
      it('recognises disjoint:', () => {
        expect(z.isDisjoint([1, 2, 3], new Set([4, 5, 6, '1']))).to.be.true
      })
      it('recognises non disjoint:', () => {
        expect(z.isDisjoint([1, 2, 3], new Set([4, 2, 5]))).to.be.false
      })
    })
  })
  describe('with references:', () => {
    const o1: any = {
      p1: 1,
    }
    const o2: any = {
      p2: 2,
    }
    const o3: any = {
      p3: 3,
    }
    const o4: any = {
      p4: 4,
    }
    describe('arrays:', () => {
      it('recognises disjoint:', () => {
        expect(
          z.isDisjoint(
            [o1, o2],
            [
              {
                p1: 1,
              },
              o3,
              o4,
            ]
          )
        ).to.be.true
        expect(
          _.intersection(
            [o1, o2],
            [
              {
                p1: 1,
              },
              o3,
              o4,
            ]
          )
        ).to.deep.equal([])
      })
      it('recognises non disjoint:', () => {
        expect(
          z.isDisjoint(
            [o1, o2],
            [
              {
                p1: 1,
              },
              o3,
              o4,
              o2,
            ]
          )
        ).to.be.false
        expect(
          _.intersection(
            [o1, o2],
            [
              {
                p1: 1,
              },
              o3,
              o4,
              o2,
            ]
          )
        ).to.deep.equal([o2])
      })
    })
    describe('equality using _.isEqual :', () => {
      it('recognises disjoint in [] & {}, without _.isEqual', () => {
        expect(
          z.isDisjoint(
            [o1, o2],
            [
              _.clone(o1),
              _.clone(o2), // different references,
            ]
          )
        ).to.be.true
      })
      it('recognises non disjoint in [] & {}, when using _.isEqual', () => {
        expect(
          z.isDisjoint(
            [o1, o2],
            [
              _.clone(o1),
              _.clone(o2), // different references, but _.isEqual
            ],
            { equality: _.isEqual }
          )
        ).to.be.false
      })
    })
  })
})
