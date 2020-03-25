import React from 'react'
import gql from 'graphql-tag'
import { sortBy } from 'lodash'
import { useQuery } from 'react-apollo-hooks'
import Layout from '~/containers/Layout'
import { Select, Row, Col } from 'antd'
import { Match, League } from '~/utils/types'
import { useHistory, useParams, generatePath } from 'react-router-dom'
import MatchComponent from './Match'
import Container from '~/components/container/Container'
import routes from '~/routes'
import MatchModal from '~/components/matchModal/MatchModal'

const matchesQuery = gql`
  query Matches($leagueId: String, $year: Int) {
    matches: getMatches(leagueId: $leagueId, year: $year) {
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
        _id
        name
      }
      ateam {
        _id
        name
      }
      beLink
      oddsByBookmaker {
        bookmaker {
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
      result {
        fullTime {
          home
          away
        }
      }
    }
  }
`

const leaguesQuery = gql`
  query Leagues {
    leagues: getLeagues {
      _id
      location {
        name
      }
      name
    }
  }
`

const yearsList = [2020, 2019, 2018, 2017, 2016, 2015]

interface State {
  predicting: boolean
  selectedYear: number
  selectedLeagueValue?: string
  leagueSearchKeyword?: string
}

const Matches = () => {
  const history = useHistory()
  const { leagueId } = useParams()
  const [state, setState] = React.useState<State>({
    selectedLeagueValue: undefined,
    leagueSearchKeyword: undefined,
    predicting: false,
    selectedYear: yearsList[0],
  })
  const [matchIdModal, setMatchIdModal] = React.useState<string | undefined>()

  const leaguesResults = useQuery(leaguesQuery)

  const leagues: League[] = leaguesResults.data?.leagues ?? []

  const matchesResults = useQuery(matchesQuery, {
    variables: {
      leagueId: leagueId ?? null,
      year: state.selectedYear,
    },
    skip: leagues.length === 0,
  })

  const matches: Match[] = matchesResults.data?.matches ?? []

  const memoizedLeaguesList = React.useMemo(() => {
    const filterByKeyword = (leagues: League[]) => {
      return leagues.filter((league) => {
        const search = state.leagueSearchKeyword!.toLowerCase()
        const isOk = (league.location.name + league.name).toLowerCase().includes(search)
        return isOk
      })
    }

    const leaguesForSort = state.leagueSearchKeyword ? filterByKeyword(leagues) : leagues

    const sortedList = sortBy(leaguesForSort, 'location.name')

    return sortedList
  }, [leagues, state.leagueSearchKeyword])

  const options = memoizedLeaguesList.map((league) => (
    <Select.Option key={league._id}>
      {league.location.name} {league.name}
    </Select.Option>
  ))

  const yearOptions = yearsList.map((year) => <Select.Option key={year}>{year}</Select.Option>)

  const handleChangeLeague = (leagueId: string) => {
    history.push(generatePath(routes.matches, { leagueId }))
  }

  const handleChangeYear = (year: string) => {
    setState({ ...state, selectedYear: parseInt(year) })
  }

  const handleSearchLeague = (key: string) => {
    setState({
      ...state,
      leagueSearchKeyword: key,
    })
  }

  const handleMatchClick = (match: Match) => {
    setMatchIdModal(match._id)
  }

  const handleMatchModalClose = () => {
    setMatchIdModal(undefined)
  }

  return (
    <Layout loading={matchesResults.loading}>
      <Row>
        <Col span={12}>
          <Select
            showSearch
            style={{ width: 300 }}
            value={state.selectedLeagueValue}
            placeholder="Select league"
            defaultActiveFirstOption
            showArrow
            filterOption={false}
            onSearch={handleSearchLeague}
            onChange={handleChangeLeague}
            notFoundContent="not found"
          >
            {options}
          </Select>
        </Col>
        <Col span={12}>
          <Select
            showSearch
            style={{ width: 150 }}
            value={state.selectedYear.toString()}
            placeholder="Select year"
            defaultActiveFirstOption
            showArrow
            onChange={handleChangeYear}
          >
            {yearOptions}
          </Select>
        </Col>
      </Row>
      <Container fullWidth>
        {matches.map((match) => (
          <MatchComponent onClick={handleMatchClick} match={match} />
        ))}
      </Container>
      {matchIdModal && <MatchModal onClose={handleMatchModalClose} matchId={matchIdModal} />}
    </Layout>
  )
}

export default Matches
