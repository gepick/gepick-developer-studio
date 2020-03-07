import { Pick, PickEnd } from '~/utils/types'
import { sumBy } from 'lodash'
import isPickEndIncluded from '~/utils/isPickEndIncluded'

export interface Options {
  minProbability?: number
  onlyValue?: boolean
  ends?: PickEnd[]
}

export function isPickByOptions(pick: Pick, options: Options) {
  return filterByOptions(options)(pick)
}

function filterByOptions(options: Options) {
  return (pick: Pick) => {
    if (options.minProbability && pick.probability < options.minProbability) {
      return false
    }

    if (options.onlyValue && pick.value && pick.value <= 0) {
      return false
    }

    if (options.ends && !isPickEndIncluded(options.ends, pick.end)) {
      return false
    }

    return true
  }
}

function countValuePicksProfit(picks: Pick[], options: Options = {}) {
  const filteredPicks = picks.filter(filterByOptions(options))

  const valuePicks = filteredPicks.filter((pick) => pick.value && pick.value > 0)
  const profit = sumBy(valuePicks, 'profit')

  return profit
}

export default countValuePicksProfit
