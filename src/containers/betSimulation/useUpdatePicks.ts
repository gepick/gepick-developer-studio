import React from 'react'
import { flatten, find } from 'lodash'
import matchesWithPredictionsToMatchesWithPicks from '~/utils/matchesWithPredictionsToMatchesWithPicks'
import { MatchWithPredictions, Pick } from '~/utils/types'
import { AutobettingSettings } from '~/components/settings/Settings'

type Response = [
  Pick[] | undefined,
  (matchesWithPredictions: MatchWithPredictions[], settings: AutobettingSettings) => Pick[],
  boolean,
]

function useUpdatePicks(): Response {
  const [picks, setPicks] = React.useState<Pick[] | undefined>()
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false)

  const updatePicks = (matchesWithPredictions: MatchWithPredictions[], settings: AutobettingSettings) => {
    setIsUpdating(true)
    const options = {
      ends: settings.ends,
      oddsInterval: settings.oddsInterval,
      oddIndex: settings.oddIndex,
    }

    const picksFilter = (pick: Pick) => {
      if (!pick.oddSize) {
        return false
      }

      if (settings.onlyValue && (pick.value ?? 0) < 0) {
        return false
      }

      if (settings.minProbability > pick.probability) {
        return false
      }

      if (!find(settings.ends, pick.end)) {
        return false
      }

      if (pick.oddSize < settings.oddsInterval.from || pick.oddSize > settings.oddsInterval.to) {
        return false
      }

      return true
    }

    const matchesWithPicks = matchesWithPredictionsToMatchesWithPicks(matchesWithPredictions, options)
    const picks = flatten(matchesWithPicks.map(({ picks }) => picks))
    const filteredPicks = picks.filter(picksFilter)
    setPicks(filteredPicks)
    setIsUpdating(false)

    return filteredPicks
  }

  return [picks, updatePicks, isUpdating]
}

export default useUpdatePicks
