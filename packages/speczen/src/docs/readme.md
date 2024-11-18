# SpecZen v1.0.0

Surgical Precision Testing & Spec-ing.

SpecZen is a Testing "Spec Definition DSL" and a Test Spec generator for **any** Test Framework (or programming language)!

Bored with reading docs? Head right to the code at `docs/examples.prettier-ignore.ts` @todo: link!

# Aims & Overview

## The Big Picture 

In the near future, AIs will be writing most of the Software code, adhering to some description, or better some Spec, while self-healing the code itself autonomously. 

When this time arrives, the Spec will be more important than the code. And the Spec, is more than just "tests" or TDD or BDD or whatever.

This projects is a small step towards this direction, by offering a way to write better Specs, that are decoupled from the Test Implementation code, and can be run in any Test Framework (or programming language) you want.

## Current aim: Author better Test Specifications & have absolute execution control on them!

SpecZen offers an awesome way to describe & interactively & selectively execute detailed Specs, decoupled completely from their Test implementations.

This means you can use ANY Test Framework for the Test Implementation (incl. but not limited to *Jest*, *Mocha*, *Jasmine* etc). 

SpecZen features an awesome but trivial Spec DSL to write Spec Suites, and a Spec generator (where a Spec is a.k.a. as *Test Case*, *Test Definition* or simply *Test*). This DSL's main aim is to give you immense control on **selecting exactly which tests to you want run** (and which to omit). 

### Spec DSL

The Spec DSL is type-safe, mostly with compile-time errors (in TypeScript), but also throws if you stuff it with wrong structure at runtime.

It is a very simple language, with only a handful of keywords, that you can learn in the next 5 minutes. 

### Grouping similar tests with SUITE

SpecZen has suites (`SUITE`) for organising your Specs in easy meaningful and related nested groups. 
  
    SUITE(`Numbers testing`, [
      SUITE(`Addition`, [...specs...])
      SUITE(`Division`, [...specs...])
    ])

Nested Suites inherit everything from their parents, and can override. This makes life so much easier and DRY, with defaults that can be overridden as you go deeper. 

Suites are absolutely composable, and you can have as many levels of nesting as you want, as in other frameworks. But unlike other frameworks, your Specs will execute in the exact order you define them, the way a Human reads them! 

### Filtering - more than `ONLY` & `SKIP`

SpecZen also has Filters such as `ONLY`ies & `SKIP`ies with **priority levels**, that offer significant semantic and practical benefits, similarly to how `logLevel` `ERROR` VS `VERBOSE` do to logging.

But, like `console.log()`, you can start just with vanilla `SKIP` & `ONLY`, so you can skip the next paragraph if you want.

#### Onlies and Skipies 

The `ONLY` family, for example `FOCUS`, `SOLO` & `ME` are Onlies. The `SKIP` family, such as `BREAKS` or `WIP` are Skipies.  

You can use those onlies & skipies, anywhere it makes sense. For one Spec, or for a whole `SUITE` and sub-`SUITE`s. You can also define regions with `SKIP_END`, `ONLY_END` & `SKIP_MUTE` that give you even more immense control!

@todo: example

Finally, you can optionally have meta information to your Filters, eg `WIP('Refactoring for #456 in progress')` or `BREAKS('Not implemented yet - see #678')` and few more options.   

It's much more than `it.only()` & `describe.skip()` on steroids! So, `SKIP` commenting out tests, just to run only a subset of them! Which is what all developers I 've seen do, including myself, for a long time. It sucks not only because it's time-consuming, error-prone & hard to manage, but also cause all your refactorings (variable renames) might not be reflected in commented out code!  

### EACHing - Repeating Patterns 

The whole of SpecZen is a repeating pattern of Specs, solving the disparity between `it.skip / it.only` and `it.each` in frameworks like Jest/Mocha, taking it further with advanced filtering to be much more than a fancy `it.each()`. 

The `EACH` command takes it even further: it makes it extremely easy to test slightly different sides of a feature (i.varying inputs) in place, keeping your Spec definitions as laconic as possible. 

Use an `EACH(altValue1, altValuealt2, ...)` instead of a value itself, to generate all Spec variations (of all alternative values permutations), while keeping the rest of the Spec as is.

@todo: example

You can combine multiple EACHes in each Spec (to multiply the variations) and also use it in `{some: {deep: {nested: {valueToCheck: EACH('value1', 'value2')}}}` and it will repeat this **whole {some: {deep: ...}} object** in separate generated Specs, with `valueToCheck` having all the alt values in each one! 

Finally, you can use Onlies & Skipies inside `EACH` as well!

