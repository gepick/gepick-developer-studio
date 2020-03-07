import React from 'react'
import moment, { Moment } from 'moment'
import { groupBy, map } from 'lodash'
import Container from '~/components/Container/Container'
import { Switch, Slider, Row, Col, Tag, DatePicker } from 'antd'
import useSwitch from '~/hooks/useSwitch'
import { PickEnd, TimeInterval } from '~/utils/types'
import POSIBLE_PICKS, { ENDS_1x2, ENDS_UO } from '~/utils/posiblePicks'
import isPickEndIncluded from '~/utils/isPickEndIncluded'
import LeagueSelect from '~/components/leagueSelect/LeagueSelect'
import OddIndexSelect from '~/components/oddIndexSelect/OddIndexSelect'
import { dayToString } from '~/utils/date'
import config from '~/config'
import { RangePickerValue } from 'antd/lib/date-picker/interface'

const { CheckableTag } = Tag

export interface AutobettingSettings {
  leagueId: string
  onlyValue: boolean
  minProbability: number
  ends: PickEnd[]
  oddIndex: number
  timeInterval: TimeInterval
}

interface Props {
  leagueId: string
  day?: string
  onlyValue?: boolean
  minProbability?: number
  oddIndex?: number
  ends?: PickEnd[]
  timeInterval: TimeInterval
  onChange: (settings: AutobettingSettings) => void
}

const GROUPED_ENDS_UO = groupBy(ENDS_UO, 'limit')

const Settings: React.FunctionComponent<Props> = (props) => {
  const [onlyValue, switchOnlyValue] = useSwitch(props.onlyValue)
  const [leagueId, setLeagueId] = React.useState<string>(props.leagueId)
  const [minProbability, setMinProbability] = React.useState<number>(props.minProbability ?? 0)
  const [ends, setEnds] = React.useState<PickEnd[]>(props.ends ?? [])
  const [oddIndex, setOddIndex] = React.useState<number>(props.oddIndex ?? 0)
  const [timeInterval, setTimeInterval] = React.useState<TimeInterval>(props.timeInterval)

  React.useEffect(() => {
    props.onChange({
      onlyValue,
      ends,
      minProbability,
      leagueId,
      oddIndex,
      timeInterval,
    })
  }, [onlyValue, leagueId, minProbability, ends, oddIndex, timeInterval])

  const selectAllEnds = () => {
    setEnds(POSIBLE_PICKS)
  }

  const unSelectAllEnds = () => {
    setEnds([])
  }

  const isEndChecked = (end: PickEnd) => {
    return isPickEndIncluded(ends, end)
  }

  const handleEndChange = (end: PickEnd) => {
    if (isEndChecked(end)) {
      const removedList = ends.filter((curr) => curr != end)

      setEnds(removedList)
    } else {
      setEnds([...ends, end])
    }
  }

  const handleTimeIntervalChange = (momentDates: RangePickerValue, stringDates: [string, string]) => {
    const [fromYear, fromMonth, fromDay] = stringDates[0].split('-')
    const [toYear, toMonth, toDay] = stringDates[1].split('-')

    setTimeInterval({
      from: {
        year: parseInt(fromYear),
        month: parseInt(fromMonth),
        day: parseInt(fromDay),
      },
      to: {
        year: parseInt(toYear),
        month: parseInt(toMonth),
        day: parseInt(toDay),
      },
    })
  }

  const datesDefaultValue: [Moment, Moment] = React.useMemo(() => {
    return [
      moment(dayToString(props.timeInterval.from), config.dateFormat),
      moment(dayToString(props.timeInterval.to), config.dateFormat),
    ]
  }, [props.timeInterval])

  const righBlockComponent = (
    <>
      <Row gutter={5}>
        <Col span={4}>League</Col>
        <Col span={10}>
          <LeagueSelect value={leagueId} onChange={setLeagueId} />
        </Col>
        <Col span={4}>Odd index</Col>
        <Col span={6}>
          <OddIndexSelect value={oddIndex} onChange={setOddIndex} />
        </Col>
      </Row>
      <Row>
        <Col style={{ lineHeight: '36px' }} span={6}>
          Min pick probability:{' '}
        </Col>
        <Col span={8}>
          <Slider onChange={setMinProbability as () => number} defaultValue={minProbability} />
        </Col>
        <Col span={5} style={{ lineHeight: '36px' }}>
          Only value picks:{' '}
        </Col>
        <Col span={5} style={{ lineHeight: '36px' }}>
          <Switch defaultChecked={onlyValue} onChange={switchOnlyValue} />
        </Col>
      </Row>
      <Row>
        <Col style={{ lineHeight: '36px' }} span={6}>
          From - To
        </Col>
        <Col span={8}>
          <DatePicker.RangePicker onChange={handleTimeIntervalChange} defaultValue={datesDefaultValue} />
        </Col>
      </Row>
    </>
  )

  const leftBlockComponent = (
    <>
      <Row gutter={5}>
        <Col span={15} style={{ paddingBottom: '5px' }}>
          {ENDS_1x2.map((end, index) => {
            return (
              <CheckableTag
                style={{ marginRight: '5px', width: '70px', textAlign: 'center', border: '1px solid' }}
                key={index}
                onChange={() => handleEndChange(end)}
                checked={isEndChecked(end)}
              >
                {end.end}
              </CheckableTag>
            )
          })}
        </Col>
        <Col span={9}>
          <Container>
            <a onClick={selectAllEnds}> select all </a>|<a onClick={unSelectAllEnds}> unselect all </a>
          </Container>
        </Col>
      </Row>
      <Row gutter={5}>
        <Col>
          <Row>
            {map(GROUPED_ENDS_UO, (ends, index) => {
              return (
                <Col span={3} key={index}>
                  {ends.map((end, index) => {
                    return (
                      <Row key={index} style={{ marginBottom: '5px' }}>
                        <CheckableTag
                          style={{ width: '70px', textAlign: 'center', border: '1px solid' }}
                          onChange={() => handleEndChange(end)}
                          checked={isEndChecked(end)}
                        >
                          {end.end} {end.limit}
                        </CheckableTag>
                      </Row>
                    )
                  })}
                </Col>
              )
            })}
            <Col span={3}></Col>
          </Row>
        </Col>
      </Row>
    </>
  )

  return (
    <Row gutter={5}>
      <Col span={12}>{righBlockComponent}</Col>
      <Col span={12} style={{ width: '600px' }}>
        {leftBlockComponent}
      </Col>
    </Row>
  )
}

export default Settings
