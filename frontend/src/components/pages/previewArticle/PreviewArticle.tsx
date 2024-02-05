import React, { useEffect } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { Input, Typography, Avatar, Image, Row, Col } from 'antd'
import { useParams, NavLink } from 'react-router-dom'
const {Text, Title} = Typography

import '@app/pages/previewArticle/previewArticle.scss'
import { RootState, useAppDispatch } from '@app/store/store'
import {
	loadTagOptionsAction,
	loadArticleAction,
	IArticle,
} from '@app/store/slices/article'
import Paragraph from 'antd/es/typography/Paragraph'

const { TextArea } = Input

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 4 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 }
	}
}

const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0
		},
		sm: {
			span: 16,
			offset: 4
		}
	}
}

const PreviewArticle: React.FC = () => {
	const dispatch = useAppDispatch()
	const article = useSelector((state: RootState) => state.article.data as IArticle)
	const { slug } = useParams()

	useEffect(() => {
		if (slug) {
			dispatch(loadArticleAction({ articleId: slug }))
		}
	}, [])

	return (
		<div className="preview-article">
			<Row justify="start">
				<Col span={6}></Col>
				<Col span={12}>
					<div className="preview-article__meta">
						<div  className="preview-article__meta-block">
							<div className="preview-article__avatar">
								<Avatar shape="circle" src={article?.user?.avatarUrl ? `http://localhost:3000${article?.user?.avatarUrl}` : `https://api.dicebear.com/7.x/miniavs/svg?seed=${article?.user?.id}`} />
							</div>
						</div>
						<div  className="preview-article__meta-block">
							<div className="preview-article__author">
								<NavLink to={`/userinfo/${article?.user?.username}`}>
									{article?.user?.username}
								</NavLink>
							</div>
							<Text type="secondary">
								Date: {`${moment(article?.updatedAt ?? article?.createdAt).format('MMMM DD YYYY')}`},
							</Text>
							<Text type="secondary">{' '}Tag: {article?.tag}</Text> 
						</div>
					</div>
					<div className="preview-article__title">
						<Title>{article?.title}</Title>
					</div>
					<div className="preview-article__content">
						{(article?.content ?? []).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
					</div>
				</Col>
				<Col span={6}></Col>
			</Row>

			
		</div>
	)
}

export default PreviewArticle
