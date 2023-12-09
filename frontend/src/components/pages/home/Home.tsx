import React from 'react'
import { Typography } from 'antd'

import '@app/pages/home/home.scss'

const { Text } = Typography

const Home: React.FC = () => {
	return (
		<div className="home">
			<div className="home__title">
				<Text>React Startup</Text>
			</div>
			<div className="home__content">
				<Text>A place to share your</Text>
				<Text italic>&nbsp;React&nbsp;</Text>
				<Text>knowledge.</Text>
			</div>
		</div>
	)
}

export default Home
