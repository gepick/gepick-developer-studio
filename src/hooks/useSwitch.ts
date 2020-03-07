import { useState } from 'react'

function useSwitch(b?: boolean): [boolean, () => void] {
  const [state, setState] = useState<boolean>(b ?? false)

  const switchState = () => {
    setState(!state)
  }

  return [state, switchState]
}

export default useSwitch
