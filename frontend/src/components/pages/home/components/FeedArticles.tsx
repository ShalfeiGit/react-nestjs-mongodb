// import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, Divider, Space, Typography, Pagination, Image } from 'antd'


import '@app/pages/home/components/feedArticles.scss'
import { RootState, useAppDispatch } from '@app/store/store'
import { IUserInfo } from '@app/store/slices/userInfo'

const {Title, Text, Link} = Typography

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
	<Space>
		{React.createElement(icon)}
		{text}
	</Space>
)

interface IFeedArticle {
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
	feedArticles: IFeedArticle[]
	pagination: IPagination
}

const FeedArticles: React.FC<IProps> = ({feedArticles, pagination}) => {
	const [currentPage, setCurrentPage] = useState(pagination.currentPage)
	const dispatch = useAppDispatch()
	const userinfo = useSelector((state: RootState) => state.userInfo.data as IUserInfo)

	const handlePaginationFeeds = (page) => {
		console.log(page)
		setCurrentPage(page)
	}

	return (
		<div className='feed-articles'>
			{feedArticles.map((feedArticle, i) => (
				<div key={i} className='feed-articles__item'>
					<div className='feed-articles__header'>
						<div><Avatar shape="circle" src={<Image preview={false} src={feedArticle.authorAvatar}/>} /></div>
						<div className='feed-articles__header-content'>
							<NavLink to={userinfo ? '/userinfo/Valentin' : '/'}  >
								{feedArticle.authorName}
							</NavLink>
							<Text type="secondary">{feedArticle.createdAt}</Text>
						</div>
					</div>
					<Title level={4}>{feedArticle.title}</Title>
					<Text>{feedArticle.content.map((text, i) => <p className='feed-articles__text' key={i}>{text}</p>)}</Text>
					<Divider />
				</div>
			))}
			<Pagination simple current={currentPage} pageSize={pagination.itemsPerPage} total={pagination.totalItems} onChange={handlePaginationFeeds}/>
		</div>
	)}

export default FeedArticles