import React from 'react'
import { Button, message } from 'antd'
import { Outlet } from 'react-router-dom'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

import Menu from '@app/shared/menu/Menu'
import { INotification, TypeResponse } from './types'

const Layout: React.FC = () =>{
	const [messageApi, contextHolder] = message.useMessage()
	const openNotification = ({type, message, description}: INotification) => {
		messageApi.open({
			type: type,
			content: description,
		})
	}

	return (
		<>
			{contextHolder}
			<Menu />
			<Outlet context={openNotification} />
		</>
	)
} 

export default Layout
