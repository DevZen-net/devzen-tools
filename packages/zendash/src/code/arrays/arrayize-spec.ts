import * as chai from 'chai'
import * as _z from '../index'

const { expect } = chai

// // clone to check mutability
// const { project, bundle, obj, arrInt, arrInt2, arrStr } = _.cloneDeep(data)

// @todo: use data + more examples
describe('arrayize :', () => {
  it('arrayize a String', () => {
    expect(_z.arrayize('agelos')).to.deep.equal(['agelos'])
  })
  it('arrayize a Number', () => {
    expect(_z.arrayize(19)).to.deep.equal([19])
  })
  it('arrayize an Object', () => {
    expect(
      _z.arrayize({
        a: 1,
        b: 2,
      })
    ).to.deep.equal([
      {
        a: 1,
        b: 2,
      },
    ])
  })
  it('arrayize an existing array, gives same value', () => {
    const arr = [1, 'john']
    expect(_z.arrayize(arr)).to.equal(arr)
  })
  it('arrayize undefined, gives empty array', () => {
    expect(_z.arrayize()).to.deep.equal([])
  })
})
