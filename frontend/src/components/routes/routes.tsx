import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import Layout from '@app/pages/layout/Layout'
import Home from '@app/pages/home/Home'
import Article from '@app/pages/article/Article'
import ErrorPage from '@app/pages/error/ErrorPage'
import SignIn from '@app/pages/signin/SignIn'
import SingUp from '@app/pages/signup/SignUp'

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
			}
		]
	}
])

const Navigation: React.FC = () => <RouterProvider router={router} />

export default Navigation
