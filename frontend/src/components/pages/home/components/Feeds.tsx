import React from 'react'
import { List, Tabs } from 'antd'

import FeedArticles from '@app/pages/home/components/FeedArticles'
import '@app/pages/home/components/feeds.scss'

const Feeds: React.FC = () => {
	const data = Array.from({ length: 23 }).map((_, i) => ({
		href: 'https://ant.design',
		title: `ant design part ${i}`,
		avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
		description:
			'Ant Design, a design language for background applications, is refined by Ant UED Team.',
		content:
			'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
	}))

	// const tabs = [{
	// 	tabName:'Global Feed',
	// 	id: '0',
	// 	feedArticles: [
	// 		{
	// 			authorName: null,
	// 			authorAvatar: null,
	// 			createdAt: null,
	// 			title : null,
	// 			content : null,
	// 			likes: null,
	// 			liked: false
	// 		},
	// 		{
	// 			authorName: null,
	// 			authorAvatar: null,
	// 			createdAt: null,
	// 			title : null,
	// 			content : null,
	// 			likes: null,
	// 			liked: false
	// 		},
	// 		{
	// 			authorName: null,
	// 			authorAvatar: null,
	// 			createdAt: null,
	// 			title : null,
	// 			content : null,
	// 			likes: null,
	// 			liked: false
	// 		},
	// 		{
	// 			authorName: null,
	// 			authorAvatar: null,
	// 			createdAt: null,
	// 			title : null,
	// 			content : null,
	// 			likes: null,
	// 			liked: false
	// 		}
	// 	]
	// },
	// {
	// 	tabName:'Your Feed',
	// 	id: '1',
	// 	articles: Array.from({ length: 4 }).map((article, i) => ({
	// 		authorName: `Username_${i}`,
	// 		authorAvatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
	// 		createdAt: `${new Date(Date.now())})`,
	// 		title : null,
	// 		content : null,
	// 		likes: null,
	// 		liked: false
	// 	}))
	// }]


	const tabs = [{
		tabName:'Global Feed',
		id: '0',
		feedArticles: [
			{
				authorName: null,
				authorAvatar: null,
				createdAt: null,
				title : null,
				content : null,
				likes: null,
				liked: false
			},
			{
				authorName: null,
				authorAvatar: null,
				createdAt: null,
				title : null,
				content : null,
				likes: null,
				liked: false
			},
			{
				authorName: null,
				authorAvatar: null,
				createdAt: null,
				title : null,
				content : null,
				likes: null,
				liked: false
			},
			{
				authorName: null,
				authorAvatar: null,
				createdAt: null,
				title : null,
				content : null,
				likes: null,
				liked: false
			}
		]
	},
	{
		tabName:'Your Feed',
		id: '1',
		articles: [
			{
				authorName: null,
				authorAvatar: null,
				createdAt: null,
				title : null,
				content : null,
				likes: null,
				liked: false
			},
			{
				authorName: null,
				authorAvatar: null,
				createdAt: null,
				title : null,
				content : null,
				likes: null,
				liked: false
			},
			{
				authorName: null,
				authorAvatar: null,
				createdAt: null,
				title : null,
				content : null,
				likes: null,
				liked: false
			},
			{
				authorName: null,
				authorAvatar: null,
				createdAt: null,
				title : null,
				content : null,
				likes: null,
				liked: false
			}
		]
	}]

	return (
		<Tabs
			defaultActiveKey="0"
			style={{ height: 220 }}
			items={tabs.map((tab) => {
				const {tabName, feedArticles, id } = tab
				return {
					label: tabName,
					key: id,
					children: <FeedArticles feedArticles={feedArticles}/>,
				}
			})}
		/>
	)
}

export default Feeds

