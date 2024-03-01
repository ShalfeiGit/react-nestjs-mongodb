// import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, Divider, Space, Typography, Pagination, Image, Button } from 'antd'
import { StarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { RootState, useAppDispatch } from '@app/store/store'
import { IUserInfo } from '@app/store/slices/userInfo'
import '@app/pages/home/components/feedArticles.scss'
import { likeArticleAction, loadAllArticlesAction, loadGroupArticlesAction } from '@app/store/slices/article'

const {Title, Text, Link} = Typography

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
	<Space>
		{React.createElement(icon)}
		{text}
	</Space>
)

interface IFeedArticle {
	articleId: number;
	authorName: string;
	authorAvatar: string;
	authorId: number
	createdAt: string;
	title: string;
	content: string;
	likes: number;
	liked: boolean;
}

interface IPagination {
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
}

interface IProps {
	feedArticles: IFeedArticle[],
	tag: string,
	pagination: IPagination
}

const FeedArticles: React.FC<IProps> = ({feedArticles, pagination, tag}) => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const userInfo = useSelector((state: RootState) => state.userInfo.data)

	const handlePaginationFeeds = (page) => {
		dispatch(tag === 'global'
			? loadAllArticlesAction({page, limit: pagination.itemsPerPage}) 
			: loadGroupArticlesAction({tag, page, limit: pagination.itemsPerPage}))
	}
	const handleReadArticle = (slug) => () => {
		navigate(`/article/preview/${slug}`)
	}
	const handleLikeArticle = (feedArticle) => () => {
		if(!userInfo) return
		const likes = (userInfo.likedArticle ?? []).some(article => `${article.id}` === `${feedArticle?.articleId}`) 
			? feedArticle?.likes - 1
			: feedArticle?.likes + 1
		dispatch(likeArticleAction({
			username: userInfo?.username,
			articleId: feedArticle?.articleId,
			likes,
			tag,
			page: pagination.currentPage,
			limit: pagination.itemsPerPage}))
	}

	return (
		<div className='feed-articles'>
			{feedArticles.map((feedArticle, i) => (
				<div key={i} className='feed-articles__item'>
					<div className='feed-articles__header'>
						<div className='feed-articles__userinfo'>
							<div><Avatar shape="circle" src={feedArticle?.authorAvatar ? `http://localhost:3000${feedArticle?.authorAvatar}` : `https://api.dicebear.com/7.x/miniavs/svg?seed=${feedArticle?.authorId}`} /></div>
							<div className='feed-articles__userinfo-content'>
								<NavLink to={`/userinfo/${feedArticle.authorName}`}  >
									{feedArticle.authorName}
								</NavLink>
								<Text type="secondary">Date: {feedArticle?.createdAt}</Text>
							</div>
						</div>
						<Button disabled={!userInfo} onClick={handleLikeArticle(feedArticle)}>
							<span className={`feed-articles__stars${feedArticle.liked ? '_liked' : '' }`}>
								<IconText icon={StarOutlined} text={`${feedArticle.likes}`} key="list-vertical-star-o" />
							</span>
						</Button>
					</div>
					<Title level={4}>{feedArticle.title}</Title>
					<div className='feed-articles__article'>
						<div className='feed-articles__article_gradient' />
						<Text>{feedArticle.content.split('\n').map((text, i) => <p className='feed-articles__article_text' key={i}>{text}</p>)}</Text>
					</div>
					<Button className='feed-articles__read-more' type="text" onClick={handleReadArticle(feedArticle.articleId)}>
						Read more...
					</Button>
					<Divider />
				</div>
			))}
			<div className='feed-articles__pagination'>
				{feedArticles.length > 0 ? (
					<Pagination current={pagination.currentPage} onChange={handlePaginationFeeds} total={pagination.totalItems} />
				) : (
					<div className='feed-articles__item'>
						<Title level={4}>Не найдены статьи по данной тематике</Title>
					</div>
				)}
			</div>
		</div>
	)}

export default FeedArticles