import {
  Allow,
  IsDefined,
  IsOptional,
  Validate,
  ValidateBy,
  ValidateIf,
  ValidateNested,
  ValidatePromise,
  IsLatLong,
  IsLatitude,
  IsLongitude,
  Equals,
  NotEquals,
  IsEmpty,
  IsNotEmpty,
  IsIn,
  IsNotIn,
  IsDivisibleBy,
  IsPositive,
  IsNegative,
  Max,
  Min,
  MinDate,
  MaxDate,
  Contains,
  NotContains,
  IsAlpha,
  IsAlphanumeric,
  IsDecimal,
  IsAscii,
  IsBase64,
  IsByteLength,
  IsCreditCard,
  IsCurrency,
  IsEmail,
  IsFQDN,
  IsFullWidth,
  IsHalfWidth,
  IsVariableWidth,
  IsHexColor,
  IsHexadecimal,
  // IsMacAddress,  why missing ?
  IsIP,
  IsPort,
  IsISBN,
  IsISIN,
  IsISO8601,
  IsJSON,
  IsJWT,
  IsLowercase,
  IsMobilePhone,
  IsISO31661Alpha2,
  IsISO31661Alpha3,
  IsMongoId,
  IsMultibyte,
  IsSurrogatePair,
  IsUrl,
  IsUUID,
  IsFirebasePushId,
  IsUppercase,
  Length,
  MaxLength,
  MinLength,
  Matches,
  IsPhoneNumber,
  IsMilitaryTime,
  IsHash,
  IsISSN,
  IsDateString,
  IsBooleanString,
  IsNumberString,
  IsBase32,
  IsBIC,
  IsBtcAddress,
  IsDataURI,
  IsEAN,
  IsEthereumAddress,
  IsHSL,
  IsIBAN,
  IsIdentityCard,
  IsISRC,
  IsLocale,
  IsMagnetURI,
  IsMimeType,
  IsOctal,
  IsPassportNumber,
  IsPostalCode,
  IsRFC3339,
  IsRgbColor,
  IsSemVer,
  IsStrongPassword,
  IsTimeZone,
  IsBase58,
  IsBoolean,
  IsDate,
  IsNumber,
  IsEnum,
  IsInt,
  IsString,
  IsArray,
  IsObject,
  ArrayContains,
  ArrayNotContains,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayUnique,
  IsNotEmptyObject,
  IsInstance,
} from 'class-validator'
import { wrapPropertyDecoratorUsingValidateBy } from './wrap/wrapPropertyDecoratorUsingValidateBy'

/*
The following are all the class-validator PropertyDecorators, wrapped by wrapValidateByPropertyDecorator and exported as $PropertyDecoratorName

They all need ValidateByAsValidatorFunction to be injected into class-validator, posing as ValidateBy. Otherwise your App will crash on boot. See wrapValidateByPropertyDecorator for details.

Since they are experimental & they break without the injection, they are NOT exported on index.js. You need to import them as:

import { $Min } from '@devzen/validzen/dist/code/class-validator-ValidZen-wraps'

Only a hand full are roughly tested (the ones on top)

@todo: add jsdocs on top of each, with a link to the original PropertyDecorator

@todo: apply to class-validator-extended

Generating code @ bottom
*/

// Tested

export const $IsIn = wrapPropertyDecoratorUsingValidateBy(IsIn)
export const $Max = wrapPropertyDecoratorUsingValidateBy(Max)
export const $Min = wrapPropertyDecoratorUsingValidateBy(Min)
export const $Equals = wrapPropertyDecoratorUsingValidateBy(Equals)

