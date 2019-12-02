import { useState } from 'react'
import { withBreakpoints } from '@atomic-layout/core'
import useBreakpointChange from './useBreakpointChange'

/**
 * Accepts a map of { breakpointName: value } pairs
 * and returns a value based on the current viewport.
 * Returns default value when no matching pair is found.
 */
const useResponsiveValue = <ValueType>(
  breakpoints: Record<string, ValueType>,
  defaultValue?: ValueType,
): ValueType => {
  const [value, updateValue] = useState<ValueType>(defaultValue)

  useBreakpointChange(() => {
    const nextValue = withBreakpoints<ValueType>(breakpoints, defaultValue)
    updateValue(nextValue)
  })

  return value
}

export default useResponsiveValue