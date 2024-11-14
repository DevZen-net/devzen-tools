import { getExpectedStringsAndResult } from './jest-docs-utils'

describe('getExpectedStuff', () => {
  it.each([
    // [undefined, [[]]],
    // [null, [null, null]],
    [
      [null, true],
      [null, true],
    ],
    [
      [null, false],
      [null, false],
    ],
    [
      [null, 233],
      [null, 233],
    ],
    [``, [[``], null]],
    [
      [``, 34],
      [[``], 34],
    ],
    [`foo`, [['foo'], null]],
    [
      [`foo`, 23],
      [['foo'], 23],
    ],
    [
      [[`foo2`, 'bar2'], 23],
      [['foo2', 'bar2'], 23],
    ],
    [{ foo: 'bar' }, [['{"foo":"bar"}'], null]],
    [[{ foo: 'bar' }], [['{"foo":"bar"}'], null]],
    [
      [{ foo: 'bar' }, 42],
      [['{"foo":"bar"}'], 42],
    ],
    [
      [[{ foo: 'bar' }, 'foobar'], 43],
      [['{"foo":"bar"}', 'foobar'], 43],
    ],
  ])('works with %o', (inputExpectedStuff, expectedStringsAndResult) => {
    expect(getExpectedStringsAndResult(inputExpectedStuff as any)).toEqual(
      expectedStringsAndResult
    )
  })
})
