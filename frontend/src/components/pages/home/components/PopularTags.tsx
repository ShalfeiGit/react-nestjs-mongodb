import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Typography } from 'antd'

import { RootState, useAppDispatch } from '@app/store/store'
import '@app/pages/home/components/popularTags.scss'

const { Text, Title } = Typography

const PopularTags: React.FC = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const popularTags = useSelector((state: RootState) => state.popularTags.data) // добавить
	const popular_tags = [
		{
			tagId: 'butt', 
			title: 'butt',
		},
		{
			tagId: 'test', 
			title: 'test',
		},
		{
			tagId: 'dragons', 
			title: 'dragons',
		},
		{
			tagId: 'training', 
			title: 'training',
		},
		{
			tagId: 'tags', 
			title: 'tags',
		},
		{
			tagId: 'as', 
			title: 'as',
		},
		{
			tagId: 'coffee', 
			title: 'coffee',
		},
		{
			tagId: 'animation', 
			title: 'animation',
		},
		{
			tagId: 'baby', 
			title: 'baby',
		},
		{
			tagId: 'flowers', 
			title: 'flowers',
		},
		{
			tagId: 'cars', 
			title: 'cars',
		},
		{
			tagId: 'caramel', 
			title: 'caramel',
		},
		{
			tagId: 'money', 
			title: 'money',
		},
		{
			tagId: 'japan', 
			title: 'japan',
		},
		{
			tagId: 'happiness', 
			title: 'happiness',
		},
		{
			tagId: 'sugar', 
			title: 'sugar',
		},
		{
			tagId: 'clean', 
			title: 'clean',
		},
		{
			tagId: 'sushi', 
			title: 'sushi',
		},
		{
			tagId: 'cookies', 
			title: 'cookies',
		},
		{
			tagId: 'well', 
			title: 'well',
		}
	]
	const handleClickTag = (tagId) => () => {
		console.log(tagId)
	}
	return (
		<div className="popular-tags">
			<div className="popular-tags__header">
				<Title level={4}>Popular Tags</Title>
			</div>
			<div className="popular-tags__content">
				{popular_tags.map(({tagId, title}, i) => 
					(<div className="popular-tags__tag" key={i} onClick={handleClickTag(tagId)}>
						{title}
					</div>)
				)}
			</div>
		</div>
	)
}

export default PopularTags
