import React from 'react'
import { Table } from 'antd'
import { PickStatus, PickWithMatch } from '~/utils/types'
import MatchModal from '~/components/matchModal/MatchModal'
import styles from './styles.css'

interface Props {
  picks: PickWithMatch[]
}

interface TableItem {
  match: PickWithMatch['match']
  pick: PickWithMatch['nicePickEnd']
  probability: PickWithMatch['probability']
  odd: PickWithMatch['oddSize']
  bookmakerProb: PickWithMatch['bookmakerProb']
  bookmakerName: PickWithMatch['bookmakerName']
  profit: PickWithMatch['profit']
  value: PickWithMatch['value']
  status: PickWithMatch['status']
  end: PickWithMatch['end']
}

const PicksTable: React.FunctionComponent<Props> = (props) => {
  const [modalMatchId, setModalMatchId] = React.useState<string | undefined>()

  const getColor = (pick: TableItem) => {
    if (pick.status === PickStatus.WIN) {
      return '#c5e1a5'
    }

    if (pick.status === PickStatus.LOST) {
      return '#ffa4a2'
    }

    return undefined
  }

  const render = (text: string, pick: TableItem) => {
    const color = getColor(pick)
    return {
      props: {
        style: { background: color },
      },
      children: <div>{text}</div>,
    }
  }

  const handleMatchModalClose = React.useCallback(() => {
    setModalMatchId(undefined)
  }, [])

  const handleMoreMatchInfoClick = React.useCallback((matchId) => {
    setModalMatchId(matchId)
  }, [])

  const renderMatch = (text: string, pick: TableItem) => {
    const color = getColor(pick)
    const { hteam, ateam, startTime, beLink } = pick.match

    return {
      props: {
        style: { background: color },
      },
      children: (
        <div>
          <div>{startTime}</div>
          <div>
            {hteam.name} - {ateam.name}
          </div>
          <div>
            <a onClick={() => handleMoreMatchInfoClick(pick.match._id)}>more</a>
          </div>
          <div>
            <a target="_blank" href={`https://betexplorer.com${beLink}`}>
              source link
            </a>
          </div>
        </div>
      ),
    }
  }

  const columns = [
    {
      title: 'Match',
      render: renderMatch,
    },
    {
      title: 'Pick',
      dataIndex: 'pick',
      render,
    },
    {
      title: 'Prob',
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

  return (
    <>
      <Table className={styles.picksTable} size="small" pagination={false} columns={columns} dataSource={data} />
      {modalMatchId && <MatchModal onClose={handleMatchModalClose} matchId={modalMatchId} />}
    </>
  )
}

export default PicksTable
