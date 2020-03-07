import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { sumBy } from 'lodash'
import { Match, _1x2End, PickWithMatch } from '~/utils/types'
import { useGlobalState, GlobalState } from '~/hooks/useGlobalState'
import predict from '~/services/predict'

const matchesQuery = gql`
  query Matches($day: String) {
    matches: getMatches(day: $day) {
      _id
      status
      startTime
      location {
        name
      }
      league {
        name
      }
      hteam {
        name
      }
      oddsByBookmaker {
        odds1x2 {
          home
          draw
          away
        }
        oddsUO {
          under
          over
          limit
        }
      }
      ateam {
        name
      }
      result {
        fullTime {
          home
          away
        }
      }
    }
  }
`

export interface DataCtrlChildProps {
  picks: PickWithMatch[]
  onPredict(): Promise<void>
}

interface PicksState extends GlobalState {
  updatePredictions(): Promise<void>
}

const usePicks = (): PicksState => {
  const [state, setGlobalState] = useGlobalState('state')

  const matchesResults = useQuery(matchesQuery, {
    variables: {
      day: '2020-01-01',
    },
  })

  const matches: Match[] = matchesResults.data?.matches ?? []

  const handlePredict = async () => {
    const picks = await predict(matches, {})
    setGlobalState({
      ...state,
      picks,
      statistics: {
        totalPicks: picks.length,
        totalProfits: sumBy(picks, 'profit'),
      },
    })
  }

  return { picks: state.picks, updatePredictions: handlePredict, statistics: state.statistics }
}

export default usePicks
