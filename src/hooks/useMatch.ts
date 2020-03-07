import gql from 'graphql-tag'
import { Match } from '~/utils/types'
import { useQuery } from 'react-apollo-hooks'

const matchQuery = gql`
  query Match($matchId: String, $historicalDeep: Int) {
    match: getMatch(matchId: $matchId, historicalDeep: $historicalDeep) {
      _id
      status
      startTime
      location {
        _id
        name
      }
      league {
        _id
        name
      }
      hteam {
        _id
        name
      }
      ateam {
        _id
        name
      }
      beLink
      oddsByBookmaker {
        _id
        odds1x2 {
          _id
          home
          draw
          away
        }
        oddsUO {
          _id
          under
          over
          limit
        }
        bookmaker {
          _id
          name
        }
      }
      result {
        fullTime {
          home
          away
        }
      }
      historicalMatches {
        home {
          _id
          status
          startTime
          location {
            _id
            name
          }
          league {
            _id
            name
          }
          ateam {
            _id
            name
          }
          hteam {
            _id
            name
          }
          beLink
          oddsByBookmaker {
            odds1x2 {
              _id
              home
              draw
              away
            }
            oddsUO {
              _id
              under
              over
              limit
            }
            bookmaker {
              _id
              name
            }
          }
          result {
            fullTime {
              home
              away
            }
          }
        }
        away {
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
          beLink
          oddsByBookmaker {
            bookmaker {
              _id
              name
            }
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
    }
  }
`

function useMatch(matchId: string): Match | undefined {
  const matchResults = useQuery(matchQuery, {
    variables: {
      matchId,
      historicalDeep: 10,
    },
    fetchPolicy: 'no-cache', // https://github.com/apollographql/react-apollo/issues/1656
  })

  console.log('useMatch matchResults', matchResults)
  const match: Match = matchResults.data?.match

  console.log('useMatch', match)

  return match
}

export default useMatch
