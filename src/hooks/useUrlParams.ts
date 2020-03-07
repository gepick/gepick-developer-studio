import { isArray } from 'lodash'
import { useHistory, useLocation } from 'react-router-dom'

interface IParam<T> {
  key: string
  value: T
}

const appendParams = (query: URLSearchParams, param: IParam<string[]>) => {
  query.delete(param.key)
  param.value.forEach((value) => {
    query.append(param.key, window.encodeURI(JSON.stringify(value)))
  })
}

type Response = [(params: Array<IParam<object | object[]>>, replace?: boolean) => void, <T>(key: string) => T | null]

function useUrlParams(): Response {
  const history = useHistory()
  const location = useLocation()
  const urlSearchParams = new URLSearchParams(location.search)

  const getUrlParams = <T>(key: string): T | null => {
    const queryValue = urlSearchParams.get(key)
    return queryValue ? JSON.parse(window.decodeURI(queryValue)) : queryValue
  }

  const addUrlSearchParam = (params: Array<IParam<object | object[]>>, replace?: boolean) => {
    const query = new URLSearchParams(history.location.search)
    params.forEach((param: IParam<object | object[]>) => {
      if (isArray(param.value)) {
        appendParams(query, param as IParam<string[]>)
      } else {
        query.set(param.key, window.encodeURI(JSON.stringify(param.value)))
      }
    })
    if (replace) {
      history.replace({ ...history.location, search: query.toString() })
    } else {
      history.push({ ...history.location, search: query.toString() })
    }
  }

  return [addUrlSearchParam, getUrlParams]
}

export default useUrlParams
