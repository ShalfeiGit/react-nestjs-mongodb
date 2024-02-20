import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import Layout from '@app/shared/layout/Layout'
import Home from '@app/pages/home/Home'
import Article from '@app/pages/article/Article'
import PreviewArticle from '@app/pages/previewArticle/PreviewArticle'
import ErrorPage from '@app/shared/error/ErrorPage'
import SignIn from '@app/pages/signIn/SignIn'
import SingUp from '@app/pages/signUp/SignUp'
import UserInfo from '@app/pages/userInfo/UserInfo'

const router = createBrowserRouter([
	{
		path: '/',
		Component: Layout,
		errorElement: <ErrorPage />,
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
				path: 'article/edit/:slug',
				Component: Article
			},
			{
				path: 'article/preview/:slug',
				Component: PreviewArticle
			},
			{
				path: 'article/create',
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
