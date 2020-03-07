import React from 'react'
import { Modal } from 'antd'
import useMatch from '~/hooks/useMatch'
import Match from '~/containers/matches/Match'

interface Props {
  matchId: string
}

const MatchModal: React.FunctionComponent<Props> = (props) => {
  const match = useMatch(props.matchId)

  if (!match) {
    return null
  }

  return (
    <Modal width="60vh" visible>
      <Match match={match} />
    </Modal>
  )
}

export default MatchModal
