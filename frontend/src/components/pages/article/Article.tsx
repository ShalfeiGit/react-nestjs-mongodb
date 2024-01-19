import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, Typography, InputNumber, Select, Flex } from 'antd'
import { useOutletContext, useNavigate, useParams } from 'react-router-dom'

import '@app/pages/userInfo/userInfo.scss'
import { RootState, useAppDispatch } from '@app/store/store'
import { loadTagOptionsAction, loadArticleAction, createArticleAction, deleteArticleAction, ITagOption } from '@app/store/slices/article'

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
	const openNotification = useOutletContext()
	const [form] = Form.useForm()
	const navigate = useNavigate()
	const {slug} = useParams()
	const [editArticle, setEditArticle] = useState(false)

	useEffect(() => {
		dispatch(loadTagOptionsAction())
		if(slug !== 'add'){
			dispatch(loadArticleAction({id:slug}))
		}
	}, [])

	const handleSubmitForm = () => {
		form.validateFields().then((values) => {
			dispatch(createArticleAction({...values, openNotification, navigate }))
		})
	}

	const handleDeleteArticle = () => {
		dispatch(deleteArticleAction({navigate, id: slug}))
	}
	const handleEditArticle = () => {
		setEditArticle(true)
	}

	return (
		<div className="article">
			<Form
				form={form}
				name="article"
				{...formItemLayout}
				onFinish={handleSubmitForm}
				autoComplete="off"
			>
				<Form.Item 
					label="Title" 
					name="title" 
				>
					<Input />
				</Form.Item>

				<Form.Item 
					label="Tag" 
					name="tag"
				>
					<Select options={tagOptions} />
				</Form.Item>

				<Form.Item 
					label="Content" 
					name="content"
				>
					<TextArea rows={20} />
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Flex gap="small" wrap="wrap">
						{slug === 'add' || editArticle ? (
							<Button type="primary" htmlType="submit">
								Сохранить
							</Button>
						):(
							<>
								<Button type="primary" onClick={handleEditArticle}>
									Редактировать
								</Button>
								<Button danger type="primary"  onClick={handleDeleteArticle}>
									Удалить
								</Button>
							</>
						)}
					</Flex>
				</Form.Item>
			</Form>
		</div>
	)
}

export default Article
