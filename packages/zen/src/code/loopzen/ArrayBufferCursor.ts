export enum DataViewType {
  Uint8 = 'Uint8',
  Int16 = 'Int16',
  Uint16 = 'Uint16',
  Int32 = 'Int32',
  Uint32 = 'Uint32',
  Float = 'Float',
  Float32 = 'Float32',
  Double = 'Double',
  Float64 = 'Float64',
}

export const DATA_VIEW_TYPE_BYTES_USED = {
  Uint8: 1,
  Int16: 2,
  Uint16: 2,
  Int32: 4,
  Uint32: 4,
  Float: 4,
  Float32: 4,
  Double: 8,
  Float64: 8,
} as const

/**
 * Create an `ArrayBufferCursor` to get an iterator-like reader for an ArrayBuffer. It implements the `DataView` methods under the hood.
 *
 * NOTE: Used internally only currently, use `loop()` to wrap as an Iterator instead.
 *
 * Usage:
 *
 *    const cursor = new ArrayBufferCursor(new ArrayBuffer(16))
 *
 *  OR
 *
 *    const cursor = new ArrayBufferCursor(new ArrayBuffer(16), 'Float')
 *
 * You can use the `hasNext()` to check if there are more items, and `next()` to get the next item.
 *
 *    while (cursor.hasNext()) {
 *      // dataViewType argument 'Float' can be omitted if passed to the constructor,
 *      // or you can override it for each read.
 *      const item = cursor.next('Float')
 *
 *      // process item
 *
 *      // write back to array at current cursor position
 *      cursor.write(item)
 *      cursor.write(item, 'Float') // override the dataViewType
 *
 *      // or use cursor.dataView to write directly
 *      cursor.dataView.setFloat32(cursor.index, item)
 *    }
 *
 * @see Initial code from ["Iterating through an arrayBuffer"](https://riptutorial.com/javascript/example/32392/iterating-through-an-arraybuffer)
 *
 * @param arrayBuffer
 * @param dataViewType is optional, as it can be passed in each next()/peek()/write() operation. If it is passed on constructor, it is used as default in all operations. If missing in both constructor and in the operation calls, it throws an error.
 */
export class ArrayBufferCursor {
  dataview: DataView
  private _cursorAt: number = 0

  constructor(
    public arrayBuffer: ArrayBuffer,
    public dataViewType?: DataViewType
  ) {
    this.dataview = new DataView(arrayBuffer, 0)
  }

  /**
   * Returns the number of items in the ArrayBuffer (including empty slots - can't determinte otherwise), taking the byteLength & byteSize of the dataViewType into account.
   * */
  size(dataViewType?: DataViewType) {
    const _dataViewType = dataViewType || this.dataViewType
    if (!_dataViewType) {
      throw new Error(
        'Unknown dataViewType - pass it to `cursor.write(value, dataViewType)` for each write, or the constructor as default eg `new ArrayBufferCursor(arrayBuffer, dataViewType)`'
      )
    }
    return this.arrayBuffer.byteLength / DATA_VIEW_TYPE_BYTES_USED[_dataViewType]
  }

  /**
   * Reset the cursor to the start of the ArrayBuffer
   */
  reset() {
    this._cursorAt = 0
  }

  writeNext(value: number, dataViewType?: DataViewType) {
    this._write(value, true, dataViewType)
  }

  write(value: number, dataViewType?: DataViewType) {
    this._write(value, false, dataViewType)
  }

  writeAt(index: number, value: number, dataViewType?: DataViewType) {
    if (index === undefined)
      throw new Error('ArrayBufferCursor: writeAt() requires an index (a.k.a byteOffset)')
    this._write(value, false, dataViewType, index)
  }

  private _write(value: number, advance: boolean, dataViewType?: DataViewType, index?: number) {
    const _dataViewType = dataViewType || this.dataViewType
    if (!_dataViewType) {
      throw new Error(
        'Unknown dataViewType - pass it to `cursor.write(value, dataViewType)` for each write, or the constructor as default eg `new ArrayBufferCursor(arrayBuffer, dataViewType)`'
      )
    }

    // index is the byteOffset in the ArrayBuffer
    index = index === undefined ? this._cursorAt : index

    switch (_dataViewType) {
      case 'Uint8': {
        this.dataview.setUint8(index, value)
        if (advance) this._cursorAt += 1
        break
      }
      case 'Int16': {
        this.dataview.setInt16(index, value, true)
        if (advance) this._cursorAt += 2
        break
      }
      case 'Uint16': {
        this.dataview.setUint16(index, value, true)
        if (advance) this._cursorAt += 2
        break
      }
      case 'Int32': {
        this.dataview.setInt32(index, value, true)
        if (advance) this._cursorAt += 4
        break
      }
      case 'Uint32': {
        this.dataview.setUint32(index, value, true)
        if (advance) this._cursorAt += 4
        break
      }
      case 'Float':
      case 'Float32': {
        this.dataview.setFloat32(index, value, true)
        if (advance) this._cursorAt += 4
        break
      }
      case 'Double':
      case 'Float64': {
        this.dataview.setFloat64(index, value, true)
        if (advance) this._cursorAt += 8
        break
      }
      default:
        throw new Error('z.ArrayBufferCursor: Unknown datatype')
    }
  }

  readNext(dataViewType?: DataViewType) {
    return this._read(true, dataViewType)
  }

  /**
   * Read / peek at the current index value, without advancing the cursor
   * @param dataViewType
   */
  read(dataViewType?: DataViewType) {
    return this._read(false, dataViewType)
  }

  readAt(index: number, dataViewType?: DataViewType) {
    if (index === undefined)
      throw new Error('ArrayBufferCursor: readAt() requires an index (a.k.a byteOffset)')
    return this._read(false, dataViewType, index)
  }

  // @todo(222): add littleEndian option
  private _read(advance: boolean, dataViewType?: DataViewType, index?: number) {
    const _dataViewType = dataViewType || this.dataViewType
    if (!_dataViewType) {
      throw new Error(
        'Unknown dataViewType - pass it to `cursor.next(dataViewType)` for each read, or the constructor as default eg `new ArrayBufferCursor(arrayBuffer, dataViewType)`'
      )
    }

    // index is the byteOffset in the ArrayBuffer
    index =
      index === undefined ? this._cursorAt : index * DATA_VIEW_TYPE_BYTES_USED[_dataViewType]

    switch (_dataViewType) {
      case 'Uint8': {
        const result = this.dataview.getUint8(index)
        if (advance) this._cursorAt += 1
        return result
      }
      case 'Int16': {
        const result = this.dataview.getInt16(index, true)
        if (advance) this._cursorAt += 2
        return result
      }
      case 'Uint16': {
        const result = this.dataview.getUint16(index, true)
        if (advance) this._cursorAt += 2
        return result
      }
      case 'Int32': {
        const result = this.dataview.getInt32(index, true)
        if (advance) this._cursorAt += 4
        return result
      }
      case 'Uint32': {
        const result = this.dataview.getUint32(index, true)
        if (advance) this._cursorAt += 4
        return result
      }
      case 'Float':
      case 'Float32': {
        const result = this.dataview.getFloat32(index, true)
        if (advance) this._cursorAt += 4
        return result
      }
      case 'Double':
      case 'Float64': {
        const result = this.dataview.getFloat64(index, true)
        if (advance) this._cursorAt += 8
        return result
      }
      default:
        throw new Error('z.ArrayBufferCursor: Unknown datatype')
    }
  }

  hasNext() {
    return this._cursorAt < this.arrayBuffer.byteLength
  }
}
