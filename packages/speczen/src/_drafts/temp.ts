import { ONLY, ONLY_ABOVE, SKIP_ABOVE, SUITE } from '../code'
import { ONLY_MERGE } from '../code/types'
import { getTinyLog } from '../code/utils/tiny-log'

const _log = getTinyLog(true, 'ONLY.spec')
const onlie = ONLY()

_log(onlie)
