/*
 MANY FEATURES HERE ARE NOT IMPLEMENTED in current version 1.0.0, it's how V2 or V3 might look like!

** Note: The Documentation TONE is for Version 3.0.0 **

The wow-ness of the tone of these docs is hugely "future" oriented, as I'm trying to describe the future of SpecZen, not just the current state of v1.0.0!

Although all the ideas are in the current version, the hyperbole in the tone should be ignored until this notice is removed, as it refers to what V3 should be!

For Version 1.0.0 look at @todo: add link to Version 1 examples in SpecZen
*/
import {
  EACH,
  ONLY,
  BREAKS,
  COLUMNS,
  FUTURE_END,
  SUITE,
  BREAKS_END,
  SKIP,
} from '../code'

/**
 ********** SpecZen Examples v1.0.0 ******************
 NOTE: THESE TESTS AND DOCS ARE IMAGINARY, NOT MEANT TO BE IMPLEMENTED!

 NOTE: Features NOT IMPLEMENTED YET:
 - only SKIP & ONLY levels are working. All are available, but only for semantics, not for filtering as their priorities do not count.
 -
 - Unimplemented: SKIP_END, BREAK_END etc
 *******************************************
 */

/** Code to be tested, just for reference. SpecZen doesn't care *how* these will be tested ;-) */
const add = (a: any, b: any) => a + b
const divide = (a: any, b: any) => a / b

class ImaginaryNumber {}

class SecretNumber {}

class MultiDimensionalNumber {}

class FutureNumber {}

class HugeNumber {}

class ImpossibleNumber {}

class SatanicNumber {}

class NonExistingNumber {}

class WeirdNumber {}

class UndiscoveredNumber {}

type AddTest = 'Some defintion here' // @todo
type DivideTest = 'Some defintion here'

