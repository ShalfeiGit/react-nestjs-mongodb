import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import Layout from '@app/pages/layout/Layout'
import Home from '@app/pages/home/Home'
import Article from '@app/pages/article/Article'
import ErrorPage from '@app/pages/error/ErrorPage'
import Login from '@app/pages/login/Login'
import Register from '@app/pages/register/Register'

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
				path: 'login',
				Component: Login
			},
			{
				path: 'register',
				Component: Register 
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
