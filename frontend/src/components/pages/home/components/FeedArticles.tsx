import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import React from 'react'
import { Avatar, List, Space } from 'antd'



const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
	<Space>
		{React.createElement(icon)}
		{text}
	</Space>
)

interface IFeedArticle {
	authorName: string;
	authorAvatar: string;
	createdAt: string;
	title: string;
	content: string;
	likes: number;
	liked: boolean;
}

interface IProps {
	feedArticles: IFeedArticle[]
}

const FeedArticles: React.FC<IProps> = ({feedArticles}) => {
	const m = feedArticles
	debugger
	const handlePaginationFeeds = (page) => {
		console.log(page)
	}

	const data = Array.from({ length: 23 }).map((_, i) => ({
		href: 'https://ant.design',
		title: `ant design part ${i}`,
		avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
		description:
			'Ant Design, a design language for background applications, is refined by Ant UED Team.',
		content:
			'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
	}))

	return (
		<List
			itemLayout="vertical"
			size="large"
			pagination={{
				onChange: handlePaginationFeeds,
				pageSize: 3,
			}}
			dataSource={data}
			renderItem={(item) => (
				<List.Item
					key={item.title}
					actions={[
						<IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
						<IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
						<IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
					]}
					extra={
						<img
							width={272}
							alt="logo"
							src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
						/>
					}
				>
					<List.Item.Meta
						avatar={<Avatar src={item.avatar} />}
						title={<a href={item.href}>{item.title}</a>}
						description={item.description}
					/>
					{item.content}
				</List.Item>
			)}
		/>
	)}

export default FeedArticles