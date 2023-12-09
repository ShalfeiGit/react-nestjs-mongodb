import React from 'react'
import { Form, Input, Button, Typography } from 'antd'

import '@app/pages/register/register.scss'

const {Title} = Typography


const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 4 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
}

const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 16,
			offset: 4,
		},
	},
}

const Register: React.FC = () => {

	const handleSubmitForm = () => {

	}

	return (
		<div className='register'>
			<Title style={{padding: 30}}>Registration</Title>
			<Form
				name="register"
				{...formItemLayout}
				style={{width: '100%', maxWidth:800}}
				initialValues={{ remember: true }}
				onFinish={handleSubmitForm}
				autoComplete="off"
			>
				<Form.Item
					label="Username"
					name="username"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[{ required: true, message: 'Please input your password!' }]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item {...tailFormItemLayout} >
					<Button type="primary" htmlType="submit">
					Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	)}

export default Register
