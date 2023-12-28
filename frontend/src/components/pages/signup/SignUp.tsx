import React from 'react'
import { NavLink } from 'react-router-dom'
import { Form, Input, Button, Typography } from 'antd'
import { useOutletContext, useNavigate } from 'react-router-dom'

import '@app/pages/signUp/signUp.scss'
import { useAppDispatch } from '@app/store/store'
import { signUpAction } from '@app/store/slices/userInfo'

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
	const dispatch = useAppDispatch()
	const openNotification = useOutletContext()
	const [form] = Form.useForm()
	const navigate = useNavigate()
	const handleSubmitForm = () => {
		form.validateFields().then((values) => {
			const {repeatPassword, ...data} = values
			dispatch(signUpAction({...data, openNotification, navigate }))
		})
	}

	const handleUsernameValidator = (rule: { required: boolean }, value: string) => {
		if(rule?.required && (!value || !value.trim())){
			return Promise.reject(new Error('Field must not be empty'))
		}
		if(value.length < 6){
			return Promise.reject(new Error('Username length must be longer than 6 characters'))
		}
		if(value.search(/^[a-zA-Z0-9]+$/)){
			return Promise.reject(new Error('Incorrect login. Use characters a-z, A-Z, 0-9'))
		}
		return Promise.resolve()
	}

	const handleEmailValidator = (rule: { required: boolean }, value: string) => {
		if(rule?.required && (!value || !value.trim())){
			return Promise.reject(new Error('Field must not be empty'))
		}
		if(value.length < 6){
			return Promise.reject(new Error('Email length must be longer than 6 characters'))
		}
		if(value.search(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
			return Promise.reject(new Error('Incorrect email. Example correct email: test@gmail.com'))
		}
		return Promise.resolve()
	}

	const handlePasswordValidator = (rule: { required: boolean }, value: string) => {
		if(rule?.required && (!value || !value.trim())){
			return Promise.reject(new Error('Field must not be empty'))
		}
		if(value.length < 6){
			return Promise.reject(new Error('Password length must be longer than 6 characters'))
		}
		if(value.search(/^[a-zA-Z0-9]+$/)){
			return Promise.reject(new Error('Incorrect password. Use characters a-z, A-Z, 0-9'))
		}
		return Promise.resolve()
	}

	const handleRepeatPasswordValidator = (rule: { required: boolean }, value: string) => {
		if(rule?.required && (!value || !value.trim())){
			return Promise.reject(new Error('Field must not be empty'))
		}
		if(form.getFieldValue('password') !== value){
			return Promise.reject(new Error('Password fields must be the same'))
		}
		return Promise.resolve()
	}

	return (
		<div className="signup">
			<Title className={'signup__text'}>Sign Up</Title>
			<NavLink to={'/signin'} className={'signin__link-title'}>
				Have an account?
			</NavLink>
			<Form
				form={form}
				name="signup"
				{...formItemLayout}
				initialValues={{ remember: true }}
				onFinish={handleSubmitForm}
				autoComplete="off"
			>
				<Form.Item 
					hasFeedback
					label="Username" 
					name="username" 
					validateDebounce={1000}
					rules={[{ required: true, validator:handleUsernameValidator }]}
				>
					<Input placeholder="Input username" />
				</Form.Item>

				<Form.Item 
					hasFeedback
					label="Email" 
					name="email" 
					validateDebounce={1000}
					rules={[{ required: true, validator:handleEmailValidator }]}
				>
					<Input placeholder="Input email" />
				</Form.Item>

				<Form.Item 
					hasFeedback
					label="Password" 
					name="password" 
					validateDebounce={1000}
					rules={[{ required: true, validator: handlePasswordValidator }]}
				>
					<Input.Password placeholder="Input password" autoComplete='on'/>
				</Form.Item>

				<Form.Item 
					hasFeedback
					label="Repeat password" 
					name="repeatPassword"
					validateDebounce={1000}
					rules={[{ required: true, validator: handleRepeatPasswordValidator }]}
				>
					<Input.Password placeholder="Input password" autoComplete='on'/>
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
