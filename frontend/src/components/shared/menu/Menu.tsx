import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Row, Button, Typography } from 'antd'
import { RocketTwoTone, LoginOutlined, HomeOutlined, FormOutlined } from '@ant-design/icons'

import '@app/shared/menu/menu.scss'

const { Text } = Typography

const Menu: React.FC = () => {
	const navigate = useNavigate()

	const handleRedirectHome = () => {
		navigate('/')
	}

	const handleShowSignInModal = () => {
		navigate('/signin')
	}

	const handleShowSignUpModal = () => {
		navigate('/signup')
	}

	return (
		<div className="menu">
			<Row>
				<Col span={1}></Col>
				<Col span={3}>
					<Button className={'menu__button'} type="link" onClick={handleRedirectHome}>
						<RocketTwoTone />
						<Text>Startup</Text>
					</Button>
				</Col>
				<Col span={5}></Col>
				<Col span={3}></Col>
				<Col span={3}></Col>
				<Col span={3}></Col>
				<Col span={3}></Col>
				<Col span={3}>
					<Button className={'menu__button'} type="link" title="Home" onClick={handleRedirectHome}>
						<HomeOutlined />
					</Button>
					<Button className={'menu__button'} type="link" title="Sign in" onClick={handleShowSignInModal}>
						<LoginOutlined />
					</Button>
				</Col>
			</Row>
		</div>
	)
}

export default Menu
