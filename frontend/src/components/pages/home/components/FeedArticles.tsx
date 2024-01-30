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
import { loadAllArticlesAction, loadGroupArticlesAction } from '@app/store/slices/article'

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
	createdAt: string;
	title: string;
	content: string[];
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

	const handlePaginationFeeds = (page) => {
		dispatch(tag === 'global'
			? loadAllArticlesAction({page, limit: pagination.itemsPerPage}) 
			: loadGroupArticlesAction({tag, page, limit: pagination.itemsPerPage}))
	}
	const handleReadArticle = (slug) => () => {
		navigate(`/article/preview/${slug}`)
	}

	return (
		<div className='feed-articles'>
			{feedArticles.map((feedArticle, i) => (
				<div key={i} className='feed-articles__item'>
					<div className='feed-articles__header'>
						<div className='feed-articles__userinfo'>
							<div><Avatar shape="circle" src={<Image preview={false} src={feedArticle.authorAvatar}/>} /></div>
							<div className='feed-articles__userinfo-content'>
								<NavLink to={`/userinfo/${feedArticle.authorName}`}  >
									{feedArticle.authorName}
								</NavLink>
								<Text type="secondary">Date: {feedArticle?.createdAt}</Text>
							</div>
						</div>
						<div className='feed-articles__grade'>
							<span className={`feed-articles__stars${feedArticle.liked ? '_liked' : '' }`} onClick={() => {}}>
								<IconText icon={StarOutlined} text={`${feedArticle.likes}`} key="list-vertical-star-o" />
							</span>
						</div>
					</div>
					<Title level={4}>{feedArticle.title}</Title>
					<div className='feed-articles__article'>
						<div className='feed-articles__article_gradient' />
						<Text>{feedArticle.content.map((text, i) => <p className='feed-articles__article_text' key={i}>{text}</p>)}</Text>
					</div>
					<Button className='feed-articles__read-more' type="text" onClick={handleReadArticle(feedArticle.articleId)}>
						Read more...
					</Button>
					<Divider />
				</div>
			))}
			<div className='feed-articles__pagination'>
				<Pagination current={pagination.currentPage} onChange={handlePaginationFeeds} total={pagination.totalItems} />
			</div>
		</div>
	)}

export default FeedArticles