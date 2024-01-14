import React, { useEffect }from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Form, Input, Button, Typography, InputNumber, Select, Flex, Tabs, TabsProps } from 'antd'
import { useOutletContext, useNavigate } from 'react-router-dom'

import '@app/pages/userInfo/userInfo.scss'
import { RootState, useAppDispatch } from '@app/store/store'
import { updateUserInfoAction, IUserInfo } from '@app/store/slices/userInfo'
import { getOtherAuthorInfoAction, IOtherAuthorInfo } from '@app/store/slices/otherAuthorInfo'
import { resetUserInfoAction, deleteUserInfoAction } from '@app/store/slices/userInfo'
import UserContent from './components/userContent'
import ArticlesContent from './components/articleContent'

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
	const tabs: TabsProps['items'] = [
		{
			key: 'articles',
			label: 'Articles',
			children: <ArticlesContent />,
		},
		{
			key: 'user-info',
			label: 'User Info',
			children: <UserContent /> ,
		}
	]

	return (
		<div className="user-info">
			<Tabs 
				defaultActiveKey="articles"
				items={tabs}
			/>
		</div>
	)
}

export default UserInfo
