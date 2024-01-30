import React, {useEffect, useState} from 'react'
import moment from 'moment'
import { Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { RootState, useAppDispatch } from '@app/store/store'
import FeedArticles from '@app/pages/home/components/FeedArticles'
import '@app/pages/home/components/feeds.scss'
import { IUserInfo } from '@app/store/slices/userInfo'
import { IArticle, IGroupArticle, IUserArticle } from '@app/store/slices/article'

export interface IFeedArticle {
	articleId: number;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  title: string;
  content: string[];
  likes: number;
  liked: boolean;
}

export interface IFeedPagination {
	totalItems: number;
  itemsPerPage: number;
  currentPage: number;	
}
export interface IFeedTab {
	tabName: string;
	id: string;
	pagination: IFeedPagination;
	feedArticles: IFeedArticle[];
}

const Feeds: React.FC = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const groupArticles = useSelector<RootState, IGroupArticle<IArticle>[]>((state) => state.article.groupArticles)
	const [activeKey, setActiveKey] = useState('global')
	const currentTabs: IFeedTab[] = (groupArticles ?? []).map((groupArticle) => ({
		tabName:`${groupArticle.tag.charAt(0).toUpperCase()}${groupArticle.tag.substring(1)} Feed`,
		id: `${groupArticle.tag}`,
		pagination: {
			totalItems: groupArticle.articles?.meta?.totalItems ?? 0,
			itemsPerPage: groupArticle.articles?.meta?.itemsPerPage ?? 10,
			currentPage: groupArticle.articles?.meta?.currentPage ?? 1,
		},
		feedArticles: (groupArticle.articles?.items ?? []).map((article, i) => ({
			articleId: article?.id,
			authorName: article?.user?.username,
			authorAvatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
			createdAt: `${moment(article?.updatedAt ? Number(article?.updatedAt): Number( article?.createdAt)).format('MMMM DD YYYY')}`,
			title: article?.title,
			content: article?.content,
			likes: article?.likes,
			liked: false,
		}))
	})).sort(first => first?.id === 'global' ? -1 : 1)
	return (
		<Tabs
			accessKey={activeKey}
			style={{ height: 220 }}
			items={currentTabs.map((tab) => {
				const {tabName, feedArticles, id, pagination } = tab
				return {
					label: tabName,
					key: id,
					children: <FeedArticles feedArticles={feedArticles} pagination={pagination} tag={id}/>,
				}
			})}
			onChange={(key) => {
				setActiveKey(key)
			}}
		/>
	)
}

export default Feeds

