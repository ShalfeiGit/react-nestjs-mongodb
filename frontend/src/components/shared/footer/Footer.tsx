import React from 'react'
import { Typography } from 'antd'
import Icon from '@ant-design/icons'
import { Link } from 'react-router-dom'
import MessageSvg  from './svg/telegramm.svg'

const {Text}	= Typography

import '@app/shared/footer/footer.scss'
import moment from 'moment'

interface IProps {
	
}

const Footer: React.FC<IProps> = () => {
	 return <div className='footer'>
		<div className='footer__wrapper'>
			<Text className='footer__text' >Copyright &copy;{moment().year()} Designed by Valentin Zadorozhniy{' '}</Text>	
			<Link to={'https://t.me/Shalfei'}>
				<Icon component={MessageSvg} />	
			</Link>
	 </div>
	 </div>
}

export default Footer
