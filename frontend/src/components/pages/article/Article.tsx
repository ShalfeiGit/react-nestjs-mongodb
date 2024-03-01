import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, Typography, Select, Flex, Popconfirm } from 'antd'
import { useOutletContext, useNavigate, useParams } from 'react-router-dom'

import '@app/pages/userInfo/userInfo.scss'
import { RootState, useAppDispatch } from '@app/store/store'
import {
	loadTagOptionsAction,
	loadArticleAction,
	createArticleAction,
	updateArticleAction,
} from '@app/store/slices/article'
import { INotificationAction } from '@app/shared/layout/types'

const { TextArea } = Input
const { Title } = Typography

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

const Article: React.FC = () => {
	const dispatch = useAppDispatch()
	const tagOptions = useSelector((state: RootState) => state.article.tags)
	const article = useSelector((state: RootState) => state.article.data)
	const userInfo = useSelector((state: RootState) => state.userInfo.data)
	const openNotification = useOutletContext<INotificationAction['openNotification']>()
	const [form] = Form.useForm()
	const navigate = useNavigate()
	const { slug } = useParams()

	useEffect(() => {
		dispatch(loadTagOptionsAction())
		if (slug) {
			dispatch(loadArticleAction({ articleId: slug }))
		}
	}, [])

	useEffect(() => {
		if (article && slug) {
			form.setFieldsValue({ ...article })
		}
	}, [article])


	const handleRedirectToListArticle = () => {
		navigate(`/userinfo/${userInfo?.username}?tab=articles-content`)
	}

	const handleSaveArticle = () => {
		form.validateFields().then((values) => {
			if(slug){
				dispatch(
					updateArticleAction({
						articleId: slug,
						title: values?.title,
						content: values?.content,
						tag: values?.tag,
						username: userInfo?.username,
						navigate,
						openNotification,
					})
				)
			} else{
				dispatch(createArticleAction({ 
					title: values?.title,
					content: (values?.content ?? ''),
					tag: values?.tag,
					username: userInfo?.username,
					openNotification,
					navigate}))
			}
		})
	}

	const handleTitleValidator = (rule: { required: boolean }, value: string) => {
		if (!value || !value.trim()) {
			return Promise.reject(new Error('Field must not be empty'))
		}
		if (value.length < 6) {
			return Promise.reject(new Error('Title length must be longer than 6 characters'))
		}
		return Promise.resolve()
	}

	const handleTagValidator = (rule: { required: boolean }, value: string) => {
		if (!value || !value.trim()) {
			return Promise.reject(new Error('Field must not be empty'))
		}
		return Promise.resolve()
	}

	const handleContentValidator = (rule: { required: boolean }, value: string) => {
		if (!value || Array.isArray(value) && value.length === 0 || typeof value === 'string'  && !value.trim()) {
			return Promise.reject(new Error('Field must not be empty'))
		}
		return Promise.resolve()
	}

	return (
		<div className="article">
			<Form form={form} name="article" {...formItemLayout} autoComplete="off">
				<Form.Item label="Title" name="title" rules={[{ validator: handleTitleValidator }]}>
					<Input />
				</Form.Item>

				<Form.Item label="Tag" name="tag" rules={[{ validator: handleTagValidator }]}>
					<Select options={tagOptions} />
				</Form.Item>

				<Form.Item label="Content" name="content" rules={[{ validator: handleContentValidator }]}>
					<TextArea rows={20} style={{whiteSpace: 'pre-line'}}/>
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Flex gap="small" wrap="wrap">
						<Popconfirm
							title="Cохранить статью"
							description="Вы уверены что хотите сохранить статью?"
							onConfirm={handleSaveArticle}
							onCancel={handleRedirectToListArticle}
							okText="Да"
							cancelText="Нет"
						>
							<Button  type="primary">
								Сохранить
							</Button>
						</Popconfirm>
					</Flex>
				</Form.Item>
			</Form>
		</div>
	)
}

export default Article
