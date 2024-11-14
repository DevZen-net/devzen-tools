import { firstPathItem } from '../getFinalConfig'

describe('firstPathItem', () => {
  it.each([
    ['dist/code/index.js', 'dist'],
    ['dist/index.js', 'dist'],
    ['/dist/code/index.js', '/dist'],
    ['./dist/code/index.js', './dist'],
  ])('resolves first path %s => %s', (pathStr, firstPath) => {
    expect(firstPathItem(pathStr)).toBe(firstPath)
  })
  it.each([['./index.js'], ['index'], ['dist']])(
    'Throws wrong path, only file - we need a directory: %s',
    (pathStr) => {
      expect(() => firstPathItem(pathStr)).toThrow(
        /DistZen: package.json "main" field must point to a directory, not a file!/
      )
    }
  )
})
