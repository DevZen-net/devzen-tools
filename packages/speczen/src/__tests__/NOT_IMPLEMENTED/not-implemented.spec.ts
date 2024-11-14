import { ONLY_ABOVE, ONLY_MERGE, SKIP_ABOVE, SKIP_MUTE } from '../../code/types'

describe('NOT_IMPLEMENTED', () => {
  it('ONLY_MERGE not implemented', () =>
    expect(() => ONLY_MERGE()).toThrow(
      `SpecZen: OnlieMerge is not implemented yet!`
    ))

  it('SKIP_ABOVE not implemented', () =>
    expect(() => SKIP_ABOVE()).toThrow(
      `SpecZen: SkipyAbove is not implemented yet!`
    ))
  it('ONLY_ABOVE not implemented', () =>
    expect(() => ONLY_ABOVE()).toThrow(
      `SpecZen: OnlieAbove is not implemented yet!`
    ))
})
