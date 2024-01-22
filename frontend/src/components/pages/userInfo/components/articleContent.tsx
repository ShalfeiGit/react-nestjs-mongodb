import React, {useEffect} from 'react'
import { Button, Popconfirm, Table } from 'antd'
import { EditOutlined, CloseOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { useOutletContext, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { RootState, useAppDispatch } from '@app/store/store'
import { loadUserArticlesAction } from '@app/store/slices/article'
import { IUserInfo } from '@app/store/slices/userInfo'

interface DataType {
  key: string;
  title: string;
  content: string;
  tag: string;
  likes: number;
}

const ArticleContent: React.FC = () => {
	const openNotification = useOutletContext()
	const navigate = useNavigate()
	const {username} = useParams()
	const userInfo = useSelector((state: RootState) => state.userInfo.data as IUserInfo)
	
	const data: DataType[] = (useSelector((state: RootState) => state.article.userArticles) ?? []).map(article => ({
		key: `${article.id}`,
		...article
	}))
	const dispatch = useAppDispatch()
	useEffect(() => {
		if(userInfo.username){
			dispatch(loadUserArticlesAction({userId: userInfo.id}))
		}
	}, [userInfo])

	const handleAddArticle = () => {
		navigate('/article/create')
	}

	const handleEditArticle = (id) => () => {
		navigate(`/article/edit/${id}`)
	}

	const handleViewArticle = (id) => () => {
		navigate(`/article/preview/${id}`)
	}


	const handleRemoveArticle = (id) => () => {
	}

	const columns: TableProps<DataType>['columns'] = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Content',
			dataIndex: 'content',
			key: 'content',
		},
		{
			title: 'Tag',
			dataIndex: 'tag',
			key: 'tag',
		},
		{
			title: 'Likes',
			dataIndex: 'likes',
			key: 'likes',
		},
		{
			title: 'Manage',
			dataIndex: 'manage',
			key: 'manage',
			render: (manage, row) => {
				return (
					<>
						<Button className="article-content__manage" type="primary" shape="circle" icon={<EyeOutlined />}  onClick={handleViewArticle(row.key)}/>
						{userInfo.username === username && (<>
							<Button className="article-content__manage" type="primary" shape="circle" icon={<EditOutlined />}  onClick={handleEditArticle(row.key)}/>
							<Popconfirm
									 title="Удалить статью"
									 description="Вы уверены что хотите удалить статью?"
									 onConfirm={handleRemoveArticle(row.key)}
									 okText="Да"
									 cancelText="Нет"
							>
								<Button className="article-content__manage" type="primary" danger  shape="circle" icon={<CloseOutlined />}/>
							</Popconfirm>
							
						</>)}
						
					</>
				)
			},
		}
	]

	return (
		<div className='article-content'>
			<div className='article-content__dashboard'>
				<Button type="primary"  icon={<PlusOutlined />} onClick={handleAddArticle} >
					Создать
				</Button>
			</div>
			<Table className='article-content__table' columns={columns} dataSource={data} />
		</div>	
	)
} 

export default ArticleContent