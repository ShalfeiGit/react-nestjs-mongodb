import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Col, Row, Button, Typography } from 'antd'
import { RocketTwoTone, LoginOutlined, SmileOutlined } from '@ant-design/icons'

import '@app/shared/menu/menu.scss'
import { RootState, useAppDispatch } from '@app/store/store'
import { signInAction } from '@app/store/slices/signInSlice'

const { Text } = Typography

const Menu: React.FC = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const userInfo = useSelector((state: RootState) => state.signIn.data)
	useEffect(() => {
		const refresh_token = localStorage.getItem('refresh_token')
		if(!userInfo && refresh_token){
			dispatch(signInAction({refresh_token}))
		}
	}, [])

	const handleRedirectHome = () => {
		navigate('/')
	}

	const handleRedirectSignInModal = () => {
		navigate('/signin')
	}

	const handleRedirectUserInfoModal = () => {
		navigate('/userinfo')
	}

	return (
		<div className="menu">
			<Row justify="end">
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
				<Col span={9} className='menu__login'>
					{userInfo 
						? (<Button className={'menu__button'} type="link" title="User info" onClick={handleRedirectUserInfoModal}>
							<SmileOutlined /><span className={'menu__greetings'}>{`Hi, ${userInfo?.username}`}</span>
						</Button>) 
						: (
							<Button className={'menu__button'} type="link" title="Sign in" onClick={handleRedirectSignInModal}>
								<LoginOutlined />
							</Button>
						)}
					
				</Col>
			</Row>
		</div>
	)
}

export default Menu
