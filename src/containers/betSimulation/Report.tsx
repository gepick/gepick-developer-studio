import React from 'react'
import { Row, Col, Card } from 'antd'
import { ReportData } from '~/utils/types'

interface Props {
	reportData: ReportData
	title: string
}

const Report: React.FunctionComponent<Props> = (props) => {
  const data = [
    { label: 'Total', value: props.reportData.totalPicks },
    { label: 'Total with results', value: props.reportData.totalPicksWithResults },
    { label: 'Total win', value: props.reportData.totalWin },
    { label: 'Total lost', value: props.reportData.totalLost },
    { label: 'Total no result', value: props.reportData.totalNoResult },
    { label: 'Total canceled', value: props.reportData.totalCanceled },
    { label: 'Total profit', value: props.reportData.totalProfit },
    { label: 'Win percent', value: props.reportData.winProc },
    { label: 'ROI', value: props.reportData.roi ?? '-' },
    { label: 'Average odd', value: props.reportData.avarageOdd ?? '-' },
    { label: 'Max odd', value: props.reportData.maxOdd ?? '-' },
    { label: 'Min odd', value: props.reportData.minOdd ?? '-' },
  ]

  return (
          <Card title={props.title}>
      {data.map((reportItem, key) => {
        return (
          <Row key={key}>
            <Col span={12}>{reportItem.label}</Col>
            <Col span={12}>{reportItem.value}</Col>
          </Row>
        )
      })}
          </Card>
  )
}

export default Report
