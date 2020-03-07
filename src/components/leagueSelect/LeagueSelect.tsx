import React from 'react'
import { sortBy } from 'lodash'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { Select } from 'antd'
import { League } from '~/utils/types'

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

interface Props {
  value?: string
  onChange(leagueId: string): void
}

const LeagueSelect: React.FunctionComponent<Props> = (props) => {
  const [selectedLeagueValue, setSelectedLeagueValue] = React.useState<string | undefined>(props.value)
  const [leagueSearchKeyword, setLeagueSearchKeyword] = React.useState<string | undefined>()

  const leaguesResults = useQuery(leaguesQuery)
  const leagues: League[] = leaguesResults.data?.leagues ?? []

  const handleSearchLeague = (key: string) => {
    setLeagueSearchKeyword(key)
  }

  const handleChangeLeague = (leagueId: string) => {
    setSelectedLeagueValue(leagueId)
    props.onChange(leagueId)
  }

  const memoizedLeaguesList = React.useMemo(() => {
    const filterByKeyword = (leagues: League[]) => {
      return leagues.filter((league) => {
        const search = leagueSearchKeyword!.toLowerCase()
        const isOk = (league.location.name + league.name).toLowerCase().includes(search)
        return isOk
      })
    }

    const leaguesForSort = leagueSearchKeyword ? filterByKeyword(leagues) : leagues

    const sortedList = sortBy(leaguesForSort, 'location.name')

    return sortedList
  }, [leagues, leagueSearchKeyword])

  const options = memoizedLeaguesList.map((league) => (
    <Select.Option key={league._id}>
      {league.location.name} {league.name}
    </Select.Option>
  ))

  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      value={selectedLeagueValue}
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
  )
}

export default LeagueSelect