And now, since it's so easy to test similar alternative Test Cases/Specs, you will! And that's how you'll reach that sweet 99.9% coverage, while remaining DRY ;-) 

### Decoupling

Finally, the SpecZen philosophy will guide you to write better Test Implementation code (in the framework of your choice, eg Jest/Mocha etc), that deals with the Generic test, rather than the specific! You will stop copy-pasting similar code "...because it's OK to do not be DRY in testing...". No, it's not OK, ok?

Congratulations: by these few keywords and concepts, you got 90% of the SpecZen syntax! It's so simple, it's deceiving!

See `docs/version-3-examples.ts` to get more of the idea!

## Future aim: Specs === Documentation === Examples === Tutorial === Executable Code === Playground 

**NOT IMPLEMENTED**: Turn your Specs into Documentation. Or maybe, write your documentation as Specs? Or Both? And by documentation we don't mean the boring auto generated JSDocs of your methods. Or long Cucumber definitions that nobody wishes they had to go through. I mean **real documentation** users want to read, proper Examples & Tutorials, even live executable code examples! 

Your `readme.md` or `examples.md` will no longer be disconnected from the code, perhaps getting out of date or be wrong (because it's just text). Imagine having it updated and built every time you build, as long as you write every feature worth documenting, using a special SpecZen way! See how Tests-as-docs idea started in my [upath](http://github.com/anodynos/upath) and became more awesome in my [LogZen](http://github.com/neozen/logzen) - to get a glimpse of what's the aim! 

This aim is NOT implemented in current Version. 

## What SpecZen is NOT

### Compatibility 
- It's NOT a Testing Framework / Test Runner etc. It's a Spec Definition DSL & Spec Generator. 
- It's NOT a replacement for Jest / Mocha / Jasmine etc. It's a great way to write your precise Specs separately from Test Implementations. Test Implementation is the code Specs run against (a.k.a their `SpecHandlers`) and those Test Implementations are written and do run in frameworks like Jest/Mocha (or anything else you want, in any programming language actually)!
- It's NOT about only White Box or Black Box testing, or Unit or Integration testing or what have you. It's about ALL of them, writing better Specs and having absolute control over them.

### Coding
- It has no `expect`-ation libraries, no code blocks, no `before()`, no `async foo(){}` or anything like that. You can express the need for any of those in your Specs (eg `{ thisResultShouldArriveAsync: true }`), and it's the Test implementation's responsibility to cater for it! 
- You're NOT writing **test code**. Essentially you're writing a document that describes the Specs and which of these that should be carried out as Tests at any point in time (during development, deployment etc). The output of SpecZen is **pure JSON** (hence it can be wired to any framework/library/language).

### Users 
- SpecZen Users do NOT need to know or care about how these Tests will be implemented, or be the programmers that write the tests or the code under test! For example, this is valid SpecZen `SUITE('Daytrip to Mars', [{ flyTo: 'Mars' }])`, but we'll let someone else implement & test it!  
- It is NOT aimed only for Managers, it's aimed for both Managers & Developers! For everyone! You could even write the Spec of your Life in it, and it will produce the JSON for it!
 
    
     SUITE(`My Life's Spec`, [
        COLUMNS('ByAge', 'DoingWhat', 'NetWorth', 'FamilySize'),

        [22, 'Finishing College', -100000, 1],  
        [30, 'Best Brogrammer', 10000, 1.5],  
        [40, 'Co-founder', -99999, 2],  
        [50, 'CEO', 100000000, { wife: 1, kids: 3, dogs: 2, cats: 3} ],  
     ])   

Good luck implementing it!

# Why SpecZen?

We've all been to scenarios with thousands of tests, with hundreds for each logical or physical "suites". All mocha-like frameworks have separate files, and infinite `describe('this', () => describe('that', () => it('should do this', () => ...)))` nesting. So we don't need anything else, right?

Wrong! 

## Dev Xperience

What if you want to run only a subset of tests, but not all of them, and you want to do it interactively, inside you code? Say you're actively working on a feature with many "serial" tests, many of which are broken or not yet implemented.

You want to run only the ones you're **really working on** and care about. - You don't care about the rest of the tests: 
- Test Suites - can be eliminated interactively in Jest, but this won't scale (explain)  
- Tests below or above you just want to run the ones you're working on, and you want to do it interactively, but in code! Why? You want to send this working feature set to a branch PR for other to see, without have commented out tests. 

But you don't want to comment out the rest, and you don't want to run all the tests in the file, because: 
  - it takes too long, 
  - because you know they break, 
  - because they produce and a lot of logging noise (don't we all resolve to `logger.log()`?)

## DevOps Xperience

What if you want to go ahead and commit to a branch, or even deploy from "main", a version with some disabled (`SKIP`ed) tests, for a good reason? Would you comment them out? And add a @todo/@fixme comment? 

Would you prefer to have a way to disable them *meaningfully*, and then re-enable them easily, without having to comment out or add/remove @todo comments that report nowhere? 

Wouldn't you want to tag them for why they `BREAKS('These tests break with the new API v2, but we have disabled the functionality on the site as well. Paying customers complain but CEO said we'll leave tech dept for next year(s). See #666.')` and get reports and semantics over it? SpecZen enables exactly this!

## SpecZen Benefits

SpecZen keeps your test code extremely:

- DRY, by allowing you to define your tests in a declarative way, with minimal code or test case repetition - it does it for you! 

- A mini-DSL for Test Definitions, that is:
  - Concise, since you only define the Spec (a.k.a. Test Cases), and not the test code - (see `docs/examples.pretter-ignore.ts`).
  - Incredibly Strong Typed (in TypeScript), so you want place wrong things in wrong places (see `typings-failing-tests.ts-NOT-ignore.prettier-ignore.ts` & `typings-passing-tests.prettier-ignore.ts`) 
  
- Terse: your tests are just Arrays of nested declarations (and nested Arrays)!  
    - Small tests are **real one-liners**
    - Large tests are easy to read in a vertical awesomeness.
    - Editing is pure vertical editing joy: since your whole structure, is mainly an array, you can fold it/unfold it very easily. 
      - Adding new fields, descriptions etc is just a breeze!
      - Adding new Test Cases is just a breeze!  
  - No more `describe('this', () => describe('that', () => it('should do this', () => ...)))` nesting & copy pasting!
  
- Developer friendly: replicating tests, or base on existing tests, while being DRY, has never been easier! But most of all it forces you to write independent tests, that are not coupled to each other, and can be run in any order!
 
- Readable, since the focus is to describe the test scenario, not the test code. Non-technical people can literally read and write tests, and understand what they do!

- Focused, by allowing you to run only the tests you want, and skip the rest, with the `ONLY` & `SKIP` commands and their priority siblings.

- Organized, by allowing you to nest suites, and have different suites & sub-suites for different test scenarios, etc.

- Expressive, using the unique ways to express requirements and tests focus, without needing to be dealing on the how. A person (even non-technical) can write all the tests in advance, without having "plugged" the test implementation functions yet! 

- Flexible, cause the tests can be refactored, changed and extended easily. Test Implementations can be amended to cater for a new feature, or a new test type, BEFORE having to write new implementations and add new duplicate code (as is often the case in testing)

- Safe, since your Suite Test Definitions are strong Typed (and also runtime are validated via ValidZen (Gen2/3)), that they have ALL the right values & structure, BEFORE they arrive to Test Implementation Land. So, before you panic when your tests break and start wondering about your tests Implementation or App code, make sure the test arguments in the Definition were sane!  

- Console-free filtering of tests, when you have no access to console (remote debugging anyone?), or is more convenient to have semi-permanent filtered (i.e skipped) Specs (eg `BREAKS('since API v2')`)! 

- Framework/Language Independent: SpecZen in its core doesn't care if you are using Jasmine, Mocha or Jest (or add your own). Or even if you're on Javascript or Python or C++. It provides you with the Test Definitions mini-DSL, and it generates the test specs you can run in your test framework of choice. You can change frameworks easier that ever, assuming your tests are written in SpecZen & you care to rewrite the implementation code (which doesnt't have to carry the Test Definitions burden). Or you could spin a web server and iterate over the Specs generated in another platform.  

Unique features not found anywhere else! It's time to rename your Jest & Mocha `.spec.ts` to `.test.ts`, cause the real Specs are here ;-)  

`SUITE('GoToMars', [ONLY])`

Not believable? See `docs/version-3-examples.ts` to get more ideas!

# SpecZen Features

## Decoupling 

SpecZen completely decouples the test code from the test runner & the tests implementation.

SpecZen is only the ideal Definition of **What tests we should have** and **Which tests to run, right now**. NOT how they are implemented! Even if you change your test framework, or application, or implementation language etc the SpecZen definitions will stand as they are (provided the different Application, language implementation etc have the same behavior of course).

Note: Your test implementations, are written inside Jest or Mocha, or anything else you want! We mention those 2 due to popularity. 

## Test Implementation **SpecHandler**

The SpecHandler is the Test Implementation code, that takes one Specs and runs it. 

And it is just a `const divideNumbersSpecHandler = ({a, b, expected}: TNumbersSpecData) => (/* Test Implementation code*/)` or similar in your Mocha/Jest, or in other Testing implementation frameworks.

To further decouple SpecZen and testing frameworks, you can mention the SpecHandler only by a string `myNumbersSpecHandler` in your Top-level SpecZen `SUITE` (and you can change it going forwards). YOu can have no references to the actual SpecHandler code, or the test framework it-self! The `SpecHandler` also is a very small name - like a function name, for example `addNumbers` or `read` or `userLogin` etc, as these will be few (tens, not thousands) and you don't need a complicated description here. 

## **SpecHandler** Aims

The tests in a SpecHandler have a *slightly different* aim, but *enormously better* way: The Holistic Generic way!  

In your Test Implementation `SpecHandler` you have full access to their vast library and full range of features of Mocha/Jest or whatever you 'll use. You can use Promises and `async`, and `before` etc like you would normally. You can use prerequisites and `before()` etc. 

The only thing SpecZen gives your SpecHandler at each `describe.each(handlerSpecs)` iteration, is a *Spec to execute*, along with some meta for your use.  

You write for example an `describe.each(addNumbersSpecs)` for every `addNumbers` or `divideNumbers` SpecHandler you have defined, and then you iterate over a **flat list** of Specs that deal with **ONE specific thing**, serviced by that single `SpecHandler`. 

For example in an API, you would test the `readOne` or the `update` method, with 2 separate SpecHandlers. But when you test the `update` success or failure parts, we suggest a single `SpecHandler` (but nothing prevents you from using separate SpecHandlers). You can have a different SpecHandler in each SUITE, but the first Top-level one is mandatory. 

### The Generic way

The `addNumbersSpecs = [{a:1, b:2, result:3}, ...]` is what tests should run. SpecZen generates a "list" of what tests should run for a particular SpecHandler, you pull and feed those into the specific implementation "SpecHandler" for the specific Spec family (eg an API read) via a `describe.each(addNumbersSpecs)`. The SpecHandler is written in your Test Framework (eg Jest/Mocha), using all their available features.   

The `SpecHandler` for `addNumbers` or `API read`, deals with all the testing complexities, all different sub-cases and is written and driven specifically by the Specs data shape, that you define!

Scroll to the example below to get the idea!

### How is this even technically possible? 

Wait a minute. We can write using the full Mocha/Jest API oe whatever, async & Promises, `before()` etc but there's **nothing** asynchronous in SpecZen. Also, there are no prerequisites, no `before`, no `after`, no `beforeEach` for the SUITES & Specs etc. 

How do they interact?

Also, there's nothing in SpecZen's code about Jest/Mocha (apart from SpecZen's own Jest Tests!). And there nothing in Jest/Mocha about SpecZen, no plugin, no import, nothing! 

Yet they work seamlessly together! *How is this even possible?*

Well, you give up one small thing: the matching of Jest / Mocha `describe()` nesting with that of `SUITE`s!

Inside your perfectly valid Jest/Mocha `SpecHandler` implementations, you write your "normal" tests with **as many nesting levels of `describe()` & `it()` you need**. You actually tend to write a small test facility for the feature you're testing and its nuances. Similarly, when writting the Specs with SpecZen, you use as many `SUITE([])` nesting levels as you need. 

Now in each `describe.each()` invocation, you deal only with a *flat list* of Specs along with some meta, that all target a specific `SpecHandler`. Additional to native Jest/Mocha nesting only inside the `SpecHandler`, SpecZen has the nested `SUITE([...])` levels implicit to the native nesting: it is part of the string description SpecZen generates. Trivial to handle, you just print this meta `description` in your 1st `describe()`! 

And done, that's the only sacrifice, resulting to no other interdependence's needed! No plugins or imports, no hacks, no complicated recursions, just a different Test Implementation mentality & writing style. And technically, the matching of recursive `SUITE` => `describe()` seems like a huge mess.  

## Generic SpecHandler Example

Assume we want to test an API's `read` (eg HTTP GET) functionality, that returns one instance / record OR throws errors, depending on the input, who's requesting it etc. In this example, we will have one single `SpecHandler` named `read`, for success & failure and other cases, cause the similarities are so many.

Let's now focus on a simplified `SUITE('read:errors', [])` which has:

    `COLUMNS('description', 'user', 'requestInstance', 'statusAndErrors')` 

One of the many Specs in `read:errors` to producing an error could look like:

    
    ```
      [
        `Throws NOT_FOUND if ${entityName}Id really doesnt exists, with SuperAdmin / NO AuthZen`,
        superAdminEmployee,
        { id: 999 },
        [HttpStatus.NOT_FOUND, `ApiZen: NOT_FOUND (404): ${entityName} with ids [999]`],
      ],
    ```

Note that our instance data is just `{ id: 999 }`, cause in errors there's no other result that needs to be checked, just the errors!

Remember, the values in the Spec are entirely up to you, and the same is the Implementation Spec *SpecHandler*. You can pass via `Spec` any flag or SpecHandler mini-config to drive your SpecHandler.  

Let's see how this Test Implementation `SpecHandler` would look like:

// @todo: bring up to date 

        ```typescript
        // Test Implementation SpecHandler for read:errors

        // This 1st line is the only "interface" between SpecZen & Jest: Specs and describe's description!
        describe.each(READ_Specs)(`Spec: ${configurableSpecZenSpecDescriptionWithNesting}`,
        
        // Then it gives you the Spec data, in the shape you defined, and gets out of 
        // your way, so you can write your normal (but Generic) SpecHandler in Jest, using full Jest!

          ({
            description,
            user,
            instance,
            statusAndErrors: [expectedStatus, errorMessage],
            // other fields, used in other cases of read
          }) => {
            const url = `/${entityName}/${instance.id}`
            let res
            beforeAll(async () => res = await rpAPI('get', url, user))

            describe(`--> Invoked GET "${serverURL}${url}" returns an "${entityName}" instance allowed for ${user.name}`, () => {
              it(`has right HttpStatus.${HttpStatus[expectedStatus]}`, () =>
                expect(res.statusCode).toBe(expectedStatus))
        
              if (expectedStatus === HttpStatus.OK) {
                it(`with right body`, () => {
                  expect(res.body).toMatch(instance)
                })
                /**
                 * You can/ought to check a lot more here, like it has the right allowed attributes depending on user.roles() and many other things or complicated scenarios.
                 *
                 * You tend to fit as many checks as you can think that are *relevant* to reading an instance, and then what Spec data would be needed to trigger this behavior. This happens with a field in COLUMNS such as options etc, and then cater for it here!
                 */
              } else
                it(`Starts with the right errorMessage \n"${errorMessage}"`, () =>
                  expect(res.error.message).toStartWith(errorMessage))
            })
        })
        ```

As you can see, it deals not only with `read:errors` but with the whole `read` operation. There is a branch to check for errors, and another for success. 

This way, many different but similar `read` Specs make sense to use the same `SpecHandler`. This way, you can add more `Spec`s easily, without having to duplicate code, but perhaps some small addition to the Test Implementation `SpecHandler`!

You could of course have separate `SpecHandler` for success and failure, and it's a matter of taste. But SpecZen favors grouping together similar `Spec`s, and have a single `SpecHandler` for them.

What about SUITEs? How do they relate to `SpecHandler`s? 

Multiple SUITES, especially nested ones, can (and should) have the same SpecHandler. For example using just a `read` SpecHandler, we can have nested suites like:

    ```
    SUITE({specHandler: 'read'}, [
      SUITE({name: 'read:errors'}, [
        SUITE({name: 'read:errors:authorization'}, [...Specs]),
        SUITE({name: 'read:errors:not_found'}, [...Specs]),
        SUITE({name: 'read:errors:locked'}, [...Specs]),
        ...
      ]),      
      SUITE({name: 'read:success'}, [...Specs]),
      ...
    ])
    ```

We only change the `name` of each child SUITE, but the SAME SpecHandler `read` will be invoked for each of these Spec in each SUITE (and the SpecHandler must be able to deal with all of them).

Naturally, the `UPDATE` SpecHandler will be a different one, and so on.

__This way you almost never have to write a specific-valued test again! All you need is `it.each(addNumbersSpecs)("GENERIC test here for addNumbers() please", ()=>{})`__

## Sequence & Control 

In all test frameworks like Jest or Mocha, tests are run in a sequence. 

Hence, we already have the notion "below" already.

To facilitate handling of sequence, everything in SpecZen is contained in an array. 

We use a number of COMMANDS^^ to have absolute control on this list. 

Lets revisit the 2 well known commands that all frameworks have, `ONLY` & `SKIP`:

- `ONLY`: run only this or these test(s) that follow. This is the Exclusive side.
  - If used inside a test, it runs `ONLY` this test! Plus all tests that have `ONLY`.
  - If used on top of a SUITE, it only-ies all tests following, (i.e all in the current Suite) and following nested SUITEs
  - If used in the middle or test suite, it only-ies all tests following (in current Suite), and following nested SUITEs. In the way you read them as a human, unlike other frameworks!

-`SKIP`: skip this or these test(s). This is the Skip side.
  - If used inside a test, it SKIPs only this test! 
  - If used on top of a SUITE, it skips all tests following, (i.e all in the current Suite), and following nested SUITEs
  - If used in the middle or test suite, it skips all tests following (in current Suite), and following nested SUITEs

__(^^ Yes! All Commands in SpecZen are in CAPITAL, to separate from rest of your code/test data, and because they are tokens & also functions with args (eg `SKIP` or `SKIP({reason: 'Breaks since refactoring in e53a1'})` can be used :))__

## All Filters (eg `SKIP` & `ONLY`) take metas

You can add meta info to your filters:

```
SKIP({
 descr: `Tried with refactored code & breaks with "Error: Invalid argument". 
         Functionality is not crucial for now, we might even depracate it - see #223`,
 group: 'UserLogin'
 updates: [
  {
    date: `2023-10-12`,
    description: `The team decided we intorduce a BREAKING CHANGE and get rid of it!`,
  },
],
 ...
})
```

## Skipies and Onlies priorities

SpecZen will use different **priorities** of `SKIP` & `ONLY`, to control which tests to run in semantically incredible new ways! 

Think of logging, where we have different Severity or Priority **logLevels**. To understand their logic, we need to understand the *Semantics* of the *Severity*. See LogZen for more details. 

In SpecZen we have 2 select *Filters* families: 
 
- the **Include Exclusively** (eg. `ONLY`), what to **Include** (exclusively, while omitting all others), 

- and **Exclude**, (eg. `SKIP`), which is what to **Skip** completely. 

Think of Affirmative & Negative, Yes & No or simply `ONLY` & `SKIP`! When we refer to `SKIP` & `ONLY` from now on, we'll mean their families.

### The `ONLY` Filter (Onlies)

The `ONLY` is the **Include Exclusively** side, and have these priorities/severities.   

Names are chosen to have a "positive, inclusive and focus" connotation, and also to be easy to remember:

- `FEAT` = 1 - We are starting work on a FEATure (eg a workpiece, PR, a ticket etc), so everything belongs together in away. We want to narrow to everything we can think of as related to this FEATure.
- `LOOK` = 2 - We start delving down to what WORKs, cause some part the whole FEATure might start to be breaking, or are irrelevant noise etc.
- `ONLY` = 3 - Only run this or these tests, it's our soft focus.
- `FOCUS` = 4 - Focus on a specific groups of Specs or Suites, along higher priority ones. The ones with lower priority (`FEAT`, `LOOK`, `ONLY`) are disabled. 
- `PICK` = 5 - Pick a group of worked-together tests, and run only them.
- `SOLO` = 6 - What we are currently working on, nothing else should matter! 
- `ME` = 7 - Override anything else, only me!

(We also call them collectively as **Onlies** or **an Onlie** or "ONLY priorities/siblings" or plain "ONLY")

Note: when we first introduce a higher level of an Onlie (eg `SOLO`) anywhere in our suite, we narrow down the tests that are *exclusively selected*. 
The tests with a lower Onlie priority have lost our focus. So in effect, the more we use **higher priority Onlies**, the **less tests are run**.

We suggest against having Onlies for in your Suites/Specs for long: you start a PR/work item/feature, you start focusing on it, and you're supposed to start removing the Onlies as you finish. This is the opposite of `SKIP`, see below.

Think the contrast of low & high LogLevels, when developing OR when in PROD:

 - While developing (locally or not), we have high logLevels (eg `VERBOSE`), if things work OK. We even have  `DEBUG` or even  `TRACE` enabled is our log level for specific parts of the App, when we struggle to pin-point that buggy code. So its high `VERBOSE`- `DEBUG`- `TRACE` on DEV, most times.
 - In production, we have `WARN` or `ERROR` usually, but if things go wrong we go a bit higher. But would you ever use  `DEBUG` even on STAGING env? Probably not. 
 
We have the same notion here, it depend on the focus.
  
The initial dev focus, when we're working on a FEATure, we're between `ONLY` & what's before it, like `LOOK` & `FEAT`. When things get a bit tough, we need a higher level of `FOCUS`, similarly in logging we only have `INFO` or `VERBOSE`, but not  `DEBUG` or  `TRACE` all the time. But when things go wrong, we go to higher levels of concentration, eg to `FOCUS`-`PICK`-`SOLO` and in extreme case to `ME` (think `ME` as the equivalent to `TRACE` `logLevel`).

**Rule of Thumb: The HIGHER the Onlie priority (eg `SOLO`), found in all your Suites, in all Specs, the LESS tests are run (i.e more focus, more solo-ness ;-). The `ONLY`, `FOCUS` etc. ones are eliminated.**

### `SKIP` Filter (a.k.a Skipies)

The `SKIP` is the **Exclude** or **Hide** command and we have the following priorities & semantics.

The names are chosen to have a "negative, exclude and ignore" connotation, and also to be easy to remember _(including **FUTURE** :-( which looks bleak with all the wars lately)

- `FUTURE` = 1 - We might have a thought about this FUTURE broken/not implemented feature, but no focus at all right now. It's nice to have a roadmap and some meta though!
- `YAGNI` = 2 - We know we don't need this feature, but we keep a test skeleton for it, just in case.
- `BREAKS` = 3 - We know it breaks, probably for a long time. Not fixable, not the focus right now.  
- `IGNORE` = 4 - Ignore this test, its maybe part of the whole feature, just not this work piece (eg PR), or waiting for something or someone else etc. 
- `SKIP` = 5 - We are currently working around this feature, but we want to be able to drill down a bit more if needed.
- `NOPE` = 6 - We don't actively want those. Maybe we are DONE with them & they seem to work fine. But maybe we don't want their noise!
- `TODO` = 7 - Marked in our open TODOs, will come back to it soon
- `WIP` = 8 - Work in progress, but not there yet. Disable momentarily.

(We also call them collectively as "Skipies" or "a Skipy" or "SKIP priorities/siblings" or plain "SKIP")

What is the *difference* and the *semantic significance* between `SKIP` or `TODO`, and the severe `BREAKS`, in our dev workflow? Small difference, but huge semantic significance, respectively! 

It's again similar to how `logger.error()` is different to `logger.verbose()`: Semantics, and practical reasons.

The low-priority `BREAKS` or `FUTURE`, is NOT what we are dealing on right now. We have `TODO`s all day that we know are there, then we have some `SKIP`s, perhaps for a different day, commit, work item etc. 

On the other side, we have `BREAKS` for things we know are broken, maybe recently etc but we are not focusing right now. But one day soon we hope to tackle it! And we have `FUTURE` which are difficult or impossible and certainly not for now, perhaps definitions or skeletons of how IT SHOULD work in the future or new version etc. We proceed accordingly!

Why not get rid of all these keywords, and just let user provide the `priority` (severity) on the just 2 COMMANDS?
`SKIP(3)` or `ONLY(10)` etc. Well, semantics & consistency for sure, it's easier to search and replace "BREAKS" with "// BREAKS" also. 

####  `SKIP` always akips

When you add any new (effective) `SKIP`s on your `SUITE` or `Spec`, it just runs a few **less tests**!  

Any `priorities` in the `SKIP` command family, means elimination of tests! So, why do we need so many levels? Is it *just* semantics, or can we control which tests we can selectively eliminate?

YES, we can. You can `SKIP_END`, or `BREAK_END`, or `TODO_END` etc inside a Suite, to selectively unhide tests (Gen2/3).

For example: 

```
// @todo: fix example
SUITE([
  WIP
  // ... some WIP Suites      
  // ... some TODO Suites      
  // ... some FUTURE Suites   
 $WIP_MUTE // @todo: this should be a global, calling into ingnoreSkipyPriority?
])
```
This will **stop** eliminating tests **only** of the WIP level, but will continue eliminating tests on the TODO level and below (the FUTURE for sure!). Now you can really test all those tests you hid 10 minutes ago, and see if they are now fixed!

# Filter Commands Overview - WIP 

## Skipies/SKIP 

These apply to all levels of Skipies, eg `FUTURE`, `BREAKS`, `WIP` 

- `SKIP`: Filters out all Specs below, until a SKIP_END is found

- `SKIP_END` (aka SKIP_END)
    - Ends skipping / Stops, at level of SKIP and higher. 
      - Warns if no SKIP in effect? Unmatched SkipEnds should warn/throw? Does it makes sense?
       
             SUITE(SKIP, [
                // SKIP in effect
                ['skipped1'],
                SUITE([['nested_skipped1']]),
                WIP_END ?????? not matching SKIP
             ])

- `SKIP_MUTE`
  - Ignores SKIP & higher, from below here!
 
- `$SKIP_MUTE`  
  - Ignores SKIP & higher, in current scope (place in root Suite for ignoring) !

- `SKIP_ABOVE` (NOT IMPLEMENTED G2/3)
   - Applies like SKIP to all things (Suites & Spec), but above, not below!

## Spec - what is a Spec?

You can think of `Spec` as a Test Case, a Test Scenario, a Test Definition, a Test Hypothesis or Test Thesis or a myriad other names. 

But a `Spec` in many industries also means the Desired Features, The Top Level Documentation or the Requirements, or Feature Docs. Maybe these are for the future or for another version. 

All of these are a valid definition for Spec, and SpecZen gives a powerful one: 

Call whatever you want, but it's just a bunch of data, it's a property bag with `SpecData` given to your `specSpecHandler`.

Similar Specs are grouped together in SUITEs (the sole container of Specs), to test different behaviours of the same thing (eg the `API read` operation).



we have

@todo: conversion of Array to Object
@todo: Each `Spec` has one or more `SpecHandlers`


# ********** The IMAGINARY SpecZen Gen2/3/N DOCS *****************

**NOTE: FEATURES AND DOCS BELOW ARE WIP / NOT IMPLEMENTED**

## ABOVE as BELOW (Gen2/3)

By default, all Filters are BELOW. But they could also have an _ABOVE equivalent (useful only in the Array, not the test!)

- `SKIP_ABOVE`: skip all tests preceding this `SKIP_ABOVE`. 
    - Q: How is this different to.... `ONLY`, which onlies what's below??
- `ONLY_ABOVE`... etc 

See `src/__tests__/NOT-IMPLEMENTED` to get ideas.

## Target SKIP/ONLY at specifics (Gen3/4)  

You can even target to unhide a specific "group", "specHandlers" etc (Gen3/4)

## `SKIP` & `ONLY` families Reporting (Gen2/3)

@todo: In each run, you will get a nice report of how many tests are "hidden", into each category of `SKIP`, for each SpecHandler etc!

These are just thoughts!


## Filter specifics (V9/YAGNI)

- `DO((test, testSuite, options) => boolean | EOnlyLevel)` - DO RUN (ie include) this test/suite, if the function returns true.
- 
- `FOCUS`((test, testSuite, options) => boolean | EOnlyLevel)` - DO RUN and apply `ONLY` (ie include exclusively) this Spec/SUITE, if the function returns true or the `EOnlyLevel` returns is >= to the `FOCUS` `onlylevel`.

- `DONT((spec, suite, options) => boolean | ESkipLvel)` - DO NOT run (i.e skip) this test/suite, if the function returns false.

Who wins if both exist? Good question!

# Release Notes

## Versions & Generations 

SpecZen versions follows [Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning): Only when it breaks functionality (hopefully rarely) eg with current version 1.x.x, it goes from 1.x.x to 2.0.0 etc. Not when features are added. [Read more](https://www.geeksforgeeks.org/introduction-semantic-versioning).  

What's more interesting, is Generation, which is quite independent of Version. 

- Version 1.0.0 & Gen 1.0.0 is with initial functionality, with many Not Implemented exotic features, but still immensely useful ;-) Tested enough, but not battle tested yet. Version 2.0.0, 3.0.0 etc will be just iterations, possibly breaking of those. Think of v1.0.0 G1 as 0.1.0 & then v2.0.0 G1 as 0.2.0, but with semantic versioning!

- Gen 2.0.0, Version XX.0.0 (unknown yet) will aim to implement missing features like `SKIP_ABOVE`, fix serious shortcomings & bugs in generation, write more tests, clean up API & docs, and add few low-hanging fruit features :-) Also make a start on Tests=Docs-Examples!
 
- Gen 3/4 will start dealing with the important/hard future features stuff.

## Future Direction Highlights

- Improve typing and type checks: 
  - a) use typing system of `Zen` (`Tany` and more)
  - c) use `TypeEqual` checks from `ts-expect`
  - b) use `ValidZen` to validate the Specs at runtime (Gen2/3) 
- Improve titling of nested of Suites & Specs.
- Detect duplicate tests (same Spec in different Suites, or same Spec in same Suite) against same SpecHandler
- Implement missing features like `SKIP_ABOVE` & `ONLY_ABOVE` (Gen2/3)
- Implement `DO` & `DONT` (Gen3/4)
- Implement Detailed Reporting (Gen2/3)
- Improve/implement `MetaInfo` info in filters (Gen2/3)
- More way to filter & search interactively but IN CODE, including `MetaInfo` (Gen3/4)
- Flip SKIP / ONLY / current view: Out of `Specs A..Z` , I work on `Spec A` and `XYZ`, and I want to flip between `A` and `XYZ` with one easy switch, ignore all others `B...W`. 

## Support us!

Please support by staring, mentioning, sharing on social, reviewing, testing, opening issues or PRs or simply using ;-)

# License

MIT NON-AI

