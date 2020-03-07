import match2picks, { Match2picksOptions } from '~/utils/match2picks'
import { MatchWithPredictions } from '~/utils/types'

function matchesWithPredictionsToMatchesWithPicks(
  matchesWithPredictions: MatchWithPredictions[],
  options: Match2picksOptions,
) {
  const matchesWithPicks = matchesWithPredictions.map((match) => {
    const picks = match2picks(match, match.predictions, options)

    return {
      ...match,
      picks,
    }
  })

  return matchesWithPicks
}

export default matchesWithPredictionsToMatchesWithPicks
