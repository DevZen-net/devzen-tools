/**
 * Checks if value is *BigInt*
 *
 * See https://stackoverflow.com/questions/66414879/how-to-check-if-a-number-is-a-bigint-in-javascript/66414932#66414932
 *
 * @param value
 *
 * @returns boolean
 */
export const isBigInt = (value: unknown): value is bigint => typeof value === 'bigint'
