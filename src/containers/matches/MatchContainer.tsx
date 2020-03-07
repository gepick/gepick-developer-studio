import React from 'react'
import gql from 'graphql-tag'
import { sumBy, filter } from 'lodash'
import { Match, Pick, MatchWithPicks, PickEnd, _1x2End } from '~/utils/types'
import { useQuery } from 'react-apollo-hooks'
import { useParams } from 'react-router-dom'
import Layout from '~/containers/Layout'
import MatchComponent from '~/containers/matches/Match'
import { Button, Row, Col, Select, Slider, Switch, Tag } from 'antd'
import predict from '~/services/predict'
import Container from '~/components/Container/Container'
import PicksTable from './PicksTable'
import { SliderValue } from 'antd/lib/slider'
import POSIBLE_PICKS from '~/utils/posiblePicks'
import isPickEndIncluded from '~/utils/isPickEndIncluded'
import matchesWithPredictionsToMatchesWithPicks from '~/utils/matchesWithPredictionsToMatchesWithPicks'

const { Option } = Select
const { CheckableTag } = Tag

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

interface Props {}
interface State {
  picks: Pick[]
  historicalDeep: number
  filterOptions: {
    minProbability: number
    onlyValue: boolean
    ends: PickEnd[]
  }
  homeTeamHistoricalMatchesWithPicks?: MatchWithPicks[]
  awayTeamHistoricalMatchesWithPicks?: MatchWithPicks[]
}

const MatchContainer: React.FunctionComponent<Props> = (props) => {
  const { matchId } = useParams()
  const [state, setState] = React.useState<State>({
    picks: [],
    historicalDeep: 10,
    filterOptions: {
      minProbability: 70,
      onlyValue: true,
      ends: POSIBLE_PICKS,
    },
  })

  const matchResults = useQuery(matchQuery, {
    variables: {
      matchId,
      historicalDeep: 10,
    },
    fetchPolicy: 'no-cache',
  })

  const match: Match = matchResults.data?.match

  const handlePredict = async () => {
    if (match) {
      const matchesWithPredictions = (await predict([match], state.filterOptions))
      const matchWithPicks = matchesWithPredictionsToMatchesWithPicks(matchesWithPredictions)	  
      setState({
        ...state,
        picks: matchWithPicks?.[0]?.picks ?? [],
      })
    }
  }

  const handleChangeHistoricalDeep = (historicalDeep: number) => {
    setState({
      ...state,
      historicalDeep,
    })
  }

  const homeTeamHistoricalMatches = React.useMemo(() => {
    if (!match) {
      return []
    }

    return match.historicalMatches.home.slice(0, state.historicalDeep)
  }, [match, state.historicalDeep])

  const awayTeamHistoricalMatches = React.useMemo(() => {
    if (!match) {
      return []
    }
    return match.historicalMatches.away.slice(0, state.historicalDeep)
  }, [match, state.historicalDeep])

  const handleCalculateHistoricalProfit = async () => {
    const homeTeamHistoricalMatchesWithPicks = await predict(homeTeamHistoricalMatches, state.filterOptions)
    const awayTeamHistoricalMatchesWithPicks = await predict(awayTeamHistoricalMatches, state.filterOptions)

    setState({
      ...state,
      homeTeamHistoricalMatchesWithPicks,
      awayTeamHistoricalMatchesWithPicks,
    })
  }

  const handleMinProbChange = (minProbability: SliderValue) => {
    setState({
      ...state,
      filterOptions: {
        ...state.filterOptions,
        minProbability: minProbability as number,
      },
    })
  }

  const handleOnlyValueChange = (onlyValue: boolean) => {
    setState({
      ...state,
      filterOptions: {
        ...state.filterOptions,
        onlyValue,
      },
    })
  }

  const isChecked = (end: PickEnd) => {
    return isPickEndIncluded(state.filterOptions.ends, end)
  }

  const setEnds = (ends: PickEnd[]) => {
    setState((prevState) => {
      return {
        ...prevState,
        filterOptions: {
          ...prevState.filterOptions,
          ends,
        },
      }
    })
  }

  const handleEndChange = (end: PickEnd) => {
    if (isChecked(end)) {
      const activeEnds = state.filterOptions.ends
      const removedList = filter(activeEnds, (curr) => curr != end)

      setEnds(removedList)
    } else {
      setEnds([...state.filterOptions.ends, end])
    }
  }

  const selectAllEnds = () => {
    setEnds(POSIBLE_PICKS)
  }

  const unSelectAllEnds = () => {
    setEnds([])
  }

  return (
    <Layout loading={matchResults.loading}>
      {match && (
        <>
          <MatchComponent match={match} />
          <Button onClick={handlePredict}>predict</Button>
          <Button onClick={handleCalculateHistoricalProfit}>calculate historical profit</Button>
          <Select defaultValue={state.historicalDeep} style={{ width: 120 }} onChange={handleChangeHistoricalDeep}>
            <Option value="10">10</Option>
            <Option value="25">25</Option>
            <Option value="50">50</Option>
            <Option value="100">100</Option>
            <Option value="250">250</Option>
            <Option value="500">500</Option>
            <Option value="1000">1000</Option>
          </Select>
          <Container>
            min probability: <Slider onChange={handleMinProbChange} defaultValue={70} />
          </Container>
          <Container>
            only value: <Switch onChange={handleOnlyValueChange} />
          </Container>
          <Container>
            {POSIBLE_PICKS.map((end) => {
              return (
                <CheckableTag onChange={() => handleEndChange(end)} checked={isChecked(end)}>
                  {end.end} {end.limit}
                </CheckableTag>
              )
            })}
            <a onClick={selectAllEnds}>select all</a>
            <a onClick={unSelectAllEnds}>unselect all</a>
          </Container>
          <Container>
            <Container>Picks</Container>
            <PicksTable filterOptions={state.filterOptions} picks={state.picks} />
          </Container>
          <Container>Historical matches</Container>
          <Row>
            <Col span={12}>
              <Container>Home team historical matches</Container>
              {!state.homeTeamHistoricalMatchesWithPicks && (
                <Container>
                  {homeTeamHistoricalMatches.map((match) => (
                    <MatchComponent match={match} />
                  ))}
                </Container>
              )}

              {state.homeTeamHistoricalMatchesWithPicks && (
                <Container>
                  Total profit: {sumBy(state.homeTeamHistoricalMatchesWithPicks, 'picksProfit')}
                  {state.homeTeamHistoricalMatchesWithPicks.map((match) => (
                    <>
                      <MatchComponent match={match} />
                      profit: {match.picksProfit}
                    </>
                  ))}
                </Container>
              )}
            </Col>
            <Col span={12}>
              <Container>Away team historical matches</Container>
              {!state.awayTeamHistoricalMatchesWithPicks && (
                <Container>
                  {awayTeamHistoricalMatches.map((match) => (
                    <MatchComponent match={match} />
                  ))}
                </Container>
              )}
              {state.awayTeamHistoricalMatchesWithPicks && (
                <Container>
                  Total profit: {sumBy(state.awayTeamHistoricalMatchesWithPicks, 'picksProfit')}
                  {state.awayTeamHistoricalMatchesWithPicks.map((match) => (
                    <>
                      <MatchComponent match={match} />
                      profit: {match.picksProfit}
                    </>
                  ))}
                </Container>
              )}
            </Col>
          </Row>
        </>
      )}
    </Layout>
  )
}

export default MatchContainer
