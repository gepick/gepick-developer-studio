import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo-hooks'
import { Route, Redirect, BrowserRouter, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import routes from './routes'
import apolloClient from './services/apolloClient'
import Statistics from './containers/statistics/Statistics'
import Matches from './containers/matches/Matches'
import MatchContainer from './containers/matches/MatchContainer'
import Picks from './containers/picks/Picks'
import { GlobalStateProvider } from '~/hooks/useGlobalState'
import 'antd/dist/antd.css'
import BetSimulation from '~/containers/betSimulation/BetSimulation'

export const history = createBrowserHistory()

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <GlobalStateProvider>
      <BrowserRouter>
        <Switch>
          <Route path={routes.statistics} exact render={() => <Statistics />} />
          <Route path={routes.betSimulation} exact render={() => <BetSimulation />} />
          <Route path={routes.picks} exact render={() => <Picks />} />
          <Route path={routes.matches} exact render={() => <Matches />} />
          <Route path={routes.match} exact render={() => <MatchContainer />} />
          <Route path={routes.other} render={() => <Redirect to={routes.statistics} />} />
        </Switch>
      </BrowserRouter>
    </GlobalStateProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
