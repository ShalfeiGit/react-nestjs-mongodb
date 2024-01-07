import React from 'react'
import moment from 'moment'
import { Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { RootState, useAppDispatch } from '@app/store/store'
import FeedArticles from '@app/pages/home/components/FeedArticles'
import '@app/pages/home/components/feeds.scss'

const Feeds: React.FC = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const feeds = useSelector((state: RootState) => state.feeds.data) // добавить

	const tabs = [{
		tabName:'Global Feed',
		id: '0',
		pagination: {
			totalItems: 4,
			itemsPerPage: 3,
			currentPage: 1,
		},
		feedArticles: Array.from({ length: 3 }).map((article, i) => ({
			articleId: i,
			authorName: 'Valentin',
			authorAvatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
			createdAt: `${moment(Date.now()).format('MMMM DD, YYYY')}`,
			title: 'What is a CV?',
			content: [
				`When applying for certain positions in the U.S., as well as jobs internationally,
			you may be required to submit a curriculum vitae rather than a resume.
			A curriculum vitae, or CV, includes more information than your typical resume,
			including details of your education and academic achievements, research,
			publications, awards, affiliations, and more.`,

				`There are also differences in what is included, and when each document is used.
			In the United States, a curriculum vitae is used when applying for academic,
			education, scientific, or research positions. A curriculum vitae can also be used to
			apply for fellowships or grants. In Europe, the Middle East, Africa, or Asia, employers
			may expect to receive a curriculum vitae rather than a resume.
			A curriculum vitae, commonly referred to as a “CV,” is a longer
			(two or more pages), more detailed synopsis than a resume.`,

				`In the United States, a curriculum vitae is used when applying for academic,
			education, scientific, or research positions. A curriculum vitae can also be
			used to apply for fellowships or grants. In Europe, the Middle East, Africa,
			or Asia, employers may expect to receive a curriculum vitae rather than a resume.
			A curriculum vitae, commonly referred to as a “CV,” is a longer (two or more pages),
			more detailed synopsis than a resume. There are also differences in what is included,
			and when each document is used.`
			],
			likes: 157,
			liked: true
		}))
	},
	{
		tabName:'Your Feed',
		id: '1',
		pagination: {
			totalItems: 4,
			itemsPerPage: 3,
			currentPage: 1,
		},
		feedArticles: Array.from({ length: 3 }).map((article, i) => ({
			articleId: i,
			authorName: 'Valentin',
			authorAvatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
			createdAt: `${moment(Date.now()).format('MMMM DD, YYYY')}`,
			title: 'What is a CV?',
			content: [
				`When applying for certain positions in the U.S., as well as jobs internationally,
			you may be required to submit a curriculum vitae rather than a resume.
			A curriculum vitae, or CV, includes more information than your typical resume,
			including details of your education and academic achievements, research,
			publications, awards, affiliations, and more.`,

				`There are also differences in what is included, and when each document is used.
			In the United States, a curriculum vitae is used when applying for academic,
			education, scientific, or research positions. A curriculum vitae can also be used to
			apply for fellowships or grants. In Europe, the Middle East, Africa, or Asia, employers
			may expect to receive a curriculum vitae rather than a resume.
			A curriculum vitae, commonly referred to as a “CV,” is a longer
			(two or more pages), more detailed synopsis than a resume.`,

				`In the United States, a curriculum vitae is used when applying for academic,
			education, scientific, or research positions. A curriculum vitae can also be
			used to apply for fellowships or grants. In Europe, the Middle East, Africa,
			or Asia, employers may expect to receive a curriculum vitae rather than a resume.
			A curriculum vitae, commonly referred to as a “CV,” is a longer (two or more pages),
			more detailed synopsis than a resume. There are also differences in what is included,
			and when each document is used.`
			],
			likes: 13,
			liked: false
		}))
	}]

	return (
		<Tabs
			defaultActiveKey="0"
			style={{ height: 220 }}
			items={tabs.map((tab) => {
				const {tabName, feedArticles, id, pagination } = tab
				return {
					label: tabName,
					key: id,
					children: <FeedArticles feedArticles={feedArticles} pagination={pagination}/>,
				}
			})}
		/>
	)
}

export default Feeds

