/**
 * Check if the value is a function, using the `typeof` operator.
 *
 * Why needed? Because lodash `_.isFunction(value)` fails for async generator functions:
 *
 *    console.log(_.isFunction(a_GeneratorFunction_async_named))
 *    console.log(_.isFunction(a_GeneratorFunction_async_anonymous))
 *
 * both print `false`
 *
 * The `z.isFunction` returns `true` for both.
 *
 * @see Use isRealFunction() to exclude classes.
 *
 * @param value
 *
 * @returns boolean true if value is any kind of function, including classes. Use isRealFunction() to exclude classes.
 */
export const isFunction = (value: unknown): value is Function => typeof value === 'function'
