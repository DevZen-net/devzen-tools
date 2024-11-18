import * as z from '../../index'

// ##### Typings tests

// ### Inspect Hints in IDE / WebStorm:

// isEqual

// Hint should be customizer
z.isEqual(1, 1, () => true)

// Hint should be options
z.isEqual(1, 1, {})
z.isEqual(1, 1, { customizer: () => true })

// Hint should be options, ctx
z.isEqual(1, 1, { path: [] }, {})

// Hint should be customizer, ctx, options
z.isEqual(1, 1, () => true, { context: [] }, { inherited: false })

// isLike

// Hint should be customizer
z.isLike(1, 1, () => true)

// Hint should be options
z.isLike(1, 1, {})
z.isLike(1, 1, { customizer: () => true })

// Hint should be options, ctx
z.isLike(1, 1, { path: [] }, {})

// Hint should be customizer, ctx, options
z.isLike(1, 1, () => true, { context: [] }, { inherited: false })
