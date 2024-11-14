import { substitute } from '../index'
import { ISubstituteOptions } from '../types'

substitute({
  workDir: 'src/test-utils/generation/__tests__',
  substitutions: {
    'test-substitution-label': 'master/sourceCode.ts',
  },
  templatesDir: 'templates',
  outputDir: '_generated',
  logLevel: 'verbose',
  watch: true,
  // clean: true,
} satisfies ISubstituteOptions)
