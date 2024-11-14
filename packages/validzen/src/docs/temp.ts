import * as _ from 'lodash'
import { $IsArrayWithAllowedValues, IsArrayWithAllowedValues, OrAnd } from '../code'
import { $Equals, $Max } from '../code/class-validator-ValidZen-wraps'
import { $OrAnd } from '../code/OrAnd'
import { getTinyLog } from '../code/utils/tiny-log'

const _log = getTinyLog(true, 'temp')
//
//
// const fn = IsArrayWithAllowedValues(['foo', 'bar'])
// const fn$ = $IsArrayWithAllowedValues(['foo', 'bar'])
//
// const $Max100 = $Max(100, {message: 'Value Max(100)'})
//
// const aComplexValidation = $OrAnd(
//   'undefined',
//   // 'number'
//   ['number', $Max(100)],
//   ['string', $Equals('foobar')]
// )
//
// // fn({someProp: ['foo']}, 'someProp')
// // fn$({someProp: ['foo']}, 'someProp')
// // _log(fn$(['foo2'], 'someProp'))
// // _log($Max100(101, 'fooProp'))
//
// _log(aComplexValidation(undefined, 'myPropKey'))
// _log(aComplexValidation(100, 'aa'))
// _log(aComplexValidation(101, 'myPropKey'))
// // _log(aComplexValidation(101, 'myPropKey'))
// //
//
// //

const a = `isAlpha,
isAscii,
isBIC,
isAlphanumeric,
isBase32,
isBase58,
isBase64,
isEAN,
isEmail,
isFQDN,
isBtcAddress,
isIBAN,
isHSL,
isCreditCard,
isDefined,
isDataURI,
isDateString,
isEthereumAddress,
isFirebasePushId,
isHexadecimal,
isHexColor,
isFullWidth,
isHalfWidth,
isISIN,
isISO4217CurrencyCode,
isISO31661Alpha2,
isISO31661Alpha3,
isISRC,
isJSON,
isJWT,
isLatitude,
isLowercase,
isLocale,
isLatLong,
isLongitude,
isMagnetURI,
isMilitaryTime,
isMimeType,
isMongoId,
isMACAddress,
isMultibyte,
isNegative,
isOctal,
isPositive,
isPort,
isRFC3339,
isSemVer,
isRgbColor,
isTimeZone,
isSurrogatePair,
isVariableWidth`
  .split(',\n')
  .map((s) => {
    let name = s.slice(2)
    if (_.toUpper(name[1]) !== name[1]) name = _.toLower(name[0]) + name.slice(1)
    return `${name}: ${s},`
  })

_log(a.join('\n'))
