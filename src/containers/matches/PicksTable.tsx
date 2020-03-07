import React from 'react'
import { Table } from 'antd'
import { Pick, PickStatus } from '~/utils/types'
import Container from '~/components/Container/Container'
import countValuePicksProfit, { Options, isPickByOptions } from '~/utils/countValuePicksProfit'

interface Props {
  picks: Pick[]
  filterOptions: Options
}

const PicksTable: React.FunctionComponent<Props> = (props) => {
  const getColor = (pick: Pick) => {
    if (!isPickByOptions(pick, props.filterOptions)) {
      return '#eee'
    }

    if (pick.status === PickStatus.WIN) {
      return '#c5e1a5'
    }

    if (pick.status === PickStatus.LOST) {
      return '#ffa4a2'
    }

    return undefined
  }
  const render = (text: string, pick: Pick) => {
    const color = getColor(pick)
    return {
      props: {
        style: { background: color, fontWeight: 600 },
      },
      children: <div>{text}</div>,
    }
  }

  const columns = [
    {
      title: 'Pick',
      dataIndex: 'pick',
      render,
    },
    {
      title: 'Probability',
      dataIndex: 'probability',
      render,
    },
    {
      title: 'Bookmaker',
      dataIndex: 'bookmakerName',
      render,
    },
    {
      title: 'Odd prob',
      dataIndex: 'bookmakerProb',
      render,
    },
    {
      title: 'Odd',
      dataIndex: 'odd',
      render,
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      render,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      render,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render,
    },
  ]

  const data = props.picks.map((pick) => ({
    match: pick.match,	  
    pick: pick.nicePickEnd,
    probability: pick.probability,
    odd: pick.oddSize,
    bookmakerProb: pick.bookmakerProb,
    bookmakerName: pick.bookmakerName,
    profit: pick.profit,
    value: pick.value,
    status: pick.status,
    end: pick.end,
  }))

  const profit = countValuePicksProfit(props.picks)

  return (
    <Container>
      <Table size="small" pagination={false} columns={columns} dataSource={data} />
      <Container>Value picks profit sum: {profit}</Container>
    </Container>
  )
}

export default PicksTable
