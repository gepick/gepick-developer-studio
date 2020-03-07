import { find, sortBy } from 'lodash'
import {
  PickStatus,
  MatchStatus,
  Match,
  MatchPredictionEnds,
  PickEnd,
  PickWithMatch,
  _1x2End,
  UOEnd,
  Result,
  EndsKeys,
} from './types'
import formatMatch from './formatMatch'
import POSIBLE_PICKS from '~/utils/posiblePicks'

interface PickOdd {
  bookmakerName: string
  oddSize: number
}

const countPickValue = (probability: number, oddSize: number) => {
  return oddSize * (probability < 1 ? probability * 100 : probability) - 100
}

const countPickProfit = (betSum: number, odd: number, status: PickStatus) => {
  if (status == PickStatus.WIN) {
    return roundToTwo(odd * betSum - betSum)
  }

  if (status == PickStatus.LOST) {
    return -betSum
  }

  if (status == PickStatus.CANCELED) {
    return betSum
  }

  return 0
}

const is1x2Pick = (end: _1x2End | UOEnd): boolean => {
  return end === _1x2End.HOME || end === _1x2End.DRAW || end === _1x2End.AWAY
}

const roundToTwo = (num: number): number => Math.round(num * 100) / 100

const oddToProb = (odd: number, round = false): number => {
  const prob = (1 / odd) * 100
  return round ? Math.round(prob) : roundToTwo(prob)
}

const getSorted1x2Odds = (match: Match, end: _1x2End): PickOdd[] => {
  const pickOdds = match.oddsByBookmaker.map((bookmakerOdds) => {
    return {
      oddSize: bookmakerOdds.odds1x2?.[0]?.[end] ?? 0,
      bookmakerName: bookmakerOdds.bookmaker.name,
    }
  })

  const sortedOdds = sortBy(pickOdds, (pick) => pick.oddSize)

  return sortedOdds.reverse()
}

const getSortedUOOdds = (match: Match, end: PickEnd): PickOdd[] => {
  const pickOdds = match.oddsByBookmaker.map((bookmakerOdds) => {
    const odd = find(bookmakerOdds.oddsUO, (odd): boolean => odd.limit === end.limit)

    return {
      oddSize: odd?.[end.end as UOEnd] ?? 0,
      bookmakerName: bookmakerOdds.bookmaker.name,
    }
  })

  const sortedOdds = sortBy(pickOdds, (pick) => pick.oddSize)

  return sortedOdds.reverse()
}

const getSortedOdds = (match: Match, { end, limit }: PickEnd) => {
  if (is1x2Pick(end)) {
    const odds1x2 = getSorted1x2Odds(match, end as _1x2End)
    return odds1x2
  }

  const uoodds = getSortedUOOdds(match, { end, limit })

  return uoodds
}

const toNicePickEnd = (end: PickEnd) => {
  if (is1x2Pick(end.end)) {
    return end.end
  }

  const later = end.end === UOEnd.UNDER ? 'u' : 'o'
  const uoEnd = later + end.limit?.toString().replace('.', '_')

  return uoEnd
}

const getPredictionByEnd = (predictions: MatchPredictionEnds, end: PickEnd): number => {
  const niceEnd = toNicePickEnd(end)
  return predictions[niceEnd as EndsKeys]
}

export const isPickWin = (results: Result, { end, limit }: PickEnd): boolean => {
  const { home, away } = results
  const sum = home + away

  switch (end) {
    case _1x2End.HOME:
      return home > away
    case _1x2End.DRAW:
      return home == away
    case _1x2End.AWAY:
      return home < away
    case UOEnd.UNDER:
      return sum < limit!
    case UOEnd.OVER:
      return sum > limit!
  }
}

export const extractPickStatus = (match: Match, end: PickEnd): PickStatus => {
  switch (match.status) {
    case MatchStatus.NORMAL:
    case MatchStatus.EXTRA_TIME:
    case MatchStatus.AFTER_PENALTIES:
    case MatchStatus.AWARDED:
      return isPickWin(match.result.fullTime!, end) ? PickStatus.WIN : PickStatus.LOST
    case MatchStatus.NOT_STARTED:
      return PickStatus.NO_RESULT
    case MatchStatus.POSTPONED:
    case MatchStatus.ABANDONED:
    case MatchStatus.CANCELED:
    case MatchStatus.INTERRUPTED:
      return PickStatus.CANCELED
  }

  throw new Error('Not supported match status: ' + match.status)
}

interface MatchPickByEndProps {
  match: Match
  predictions: MatchPredictionEnds
  end: PickEnd
  oddIndex: number
}

const matchPickByEnd = ({ match, predictions, end, oddIndex }: MatchPickByEndProps): PickWithMatch => {
  const sortedOdds = getSortedOdds(match, end)
  const pickOdd = sortedOdds[oddIndex]
  const oddSize = pickOdd?.oddSize ?? null
  const probability = getPredictionByEnd(predictions, end)
  const bookmakerProb = oddSize ? roundToTwo(oddToProb(oddSize, true)) : undefined
  const betSum = 1
  const status = extractPickStatus(match, end)

  return {
    betSum,
    bookmakerProb,
    end,
    nicePickEnd: toNicePickEnd(end) as EndsKeys,
    match: formatMatch(match),
    matchId: match._id,
    oddSize,
    bookmakerName: pickOdd?.bookmakerName,
    probDiff: probability && bookmakerProb ? roundToTwo(probability - bookmakerProb) : null,
    probability,
    profit: oddSize ? countPickProfit(betSum, oddSize, status) : 0,
    status,
    value: probability && oddSize ? roundToTwo(countPickValue(probability, oddSize)) : null,
  }
}

export interface Match2picksOptions {
  oddIndex?: number
}

const match2picks = (match: Match, predictions?: MatchPredictionEnds, options?: Match2picksOptions): PickWithMatch[] => {
  if (!predictions) {
    return []
  }

  return POSIBLE_PICKS.map((end) => {
    return matchPickByEnd({ end, match, predictions, oddIndex: options?.oddIndex ?? 0 })
  })
}

export default match2picks
