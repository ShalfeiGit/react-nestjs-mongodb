import React, { useEffect }from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Form, Input, Button, Typography, InputNumber, Select, Flex, Tabs, TabsProps } from 'antd'
import { useOutletContext, useNavigate } from 'react-router-dom'

import { RootState, useAppDispatch } from '@app/store/store'
import { updateUserInfoAction, IUserInfo } from '@app/store/slices/userInfo'
import { getOtherAuthorInfoAction, IOtherAuthorInfo } from '@app/store/slices/otherAuthorInfo'
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

const UserContent: React.FC = () => {
	const dispatch = useAppDispatch()
	const userInfo = useSelector((state: RootState) => state.userInfo.data as IUserInfo)
	const otherAuthorInfo = useSelector((state: RootState) => state.otherAuthorInfo.data as IOtherAuthorInfo)
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
		if(!userInfo?.username){
			navigate('/')
		} else {
			dispatch(getOtherAuthorInfoAction({username}))
		}
	}, [])

	useEffect(() => {
		form.resetFields()
	}, [username])

	useEffect(() => {
		form.setFieldsValue(userInfo?.username === username ? userInfo : otherAuthorInfo )
	}, [userInfo, otherAuthorInfo])

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
					label="Email" 
					name="email" 
					validateDebounce={1000}
					rules={[{ required: true, validator:handleEmailValidator }]}
					initialValue={userInfo?.email}
				>
					<Input disabled={username && userInfo?.username !== username} />
				</Form.Item>

				<Form.Item 
					label="Bio" 
					name="bio"
					initialValue={userInfo?.bio}
				>
					<TextArea disabled={username && userInfo?.username !== username} placeholder="Input bio" />
				</Form.Item>

				<Form.Item 
					label="Age" 
					name="age" 
					initialValue={userInfo?.age}
				>
					<InputNumber disabled={username && userInfo?.username !== username} placeholder="Input age" />
				</Form.Item>

				<Form.Item 
					label="Gender" 
					name="gender"
					initialValue={userInfo?.gender}
				>
					<Select disabled={username && userInfo?.username !== username} options={genderOptions} />
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					<Flex gap="small" wrap="wrap">
						{username && userInfo?.username === username	
							? (<>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
								<Button type="primary" ghost onClick={handleLogOutUser}>
									Log Out
								</Button>
								<Button type="primary" danger onClick={handleDeleteUser}>
									Delete
								</Button>
							</>) : null}
					</Flex>
				</Form.Item>
			</Form>
		</div>
	)
}

export default UserContent
