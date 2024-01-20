import React, { useEffect, useState }from 'react'
import { useSelector } from 'react-redux'
import { Input, Typography, Tabs, TabsProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string'

import '@app/pages/userInfo/userInfo.scss'
import { RootState } from '@app/store/store'
import { IUserInfo } from '@app/store/slices/userInfo'
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
	const navigate = useNavigate()
	const [tabQuery, setTabQuery]  = useState('')
	const userInfo = useSelector((state: RootState) => state.userInfo.data)
	const tabs: TabsProps['items'] = [
		{
			key: 'user-content',
			label: 'User Info',
			children: <UserContent /> ,
		},
		{
			key: 'articles-content',
			label: 'Articles Info',
			children: <ArticlesContent />,
		}
	]

	useEffect(() => {
		const { tab } = queryString.parse(window.location.search)
		const currentTab = tab ? `${tab}` : 'user-content'
		setTabQuery(currentTab)
		if(userInfo?.username){
			navigate(`/userinfo/${userInfo?.username}?${queryString.stringify({ tab: currentTab})}`)
		}
	}, [userInfo?.username]) 

	const onChange = (key: string) => {
		setTabQuery(key)
		navigate(`/userinfo/${userInfo.username}?${queryString.stringify({ tab: key})}`)
	}

	return ( 
		<div className="user-info">
			<Tabs 
				className={'user-info__tabs'}
				defaultActiveKey="user-content"
				items={tabs}
				activeKey={tabQuery}
				onChange={onChange}
			/>
		</div>
	)
}

export default UserInfo
