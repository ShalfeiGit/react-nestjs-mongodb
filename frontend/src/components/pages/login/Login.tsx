import React from 'react'
import { Form, Input, Button, Typography } from 'antd'

import '@app/pages/login/login.scss'

const {Title} = Typography

const Register: React.FC = () => {

	const handleSubmitForm = () => {

	}

	return (
		<div className='register'>
			<div>
				<Title level={1}>Login</Title>
			</div>
			<Form
				name="basic"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
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

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
					Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	)}

export default Register
