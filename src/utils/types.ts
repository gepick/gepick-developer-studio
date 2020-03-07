export interface TimeInterval {
  from: Day
  to: Day
}

export enum EndsKeys {
  HOME = 'home',
  DRAW = 'draw',
  AWAY = 'away',
  U0_5 = 'u0_5',
  O0_5 = 'o0_5',
  U1_5 = 'u1_5',
  O1_5 = 'o1_5',
  U2_5 = 'u2_5',
  O2_5 = 'o2_5',
  U3_5 = 'u3_5',
  O3_5 = 'o3_5',
  U4_5 = 'u4_5',
  O4_5 = 'o4_5',
  U5_5 = 'u5_5',
  O5_5 = 'o5_5',
  U6_5 = 'u6_5',
  O6_5 = 'o6_5',
}

export type MatchPredictionEnds = { [key in EndsKeys]: number /* in percent e.g 75 not 0.75 */ }

export interface MatchPredictions {
  _id: string
  predictions: MatchPredictionEnds
}

export enum UOEnd {
  UNDER = 'under',
  OVER = 'over',
}

export enum _1x2End {
  HOME = 'home',
  DRAW = 'draw',
  AWAY = 'away',
}

export interface PickEnd {
  end: _1x2End | UOEnd
  limit?: number
}

export interface Odds1x2 {
  home: number
  draw: number
  away: number
}

export interface OddsUO {
  under: number
  over: number
  limit: number
}

interface Bookmaker {
  name: string
}

interface OddsByBookmaker {
  bookmaker: Bookmaker
  odds1x2: Odds1x2[]
  oddsUO: OddsUO[]
}

export interface Result {
  home: number
  away: number
}

interface MatchResult {
  half1?: Result
  half2?: Result
  extraTime?: Result
  penalties?: Result
  fullTime?: Result
  matchRes?: Result
}

interface Location {
  _id: string
  name: string
}

export interface League {
  _id: string
  name: string
  location: Location
}

interface Team {
  _id: string
  name: string
}

interface HistoricalMatches {
  home: Match[]
  away: Match[]
}

export interface Match {
  _id: string
  startTime: string
  oddsByBookmaker: OddsByBookmaker[]
  location: Location
  league: League
  hteam: Team
  ateam: Team
  status: MatchStatus
  result: MatchResult
  historicalMatches: HistoricalMatches
  beLink?: string
}

export enum PickStatus {
  WIN = 'WIN',
  LOST = 'LOST',
  NO_RESULT = 'NO_RESULT',
  CANCELED = 'CANCELED',
}

export enum MatchStatus {
  NOT_STARTED = 'NOT_STARTED',
  NORMAL = 'NORMAL',
  AFTER_PENALTIES = 'AFTER_PENALTIES',
  POSTPONED = 'POSTPONED',
  CANCELED = 'CANCELED',
  EXTRA_TIME = 'EXTRA_TIME',
  AWARDED = 'AWARDED',
  ABANDONED = 'ABANDONED',
  INTERRUPTED = 'INTERRUPTED',
  WALKOVER = 'WALKOVER',
  UNKNOWN = 'UNKNOWN',
}

export interface Pick {
  matchId: string
  end: PickEnd
  nicePickEnd: EndsKeys
  oddSize: number | null
  status: PickStatus
  probability: number
  profit: number
  value?: number | null
  bookmakerName?: string
  bookmakerProb?: number
  probDiff?: number | null
  betSum?: number
}

export interface PickWithMatch extends Pick {
  match: Match
}

export interface MatchWithPicks extends Match {
  picks: Pick[]
  picksProfit?: number	
}

export interface MatchWithPredictions extends Match {
  predictions?: MatchPredictionEnds
}

export interface ReportData {
  totalPicks: number
  totalPicksWithResults: number
  totalWin: number
  totalLost: number
  totalNoResult: number
  totalCanceled: number
  totalProfit: number
  winProc: number
  roi?: number
  avarageOdd?: number
  maxOdd?: number
  minOdd?: number
}

export interface Day {
  year: number
  month: number
  day: number
}

