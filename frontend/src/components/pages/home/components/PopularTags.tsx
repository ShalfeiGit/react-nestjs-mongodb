import React from 'react'
import { Typography } from 'antd'

import '@app/pages/home/home.scss'

const { Text } = Typography

const PopularTags: React.FC = () => {
	return (
		<div className="popular-tags">
			<Text>PopularTags</Text>
		</div>
	)
}

export default PopularTags
