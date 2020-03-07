import React, { useRef, useEffect, useState } from 'react'

interface IProps {
  children: (width: number, height: number) => React.ReactNode
}
interface IState {
  width: number
  height: number
}

const Dimensions: React.FunctionComponent<IProps> = (props) => {
  const [state, setState] = useState<IState>({
    width: 0,
    height: 0,
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const width = ref.current!.clientWidth
      const height = ref.current!.clientHeight
      setState((prevState) => ({ ...prevState, width, height }))
    }
  }, [ref.current])

  return (
    <div style={{ width: '100%', height: '100%' }} ref={ref}>
      {props.children(state.width, state.height)}
    </div>
  )
}

export default Dimensions

