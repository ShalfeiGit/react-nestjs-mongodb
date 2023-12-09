import React from 'react'
import { NavLink } from 'react-router-dom'
import { Form, Input, Button, Typography } from 'antd'

import '@app/pages/signin/signin.scss'

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

const SignIn: React.FC = () => {

	const handleSubmitForm = () => {

	}

	return (
		<div className='signin'>
			<Title level={1}>Sign In</Title>
			<NavLink 
				to={'signup'}
				className={'signin__link-title'}
			>Need an account?</NavLink>
			<Form
				name="signin"
				labelCol={{ span: 8 }}
				{...formItemLayout}
				initialValues={{ remember: true }}
				onFinish={handleSubmitForm}
				autoComplete="off"
			>
				<Form.Item
					label="Username"
					name="username"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input placeholder='Input username'/>
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[{ required: true, message: 'Please input your password!' }]}
				>
					<Input.Password placeholder='Input password'/>
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	)}

export default SignIn
