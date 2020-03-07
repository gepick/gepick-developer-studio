import { PickEnd } from '~/utils/types'

function isPickEndIncluded(ends: PickEnd[], end: PickEnd) {
  const key = end.end + end.limit
  const keys = ends.map((end) => end.end + end.limit)

  return keys.includes(key)
}

export default isPickEndIncluded
