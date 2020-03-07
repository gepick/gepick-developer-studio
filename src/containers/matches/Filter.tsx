import React from 'react'
import { Switch, Button } from 'antd'
import { FilterSettings } from './utils'
import Container from '~/components/Container/Container'
import useSwitch from '~/hooks/useSwitch'

interface Props {
  initSettings: FilterSettings	
  onUpdate(settings: FilterSettings): void
}

const Filter: React.FunctionComponent<Props> = (props) => {
  const [onlyValueState, switchOnlyValueState] = useSwitch(props.initSettings.onlyValue)

  const handleUpdate = () => {
    props.onUpdate({
      onlyValue: onlyValueState,
    })
  }

  return (
    <Container>
      <Switch checked={onlyValueState} onChange={switchOnlyValueState} />
      <Button onClick={handleUpdate}>update</Button>
    </Container>
  )
}

export default Filter
