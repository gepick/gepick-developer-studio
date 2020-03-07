import React from 'react'
import { MatchWithPredictions, Match } from '~/utils/types'
import { predictByChunks } from '~/services/predict'

type Response = [MatchWithPredictions[] | undefined, (matches: Match[]) => Promise<void>, number, boolean]

function useCalculatePrediction(): Response {
  const [predictedPercent, setPredictedPercent] = React.useState<number>(0)
  const [isCalculating, setIsCalculating] = React.useState<boolean>(false)
  const [matchesWithPredictions, setMatchesWithPredictions] = React.useState<MatchWithPredictions[] | undefined>(
    undefined,
  )

  const handleChange = (percentage: number) => setPredictedPercent(percentage)

  const calculate = async (matches: Match[]) => {
    setIsCalculating(true)
    setPredictedPercent(0)
    const matchesWithPredictions = await predictByChunks(matches, {}, 5, handleChange)
    setMatchesWithPredictions(matchesWithPredictions)
    setIsCalculating(false)
    setPredictedPercent(0)
  }

  return [matchesWithPredictions, calculate, predictedPercent, isCalculating]
}

export default useCalculatePrediction
