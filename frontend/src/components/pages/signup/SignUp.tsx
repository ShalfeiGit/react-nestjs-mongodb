import React from 'react'
import { NavLink } from 'react-router-dom'
import { Form, Input, Button, Typography } from 'antd'

import makeRequest from '@app/api/api'
import '@app/pages/signup/signup.scss'

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

const SignUp: React.FC = () => {
	const handleSubmitForm = () => {
		makeRequest({
			method: 'get',
			url: 'login'
		})
	}

	return (
		<div className="signup">
			<Title className={'signup__text'}>Sign Up</Title>
			<NavLink to={'signup'} className={'signin__link-title'}>
				Have an account?
			</NavLink>
			<Form
				name="signup"
				{...formItemLayout}
				initialValues={{ remember: true }}
				onFinish={handleSubmitForm}
				autoComplete="off"
			>
				<Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please, input username' }]}>
					<Input placeholder="Input username" />
				</Form.Item>

				<Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please, input email' }]}>
					<Input placeholder="Input email" />
				</Form.Item>

				<Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please, input password' }]}>
					<Input.Password placeholder="Input password" />
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default SignUp
