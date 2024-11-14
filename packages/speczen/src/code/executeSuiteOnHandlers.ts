import { GenerateSpecsOptions, Suite } from './Suite'
import { SuiteCmd } from './types'

/**
 * Executes a suite on a set of given speHandlers
 *
 * @param specHandlers an object {specHandlerName: (spec) => void}
 * @param suiteCmd the top level SUITE (i.e Suite command) to execute on the handlers
 * @param generateSpecsOptions GenerateSpecsOptions
 */
export const executeSuiteOnHandlers = (
  specHandlers: { [specHandlerName: string]: (...args) => void },
  suiteCmd: SuiteCmd<any>,
  generateSpecsOptions: GenerateSpecsOptions = {}
) => {
  const { executableSpecsPerHandler, inlineSpecHandlers } = new Suite(
    suiteCmd
  ).generateSpecs(generateSpecsOptions)

  specHandlers = { ...specHandlers, ...inlineSpecHandlers }

  for (const specHandlerName in executableSpecsPerHandler) {
    // prettier-ignore
    if (!specHandlers[specHandlerName]) throw new Error(`speczen: executeSuiteOnHandlers(): specHandler not found: ${specHandlerName}`)

    const specs = executableSpecsPerHandler[specHandlerName]
    for (const spec of specs) specHandlers[specHandlerName](spec)
  }
}
