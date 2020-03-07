import React from 'react'
import BarChart from './BarChart'
import Dimensions from '../../dimensions/Dimensions'
import { IBarChartProps } from './types'

type Props = Omit<IBarChartProps, 'width' | 'height'>

const ResponsiveBarChart: React.FunctionComponent<Props> = (props) => {
  return (
    <Dimensions>
      {(width: number, height: number) => (
        <BarChart top={20} bottom={30} left={30} right={0} {...props} width={width} height={height} />
      )}
    </Dimensions>
  )
}

export default ResponsiveBarChart
