import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Typography } from 'antd'

import { RootState, useAppDispatch } from '@app/store/store'
import '@app/pages/home/components/popularTags.scss'
import { loadAllArticlesAction, loadGroupArticlesAction, loadTagOptionsAction, removeGroupArticlesAction } from '@app/store/slices/article'

const { Text, Title } = Typography

interface IPopularTags {
	page: number;
	limit: number;
}

const PopularTags: React.FC<IPopularTags> = ({page, limit}) => {
	const dispatch = useAppDispatch()
	const tagOptions = useSelector((state: RootState) => state.article.tags)
	const groupArticles = useSelector((state: RootState) => state.article.groupArticles)
	const userId = useSelector((state: RootState) => state.userInfo?.data?.id)

	useEffect(() => {
		dispatch(loadTagOptionsAction())
		dispatch(loadAllArticlesAction({page, limit}))
	}, [])

	const navigate = useNavigate()
	const popularTags = (tagOptions ?? []).map(tagOption => ({
		tag: tagOption.value, 
		title: tagOption.label,
	}))
	
	const handleSelectTag = (tag) => () => {
		groupArticles.some(groupArticle => groupArticle.tag === tag) 
			? dispatch(removeGroupArticlesAction({tag})) 
			: dispatch(loadGroupArticlesAction({tag, page, limit}))
	}

	return (
		<div className="popular-tags">
			<div className="popular-tags__header">
				<Title level={4}>Popular Tags</Title>
			</div>
			<div className="popular-tags__content">
				{popularTags.map(({tag, title}, i) => 
					(<Button 
						danger={(groupArticles ?? []).some(groupArticle => groupArticle.tag === tag)} 
						className="popular-tags__tag" 
						key={i} 
						onClick={handleSelectTag(tag)}
					>
						{title}
					</Button>)
				)}
			</div>
		</div>
	)
}

export default PopularTags
