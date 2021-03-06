import React from 'react'
import { Match } from '~/utils/types'
import formatMatch from '~/utils/formatMatch'
import Container from '~/components/container/Container'

interface Props {
  match: Match
  onClick?(match: Match): void
}

const Match: React.FunctionComponent<Props> = (props) => {
  const { startTime, hteam, ateam, result, beLink } = formatMatch(props.match)
  const res = result?.fullTime

  const resComponent = res && (
    <>
      {res?.home}:{res?.away}
    </>
  )
  const handleOnMatchClick = React.useCallback(() => {
    if (props.onClick) {
      props.onClick(props.match)
    }
  }, [props.onClick, props.match])

  const handleExplore = () => {
    if (props.onClick) {
      props.onClick(props.match)
    }
  }

  return (
    <Container>
      <span onClick={handleOnMatchClick}>
        {startTime} {hteam.name} - {ateam.name} {resComponent}
      </span>
      <Container inline width={5} />
      <a href={'https://betexplorer.com' + beLink} target="_blank">
        source
      </a>
      <Container inline width={5} />
      <a onClick={handleExplore}>explore</a>
    </Container>
  )
}

export default Match
