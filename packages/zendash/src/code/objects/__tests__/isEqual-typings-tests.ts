import * as _z from '../../index'

// ##### Typings tests

// ### Inspect Hints in IDE / WebStorm:

// isEqual

// Hint should be customizer
_z.isEqual(1, 1, () => true)

// Hint should be options
_z.isEqual(1, 1, {})
_z.isEqual(1, 1, { customizer: () => true })

// Hint should be options, ctx
_z.isEqual(1, 1, { path: [] }, {})

// Hint should be customizer, ctx, options
_z.isEqual(1, 1, () => true, { context: [] }, { inherited: false })

// isLike

// Hint should be customizer
_z.isLike(1, 1, () => true)

// Hint should be options
_z.isLike(1, 1, {})
_z.isLike(1, 1, { customizer: () => true })

// Hint should be options, ctx
_z.isLike(1, 1, { path: [] }, {})

// Hint should be customizer, ctx, options
_z.isLike(1, 1, () => true, { context: [] }, { inherited: false })
