import { getCallSites } from '../../code/getCallSites'

// getSomeOtherFileFunctions is a function that returns an object with functions, given a LogZen instance. The functions are meant to be used in other files.
export const getSomeOtherFileFunctions = (LogZen) => {
  const lExternal = new LogZen()

  const someOtherFileExternalLogger = (...argsToPrint) => {
    lExternal.info('external someOtherFile', ...argsToPrint) // lExternal.info('external someOtherFile, with options:', lExternal.options(), ...argsToPrint)
  }

  const someOtherFileInternalLogger = (...argsToPrint) => {
    // console.log(LogZen)
    const lInternal = new LogZen()
    lInternal.log('internal someOtherFile', ...argsToPrint)
  }

  const passMeALoggerToPrint = (l, ...argsToPrint) => {
    let lineNumber
    l.log(
      (lineNumber = getCallSites(1)[0].getLineNumber() - 1) && 'passMeALoggerToPrint prints',
      ...argsToPrint
    )
    return lineNumber
  }

  return {
    someOtherFileExternalLogger,
    someOtherFileInternalLogger,
    passMeALoggerToPrint,
  }
}
