import { inspect } from '../inspect'
import { print } from '../print'

const usePrint = false

/**
 * The most minimal log, for LogZen-less internalDebugging while dev!
 */
export const getTinyLog =
  (enabled, name?: string) =>
  (...args) => {
    if ((enabled && true) || args[0] === true)
      process.stdout.write(
        [
          `${name} tinyLog:`,
          ...args.map((a) => {
            // console.log('  tinyLog a, typeof a', a, typeof a)

            return typeof a === 'string' ||
              typeof a === 'number' ||
              typeof a === 'bigint' ||
              typeof a === 'boolean' ||
              a === undefined ||
              typeof a === 'symbol' ||
              typeof a === 'function'
              ? a
              : // : Array.isArray(a) // && false
                //   ? print(a) // JSON.stringify(a, null, 0)
                usePrint
                ? print(a)
                : // util.format(`%o`, a)
                  inspect(a, {
                    compact: true,
                    // showHidden: false, // true shows array length
                    showHidden: true, // true shows array length
                    colors: true,
                    breakLength: 100,
                    maxArrayLength: 32,
                    maxStringLength: 500,
                    depth: 15,
                  })
          }),
          '\n\n',
        ].join(' ')
      )
  }
