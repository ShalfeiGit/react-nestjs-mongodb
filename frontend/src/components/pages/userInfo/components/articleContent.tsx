import React, {useEffect} from 'react'
import { Button, Table } from 'antd'
import { EditOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { useOutletContext, useNavigate } from 'react-router-dom'

import { RootState, useAppDispatch } from '@app/store/store'

interface DataType {
  key: string;
  title: string;
  content: string;
  tag: string;
  likes: number;
}

const data: DataType[] = [
	{
		key: '1',
		title: 'Test title 1',
		content: 'Test content 1',
		tag: 'frontend',
		likes: 35,
	},
	{
		key: '2',
		title: 'Test title 2',
		content: 'Test content 2',
		tag: 'backend',
		likes: 36,
	},
	{
		key: '3',
		title: 'Test title 3',
		content: 'Test content 3',
		tag: 'marketing',
		likes: 37,
	},
	{
		key: '4',
		title: 'Test title 4',
		content: 'Test content 4',
		tag: 'graphic',
		likes: 38,
	},
	{
		key: '5',
		title: 'Test title 5',
		content: 'Test content 5',
		tag: 'devops',
		likes: 39,
	},
	{
		key: '6',
		title: 'Test title 6',
		content: 'Test content 6',
		tag: 'marketing',
		likes: 40,
	},
]

const ArticleContent: React.FC = () => {
	const openNotification = useOutletContext()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	useEffect(() => {
	}, [])

	const handleAddArticle = () => {
		navigate('/article/add')
	}

	const handleEditArticle = (id) => () => {
		navigate(`/article/${id}`)
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
						<Button className="article-content__manage" type="primary" shape="circle" icon={<EditOutlined />}  onClick={handleEditArticle(row.key)}/>
						<Button className="article-content__manage" type="primary" danger  shape="circle" icon={<CloseOutlined />} onClick={handleRemoveArticle(row.key)}/>
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