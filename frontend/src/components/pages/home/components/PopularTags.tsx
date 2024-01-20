import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Typography } from 'antd'

import { RootState, useAppDispatch } from '@app/store/store'
import '@app/pages/home/components/popularTags.scss'
import { loadTagOptionsAction } from '@app/store/slices/article'

const { Text, Title } = Typography

const PopularTags: React.FC = () => {
	const dispatch = useAppDispatch()
	const tagOptions = useSelector((state: RootState) => state.article.tags)
	useEffect(() => {
		dispatch(loadTagOptionsAction())
	}, [])

	const navigate = useNavigate()
	const popularTags = (tagOptions ?? []).map(tagOption => ({
		tagId: tagOption.value, 
		title: tagOption.label,
	}))
	
	const handleClickTag = (tagId) => () => {
	}
	return (
		<div className="popular-tags">
			<div className="popular-tags__header">
				<Title level={4}>Popular Tags</Title>
			</div>
			<div className="popular-tags__content">
				{popularTags.map(({tagId, title}, i) => 
					(<div className="popular-tags__tag" key={i} onClick={handleClickTag(tagId)}>
						{title}
					</div>)
				)}
			</div>
		</div>
	)
}

export default PopularTags
