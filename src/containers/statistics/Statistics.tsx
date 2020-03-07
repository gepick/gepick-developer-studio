import React from 'react'
import Layout from '~/containers/Layout'
import usePicks from '~/hooks/usePicks'

const Statistics = () => {
  const { statistics } = usePicks()
  return <Layout >totalPicks: {statistics?.totalPicks} total profit: {statistics?.totalProfits}</Layout>
}

export default Statistics
