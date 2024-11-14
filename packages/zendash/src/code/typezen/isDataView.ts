/**
 * Check if value is a DataView
 *
 * @param value
 */
export const isDataView = (value: unknown): value is DataView => value instanceof DataView
