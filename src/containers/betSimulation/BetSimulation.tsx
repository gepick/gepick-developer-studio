import React from 'react'
import moment from 'moment'
import { Row, Col, DatePicker, Divider, Tabs, Card, Button } from 'antd'
import Layout from '~/containers/Layout'
import Settings, { AutobettingSettings } from '~/components/settings/Settings'
import { PickWithMatch, Day } from '~/utils/types'
import PicksTable from '~/components/picksTable/picksTable'
import Report from '~/containers/betSimulation/Report'
import fixDate from '~/utils/fixDate'
import ResponsiveBarChart from '~/components/charts/barchart/ResponsiveBarchart'
import POSIBLE_PICKS from '~/utils/posiblePicks'
import useMatches from './useMatches'
import useCalculatePredictions from './useCalculatePredictions'
import useUpdatePicks from '~/containers/betSimulation/useUpdatePicks'
import { dayToString } from '~/utils/date'
import useReportData from '~/containers/betSimulation/useReportData'
import Match from '~/components/match/Match'
import config from '~/config'
import useUrlParams from '~/hooks/useUrlParams'

interface Props {}

const defaultDay = {
  year: 2014,
  month: 3,
  day: 8,
}

const defaultTimeInterval = {
  from: defaultDay,
  to: {
    year: 2015,
    month: 1,
    day: 1,
  },
}

const defaultSettings: AutobettingSettings = {
  leagueId: '5c9dcc554678f71aecf799cd',
  onlyValue: false,
  minProbability: 0,
  ends: POSIBLE_PICKS,
  oddIndex: 0,
  timeInterval: defaultTimeInterval,
}

const BetSimulation: React.FunctionComponent<Props> = (props) => {
  const [matches, fetchMatches, isMatchesLoading] = useMatches()
  const [
    matchesWithPredictions,
    calculatePredictions,
    predictedPercent,
    isCalculatingPredictions,
  ] = useCalculatePredictions()
  const [filteredPicks, updatePicks, isUpdatingPicks] = useUpdatePicks()
  const [reports, updateReports, isUpdatingReports] = useReportData()
  const [addUrlSearchParam, getUrlParams] = useUrlParams()

  const settings = getUrlParams<AutobettingSettings>('settings') ?? defaultSettings
  const selectedDay = getUrlParams<Day>('selectedDay') ?? defaultDay

  // @ts-ignore
  const handleDayChange = (date: any, dateString: string) => {
    const splitedDateString = dateString.split('-')
    const newDay = {
      year: parseInt(splitedDateString[0]),
      month: parseInt(splitedDateString[1]),
      day: parseInt(splitedDateString[2]),
    }
    addUrlSearchParam([{ key: 'selectedDay', value: newDay }])
    updateReports(filteredPicks as PickWithMatch[], newDay)
  }

  const handleFetchMatches = async () => {
    if (settings) {
      const { timeInterval } = settings
      await fetchMatches({ leagueId: settings.leagueId, from: timeInterval.from, to: timeInterval.to })
    }
  }

  const handleCalculatePredictions = async () => {
    await calculatePredictions(matches)
  }

  const handleUpdatePicks = () => {
    if (matchesWithPredictions && settings) {
      const filteredPicks = updatePicks(matchesWithPredictions, settings)
      updateReports(filteredPicks as PickWithMatch[], selectedDay)
    }
  }

  const handleSettingsChange = (settings: AutobettingSettings) => {
    addUrlSearchParam([{ key: 'settings', value: settings }])
  }

  const reportsComponent = React.useMemo(() => {
    if (!reports) {
      return null
    }

    return (
      <Row>
        <Col span={6}>
          <Report
            title={`${selectedDay.year}-${fixDate(selectedDay.month)}-${fixDate(selectedDay.day)} day report`}
            reportData={reports.dayReport}
          />
          <Report
            title={`${selectedDay.year}-${fixDate(selectedDay.month)} month report`}
            reportData={reports.monthReport}
          />
          <Report title={`${selectedDay.year} year report`} reportData={reports.yearReport} />
          <Report title="All times report" reportData={reports.allTimesReport} />
        </Col>
        <Col span={18}>
          <Card
            bodyStyle={{ height: 350 }}
            title={`Selected month (${selectedDay.year}-${fixDate(selectedDay.month)}) days profits`}
          >
            <ResponsiveBarChart id="profitBarchartByDay" data={reports.monthDaysProfitGraphData} />
          </Card>
          <Card bodyStyle={{ height: 350 }} title={`Selected year (${selectedDay.year}) months profits`}>
            <ResponsiveBarChart id="profitBarchartByDay" data={reports.yearMonthsProfitGraphData} />
          </Card>
          <Card bodyStyle={{ height: 350 }} title={`All years profits`}>
            <ResponsiveBarChart id="profitBarchartByDay" data={reports.yearsProfitGraphData} />
          </Card>
        </Col>
      </Row>
    )
  }, [reports])

  return (
    <Layout>
      <Settings
        timeInterval={settings.timeInterval}
        leagueId={settings.leagueId}
        ends={settings.ends}
        oddIndex={settings.oddIndex}
        onlyValue={settings.onlyValue}
        minProbability={settings.minProbability}
        onChange={handleSettingsChange}
      />
      <Button disabled={!settings} loading={isMatchesLoading} onClick={handleFetchMatches}>
        Fetch matches
      </Button>
      <Button disabled={matches.length === 0} loading={isCalculatingPredictions} onClick={handleCalculatePredictions}>
        Calculate predictions {isCalculatingPredictions && `${predictedPercent}%`}
      </Button>
      <Button
        disabled={(matchesWithPredictions?.length ?? 0) === 0}
        onClick={handleUpdatePicks}
        loading={isUpdatingPicks || isUpdatingReports}
      >
        Update picks & and report
      </Button>
      <Divider orientation="left">Report</Divider>
      <Row>
        <Col style={{ lineHeight: '36px' }} span={1}>
          Day
        </Col>
        <Col span={23}>
          <DatePicker
            allowClear={false}
            defaultValue={moment(dayToString(selectedDay))}
            format={config.dateFormat}
            onChange={handleDayChange}
          />
        </Col>
      </Row>
      <Tabs animated={false}>
        <Tabs.TabPane tab="Picks" key="1">
          <PicksTable picks={reports?.dayPicks ?? []} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Stats" key="2">
          {reportsComponent}
        </Tabs.TabPane>
        <Tabs.TabPane tab={`Matches (${matches.length})`} key="3">
          {matches.map((match) => {
            return <Match match={match} />
          })}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  )
}

export default BetSimulation
