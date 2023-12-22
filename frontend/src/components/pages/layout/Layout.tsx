import React from 'react'
import { Button, notification } from 'antd'
import { Outlet } from 'react-router-dom'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

import Menu from '@app/shared/menu/Menu'
import { INotification, TypeResponse } from './types'





const Layout: React.FC = () =>{
	const [api, contextHolder] = notification.useNotification()
	const openNotification = ({type, message, description}: INotification) => {
		api.open({
			message,
			description,
			icon: type === TypeResponse.success
			 ? <CheckCircleOutlined  style={{ color: '#008000' }} />
			 : <CloseCircleOutlined  style={{ color: '#FF0000' }} />
			 ,
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
