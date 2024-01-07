import React from 'react'
import { Col, Row, Typography } from 'antd'

import '@app/pages/home/home.scss'
import Feeds from './components/Feeds'
import PopularTags from './components/PopularTags'

const { Text } = Typography

const Home: React.FC = () => {
	return (
		<div className="home">
			<div className="home__explanation">
				<div className="home__title">
					<Text>React-Nestjs-MySQL Startup</Text>
				</div>
				<div className="home__content">
					<Text>A place to share your knowledge.</Text>
				</div>
			</div>
			<Row justify="end">
				<Col span={1}></Col>
				<Col span={16}><Feeds/></Col>
				<Col span={1}></Col>
				<Col span={6}><PopularTags/></Col>
			</Row>
		</div>
	)
}

export default Home
