// @flow
import type { TBreakpoint } from '../const/defaultOptions'
import type { TAreaParams } from './getAreaParams'
import * as React from 'react'
import styled from 'styled-components'
import MediaQuery from 'react-responsive/dist/react-responsive.min'

import getAreaParams from './getAreaParams'
import capitalize from './capitalize'
import applyStyles from './applyStyles'

export type TAreaComponent = Class<React.Component<any, void, void>>
export type TAreaComponentsMap = {
  [componentName: string]: TAreaComponent,
}

const withPlaceholder = (
  AreaComponent: TAreaComponent,
  areaParams: TAreaParams[],
) => {
  const Placeholder = ({ children, ...restProps }: { children: React.Node }) =>
    areaParams.reduce((components, breakpointOptions, index) => {
      if (!breakpointOptions) {
        return components
      }

      const { behavior, ...breakpointProps } = breakpointOptions

      return components.concat(
        <MediaQuery
          key={`${AreaComponent.displayName}_${index}`}
          {...breakpointProps}
          {...restProps}
          component={AreaComponent}
        >
          {children}
        </MediaQuery>,
      )
    }, [])
  Placeholder.displayName = `Placeholder(${AreaComponent.displayName})`

  return Placeholder
}

const createArea = (areaName: string): TAreaComponent => styled.div`
  grid-area: ${areaName};
  ${(props) => applyStyles(props)};
`

type TGetComponentsArgs = {
  areas: string[],
  templates: [],
}

export default function getComponents({
  areas,
  templates,
}: TGetComponentsArgs) {
  return areas.reduce((components, areaName) => {
    const areaParams = getAreaParams(areaName, templates)
    const capitalizedAreaName = capitalize(areaName)
    const shouldAlwaysRender =
      areaParams.length === 1 &&
      areaParams.every((breakpoint) => {
        return !breakpoint.minWidth && !breakpoint.maxWidth
      })
    const AreaComponent = createArea(areaName)
    AreaComponent.displayName = capitalizedAreaName

    const endComponent = shouldAlwaysRender
      ? AreaComponent
      : withPlaceholder(AreaComponent, areaParams)

    return Object.assign({}, components, {
      [capitalizedAreaName]: endComponent,
    })
  }, {})
}