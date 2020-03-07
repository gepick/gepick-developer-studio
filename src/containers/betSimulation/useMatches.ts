import React from 'react'
import { Match, Day } from '~/utils/types'
import { getMatchesByTimeInterval } from '~/queries/queries'
import { useQuery } from 'react-apollo-hooks'
import { dayToString } from '~/utils/date'

interface FetchOptions {
  leagueId: string
  from: Day
  to: Day
}

function useMatches(): [Match[], (options: FetchOptions) => Promise<void>, boolean] {
  const [matches, setMatches] = React.useState<Match[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)

  const matchResults = useQuery(getMatchesByTimeInterval, {
    skip: true,
  })

  const fetchMatches = async (options: FetchOptions) => {
    setLoading(true)
    const variables = {
      from: dayToString(options.from),
      to: dayToString(options.to),
      leagueId: options.leagueId,
    }

    const results = await matchResults.refetch(variables)
    const matches: Match[] = results.data?.matches
    setMatches(matches)
    setLoading(false)
  }

  return [matches, fetchMatches, loading]
}

export default useMatches
