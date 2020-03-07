export interface IBarchartItem {
  x: string
  y: number
}

export interface IBarChartProps {
  id: string
  width: number
  height: number
  top?: number
  right?: number
  bottom?: number
  left?: number
  data: IBarchartItem[]
}
