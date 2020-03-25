import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo-hooks'
import { Route, Redirect, BrowserRouter, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import routes from './routes'
import apolloClient from './services/apolloClient'
import Matches from './containers/matches/Matches'
import 'antd/dist/antd.css'
import BetSimulation from '~/containers/betSimulation/BetSimulation'

export const history = createBrowserHistory()

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Switch>
          <Route path={routes.betSimulation} exact render={() => <BetSimulation />} />
          <Route path={routes.matches} exact render={() => <Matches />} />
          <Route path={routes.other} render={() => <Redirect to={routes.betSimulation} />} />
        </Switch>
      </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
)