// NOT Tested / NOT TOUCHED!
// @todo: test them!
export const $Allow = wrapPropertyDecoratorUsingValidateBy(Allow)
export const $IsDefined = wrapPropertyDecoratorUsingValidateBy(IsDefined)
export const $IsOptional = wrapPropertyDecoratorUsingValidateBy(IsOptional)
// export const $Validate = wrapPropertyDecoratorUsingValidateBy(Validate)
// export const $ValidateBy = wrapPropertyDecoratorUsingValidateBy(ValidateBy)
// export const $ValidateIf = wrapPropertyDecoratorUsingValidateBy(ValidateIf)
// export const $ValidateNested = wrapPropertyDecoratorUsingValidateBy(ValidateNested)
export const $ValidatePromise = wrapPropertyDecoratorUsingValidateBy(ValidatePromise)
export const $IsLatLong = wrapPropertyDecoratorUsingValidateBy(IsLatLong)
export const $IsLatitude = wrapPropertyDecoratorUsingValidateBy(IsLatitude)
export const $IsLongitude = wrapPropertyDecoratorUsingValidateBy(IsLongitude)
export const $NotEquals = wrapPropertyDecoratorUsingValidateBy(NotEquals)
export const $IsEmpty = wrapPropertyDecoratorUsingValidateBy(IsEmpty)
export const $IsNotEmpty = wrapPropertyDecoratorUsingValidateBy(IsNotEmpty)
export const $IsNotIn = wrapPropertyDecoratorUsingValidateBy(IsNotIn)
export const $IsDivisibleBy = wrapPropertyDecoratorUsingValidateBy(IsDivisibleBy)
export const $IsPositive = wrapPropertyDecoratorUsingValidateBy(IsPositive)
export const $IsNegative = wrapPropertyDecoratorUsingValidateBy(IsNegative)
export const $MinDate = wrapPropertyDecoratorUsingValidateBy(MinDate)
export const $MaxDate = wrapPropertyDecoratorUsingValidateBy(MaxDate)
export const $Contains = wrapPropertyDecoratorUsingValidateBy(Contains)
export const $NotContains = wrapPropertyDecoratorUsingValidateBy(NotContains)
export const $IsAlpha = wrapPropertyDecoratorUsingValidateBy(IsAlpha)
export const $IsAlphanumeric = wrapPropertyDecoratorUsingValidateBy(IsAlphanumeric)
export const $IsDecimal = wrapPropertyDecoratorUsingValidateBy(IsDecimal)
export const $IsAscii = wrapPropertyDecoratorUsingValidateBy(IsAscii)
export const $IsBase64 = wrapPropertyDecoratorUsingValidateBy(IsBase64)
export const $IsByteLength = wrapPropertyDecoratorUsingValidateBy(IsByteLength)
export const $IsCreditCard = wrapPropertyDecoratorUsingValidateBy(IsCreditCard)
export const $IsCurrency = wrapPropertyDecoratorUsingValidateBy(IsCurrency)
export const $IsEmail = wrapPropertyDecoratorUsingValidateBy(IsEmail)
export const $IsFQDN = wrapPropertyDecoratorUsingValidateBy(IsFQDN)
export const $IsFullWidth = wrapPropertyDecoratorUsingValidateBy(IsFullWidth)
export const $IsHalfWidth = wrapPropertyDecoratorUsingValidateBy(IsHalfWidth)
export const $IsVariableWidth = wrapPropertyDecoratorUsingValidateBy(IsVariableWidth)
export const $IsHexColor = wrapPropertyDecoratorUsingValidateBy(IsHexColor)
export const $IsHexadecimal = wrapPropertyDecoratorUsingValidateBy(IsHexadecimal)
// export const $IsMacAddress = wrapValidateByPropertyDecorator(IsMacAddress) // why is it missing?
export const $IsIP = wrapPropertyDecoratorUsingValidateBy(IsIP)
export const $IsPort = wrapPropertyDecoratorUsingValidateBy(IsPort)
export const $IsISBN = wrapPropertyDecoratorUsingValidateBy(IsISBN)
export const $IsISIN = wrapPropertyDecoratorUsingValidateBy(IsISIN)
export const $IsISO8601 = wrapPropertyDecoratorUsingValidateBy(IsISO8601)
export const $IsJSON = wrapPropertyDecoratorUsingValidateBy(IsJSON)
export const $IsJWT = wrapPropertyDecoratorUsingValidateBy(IsJWT)
export const $IsLowercase = wrapPropertyDecoratorUsingValidateBy(IsLowercase)
export const $IsMobilePhone = wrapPropertyDecoratorUsingValidateBy(IsMobilePhone)
export const $IsISO31661Alpha2 = wrapPropertyDecoratorUsingValidateBy(IsISO31661Alpha2)
export const $IsISO31661Alpha3 = wrapPropertyDecoratorUsingValidateBy(IsISO31661Alpha3)
export const $IsMongoId = wrapPropertyDecoratorUsingValidateBy(IsMongoId)
export const $IsMultibyte = wrapPropertyDecoratorUsingValidateBy(IsMultibyte)
export const $IsSurrogatePair = wrapPropertyDecoratorUsingValidateBy(IsSurrogatePair)
export const $IsUrl = wrapPropertyDecoratorUsingValidateBy(IsUrl)
export const $IsUUID = wrapPropertyDecoratorUsingValidateBy(IsUUID)
export const $IsFirebasePushId = wrapPropertyDecoratorUsingValidateBy(IsFirebasePushId)
export const $IsUppercase = wrapPropertyDecoratorUsingValidateBy(IsUppercase)
export const $Length = wrapPropertyDecoratorUsingValidateBy(Length)
export const $MaxLength = wrapPropertyDecoratorUsingValidateBy(MaxLength)
export const $MinLength = wrapPropertyDecoratorUsingValidateBy(MinLength)
export const $Matches = wrapPropertyDecoratorUsingValidateBy(Matches)
export const $IsPhoneNumber = wrapPropertyDecoratorUsingValidateBy(IsPhoneNumber)
export const $IsMilitaryTime = wrapPropertyDecoratorUsingValidateBy(IsMilitaryTime)
export const $IsHash = wrapPropertyDecoratorUsingValidateBy(IsHash)
export const $IsISSN = wrapPropertyDecoratorUsingValidateBy(IsISSN)
export const $IsDateString = wrapPropertyDecoratorUsingValidateBy(IsDateString)
export const $IsBooleanString = wrapPropertyDecoratorUsingValidateBy(IsBooleanString)
export const $IsNumberString = wrapPropertyDecoratorUsingValidateBy(IsNumberString)
export const $IsBase32 = wrapPropertyDecoratorUsingValidateBy(IsBase32)
export const $IsBIC = wrapPropertyDecoratorUsingValidateBy(IsBIC)
export const $IsBtcAddress = wrapPropertyDecoratorUsingValidateBy(IsBtcAddress)
export const $IsDataURI = wrapPropertyDecoratorUsingValidateBy(IsDataURI)
export const $IsEAN = wrapPropertyDecoratorUsingValidateBy(IsEAN)
export const $IsEthereumAddress = wrapPropertyDecoratorUsingValidateBy(IsEthereumAddress)
export const $IsHSL = wrapPropertyDecoratorUsingValidateBy(IsHSL)
export const $IsIBAN = wrapPropertyDecoratorUsingValidateBy(IsIBAN)
export const $IsIdentityCard = wrapPropertyDecoratorUsingValidateBy(IsIdentityCard)
export const $IsISRC = wrapPropertyDecoratorUsingValidateBy(IsISRC)
export const $IsLocale = wrapPropertyDecoratorUsingValidateBy(IsLocale)
export const $IsMagnetURI = wrapPropertyDecoratorUsingValidateBy(IsMagnetURI)
export const $IsMimeType = wrapPropertyDecoratorUsingValidateBy(IsMimeType)
export const $IsOctal = wrapPropertyDecoratorUsingValidateBy(IsOctal)
export const $IsPassportNumber = wrapPropertyDecoratorUsingValidateBy(IsPassportNumber)
export const $IsPostalCode = wrapPropertyDecoratorUsingValidateBy(IsPostalCode)
export const $IsRFC3339 = wrapPropertyDecoratorUsingValidateBy(IsRFC3339)
export const $IsRgbColor = wrapPropertyDecoratorUsingValidateBy(IsRgbColor)
export const $IsSemVer = wrapPropertyDecoratorUsingValidateBy(IsSemVer)
export const $IsStrongPassword = wrapPropertyDecoratorUsingValidateBy(IsStrongPassword)
export const $IsTimeZone = wrapPropertyDecoratorUsingValidateBy(IsTimeZone)
export const $IsBase58 = wrapPropertyDecoratorUsingValidateBy(IsBase58)
export const $IsBoolean = wrapPropertyDecoratorUsingValidateBy(IsBoolean)
export const $IsDate = wrapPropertyDecoratorUsingValidateBy(IsDate)
export const $IsNumber = wrapPropertyDecoratorUsingValidateBy(IsNumber)
export const $IsEnum = wrapPropertyDecoratorUsingValidateBy(IsEnum)
export const $IsInt = wrapPropertyDecoratorUsingValidateBy(IsInt)
export const $IsString = wrapPropertyDecoratorUsingValidateBy(IsString)
export const $IsArray = wrapPropertyDecoratorUsingValidateBy(IsArray)
export const $IsObject = wrapPropertyDecoratorUsingValidateBy(IsObject)
export const $ArrayContains = wrapPropertyDecoratorUsingValidateBy(ArrayContains)
export const $ArrayNotContains = wrapPropertyDecoratorUsingValidateBy(ArrayNotContains)
export const $ArrayNotEmpty = wrapPropertyDecoratorUsingValidateBy(ArrayNotEmpty)
export const $ArrayMinSize = wrapPropertyDecoratorUsingValidateBy(ArrayMinSize)
export const $ArrayMaxSize = wrapPropertyDecoratorUsingValidateBy(ArrayMaxSize)
export const $ArrayUnique = wrapPropertyDecoratorUsingValidateBy(ArrayUnique)
export const $IsNotEmptyObject = wrapPropertyDecoratorUsingValidateBy(IsNotEmptyObject)
export const $IsInstance = wrapPropertyDecoratorUsingValidateBy(IsInstance)

