import React, { useEffect, useState }from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, Typography, InputNumber, Select, Flex, Popconfirm, Upload, UploadFile, Modal } from 'antd'
import { useOutletContext, useNavigate, useParams } from 'react-router-dom'

import { RootState, useAppDispatch } from '@app/store/store'
import { updateUserInfoAction, IUserInfo, savePreviewUserAvatarAction } from '@app/store/slices/userInfo'
import { getOtherAuthorInfoAction, IOtherAuthorInfo } from '@app/store/slices/otherAuthorInfo'
import { resetUserInfoAction, deleteUserInfoAction, deletePreviewUserAvatarAction } from '@app/store/slices/userInfo'
import { loadUserArticlesAction } from '@app/store/slices/article'
import { PlusOutlined } from '@ant-design/icons'
import { INotification } from '@app/shared/layout/types'

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

// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UserContent: React.FC = () => {
	const dispatch = useAppDispatch()
	const userInfo = useSelector((state: RootState) => state.userInfo.data as IUserInfo)
	const otherAuthorInfo = useSelector((state: RootState) => state.otherAuthorInfo.data as IOtherAuthorInfo)
	const {username} = useParams()
	const openNotification = useOutletContext<(data: INotification) => void>()
	const [form] = Form.useForm()
	const navigate = useNavigate()
	const [uploadOptions, setUploadOptions] = useState({
		title: '',
		image: '',
		open: false,
		showPreview: true,
		fileInfo: null,
		fileList: []
	})



	useEffect(() => {
		form.resetFields()
		if(userInfo?.username !== username){
			dispatch(getOtherAuthorInfoAction({username}))
			dispatch(loadUserArticlesAction({username, page: 1, limit: 10}))
		}
		if(userInfo?.username === username) {
			setUploadOptions({
				...uploadOptions,
				image: `http://localhost:3000${userInfo?.avatarUrl}`,
				showPreview: true,
				fileList: [	{
					uid: `${username}`,
					name: `${userInfo?.avatarUrl}`.replace('/avatars/', ''),
					status: 'done',
					url: `http://localhost:3000${userInfo?.avatarUrl}`,
				}]})
		}
	}, [username])

	useEffect(() => {
		const user = userInfo?.username === username ? userInfo : otherAuthorInfo
		form.setFieldsValue(user)
		if(user?.avatarUrl) {
			setUploadOptions({
				...uploadOptions,
				image: `http://localhost:3000${user?.avatarUrl}`,
				showPreview: true,
				fileList: [	{
					uid: `${username}`,
					name: `${userInfo?.avatarUrl}`.replace('/avatars/', ''),
					status: 'done',
					url: `http://localhost:3000${user?.avatarUrl}`,
				}]})
		}
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

	const handleSubmitForm = () => {
		form.validateFields().then((values) => {
			const formData = new FormData()
			if(uploadOptions.fileInfo){
				formData.append('avatar', uploadOptions.fileInfo?.preview)
				formData.append('ext', uploadOptions.fileInfo?.ext)
				formData.append('avatarDate', uploadOptions.fileInfo?.avatarDate)
				Object.keys(values).map(key => formData.append(key, values[key]))
				dispatch(updateUserInfoAction({...values, formData, openNotification, navigate }))
			}else{
				formData.append('avatarDate', uploadOptions.fileInfo?.avatarDate 
					? uploadOptions.fileInfo.avatarDate 
					: `${userInfo?.avatarUrl}`.replace(`/avatars/${userInfo?.username}-`, '').replace(/\.\w+$/g, ''))
				dispatch(deletePreviewUserAvatarAction({username, formData}))
				Object.keys(values).map(key => formData.append(key, values[key]))
				dispatch(updateUserInfoAction({...values, formData, openNotification, navigate }))
			}
		})
	}

	const handleLogOutUser = () => {
		dispatch(resetUserInfoAction({navigate}))
	}

	const handleDeleteUser = () => {
		dispatch(deleteUserInfoAction({navigate, username}))
	}

	const handleUploadAvatarEvent = async options => {
		const { onSuccess, onError, file } = options
		if(/(jpg|jpeg|png)$/.test(file.name)){
			onSuccess('Ok')
		}else{
			onError({ err: `Unsupported file type ${file.type}` })
		}
	}

	const handleLoadAvatar = async ({ file, fileList, event }) => {
		if(file.status === 'removed') return 
		if(file.status === 'error') return
		const fileMatch = file.name.match(/(jpg|jpeg|png)$/) 
		if(fileMatch){
			const getBase64 = (file): Promise<string> =>
				new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.readAsDataURL(file)
					reader.onload = () => resolve(reader.result as string)
					reader.onerror = (error) => reject(error)
				})
			const formData = new FormData()
			const avatarDate = Date.now().toString()
			const fileInfo = {
				preview: await getBase64(file.originFileObj),
				ext: fileMatch[0],
				avatarDate 
			}
			formData.append('avatar', fileInfo.preview)
			formData.append('ext', fileInfo.ext)
			formData.append('avatarDate', avatarDate)
			const cb = () => {
				setUploadOptions({
					...uploadOptions,
					fileInfo,
					image: `http://localhost:3000/avatars/${username}-${avatarDate}.${fileInfo.ext}`,
					showPreview: true,
					fileList: [	{
						uid: `${username}`,
						name: `${username}.${fileInfo.ext}`,
						status: 'done',
						url: `http://localhost:3000/avatars/${username}-${avatarDate}.${fileInfo.ext}`,
					}]})
			}
			dispatch(savePreviewUserAvatarAction({username, formData, cb}))
		}
	}
	
	const handleCancelAvatar = () => {
		setUploadOptions({...uploadOptions, fileInfo: null, fileList: [], showPreview: false})
		return 
	}

	const handleClosePreviewAvatar = () => setUploadOptions({...uploadOptions, open: false})
	const handleShowPreviewAvatar = async (file: UploadFile) => {
		setUploadOptions({...uploadOptions, open: true, title: file.name})
	}

	return (
		<div className="user-content">
			<Title className={'user-content__text'}>User Info</Title>
			<div className='user-content__avatar'>
				<Upload
					accept="image/*"
					listType="picture-circle"
					maxCount={1}
					customRequest={handleUploadAvatarEvent}
					onChange={handleLoadAvatar}
					onRemove={handleCancelAvatar}
					onPreview={handleShowPreviewAvatar}
					showUploadList={uploadOptions.showPreview}
					fileList={uploadOptions.fileList}
					defaultFileList={uploadOptions.fileList}
					disabled={userInfo?.username !== username}
					className="image-upload-grid"
				>
					{uploadOptions.fileList.length >= 1 
							 ? null
							 : (<div className='user-content__upload'>
							<div><PlusOutlined /></div>
							<div>Upload</div>
							 </div>)}
				</Upload>
				<Modal open={uploadOptions.open} title={uploadOptions.title} footer={null} onCancel={handleClosePreviewAvatar}>
					<img style={{ width: '100%' }} src={uploadOptions.image} />
				</Modal>
			</div>
			<Form
				form={form}
				name="user-content"
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
								<Popconfirm
									 title="Удалить статью"
									 description="Вы уверены что хотите удалить пользователя и все его статьи?"
									 onConfirm={handleDeleteUser}
									 okText="Да"
									 cancelText="Нет"
								>
									<Button type="primary" danger >
									Delete
									</Button>
								</Popconfirm>
							</>) : null}
					</Flex>
				</Form.Item>
			</Form>
		</div>
	)
}

export default UserContent
