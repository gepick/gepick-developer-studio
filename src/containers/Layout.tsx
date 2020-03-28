import React from 'react'
import { Link, generatePath } from 'react-router-dom'
import routes from '~/routes'
import { Layout, Menu } from 'antd'
import Container from '~/components/container/Container'

interface Props {
  loading?: boolean
}

const { Header, Content, Sider } = Layout

const GeLayout: React.FunctionComponent<Props> = (props) => (
  <Layout>
    <Header className="header">
      <Container flex>
        <Container style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>GEPICK developer studio</Container>
      </Container>
    </Header>

    <Layout>
      <Sider theme="light" width={200}>
        <Menu style={{ minHeight: 'calc(100vh - 64px' }}>
          <Menu.Item key="1">
            <Link to={routes.betSimulation}>Bet simulation</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to={generatePath(routes.matches)}>matches</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '10px' }}>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  </Layout>
)

export default GeLayout
