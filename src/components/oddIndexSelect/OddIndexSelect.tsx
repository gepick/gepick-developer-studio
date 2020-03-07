import React from 'react'
import { Select } from 'antd'

interface Props {
  value?: number
  onChange: (index: number) => void
}

const OddIndexSelect: React.FunctionComponent<Props> = (props) => {
  const optionsList = [0, 1, 2, 3, 4, 5]

  const handleChange = (index: string) => {
    props.onChange(parseInt(index))
  }

  return (
    <Select
      style={{ width: '100%' }}
      value={props.value?.toString() ?? '0'}
      placeholder="Select index"
      defaultActiveFirstOption
      showArrow
      filterOption={false}
      onChange={handleChange}
    >
      {optionsList.map((value) => (
        <Select.Option key={value}>{value}</Select.Option>
      ))}
    </Select>
  )
}

export default OddIndexSelect
