import React from 'react'
import { Modal, Row, Col } from 'antd'
import useMatch from '~/hooks/useMatch'
import Match from '~/containers/matches/Match'
import Container from '~/components/container/Container'

interface Props {
  matchId: string
  onClose(): void
}

const MatchModal: React.FunctionComponent<Props> = (props) => {
  const match = useMatch(props.matchId)

  if (!match) {
    return null
  }

  return (
    <Modal onOk={props.onClose} onCancel={props.onClose} width="70vw" visible>
      <Match match={match} />
      <Container height={20} />
      <Row>
        <Col span={12}>
          {match.historicalMatches.home.map((hmatch) => {
            return <Match match={hmatch} />
          })}
        </Col>
        <Col span={12}>
          {match.historicalMatches.away.map((hmatch) => {
            return <Match match={hmatch} />
          })}
        </Col>
      </Row>
    </Modal>
  )
}

export default MatchModal
