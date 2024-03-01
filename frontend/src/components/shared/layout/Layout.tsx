import React from 'react'
import { message } from 'antd'
import { Outlet, useLocation  } from 'react-router-dom'

import Menu from '@app/shared/menu/Menu'
import Footer from '@app/shared/footer/Footer'
import { INotification } from './types'

const Layout: React.FC = () =>{
	
	const [messageApi, contextHolder] = message.useMessage()
	const openNotification = ({type, content}: INotification) => {
		messageApi.open({
			type: type,
			content: <>{content}</>,
		})
	}
	const location = useLocation()

	return (
		<>
			{contextHolder}
			<Menu openNotification={openNotification}/>
			<Outlet context={openNotification} />
			{location.pathname === '/' ? (<Footer />) : null }
		</>
	)
} 

export default Layout
