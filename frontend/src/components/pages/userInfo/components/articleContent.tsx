import React, {useEffect} from 'react'
import { Button, Popconfirm, Table, Pagination } from 'antd'
import { EditOutlined, CloseOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { useNavigate, useParams} from 'react-router-dom'
import { useSelector } from 'react-redux'

import { RootState, useAppDispatch } from '@app/store/store'
import { deleteArticleAction, loadUserArticlesAction } from '@app/store/slices/article'
import { IUserInfo } from '@app/store/slices/userInfo'
import { INotificationAction } from '@app/shared/layout/types'

interface DataType {
  key: string;
  title: string;
  content: string[];
  tag: string;
  likes: number;
}
 interface IProps{
	openNotification: INotificationAction['openNotification'];
 }
const ArticleContent: React.FC<IProps> = (props) => {

	const navigate = useNavigate()
	const {username} = useParams()
	const userInfo = useSelector((state: RootState) => state.userInfo.data as IUserInfo)
	
	const data: DataType[] = (useSelector((state: RootState) => state.article.userArticles.find(userArticle => userArticle.userId === userInfo.id)?.articles?.items) ?? []).map(article => ({
		key: `${article.id}`,
		...article
	}))

	const pagination = (useSelector((state: RootState) => state.article.userArticles.find(userArticle => userArticle.userId === userInfo.id)?.articles?.meta))
	const dispatch = useAppDispatch()
	useEffect(() => {
		if(userInfo?.username){
			dispatch(loadUserArticlesAction({userId: userInfo?.id, page: 1, limit: 10}))
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
		const {openNotification}  = props
		dispatch(deleteArticleAction({articleId: id, navigate, openNotification, username: userInfo?.username, userId: userInfo?.id}))
	}

	const handleChangeArticlePagination = (page) =>{
		dispatch(loadUserArticlesAction({userId: userInfo?.id, page, limit: 10}))
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
			render: content => (
				<div className={'feed-articles__article'}>
					<div className='feed-articles__article_gradient' />
					{content.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
				</div>
			)
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
			width:' 18%',
			render: (manage, row) => {
				return (
					<div>
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
					</div>
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
			<Table className='article-content__table' columns={columns} dataSource={data} pagination={{
				onChange: handleChangeArticlePagination,
				pageSize: pagination?.itemsPerPage ?? 10,
				showSizeChanger: false,
				showQuickJumper: false,
				total: pagination?.totalItems ?? 0,
				current: pagination?.currentPage?? 1
			}}/>
		</div>	
	)
} 

export default ArticleContent