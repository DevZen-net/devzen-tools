export const delaySecs = 0.01
export const delay = async <Tinput extends any>(secs = delaySecs, value?: Tinput) => {
  const promise: Promise<Tinput> = new Promise<Tinput>((resolve) =>
    setTimeout(() => {
      resolve(value as any)
    }, secs * 1000)
  )
  // if (typeof jest !== 'undefined') await jest.advanceTimersByTimeAsync(secs * 1000)
  // jest.runAllTimers(); // not needed ;-)
  return promise
}

export const fillArrayEmptySlotsWithZeros = (array: number[], finalCount) => {
  while (array.length < finalCount) {
    array.push(0)
  }

  return array
}
