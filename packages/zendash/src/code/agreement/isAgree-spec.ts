import * as chai from 'chai'
import * as _z from '../index'

const { expect } = chai
// _z = require 'zendash' #
// data = require '../test-data'
describe('isAgree works against', () => {
  it('a String against another String', () => {
    expect(_z.isAgree('angelos', 'angelos')).to.be.true
  })

  it('a String against an array of values', () => {
    expect(_z.isAgree('angelos', ['foo', 'angelos'])).to.be.true
  })

  it('a String against an array of values', () => {
    expect(_z.isAgree('angelos', ['foo', 'angel'])).to.be.false
  })

  it('a String against an array of values', () => {
    expect(_z.isAgree('angelos', [])).to.be.false
  })

  it('a number against another number', () => {
    expect(_z.isAgree(1.23, 1.23)).to.be.true
  })

  it('a String against a RegExp', () => {
    expect(_z.isAgree('angelos', /angel/)).to.be.true
  })

  it('a Number against a RegExp', () => {
    expect(_z.isAgree(123.45, /\d/)).to.be.true
  })

  it('a String against undefined', () => {
    const b = undefined
    expect(_z.isAgree('angelos', b)).to.be.true
  })

  it('a String against another object having a matching `toString()`', function () {
    expect(
      _z.isAgree(
        {
          x: 'angelos',
          toString() {
            return this.x
          },
        },
        'angelos'
      )
    ).to.be.true
  })

  it('a String against another object having a non-matching `toString()`', function () {
    expect(
      _z.isAgree(
        {
          toString() {
            return 'foo'
          },
        },
        'angelos'
      )
    ).to.be.false
  })
})
