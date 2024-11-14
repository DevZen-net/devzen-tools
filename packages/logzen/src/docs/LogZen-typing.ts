import { isRealObject } from '@devzen/zendash'
import process from 'node:process'
import * as _ from 'lodash'
import { ELogLevel, getTinyLog, LogZen, Output } from '../code'
const _log = getTinyLog(false, '// src/docs/temp.ts')

// remove @ts-expect-error to see errors

LogZen.updateLogPathOptions({ '/': { output: 'std' } })

/* @ts-expect-error */
LogZen.updateLogPathOptions({ '/': { output: 'wrong-builtin-type' } })

new LogZen('foo')
new LogZen('foo', 'warn')
new LogZen('foo', 'log', 12)

/* @ts-expect-error */
new LogZen('foo', 12, 'error')
/* @ts-expect-error */
new LogZen('foo', 'wrong-logLevel')

/* @ts-expect-error */
new LogZen('foo', 'wrong-logLevel', 12)

new LogZen({ output: ['std'] }, 12)
new LogZen({ output: ['std'] }, 'warn')
new LogZen({ output: ['std'] }, 'warn', 12)

/* @ts-expect-error */
new LogZen({ output: ['std'] }, 12, 'error')
/* @ts-expect-error */
new LogZen({ output: ['std'] }, 'wrong-logLevel')
/* @ts-expect-error */
new LogZen({ output: ['std'] }, 'wrong-logLevel', 12)
