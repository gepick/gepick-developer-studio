import React from 'react'
import { _1x2End, PickWithMatch } from '~/utils/types'
import Container from '~/components/Container/Container'
import Layout from '~/containers/Layout'
import usePicks from '~/hooks/usePicks'

interface PickProps {
  pick: PickWithMatch
  onClick?(): Promise<void>
}

const Pick: React.FunctionComponent<PickProps> = (props) => {
  const { startTime, location, league, hteam, ateam } = props.pick.match
  const { nicePickEnd, probability, profit, status, oddSize } = props.pick
  return (
    <Container onClick={props.onClick}>
      {startTime} {location.name} {league.name} {hteam.name} {ateam.name} {nicePickEnd} {probability} {oddSize ?? '-'}{' '}
      {profit} {status}
    </Container>
  )
}

interface PicksProps {}

const Picks: React.FunctionComponent<PicksProps> = (props) => {
  const { picks, updatePredictions } = usePicks()

  return (
    <Layout>
      <button onClick={updatePredictions}>update</button>
      {picks.map((pick) => (
        <Pick pick={pick} />
      ))}
    </Layout>
  )
}

export default Picks
