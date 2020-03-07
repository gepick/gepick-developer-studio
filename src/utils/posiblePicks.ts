import { _1x2End, UOEnd } from '~/utils/types'

export const ENDS_1x2 = [{ end: _1x2End.HOME }, { end: _1x2End.DRAW }, { end: _1x2End.AWAY }]

export const ENDS_UO = [
  { end: UOEnd.UNDER, limit: 0.5 },
  { end: UOEnd.OVER, limit: 0.5 },
  { end: UOEnd.UNDER, limit: 1.5 },
  { end: UOEnd.OVER, limit: 1.5 },
  { end: UOEnd.UNDER, limit: 2.5 },
  { end: UOEnd.OVER, limit: 2.5 },
  { end: UOEnd.UNDER, limit: 3.5 },
  { end: UOEnd.OVER, limit: 3.5 },
  { end: UOEnd.UNDER, limit: 4.5 },
  { end: UOEnd.OVER, limit: 4.5 },
  { end: UOEnd.UNDER, limit: 5.5 },
  { end: UOEnd.OVER, limit: 5.5 },
  { end: UOEnd.UNDER, limit: 6.5 },
  { end: UOEnd.OVER, limit: 6.5 },
]

const POSIBLE_PICKS = [...ENDS_1x2, ...ENDS_UO]

export default POSIBLE_PICKS
