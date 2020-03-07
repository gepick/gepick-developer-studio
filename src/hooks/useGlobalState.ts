import { createGlobalState } from 'react-hooks-global-state'
import { MatchWithPredictions } from '~/utils/types'

interface Statistic {
  totalPicks: number
  totalProfits: number	
}

export interface GlobalState {
  picks: MatchWithPredictions[]
  statistics?: Statistic
}

interface State {
  state: GlobalState
}

export const { GlobalStateProvider, useGlobalState } = createGlobalState<State>({
  state: { picks: [], statistics: undefined },
})
