import { MapKeysCallback } from './loop'
import { GetMapReturn, IMapOptions, ProjectKeys, ProjectValues, MapOptionsOverride } from './map'
import { project } from './project'

/**
 * Map over the (many) keys/indexes of **any possible input value**, returning a new instance of the same input value type (if possible), with the results of calling the projector/mapping function on every "nested" key/prop/index of the input value.
 *
 * Similar idea to lodash `_.mapKeys()`, but powered by [`_z.loop()`](/functions/loop.html). Hence:
 *
 * @see [`_z.map()`](/functions/map.html) as mapKeys() is a special case of map() where keys/indexes are mapped, instead of items/values.
 *
 * @see [`_z.loop()`](/functions/loop.html) the power hidden behind `map()` and all other collection functions.
 *
 * @returns the same type as the input value, but with the keys/props/indexes mapped over. Objects, Arrays, Maps, Sets etc are copied and returned as new values. Also, Iterators, Generators etc are returned as a Generator with their `null` keys mapped over by the mapKeys callback.
 */
export function mapKeys<
  Tinput extends any, // @todo: also allow non-objects
  ImapKeysCallback extends MapKeysCallback<TcallbackItems, TcallbackKeys, Tinput, any>,
  Toptions extends IMapOptions<any, any, Tinput>,
  // Callback items (similar but not same to TloopItems), passed to the map/project function
  // - project / callback values are supported with isProject = true
  // - excluding Props that are inherited & nonEnumerables, with MapOptionsOverride
  TcallbackItems = ProjectValues<Tinput, MapOptionsOverride<Toptions>>,
  TcallbackKeys = ProjectKeys<Tinput, MapOptionsOverride<Toptions>>,
>(
  input: Tinput,
  mapKeysCb: ImapKeysCallback,
  options?: Toptions,
): GetMapReturn<Tinput, Toptions, null, ImapKeysCallback> {
  return project<TcallbackItems, TcallbackKeys | null, Tinput>(
    input,
    options as any,
    mapKeysCb as any,
    'mapKeys',
  ) as any
}
