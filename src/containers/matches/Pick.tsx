import React from 'react'
import { Pick } from '~/utils/types'
import Container from '~/components/Container/Container'

interface Props {
  pick: Pick
}

const PickComponent: React.FunctionComponent<Props> = (props) => {
  const { end, probability } = props.pick
  console.log('Pick:', props.pick)
  return (
    <Container>
      {end.end} probability:{probability}{' '}
    </Container>
  )
}

export default PickComponent
