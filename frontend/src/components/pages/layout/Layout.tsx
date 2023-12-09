import React from 'react'
import { Outlet } from 'react-router-dom'

import Menu from '@app/shared/menu/Menu'

const Layout: React.FC = () => (
	<>
		<Menu />
		<Outlet />
	</>
)

export default Layout
