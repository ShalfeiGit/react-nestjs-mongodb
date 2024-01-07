import React from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, Typography, InputNumber, Select, Flex } from 'antd'
import { useOutletContext, useNavigate } from 'react-router-dom'

import '@app/pages/userInfo/userInfo.scss'
import { RootState, useAppDispatch } from '@app/store/store'

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
	// const article = useSelector((state: RootState) => state.article.data as IArticle)
	const openNotification = useOutletContext()
	const [form] = Form.useForm()
	const navigate = useNavigate()

	const handleSubmitForm = () => {
		form.validateFields().then((values) => {
			// dispatch()
		})
	}
	
	const genderOptions =[
		{label: 'male', value: 'male'},
		{label: 'female', value: 'female'},
		{label: 'others', value: 'others'}
	]

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
					<Select options={genderOptions} />
				</Form.Item>

				<Form.Item 
					label="Content" 
					name="content"
				>
					<TextArea rows={20} />
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Flex gap="small" wrap="wrap">
						<Button type="primary" htmlType="submit">
							Удалить
						</Button>
						<Button type="primary" htmlType="submit">
							Редактировать
						</Button>
						<Button type="primary" htmlType="submit">
							Сохранить
						</Button>
					</Flex>
				</Form.Item>
			</Form>
		</div>
	)
}

export default Article
