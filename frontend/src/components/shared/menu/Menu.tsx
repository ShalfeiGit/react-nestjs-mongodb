import React, {useEffect} from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Col, Row, Button, Typography, Avatar, Space  } from 'antd'
import { RocketTwoTone, LoginOutlined, UserOutlined } from '@ant-design/icons'

import '@app/shared/menu/menu.scss'
import { RootState, useAppDispatch } from '@app/store/store'
import { IUserInfo, signInAction } from '@app/store/slices/userInfo'
import { INotification } from '@app/pages/layout/types'

const { Text } = Typography
interface IProps {
	openNotification(data: INotification): void
}

const Menu: React.FC<IProps> = ({openNotification}) => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const userInfo = useSelector((state: RootState) => state.userInfo.data)
	useEffect(() => {
		const refresh_token = localStorage.getItem('refresh_token')
		if(!userInfo && refresh_token){
			dispatch(signInAction({ openNotification, navigate, refresh_token, }))
		}
	}, [])

	const handleRedirectHome = () => {
		navigate('/')
	}

	const handleRedirectSignInModal = () => {
		navigate('/signin')
	}

	const handleRedirectUserInfoModal = (username) => () => {
		navigate(`/userinfo/${username}`)
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
						? (<Button className={'menu__button'} type="link" title="User info" onClick={handleRedirectUserInfoModal((userInfo as IUserInfo)?.username)}>
							<Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined/>} /><span className={'menu__greetings'}>{`Hi, ${(userInfo as IUserInfo)?.username}`}</span>
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
