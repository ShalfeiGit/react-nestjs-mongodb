import React, { useEffect }from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Form, Input, Button, Typography, InputNumber, Select, Flex } from 'antd'
import { useOutletContext, useNavigate } from 'react-router-dom'

import '@app/pages/userInfo/userInfo.scss'
import { RootState, useAppDispatch } from '@app/store/store'
import { updateUserInfoAction, getUserInfoAction, IUserInfo } from '@app/store/slices/userInfo'
import { resetUserInfoAction, deleteUserInfoAction } from '@app/store/slices/userInfo'

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

const UserInfo: React.FC = () => {
	const dispatch = useAppDispatch()
	const data = useSelector((state: RootState) => state.userInfo.data as IUserInfo)
	const { username } = useParams()
	const openNotification = useOutletContext()
	const [form] = Form.useForm()
	const navigate = useNavigate()

	const handleSubmitForm = () => {
		form.validateFields().then((values) => {
			dispatch(updateUserInfoAction({...values, openNotification, navigate }))
		})
	}

	useEffect(() => {
		dispatch(getUserInfoAction({username}))
	}, [])

	useEffect(() => {
		form.setFieldsValue(data)
	}, [data])

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

	const genderOptions =[
		{label: 'male', value: 'male'},
		{label: 'female', value: 'female'},
		{label: 'others', value: 'others'}
	]

	const handleLogOutUser = () => {
		localStorage.clear()
		dispatch(resetUserInfoAction({navigate}))
	}

	const handleDeleteUser = () => {
		localStorage.clear()
		dispatch(deleteUserInfoAction({navigate, username}))
	}

	return (
		<div className="user-info">
			<Title className={'user-info__text'}>User Info</Title>
			<Form
				form={form}
				name="user-info"
				{...formItemLayout}
				initialValues={{ remember: true }}
				onFinish={handleSubmitForm}
				autoComplete="off"
			>
				<Form.Item 
					label="Username" 
					name="username" 
					initialValue={username}
				>
					<Input disabled />
				</Form.Item>

				<Form.Item 
					hasFeedback
					label="Email" 
					name="email" 
					validateDebounce={1000}
					rules={[{ required: true, validator:handleEmailValidator }]}
					initialValue={data?.email}
				>
					<Input />
				</Form.Item>

				<Form.Item 
					label="Bio" 
					name="bio"
					initialValue={data?.bio}
				>
					<TextArea placeholder="Input bio" />
				</Form.Item>

				<Form.Item 
					label="Age" 
					name="age" 
					initialValue={data?.age}
				>
					<InputNumber placeholder="Input age" />
				</Form.Item>

				<Form.Item 
					label="Gender" 
					name="gender"
					initialValue={data?.gender}
				>
					<Select options={genderOptions} />
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					<Flex gap="small" wrap="wrap">
						<Button type="primary" htmlType="submit">
						Submit
						</Button>
						<Button type="primary" ghost onClick={handleLogOutUser}>
     				 Log Out
    			</Button>
						<Button type="primary" danger onClick={handleDeleteUser}>
     				 Delete
    			</Button>
					</Flex>
				</Form.Item>
			</Form>
		</div>
	)
}

export default UserInfo
