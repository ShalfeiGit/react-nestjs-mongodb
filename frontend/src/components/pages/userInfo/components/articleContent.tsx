import React from 'react'
import { Button, Table } from 'antd'
import { EditOutlined, CloseOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'

interface DataType {
  key: string;
  title: string;
  content: string;
  tag: string;
  likes: number;
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
		render: (manage, item) => {
			return (
				<div>
					<Button className="article-content__manage" type="primary" shape="circle" icon={<EditOutlined />}  onClick={() => { console.log(item)}}/>
					<Button className="article-content__manage" type="primary" danger  shape="circle" icon={<CloseOutlined />} onClick={() => { console.log(item)}}/>
				</div>
			)
		},
	}
]

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
	return (
		<div className='article-content'>
			<Table className='article-content__table' columns={columns} dataSource={data} />
		</div>	
	)
} 

export default ArticleContent