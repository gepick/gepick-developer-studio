import React from 'react'
import { sumBy } from 'lodash'
import { Pick, PickStatus } from '~/utils/types'
import Container from '~/components/Container/Container'

interface Props {
  picks: Pick[]
}

const PicksReport: React.FunctionComponent<Props> = (props) => {
  const total = props.picks.length

  const winPicks = props.picks.filter((pick) => {
    return pick.status === PickStatus.WIN
  })

  const lostPicks = props.picks.filter((pick) => {
    return pick.status === PickStatus.LOST
  })

  const noResultPicks = props.picks.filter((pick) => {
    return pick.status === PickStatus.NO_RESULT
  })

  const canceledPicks = props.picks.filter((pick) => {
    return pick.status === PickStatus.CANCELED
  })

  const profit = sumBy([...winPicks, ...lostPicks], 'profit')	

  return (
    <Container>
      <Container>total: {total}</Container>
      <Container>win: {winPicks.length}</Container>
      <Container>lost: {lostPicks.length}</Container>
      <Container>no result: {noResultPicks.length}</Container>
      <Container>canceled: {canceledPicks.length}</Container>
      <Container>profit: {profit}</Container>
    </Container>
  )
}

export default PicksReport
