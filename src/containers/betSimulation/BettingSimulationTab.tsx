import React from 'react'
import { Radio, Select, InputNumber } from 'antd'
import { reverse } from 'lodash'
import { PickWithMatch } from '~/utils/types'
import Container from '~/components/container/Container'
import { isPickWin } from '~/utils/match2picks'
import { RadioChangeEvent } from 'antd/lib/radio'

interface Props {
  picks: PickWithMatch[]
}

enum MONEY_STRATEGY {
  SIMPLE,
  DAGON,
}

const getDagonTable = (multiple: number) => {
  const table = [{ step: 1, betSum: 1, requiredSum: 1 }]

  for (let i = 2; i < 20; i++) {
    const last = table[i - 2]
    const betSum = last.betSum * multiple
    table.push({
      step: i,
      betSum,
      requiredSum: betSum + last.requiredSum,
    })
  }

  return table
}

interface DagonSettings {
  maxStep: number
  multiple: number
}

const renderDagon = (picks: PickWithMatch[], settings: DagonSettings) => {
  const { maxStep } = settings
  let step = 0
  let dagonStep = 1
  let currentBuff = 1
  const dagonTable = getDagonTable(settings.multiple)
  console.log(dagonTable)
  let startBetSum = currentBuff / dagonTable[maxStep - 1].requiredSum

  return (
    <Container>
      <Container>
        step:{step} currentBuff:{currentBuff} starBetSum:{startBetSum}
      </Container>
      {reverse(picks).map((pick) => {
        step++

        if (dagonStep == maxStep - 1) {
          dagonStep = 1
        }

        if (dagonStep === 1) {
          startBetSum = currentBuff / dagonTable[maxStep - 1].requiredSum
        }

        let betSum = dagonTable[dagonStep - 1].betSum * startBetSum
        const result = pick.match.result.fullTime

        if (result && pick.oddSize) {
          if (isPickWin(result, pick.end)) {
            currentBuff = currentBuff + (betSum * pick.oddSize - betSum)
            dagonStep = 1
          } else {
            currentBuff = currentBuff - betSum
            dagonStep++
          }
        }

        return (
          <>
            <Container marginBottom={10}>
              <Container>
                {result?.home}:{result?.away} {pick.nicePickEnd} {pick.oddSize}
              </Container>
              <Container>
                step:{step} dagonStep: {dagonStep} currentBuff:{currentBuff} betSum:{betSum}
              </Container>
            </Container>
            <hr />
          </>
        )
      })}
    </Container>
  )
}

const renderSimple = (picks: PickWithMatch[]) => {
  let step = 0
  let currentBuff = 1
  return reverse(picks).map((pick) => {
    step++
    let betSum = currentBuff / 2
    const result = pick.match.result.fullTime

    if (result && pick.oddSize) {
      if (isPickWin(result, pick.end)) {
        currentBuff = currentBuff + (betSum * pick.oddSize - betSum)
      } else {
        currentBuff = currentBuff - betSum
      }
    }

    return (
      <Container>
        step:{step} currentBuff:{currentBuff} betSum:{betSum}
      </Container>
    )
  })
}

const Tab: React.FunctionComponent<Props> = (props) => {
  const [strategy, setStrategy] = React.useState<MONEY_STRATEGY>(MONEY_STRATEGY.SIMPLE)
  const [dagonSettings, setDagonSettings] = React.useState<DagonSettings>({
    maxStep: 10,
    multiple: 2,
  })

  const handleStrategyChange = (e: RadioChangeEvent) => {
    setStrategy(e.target.value)
  }

  const handleDagonMaxStepChange = (maxStep: number) => {
    setDagonSettings({
      ...dagonSettings,
      maxStep,
    })
  }

  const handleMultipleChange = (multiple?: number) => {
    if (multiple) {
      setDagonSettings({
        ...dagonSettings,
        multiple,
      })
    }
  }

  return (
    <Container>
      <Container>
        <Radio.Group onChange={handleStrategyChange} value={strategy}>
          <Radio value={MONEY_STRATEGY.SIMPLE}>Simple</Radio>
          <Radio value={MONEY_STRATEGY.DAGON}>Dagon</Radio>
        </Radio.Group>
        max step:
        <Select value={dagonSettings.maxStep} showArrow filterOption={false} onChange={handleDagonMaxStepChange}>
          {[...Array(20).keys()].map((value) => (
            <Select.Option key={value}>{value}</Select.Option>
          ))}
        </Select>
        growing multiple:
        <InputNumber
          min={0}
          max={10}
          step={0.01}
          value={dagonSettings.multiple}
          onChange={handleMultipleChange}
        />
        {strategy === MONEY_STRATEGY.SIMPLE && renderSimple(props.picks)}
        {strategy === MONEY_STRATEGY.DAGON && renderDagon(props.picks, dagonSettings)}
      </Container>
    </Container>
  )
}

export default Tab