const suite = SUITE({ title: 'Arithmetic' }, [
  COLUMNS('name', 'target', 'expected', 'error?'),
  /**
   # Suites

   A simple self-explanatory test Suite.
   It uses the above COLUMNS, to know what the array items mean, in their array position - more below
   */
  SUITE({ specHandlers: 'add' }, [
    // 'name', 'target', 'expected', 'error?' inherited from parent SUITE's COLUMNS
    ['2 nums', () => add(1, 2), 3],
    ['2 nums, reverse', () => add(2, 1), 3],

    ONLY, // only runs following tests, the above are boring!
    ['invalid args', () => add(1, 'foo'), undefined, 'Error: cant add number and string'],
    ['invalid args', () => add(1, true), undefined, 'Error: cant add number and boolean'],
  ]),
  /**
   ## Different Suite & Test Types

   Suite 'divide' uses a different Test Implementation SpecHandler(s), with different arguments, test code etc

   They divide Specs provide the interface, of what each SpecZen TestDescriptor should look like, and is used to validate the testsArray, and provide the right object and types to SpecHandler(s).
   */
  SUITE({ specHandlers: 'divide' }, [
    ['2 nums', () => divide(4, 2), 2],

    /**
     ## Nested suites

     We can have suites nested in suites, for better descriptions in a nested way, among other uses.

     Each nesting level will inherit the COLUMNS of the closest COLUMNS found in a parent suite, and the same for the `specHandlers`. In this case we're under 'divide' specHandlers, so we don't need to specify it again.

     Your SpecHandler(s) supports all Specs destined for it, and it's a good practice to use nested suites, to group similar tests and App features, under the same SpecHandler(s).

     For example:
     */
    SUITE({ title: 'WrongThings' }, [
      ['simple 0', () => divide(4, 0), undefined, 'Error: cant divide number by 0'],

      // We can have any number of nesting
      SUITE([
        ['BigInt', () => divide(4, BigInt(123456789)), undefined, 'Error: divide by BigInt is Not Implemented'],

        SKIP, // SKIP following tests (with SKIP severity)
        ['NotANumber', () => divide(4, NaN), undefined, 'Error: cant divide number by NaN'],
        ['String', () => divide(4, 'foo'), undefined, 'Error: cant divide number by string'],
      ]),
    ]),
    /**
     ## Columns:

     It's the default to write the tests with COLUMNS, for better descriptions, among other uses.

     These allow us to convert the array format to an object format (and vise versa) to use in your tests implementation code, instead of relying on array indexes, which would suck. Strong Typescript Typing & ValidZen validation included ;-)

     This is done with the COLUMNS function, which must be in the 1st position of the SUITE array arg (or just after a ONLY/SKIP in 1st position). It is called with the column names, and then knows how to interpret the test descriptions:
     */
    SUITE({ title: 'MoreWrongThings' }, [
      COLUMNS('name', 'target', 'expected', 'error?'),
      [
        'ImaginaryNumber',
        () => divide(42, new ImaginaryNumber()),
        undefined,
        'Error: cant divide between numbers and ImaginaryNumbers',
      ],

      // We can have any number of nesting SUITES, that inherit the last COLUMNS found
      SUITE({ title: 'ComplexWrongThings' }, [
        [
          'SecretNumber',
          () => divide(42, SecretNumber),
          undefined,
          'Error: cant divide number by SecretNumber',
        ],

        BREAKS, // SKIP following tests, with BREAKS severity
        [
          'MultiDimensionalNumber',
          () => divide(4, MultiDimensionalNumber),
          undefined,
          'Error: cant divide number by MultiDimensionalNumber',
        ],
      ]),
    ]),
    /**

     ### Columns: Array to Object conversion

     Columns enables the conversion of a test definition:

     ['2 nums', () => divide(4, 2), 2],

     to objects like this:

     { descr: '2 nums', target: [Function], expected: 2, error?: undefined },

     passed to your test implementation code. All you need is a

     COLUMNS('descr', 'target', 'expected')

     It is:

     - Mandatory to have Columns in the *first* row of the *first* Top Level suite. Otherwise, it throws since SpecZen won't know how to interpret the tests descriptions.

     - Optional to have Columns in, only in the *first* row of any nested suite. If it's a different row, it throws!

     A nested Suit with COLUMNS affects all Suite following tests, including all nested suites, until you call it again.

     ### Columns as Pillars

     Different fields are allowed in different suites, giving rise to different target types, descriptions, errors, etc depending on our focus!

     And let's add some needed twists doing so:

     - We're dealing with complicated arithmetic here, so we need a description.

     - We're not calling the target function (because it might be async, it can throw etc.) but instead we provide its arguments, and let the test implementation code to deal with it. Since we do that, we ought to change our specHandlers to 'divideWithTargetArguments' to reflect that.

     - We care about speed of execution, se we provide a maxDuration for each test, and the test implementation code will take care of it, and fail if the test it takes longer than that. An implementation detail, a crucial Test!
     */

    SUITE({
      specHandlers: 'divideWithTargetArguments',
      title: 'VeryComplicatedNumbers',
    }, [

      COLUMNS(
        'name',
        'description',
        'targetArguments',
        'expected',
        'maxDuration',
        'error?',
      ),

      [HugeNumber.name, 'HugeNumbers takes much time', [4, new HugeNumber], 100000004, 500],
      [
        FutureNumber.name,
        'Future numbers, well, you have to wait for them',
        [42, new FutureNumber()],
        43,
        500,
      ],

      /**
       This allows our Test Definitions to both have a better description, but more crucially to direct the Test Implementation to cater and the `maxDuration` constraint. How it does test, not up to us!
       */
      SUITE({ title: 'FailingComplicatedNumbers' }, [
        /**
         Since these throw, no expected result! And 'error' is no longer optional!
         */
        COLUMNS('name', 'description', 'targetArguments', 'maxDuration', 'error'),
        [
          'Infinity',
          `Infinity, who get it?
          Assume our method throws, after a while. We want to get the Error in a timely manner`,
          [Infinity / 2],
          500,
          'Error: cant divide with Infinity, incalculable',
        ],

        [
          SecretNumber.name,
          `SecretNumbers require clearence. Eventually they fail`,
          [1984, new SecretNumber()],
          500,
          'Error: cant divide with Infinity, incalculable',
        ],
      ]),
    ]),
  ]),
  /**
   We, on our part, did our best to provide the arguments in the right order, and with the right types, so that the target function will be called with the right arguments, and be tested thouroughly!

   SpecZen DOES NOT care about the implementation details, it just cares about the test authoring expressiveness it provides!
   **/

   /**
   ## `ONLY`, `SKIP` & siblings: controlling what tests run

   These command control which tests will run, and which will be skipped.
   And we have more than ONLY, SKIP, as they have siblings, with different priority & semantics (eg FOCUS/ME/etc & BREAKS/WIP/etc.)

   Assume the following:
   */
  SUITE({ title: 'WeirdComplexWrongNumbers' }, [

    [
      /**
       We can SKIP a single Spec (with SKIP priority)
       */
      SKIP,
      'WeirdNumber',
      () => divide(42, new WeirdNumber()),
      undefined,
      'Error: cant divide number by WeirdNumber',
    ],
    /**
     Or we can SKIP (i.e exclude) inside a SUITE, essentially skipping a *block of Spec & SUITEs inside that block*. As if you commented out the code, as you read it in the screen!

     The following example skips a block, with BREAKS priority (plus we can BREAK_END just below, to define a block).

     This is where you normally comment out a group of Specs, only to uncomment them later, and forget to uncomment them, or uncomment some wrong ones, or you break the sctructure, and then you have a broken test suite, and nothing is clear, without meta information to know why, and complete lack of control! But not in SpecZen!
     */
    BREAKS({
      reason: 'This BREAKS since API v3.4 support for ExoticNumbers',
      group: 'ExoticNumbers', // @todo: Implement filtering by group
      updates: [
        {
          date: `2023-10-10`,
          description: `We found its impossible to deal with impossible figures (numbers included) at all!`,
        },
        {
          date: `2023-10-12`,
          description: `Backlog #369 as MAYBE & WONT_FIX (for a while I guess)`,
        },
      ],
    }),
    [
      'ImpossibleNumber',
      () => divide(4, new ImpossibleNumber()),
      undefined,
      'Error: cant divide number by ImpossibleNumber',
    ],
    [
      'NonExistingNumber',
      () => divide(4, new NonExistingNumber()),
      undefined,
      'Error: cant divide number by NonExistingNumber',
    ],
    /**
     Now we stop omitting, with BREAK priority!
     */
    BREAKS_END({
      reason: 'Everything BREAK or below now works!',
    }),
    [
      'SatanicNumber',
      () => divide(4, new SatanicNumber()),
      undefined,
      'Error: watch out for SatanicNumbers',
    ],
  ]),
  /**
   We could even target a **specific group** to BREAK_END, with a group name, or a group name & reason etc!

   Except from documenting, you 're also *disabling skipping* ONLY for those that belong to the group(s), and not all tests:
   */
  BREAKS_END({
    reason: 'Lets test this!',
    group: 'ExoticNumbers', // @todo: Implement filtering by group
  }),

  /**
   * We've seen SKIP:
   *  - inside a Spec (only 1st arg!)
   *  - inside the SUITE array, anywhere (among Specs & other nested SUITEs)
   *
   *  But you can also SKIP everywhere that matters, including as first arg of SUITE(), before SuiteOptions & SUITEarray
   *
   *  For example, this
   */
  SUITE(SKIP, { title: 'WeirdComplexWrongNumbers' }, [
    [
      'WeirdNumber',
      () => divide(42, new WeirdNumber()),
      'Error: cant divide number by WeirdNumber',
    ]
  ]),
  /**
   is conceptually equivalent to
   */
  SUITE({ title: 'WeirdComplexWrongNumbers' }, [
    SKIP, // same effect as above
    [
      'WeirdNumber',
      () => divide(42, new WeirdNumber()),
      'Error: cant divide number by WeirdNumber',
    ]
  ]),
  /**
   * The same applies to ONLY & the SKIP_END & ONLY_END (and all their siblings FOCUS, BREAKS etc)
   */


  /**
   * ### SKIP Priorities

   But how do Skipies Priorities matter?

   Let's redo the previous example, with one addition:
   */
  SUITE({ title: 'WeirdComplexWrongThings' }, [
    [
      'WeirdNumber',
      () => divide(42, new WeirdNumber()),
      undefined,
      'Error: cant divide number by WeirdNumber',
    ],

    BREAKS,
    [
      'ImpossibleNumber',
      () => divide(4, new ImpossibleNumber()),
      undefined,
      'Error: cant divide number by ImpossibleNumber',
    ],
    [
      'NonExistingNumber',
      () => divide(4, new NonExistingNumber()),
      undefined,
      'Error: cant divide number by NonExistingNumber',
    ],
    /**
     Ooops! We have skipped this with very low priority! Read on below!
     */
    [
      FUTURE_END({
        reason: 'We have to wait until undiscovered numbers get discovered!',
        updates: [
          {
            date: `2023-10-12`,
            description: `The CEO insisted we work on them ASAP, but nobody seems to care about the(ir) future!`,
          },
        ],
      }),
      UndiscoveredNumber.name,
      () => divide(4, new UndiscoveredNumber()),
      undefined,
      'Error: cant divide number by UndiscoveredNumber - wait until it gets discovered!',
    ],
    BREAKS_END({
      reason: 'Everything BREAK or below?, in the tests below now works!',
    }),

    /**
     We 've just stopped Skipping, with the specific BREAK priority, so this DOESN'T affect the FUTURE skip command (btw the FUTURE priority is the lowest priority we have)

     FUTURE is still skipped, despite the CEO's wishes, because the `runLevel` priority is lower, i.e. the test refers to some FUTURE development, impossible to solve right now.

     In everyday development, you will be more dealing with SKIP and what around it (NOPE & TODO) in which dev mode  BREAKS & FUTURE will seem too exotic (to deal right now). But the idea and workflow is the same!

     We care about what broke our current test struggle in our everyday micro-dev work, and not some exotic BREAKS or FUTURE skipped tests! And we should be able to control them, and not let them disorient us!

     */
    [
      'SatanicNumber',
      () => divide(4, new SatanicNumber()),
      undefined,
      'Error: watch out for SatanicNumbers',
    ],
  ]),

  /**
   ## Repeat similar tests with EACH

   Enough with failing exceptions on Exotic Numbers!

   Let's divide some normal numbers, and see we're still not perfectly crafting our Test Cases yet:
   */
  SUITE({ title: 'NormalNumbers' }, [
    COLUMNS('name', 'a', 'b', 'expected'),
    // even nums
    ['2 normal even nums 4 & 2 ', 4, 2, 2],
    ['2 normal even nums 8 & 4', 8, 4, 2],
    ['2 normal even nums 16 & 8', 16, 8, 2],
    // ... more crucial tests here

    // odd nums
    ['2 normal odd nums', 9, 3, 3],
    ['2 normal odd nums', 18, 6, 3],
    // ... more crucial tests here
  ]),

  /**
   The problem is obvious: repetition. But SpecZen is DRY. We could write this:
   */
  SUITE({ title: 'DRYNormalNumbers' }, [

    COLUMNS('name', 'a', 'b', 'expected'),

    ['2 normal even nums', EACH([4, 2], [8, 4], [16, 8]), 2],

    ['2 normal odd nums', EACH([9, 3], [27, 9]), 3],
  ]),
  /**
   Its obvious what EACH does: it repeats the Spec, as the arguments of EACH (each arg is an array) with the `'a'` & `'b'` params repeated, while the others staying static (name & expected).

   We don't need to worry about the descriptions, the args are there to describe the test, as SpecZen will use them to create a better description anyway! And since they are repeated by SpecZen, you get some pseudo-Suite nesting goodness for free!

   You could achieve this with `Array.reduce` or a n `Array.flatMap` etc, but it would take coding effort, it would be less readable (for non devs), and less DRY!

   ## EACH args

   Each arg in EACH is an array of Spec parameters. In the above, we always repeat 2 params, corresponding to 'a' & 'b' columns.
   We can repeat more params in each EACH arg, or organise our parameters as we see fit.

   Let's see an example where the `'a'` & `'b'` params are organised in their own array as `'targetArguments'`, and the `'expected'` being part the EACH args:
   */

  SUITE({ title: 'DRYNormalNumbers2' }, [
    COLUMNS('name', 'targetArguments', 'expected'),
    ['2 normal nums - EVEN or ODD',
      EACH(
        [[4, 2], 2],
        [[8, 4], 2],
        [[16, 8], 2],

        // Odd numbers can fit here, since "expected" is repeated also
        [[9, 3], 3],
        [[27, 3], 9]
      ),
    ],
  ]),
  /**

   The args inside EACH spread inside the Spec params, repeated in the order they are defined, and the Spec is repeated for each combination of the repeated args.

   ### Defaults & Discarded args

   Since EACH arguments spreads and push values in the Spec, we can have different number of eachArgs inside each EACH repetition, thus creating defaults & discarded param/columns, as we see in this example:
   */
  SUITE({ title: 'DRYNormalNumbers2' }, [
    COLUMNS('name', 'targetArguments', 'expected', 'discardedExpected?'),
    ['2 normal nums - EVEN or ODD',
      EACH(
        // All of these use the default "expected" = 2
        [[4, 2]],
        [[8, 4]],
        [[16, 8]],

        // These have their **own expected**, pushing the default "expected" forward to "discardedExpected" optional COLUMN
        [[9, 3], 3],
        [[27, 3], 9]
      ),
      2 // the default "expected". But the ODD numbers replace it with their own "expected", pushin this to "discardedExpected" when they are expanded.
    ],
  ]),

  /**
   You should do this at the end of the Spec params, and not in the middle, as it would be confusing. Also, you need optional params (with a "?" at the end of column name), that consume the "pushed" & unused Spec params.


   ## Multiple EACHs

   EACH can be used more than once in a test definition! This will create a "test matrix" with ALL possible combinations of the repeated params, as they expand in the order defined. Be wise about using it, as it can expand the number of Specs significantly!

   Let's shift from numbers to an API read test, where different *Users* have access to *Documents* with different permissions, and we want to check all of these combinations. Note that Documents with id `999` & `666` are classified!

   Let's see how this would look like be with 2 EACHs:
   */
  SUITE({ specHandlers: 'ReadDocument' }, [
    COLUMNS('@title', 'user', 'documentId', 'statusAndErrors'),
    [
      'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
      EACH(['simpleEmployee'], ['managerEmployee']), // test all users we care about
      EACH([{ id: 999 }], [{id: 666}]),              // against all classified documents (i.e 2x2 tests)
      ['HttpStatus.FORBIDDEN', `ApiZen: FORBIDDEN (403)`],
    ],
  ]),
  /**
   This would be equivalent of writing all 2x2 tests:
   */
  SUITE({ specHandlers: 'ReadDocument' }, [
    COLUMNS('title', 'user', 'documentId', 'statusAndErrors'),
    [
      'Throws FORBIDDEN if user simpleEmployee has no permissions to read document 999',
      'simpleEmployee',
      { id: 999 },
      ['HttpStatus.FORBIDDEN', `ApiZen: FORBIDDEN (403)`],
    ],
    [
      'Throws FORBIDDEN if user simpleEmployee has no permissions to read document 666',
      'simpleEmployee',
      { id: 666 },
      ['HttpStatus.FORBIDDEN', `ApiZen: FORBIDDEN (403)`],
    ],
    [
      'Throws FORBIDDEN if user managerEmployee has no permissions to read document 999',
      'managerEmployee',
      { id: 999 },
      ['HttpStatus.FORBIDDEN', `ApiZen: FORBIDDEN (403)`],
    ],
    [
      'Throws FORBIDDEN if user managerEmployee has no permissions to read document 666',
      'managerEmployee',
      { id: 666 },
      ['HttpStatus.FORBIDDEN', `ApiZen: FORBIDDEN (403)`],
    ],
  ]),
  /**
Imagine this for 3x3 or 4x4! Even if you write all these tests with an AI (like I did just now), it's still more verbose, less readable and harder to change and reason about, than the EACH equivalent!

Are we done with EACH? Not yet! We can go even deeper!

## Deep Nested EACHing

So far, we've seen EACH used in the 1st level of the Spec (the Spec's ROOT), but we can use it in any deep nested level of our Object we want to expand!

Think of when you have a function/method/api that should work with slight variations of the data of some input object. For example, my function should work with both `number` and `stringNumber` and produce the same result:

  - {someData: { number: 5, moreData}, otherProps}

  - {someData: { number: '5', moreData}, otherProps}

  - {someData: { number: '5.0', moreData}, otherProps}

  - {someData: { number: 'five', moreData}, otherProps}

Instead of writing 4 Specs repeating all other data, you can write only 1 and use EACH **directly on the nested value of your input object**, and expand the input object!

   [
      'someSpecParam',
      { someData: { number: EACH(5, '5', '5.0', 'five'), moreData}, otherProps }
      'someOtherParam',
   ]

This will expand this Spec to ALL 4 variations above, with you being DRY!

As you noticed, we're not using an Array as every EACH argument, but directly the prop value. This is because unlike the root EACH, we're not "pushing" Spec parameters, when we use EACH in a nested level. We're replacing the value of the property on the input Object directly, with every EACH arg.

Let's rewrite the example above, using nested value changes with nested EACH:
*/
  SUITE({ specHandlers: 'ReadDocument' }, [
    COLUMNS('@title', 'user', 'documentId', 'statusAndErrors'),
    [
      'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
      {
        userId: 1,
        role: EACH('EMPLOYEE_ROLE', 'MANAGER_ROLE')  // test all roles we care about, on same userId: 1
      } ,
      EACH([{ id: 999 }], [{id: 666}]),              // against all classified documents (i.e 2x2 tests)
      ['HttpStatus.FORBIDDEN', `ApiZen: FORBIDDEN (403)`],
    ],
  ]),

/**
Deep nested EACHes work with both nested Objects & Arrays, and also play well with instances of classes (with EACH outside of them.

You can have a Spec like:

  [new Foo(1), EACH(new Foo(2), new Foo(22)), 222]

and all your Foo instances will stay as un-cloned instances of Foo when permuted in the Spec variations.

BUT you can't currently use EACH **inside** some class instance:

  [200, new Foo({someEachProp: EACH(2, 22)}), 222]

as doing so will produce an error. This is because cloning of instances, with an EACH inside them, is NOT IMPLEMENTED currently.
*/

// @todo(245): SUITE<NumbersAddTest>(...) to provide a type for the testsArray test target function, and the expected result
])

