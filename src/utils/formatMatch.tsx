import moment from 'moment'
import { Match }from '~/utils/types'

const formatMatch = (match: Match) => {
  return {
    ...match,
    startTime: moment(parseInt(match.startTime)).format('YYYY-MM-DD HH:mm'),
  }
}

export default formatMatch
