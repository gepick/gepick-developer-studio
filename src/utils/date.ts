import { Day } from '~/utils/types'
import fixDate from '~/utils/fixDate'

export function dayToString(day: Day){
  const yearString = fixDate(day.year)
  const monthString = fixDate(day.month)
  const dayString = fixDate(day.day)

  return `${yearString}-${monthString}-${dayString}`	
}
