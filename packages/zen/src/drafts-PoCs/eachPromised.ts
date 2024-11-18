/**
 * A promise-aware derivative of `_.each`.
 *
 * Iterates over elements of `collection` invoking `iteratee` for each element, BUT  If `iteratee`
 * returns a promise, it waits for it to resolve before continuing to the next element.
 *
 * The `iteratee` is bound to `thisArg` and invoked with three arguments: `(value, index|key, collection)`.
 *
 * @param {Array | Object} collection - An Array or Object to iterate over.
 * @param {Function} iteratee - The function invoked per iteration. Might return a `promise` which is respected.
 * @param {*} thisArg - The `this` binding of `iteratee`.
 * @returns {Promise} - A promise that resolves to `collection`, when the whole iteration is over (each `iteratee` promise resolved).
 */
export const eachPromised = function (collection, iteratee, thisArg?) {
  var promise = new Promise((resolve) => resolve(collection))

  iteratee || (iteratee = (x) => x)

  for (let i = 0; i < collection.length; i++) {
    promise = promise.then(function () {
      return iteratee.call(thisArg || this, collection[i], i, collection)
    })
  }

  return promise.then(function () {
    return collection
  })
}
