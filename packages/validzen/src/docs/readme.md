# ValidZen v1.0.0 - Alpha - WIP DOCS

A powerful OR & AND PropertyDecorator for `class-validator`, to support very complex validation scenarios. Full integration with  `class-transformer-validator` and useful opinionated tools. Also, a PoC to reuse ALL `class-validator` & `class-validator-extended` PropertyDecorators as-is!   


# OrAnd Decorator & Validator

*OrAnd** is a decorator and the main API for validation of ValidZen. 

It is build around the great class-validator, and can be used in accordance with it as a normal class-validator decorator of class properties (spoiler alert: but also as a standalone validator for class-less "naked" values)!

# Class Decorator Example

 ```
 class FooPerson {

   @OrAnd('undefined', 'number')
   ageYears: number | string

 }
 ```

The `@OrAnd(...validators)` checks if the given value matches with the provided conformity/types and/or Validating Functions, with 6 amazing twists:

- Arbitrary *OR & AND* composition, via simple array nesting.
- Simple type/conformity checks (eg 'string' or 'number' or 'numberString' etc) - more than 110 in total!
- Simple ad-hoc boolean returning functions, as validating functions.
- Your own PropertyDecorators duality: as Property Decorators or simple Validating Functions.
- Built in **Property Decorators of class-validator** duality, as simple Validating Functions (requires patching or a small change in class-validator)
- OrAnd (and all other Property Decorators) can be used outside classes, outside TypeScript, as simple validating functions for "naked" values.   

All of these twists together open new opportunities: 
- Ad-hoc validating of values, in TS or plain JS _(in this release)_
- Validating function/method signatures at runtime _(coming soon-ish)_ 
- Auto extraction of validated arguments in overloaded function/methods _(coming soon-ish)_
- and more...

Let's see all these twists in detail:

## Twist #1 - OR & AND

The first great twist is that ValidZen supports both *ORs and ANDs*, that work via simple array nesting. The first/root level of `...args` is an `OR`:

 ```
 @OrAnd('undefined', 'number', 'string')
 ageYears?: number | string
 ```

The validation will pass, if the value is **any of these types** (`undefined` OR `number` OR `string`).

In the 1st level of array nesting (i.e an Array in root args), it's validators are evaluated as `AND`:

 ```
 @OrAnd('undefined', ['number', $Min(0), $Max(100)])
 ageYears?: number // 0-100
 ```

This is evaluated as `(undefined OR (number AND $Min(0) AND $Max(100)))`

If we have a 2nd level of array (i.e an Array, within the root array), it is again an `OR` and so on, alternating `OR` and `AND` with simple nesting:

 ```
class Person {  
  
  @OrAnd(
    'undefined',
                                                  
    [                                          
      'number',
      $Min(0),
      [     
        $Max(100), 
        $Equals(1984) 
      ]                
    ],
    
    [               
      'string',      
      [           
        $Equals('Unborn'),         
        $Equals('Highlander')
      ]  
    ]
  )
  ageYears?: number | string  
}
 ```

which is evaluated as

 ```
( 
  undefined OR 

  (
    number
    AND $Min(0)
    AND (
      $Max(100) OR $Equals(1984)
    )
  )  
  
  OR 
  
  (
    string
    AND (
      $Equals('Unborn') OR $Equals('Highlander')
    )
  )
)  
 ```

@todo: explain the $validator
@todo: example output of failed Validation

Using this simple technique, you can be any complex validation expression!

## Twist #2: ad-hoc boolean returning functions as validators 

The 2nd twist, is that we can use simple ad-hoc boolean returning functions (i.e `(val) => boolean`) as validators:

  ```
  @OrAnd(
  [
  'number',
    function isAdult(age) { return age > 18 }
  ],
  )
  adultAgeYears: number
  ```

along side the many builtin fixed "type-checks" like `'number'`, `'boolean'` etc, but also "type-conformity" checks like `numberString` or `booleanString` etc.

- #3 The 3rd even more awesome twist is that **it supports your PropertyDecorators as Validating Functions**!

- All decorators you write from now on, can be nested OR-wise or AND-wise and they can act as double: Used as standalone PropertyDecorators, or used as validating functions! All that by changing ONE line of code (plus an import)! See `IsArrayWithAllowedValues` & `IsNumberEnumKeyOrValue` for examples.

@todo: examples & usage of $

- #4 The most amazing of all twists, is that most **Property Decorators of class-validator** can be used as in ValidZen as is (note: not all are tested, some like ValidateBy, ValidateBy etc dont make sense!)

This twist is still experimental, but it works perfect so far! Unfortunately, it requires an small injection into class-validator (patch-package) for it to work, or better a small change on their part, for this feature to become production-ready @todo: open request/PR & add issue link.

See wrapValidateByPropertyDecorator() for more details.

- #5 Finally, all (or most) of existing PropertyDecorators in class-validator, along with `OrAnd` itself and others in ValidZen, can also be used as plain functions!

Better yet, they compose naturally via `OrAnd` or otherwise (they are just functions!), outside of classes & class decorators and all their limitations! This allows them to validate simple "naked" values, not having to be decorated properties/members of a class!

All of their arguments are supported normally, and the typings are preserved @todo: except the propertyKey requirement in the result validation function.

A trivial example:

  ```
  const max100Validator = $Max(100, {message: 'Value must not be greater than 100'})

  max100Validator(99)  // returns true for valid

  max100Validator(101) // will throw ValidationError[]
  ```

In the next example many validators are composed, outside decorators and classes, using `$OrAnd`

  ```
  const aComplexValidationForAge = $OrAnd(
    'undefined',
    [
      'number',
      $Min(0),
      [ $Max(100), $Equals(1984) ]
    ],

    ['string', [$Equals('Unborn'), $Equals('Highlander')]]
  )

  aComplexValidationForAge(18) // returns true
  aComplexValidationForAge('Highlander') // returns true

  aComplexValidationForAge(101) // throws ValidationError[]
  ```

As you can see, the syntax of using `@OrAnd` as a decorator and `$OrAnd` as a function composer is exactly the same!

It plays along with wrapValidateByPropertyDecorator & ValidateByAsValidatorFunction @todo: explain

Inspired by IsGenericType & others from https://github.com/typestack/class-validator/issues/160#issuecomment-1482593808

## Version 1.0.0 Released
 
- Solve any v1.0.0 issues

- Improve tests & docs and add more examples. More & better testing / coverage ~90% -> 100%.

## Future Direction Highlights

Please support by staring, mentioning, sharing on social, reviewing, testing, opening issues or PRs or simply using ;-)

# License

MIT NON-AI


