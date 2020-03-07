import React from 'react'

import {
  calculatePicksReport,
  getYearMonthsGraphData,
  getMonthDaysGraphData,
  getYearsGraphData,
  findDayPicks,
  findMonthPicks,
  findYearPicks,
  formatPicksByYearsMonthsDays,
} from './utils'
import { Day, PickWithMatch, ReportData } from '~/utils/types'
import { IBarchartItem } from '~components/charts/barchart/types'

interface Reports {
  dayPicks: PickWithMatch[]
  monthPicks: PickWithMatch[]
  yearPicks: PickWithMatch[]
  allPicks: PickWithMatch[]
  dayReport: ReportData
  monthReport: ReportData
  yearReport: ReportData
  allTimesReport: ReportData
  monthDaysProfitGraphData: IBarchartItem[]
  yearMonthsProfitGraphData: IBarchartItem[]
  yearsProfitGraphData: IBarchartItem[]
}

type Response = [Reports | undefined, (picks: PickWithMatch[], day: Day) => void, boolean]

function useReportData(): Response {
  const [reports, setReports] = React.useState<Reports | undefined>()
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false)

  const updateReport = (allPicks: PickWithMatch[], day: Day) => {
    setIsUpdating(true)
    const picksByYearsMonthsDays = formatPicksByYearsMonthsDays(allPicks)
    const dayPicks = findDayPicks(picksByYearsMonthsDays, day)
    const monthPicks = findMonthPicks(picksByYearsMonthsDays, day)
    const yearPicks = findYearPicks(picksByYearsMonthsDays, day)

    const dayReport = calculatePicksReport(dayPicks ?? [])
    const monthReport = calculatePicksReport(monthPicks)
    const yearReport = calculatePicksReport(yearPicks)
    const allTimesReport = calculatePicksReport(allPicks)

    const monthDaysGraphData = getMonthDaysGraphData(picksByYearsMonthsDays ?? [], {
      year: day.year,
      month: day.month,
    })

    const monthDaysProfitGraphData = monthDaysGraphData.map((data) => {
      return {
        x: data.day,
        y: data.report.totalProfit,
      }
    })

    const yearMonthsGraphData = getYearMonthsGraphData(picksByYearsMonthsDays ?? [], { year: day.year })

    const yearMonthsProfitGraphData = yearMonthsGraphData.map((data) => {
      return {
        x: data.month,
        y: data.report.totalProfit,
      }
    })

    const yearsGraphData = getYearsGraphData(picksByYearsMonthsDays ?? [])
    const yearsProfitGraphData = yearsGraphData.map((data) => {
      return {
        x: data.year,
        y: data.report.totalProfit,
      }
    })

    setReports({
      dayPicks,
      monthPicks,
      yearPicks,
      allPicks,
      dayReport,
      monthReport,
      yearReport,
      allTimesReport,
      monthDaysProfitGraphData,
      yearMonthsProfitGraphData,
      yearsProfitGraphData,
    })
    setIsUpdating(false)
  }

  return [reports, updateReport, isUpdating]
}

export default useReportData
