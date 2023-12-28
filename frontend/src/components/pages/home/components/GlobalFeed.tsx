import React from 'react'
import { Typography } from 'antd'

import '@app/pages/home/home.scss'

const { Text } = Typography

const GlobalFeed: React.FC = () => {
	return (
		<div className="global-feed">
			<Text>GlobalFeed</Text>
		</div>
	)
}

export default GlobalFeed

