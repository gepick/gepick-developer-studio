import axios from 'axios'
import { find, chunk } from 'lodash'
import { Match, MatchPredictions, _1x2End, MatchWithPredictions } from '~/utils/types'
import { Options } from '~/utils/countValuePicksProfit'

interface ModelParmas {
  matchesToPredict_ids: string[]
  params?: object
}

const predict = async (matches: Match[], options: Options): Promise<MatchWithPredictions[]> => {
  const matchesIds = matches.map((match) => match._id)
  const body: ModelParmas = {
    matchesToPredict_ids: matchesIds,
  }

  const res = await axios.post('/predict', body)

  const matchesPredictions: MatchPredictions[] = res.data
  const findMatchPrediction = (matchId: string) => {
    const matchPredictions = find(matchesPredictions, (predictions) => {
      return predictions._id === matchId
    })

    return matchPredictions?.predictions
  }

  const matchesWithPredictions = matches.map((match) => {
    const predictions = findMatchPrediction(match._id)
    return {
      ...match,
      predictions,
    }
  })
  
  return matchesWithPredictions
}

export async function predictByChunks(
  matches: Match[],
  options: Options,
  chunkSize: number,
  onPrecentageChange: (precentage: number) => void,
  stop?: number,
) {
  const matchesChunks = chunk(matches, chunkSize)

  let matchesWithPredictions: MatchWithPredictions[] = []

  for (let i = 0; i < matchesChunks.length; i++) {
    const predictionsChunk = await predict(matchesChunks[i], options)
    matchesWithPredictions = matchesWithPredictions.concat(predictionsChunk)
    onPrecentageChange(Math.round((i / matchesChunks.length) * 100))

    if (stop && stop === i) {
      break
    }
  }

  return matchesWithPredictions
}

export default predict
