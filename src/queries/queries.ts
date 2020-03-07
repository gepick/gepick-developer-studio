import gql from 'graphql-tag'

/* Maybe delete it becouse it is not usefull anymore */
export const getMatchesByYears = gql`
  query Matches($yearFrom: Int, $yearTo: Int, $leagueId: String) {
    matches: getMatchesByYears(yearFrom: $yearFrom, yearTo: $yearTo, leagueId: $leagueId) {
      _id
      status
      startTime
      location {
        name
      }
      league {
        name
      }
      hteam {
        _id
        name
      }
      ateam {
        _id
        name
      }
      beLink
      oddsByBookmaker {
        bookmaker {
          name
        }
        odds1x2 {
          home
          draw
          away
        }
        oddsUO {
          under
          over
          limit
        }
      }
      result {
        fullTime {
          home
          away
        }
      }
    }
  }
`

export const getMatchesByTimeInterval = gql`
  query Matches($from: String, $to: String, $leagueId: String) {
    matches: getMatchesByTimeInterval(from: $from, to: $to, leagueId: $leagueId) {
      _id
      status
      startTime
      location {
        name
      }
      league {
        name
      }
      hteam {
        _id
        name
      }
      ateam {
        _id
        name
      }
      beLink
      oddsByBookmaker {
        bookmaker {
          name
        }
        odds1x2 {
          home
          draw
          away
        }
        oddsUO {
          under
          over
          limit
        }
      }
      result {
        fullTime {
          home
          away
        }
      }
    }
  }
`