/*
const decorators =
`Allow
IsDefined
IsOptional
Validate
ValidateBy
ValidateIf
ValidateNested
ValidatePromise
IsLatLong
IsLatitude
IsLongitude
Equals
NotEquals
IsEmpty
IsNotEmpty
IsIn
IsNotIn
IsDivisibleBy
IsPositive
IsNegative
Max
Min
MinDate
MaxDate
Contains
NotContains
IsAlpha
IsAlphanumeric
IsDecimal
IsAscii
IsBase64
IsByteLength
IsCreditCard
IsCurrency
IsEmail
IsFQDN
IsFullWidth
IsHalfWidth
IsVariableWidth
IsHexColor
IsHexadecimal
IsMacAddress
IsIP
IsPort
IsISBN
IsISIN
IsISO8601
IsJSON
IsJWT
IsLowercase
IsMobilePhone
IsISO31661Alpha2
IsISO31661Alpha3
IsMongoId
IsMultibyte
IsSurrogatePair
IsUrl
IsUUID
IsFirebasePushId
IsUppercase
Length
MaxLength
MinLength
Matches
IsPhoneNumber
IsMilitaryTime
IsHash
IsISSN
IsDateString
IsBooleanString
IsNumberString
IsBase32
IsBIC
IsBtcAddress
IsDataURI
IsEAN
IsEthereumAddress
IsHSL
IsIBAN
IsIdentityCard
IsISRC
IsLocale
IsMagnetURI
IsMimeType
IsOctal
IsPassportNumber
IsPostalCode
IsRFC3339
IsRgbColor
IsSemVer
IsStrongPassword
IsTimeZone
IsBase58
is-tax-id
is-iso4217-currency-code
IsBoolean
IsDate
IsNumber
IsEnum
IsInt
IsString
IsArray
IsObject
ArrayContains
ArrayNotContains
ArrayNotEmpty
ArrayMinSize
ArrayMaxSize
ArrayUnique
IsNotEmptyObject
IsInstance
`

console.log(decorators.split('\n')
  .filter(s => !!s && s[0].toUpperCase() === s[0] )
  .map(dec => `
export const $${dec} = wrapValidateByPropertyDecorator(${dec})`)
  .join(''))

console.log(decorators.split('\n')
  .filter(s => !!s && s[0].toUpperCase() === s[0] )
  .join(',\n'))
*/
