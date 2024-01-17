import React from 'react'
import { message } from 'antd'
import { Outlet } from 'react-router-dom'

import Menu from '@app/shared/menu/Menu'
import { INotification } from './types'

const Layout: React.FC = () =>{
	
	const [messageApi, contextHolder] = message.useMessage()
	const openNotification = ({type, content}: INotification) => {
		messageApi.open({
			type: type,
			content: <>{content}</>,
		})
	}

	return (
		<>
			{contextHolder}
			<Menu openNotification={openNotification}/>
			<Outlet context={openNotification} />
		</>
	)
} 

export default Layout
