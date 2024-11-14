/*
Code adapted from https://github.com/stefanpenner/get-caller-file/blob/master/index.ts
and interface CallSite from https://github.com/sindresorhus/callsites/blob/main/index.d.ts
*/

// Call this function in another function to find out the file from
// which that function was called from. (Inspects the v8 stack trace)
//
// Inspired by http://stackoverflow.com/questions/13227489

import { inspect } from '../code/inspect'

type AnyFunction = (...args: any[]) => any

export interface CallSite {
  /**
   Returns the value of `this`.
   */
  getThis(): unknown | undefined

  /**
   Returns the type of `this` as a string. This is the name of the function stored in the constructor field of `this`, if available, otherwise the object's `[[Class]]` internal property.
   */
  getTypeName(): string | null

  /**
   Returns the current function.
   */
  getFunction(): AnyFunction | undefined

  /**
   Returns the name of the current function, typically its `name` property. If a name property is not available an attempt will be made to try to infer a name from the function's context.
   */
  getFunctionName(): string | null

  /**
   Returns the name of the property of `this` or one of its prototypes that holds the current function.
   */
  getMethodName(): string | undefined

  /**
   Returns the name of the script if this function was defined in a script.
   */
  getFileName(): string | null

  /**
   Returns the current line number if this function was defined in a script.
   */
  getLineNumber(): number | null

  /**
   Returns the current column number if this function was defined in a script.
   */
  getColumnNumber(): number | null

  /**
   Returns a string representing the location where `eval` was called if this function was created using a call to `eval`.
   */
  getEvalOrigin(): string | undefined

  /**
   Returns `true` if this is a top-level invocation, that is, if it's a global object.
   */
  isToplevel(): boolean

  /**
   Returns `true` if this call takes place in code defined by a call to `eval`.
   */
  isEval(): boolean

  /**
   Returns `true` if this call is in native V8 code.
   */
  isNative(): boolean

  /**
   Returns `true` if this is a constructor call.
   */
  isConstructor(): boolean
}

export const getCallSites = (position = 2, maxStackDepth = 0): CallSite[] => {
  if (position >= Error.stackTraceLimit) {
    throw new TypeError(
      `LogZen: getCallSites(position) requires position be less then Error.stackTraceLimit but position was: \`${position}\` and Error.stackTraceLimit was: \`${Error.stackTraceLimit}\``
    )
  }

  const oldPrepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, stack) => stack
  const stack = new Error('foo').stack
  Error.prepareStackTrace = oldPrepareStackTrace

  if (stack !== null && typeof stack === 'object') {
    // stack[0] holds this file
    // stack[1] holds where this function was called
    // stack[2] holds the file we're interested in
    // return stack[position] ? (stack[position] as any).getFileName() : undefined

    // @ts-ignore
    return stack.slice(position, position + maxStackDepth + 1)
  } else throw new Error(`LogZen: getCallSites(position) error in stack = ${inspect(stack)}`)
}
