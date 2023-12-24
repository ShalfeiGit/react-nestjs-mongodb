import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import Layout from '@app/pages/layout/Layout'
import Home from '@app/pages/home/Home'
import Article from '@app/pages/article/Article'
import ErrorPage from '@app/pages/error/ErrorPage'
import SignIn from '@app/pages/signIn/SignIn'
import SingUp from '@app/pages/signUp/SignUp'
import UserInfo from '@app/pages/userInfo/UserInfo'

const router = createBrowserRouter([
	{
		path: '/',
		Component: Layout,
		// errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				Component: Home
			},
			{
				path: 'signin',
				Component: SignIn
			},
			{
				path: 'signup',
				Component: SingUp
			},
			{
				path: 'articles/:slug',
				Component: Article
			},
			{
				path: 'userinfo/:username',
				Component: UserInfo
			}
		]
	}
])

const Navigation: React.FC = () => <RouterProvider router={router} />

export default Navigation
