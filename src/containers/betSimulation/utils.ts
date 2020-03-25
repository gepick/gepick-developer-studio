import { PickWithMatch, PickStatus, Pick, Day } from '~/utils/types'
import { groupBy, map, sumBy, maxBy, minBy, flatten } from 'lodash'
import { ReportData } from '~/utils/types'
import roundToTwo from '~/utils/roundToTwo'

interface PicksByDays {
  day: string
  picks: PickWithMatch[]
}

interface PicksByMonthsDays {
  month: string
  picks: PicksByDays[]
}

export interface PicksByYearsMonthsDays {
  year: string
  picks: PicksByMonthsDays[]
}

interface Month {
  year: number
  month: number
}

interface Year {
  year: number
}

export const findYearPicks = (picksByYearsMonthsDays: PicksByYearsMonthsDays[], day: Day | Year) => {
  const picksOfYear = picksByYearsMonthsDays.find((yearPicks) => parseInt(yearPicks.year) === day.year)

  const flattedPicksByYear = flatten(map(picksOfYear?.picks ?? [], (obj) => obj.picks))
  const flattedPicksByDays = flatten(map(flattedPicksByYear, (obj) => obj.picks))

  return flattedPicksByDays
}

export const findMonthPicks = (picksByYearsMonthsDays: PicksByYearsMonthsDays[], day: Day | Month) => {
  const picksOfYear = picksByYearsMonthsDays.find((yearPicks) => parseInt(yearPicks.year) === day.year)

  const picksByMonth = picksOfYear?.picks.find((monthPicks) => parseInt(monthPicks.month) === day.month)
  const flattedPicksByMonth = flatten(map(picksByMonth?.picks ?? [], (obj) => obj.picks))

  return flattedPicksByMonth
}

export const findDayPicks = (picksByYearsMonthsDays: PicksByYearsMonthsDays[], day: Day) => {
  const picksOfYear = picksByYearsMonthsDays.find((yearPicks) => parseInt(yearPicks.year) === day.year)
  const picksByMonth = picksOfYear?.picks.find((monthPicks) => parseInt(monthPicks.month) === day.month)
  const picksByDay = picksByMonth?.picks.find((dayPicks) => parseInt(dayPicks.day) === day.day)

  return picksByDay?.picks ?? []
}

export function formatPicksByYearsMonthsDays(picks: PickWithMatch[]): PicksByYearsMonthsDays[] {
  const picksByYears = groupBy(picks, (pick: PickWithMatch) => {
    return pick.match.startTime.split('-')[0]
  })

  const toPicksByDays = (picksByMonths: any) => {
    const picksByDays = map(picksByMonths, (monthPicks, month) => {
      const picksByDay = groupBy(monthPicks, (pick: PickWithMatch) => {
        return pick.match.startTime.split('-')[2].split(' ')[0]
      })

      const formatedPicks = map(picksByDay, (dayPicks, day) => {
        return {
          day,
          picks: dayPicks,
        }
      })

      return { month, picks: formatedPicks }
    })

    return picksByDays
  }

  const picksByYearsMonthsDays = map(picksByYears, (picksByYear, year) => {
    const picksByMonths = groupBy(picksByYear, (pick: PickWithMatch) => {
      return pick.match.startTime.split('-')[1]
    })

    return { year, picks: toPicksByDays(picksByMonths) }
  })

  return picksByYearsMonthsDays
}

export function calculatePicksReport(picks: PickWithMatch[] | Pick[]): ReportData {
  const totalPicks = picks.length
  const totalWin = picks.filter(({ status }) => status === PickStatus.WIN).length
  const totalLost = picks.filter(({ status }) => status === PickStatus.LOST).length
  const totalNoResult = picks.filter(({ status }) => status === PickStatus.NO_RESULT).length
  const totalCanceled = picks.filter(({ status }) => status === PickStatus.CANCELED).length
  const picksWithResults = picks.filter(({ status }) => status === PickStatus.WIN || PickStatus.LOST)
  const totalPicksWithResults = picksWithResults.length
  const totalProfit = roundToTwo(sumBy(picks, 'profit'))
  const winProc = totalWin === 0 ? 0 : Math.round((totalWin / totalPicksWithResults) * 100)
  const roi = totalProfit / totalPicksWithResults

  const avarageOdd = sumBy(picks, 'oddSize') / totalPicksWithResults
  const maxOdd = maxBy(picks, ({ oddSize }) => oddSize)?.oddSize ?? undefined
  const minOdd = minBy(picks, ({ oddSize }) => oddSize)?.oddSize ?? undefined

  const data = {
    totalPicks,
    totalPicksWithResults,
    totalWin,
    totalLost,
    totalNoResult,
    totalCanceled,
    totalProfit,
    winProc,
    roi: roi ? roundToTwo(roi) : undefined,
    avarageOdd: avarageOdd ? roundToTwo(avarageOdd) : undefined,
    maxOdd,
    minOdd,
  }

  return data	
}

export interface DayGraphData {
  day: string
  report: ReportData
}

// @TODO - change to year month type to number. Also change throw all code base
export function getMonthDaysGraphData(
  picksByYearsMonthsDays: PicksByYearsMonthsDays[],
  options: Month,
): DayGraphData[] {
  const data = map(new Array(31), (_, key) => {
    const day = key + 1
    const dayPicks = findDayPicks(picksByYearsMonthsDays, { ...options, day })
    return {
      day: day.toString(),
      report: calculatePicksReport(dayPicks ?? []),
    }
  })

  return data
}

export interface MonthGraphData {
  month: string
  report: ReportData
}

export function getYearMonthsGraphData(
  picksByYearsMonthsDays: PicksByYearsMonthsDays[],
  options: Year,
): MonthGraphData[] {
  const data = map(new Array(12), (_, key) => {
    const month = key + 1
    const monthPicks = findMonthPicks(picksByYearsMonthsDays, { ...options, month })
    return {
      month: month.toString(),
      report: calculatePicksReport(monthPicks ?? []),
    }
  })

  return data
}

export interface YearGraphData {
  year: string
  report: ReportData
}

export function getYearsGraphData(picksByYearsMonthsDays: PicksByYearsMonthsDays[]): YearGraphData[] {
  const years = picksByYearsMonthsDays.map(({ year }) => year)
  const data = map(years, (year) => {
    const yearPicks = findYearPicks(picksByYearsMonthsDays, { year: parseInt(year) })
    return {
      year,
      report: calculatePicksReport(yearPicks ?? []),
    }
  })

  return data
}
