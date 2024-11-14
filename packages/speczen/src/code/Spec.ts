import { Filter, FilterEnd } from './types'

/**
 * A Spec, a.k.a as a Test Case, a Test Scenario etc
 * */
export class Spec<TSpecData> {
  public __kind? = 'Spec'

  constructor(
    /**
     * Our array with Spec Data, transformed to the final TSpecData Object, without Filters & EACH
     * @todo: handleSuite() handle EACH properly, create as many entries as needed.
     */
    public specData: TSpecData,
    public filter: Filter | FilterEnd | null // can have only 1 Filter or FilterEnd in it, for now!
    /*
     @todo: allow 2 filters? Is there such scenario?
     */
  ) {}

  isVisible: boolean // @todo: make a getter
}
