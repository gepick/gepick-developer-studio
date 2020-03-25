// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const colors = d3.scaleOrdinal(d3.schemeCategory10)
const format = d3.format('.2f')

const XAxis = ({ top, bottom, left, right, height, scale }) => {
  const axis = useRef(null)

  useEffect(() => {
    d3.select(axis.current).call(d3.axisBottom(scale))
  })

  const position = height - bottom

  return <g className="axis x" ref={axis} transform={`translate(${left}, ${position})`} />
}

const YAxis = ({ top, bottom, left, right, scale }) => {
  const axis = useRef(null)

  useEffect(() => {
    d3.select(axis.current).call(d3.axisLeft(scale))
  })

  return <g className="axis y" ref={axis} transform={`translate(${left}, ${top})`} />
}

const Rect = ({ data, x, y, height, top, bottom }) => {
  return (
    <g transform={`translate(${x(data.date)}, ${y(data.value < 0 ? 0 : data.value)})`}>
      <rect width={x.bandwidth()} height={Math.abs(y(data.value) - y(0))} fill={colors(data.inex)} />
      <text
        transform={`translate(${x.bandwidth() / 2}, ${-2})`}
        textAnchor="middle"
        alignmentBaseline="baseline"
        fill="grey"
        fontSize="10"
      >
        {format(data.value)}
      </text>
    </g>
  )
}

const Bar = (props) => {
  const data = props.data.map((d, index) => {
    return {
      index,
      date: d.x,
      value: d.y,
    }
  })

  const x = d3
    .scaleBand()
    .range([0, props.width - props.left - props.right])
    .domain(data.map((d) => d.date))
    .padding(0.1)

  const y = d3
    .scaleLinear()
    .range([props.height - props.top - props.bottom, 0])
    .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])

  return (
    <>
      <svg width={props.width} height={props.height}>
        <XAxis
          scale={x}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
          height={props.height}
        />
        <YAxis scale={y} top={props.top} bottom={props.bottom} left={props.left} right={props.right} />
        <g transform={`translate(${props.left}, ${props.top})`}>
          {data.map((d, i) => (
            <Rect data={d} x={x} y={y} top={props.top} bottom={props.bottom} height={props.height} />
          ))}
        </g>
      </svg>
    </>
  )
}

export default Bar
