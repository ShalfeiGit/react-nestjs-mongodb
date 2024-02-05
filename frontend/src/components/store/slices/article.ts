import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IAxiosErrorResponse, IAxiosResponse, IInitialState, IThunkApi } from '@app/store/store'
import { ICallNotificationAction, INavigateAction, INotificationAction } from '@app/shared/layout/types'
import { IUserInfo, signInAction } from './userInfo'

export interface IFeedArticles {
	articleId: string,
	authorName: string,
	authorAvatar: string,
	createdAt: number,
	title: string,
	content: string[],
	likes: number,
	liked: boolean,
}
export interface IPagination {
	totalItems: number,
	itemsPerPage: number,
	currentPage: number,
}

export interface IFeeds {
	tabName: string;
	id: string;
  pagination: IPagination;
	feedArticles: IFeedArticles[]
}

export interface ITagOption {
	label: string;
	value: string;
}

export interface IArticle {
	id: number;
  title: string;
  content: string[];
  tag: string
  updatedAt: number;
 	createdAt: number;
  likes: number;
  user: Pick<IUserInfo, 'username' | 'id' | 'avatarUrl'>;
}

export interface IPagnationMeta {
	currentPage: number,
	itemCount: number,
	itemsPerPage: number,
	totalItems: number,
	totalPages: number,
}
export interface IPaginatedResponse <T>{
	items: T[],
	meta: IPagnationMeta,
}

export interface IArticleRequestData {
	articleId?: string;
	tag?: string;
	username?: string;
}

export interface ILikeArticleResponse {
	user: IUserInfo
	groupArticles: IPaginatedResponse<IArticle>
}

export interface IGroupArticle<T> {
	tag: string,
	articles: IPaginatedResponse<IArticle>
}

export interface IUserArticle<T> {
	username: string,
	articles: IPaginatedResponse<IArticle>
}

export interface IAdditionalArticleInfo {
	tags: ITagOption[],
	groupArticles: IGroupArticle<IArticle>[],
	userArticles: IUserArticle<IArticle>[],
}

export interface IPaginationInfo {
	page: number,
  limit: number,
}

const initialState: IInitialState<IArticle | ITagOption[] | IGroupArticle<IArticle> | IUserArticle<IArticle>> & IAdditionalArticleInfo = {
	data: null,
	tags: null,
	groupArticles: [],
	userArticles: [],
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

export const loadArticleAction = createAsyncThunk(
	'article/loadArticle',
	async (data: IArticleRequestData, thunkAPI: IThunkApi<IAxiosResponse<IArticle> & IAxiosErrorResponse>) => {
		const { articleId } = data
		const response = await thunkAPI.extra.api({ method: 'get', url: `article/${articleId}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return response
		}
	}
)

export const loadAllArticlesAction = createAsyncThunk(
	'article/loadAllArticles',
	async (data: IArticleRequestData & IPaginationInfo, thunkAPI: IThunkApi<IAxiosResponse<IGroupArticle<IArticle>> & IAxiosErrorResponse>) => {
		const response = await thunkAPI.extra.api({ method: 'get', url: `article/global/all?page=${data.page}&limit=${data.limit}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return {
				...response,
				data: {
					tag: 'global',
					articles: response.data
				}
			}
		}
	}
)

export const loadGroupArticlesAction = createAsyncThunk(
	'article/loadGroupArticles',
	async (data: IArticleRequestData & IPaginationInfo, thunkAPI: IThunkApi<IAxiosResponse<IGroupArticle<IArticle>> & IAxiosErrorResponse>) => {
		const { tag, page, limit } = data
		const response = await thunkAPI.extra.api({ method: 'get', url: `article/group/${tag}?page=${page}&limit=${limit}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return {
				...response,
				data: {
					tag,
					articles: response.data
				}
			}
		}
	}
)

export const removeGroupArticlesAction = createAsyncThunk(
	'article/removeGroupArticles',
	async (data: IArticleRequestData) => {
		const { tag } = data
		return { tag }
	}
)

export const loadUserArticlesAction = createAsyncThunk(
	'article/loadUserArticles',
	async (data: IArticleRequestData & IPaginationInfo, thunkAPI: IThunkApi<IAxiosResponse<IUserArticle<IArticle>> & IAxiosErrorResponse>) => {
		const { username, page, limit } = data
		const response = await thunkAPI.extra.api({ method: 'get', url: `article/filter/${username}?page=${page}&limit=${limit}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return {
				...response,
				data: {
					username,
					articles: response.data
				}
			}
		}
	}
)

export const loadTagOptionsAction = createAsyncThunk(
	'article/loadTagOptions',
	async (data = null, thunkAPI: IThunkApi<IAxiosResponse<ITagOption[]> & IAxiosErrorResponse>) => {
		const response = await thunkAPI.extra.api({ method: 'get', url: 'article/options/tag' })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return response
		}
	}
)

export const createArticleAction = createAsyncThunk(
	'article/createArticle',
	async (data: Pick<IUserInfo, 'username'> 
		& Pick<IArticle, 'content' | 'title' | 'tag'>
		& INotificationAction 
		& INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IArticle> & IAxiosErrorResponse>) => {
		const {username, content, title, tag, navigate, openNotification} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				content: message,
				type
			})
		}
		const response = await thunkAPI.extra.api({ method: 'post', url: `article/${username}`, data: {tag, title, content} })
		callNotification({
			type: response.status >= 400 ? 'error' : 'success',
			message: response.status >= 400 ? response.data.message : 'Article was created'
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			navigate(`/userinfo/${username}?tab=articles-content`)
			return response
		}
	}
)

export const updateArticleAction = createAsyncThunk(
	'article/updateArticle',
	async (data: IArticleRequestData
		& Pick<IUserInfo, 'username'> 
		& Pick<IArticle, 'content' | 'title' | 'tag'>
		& INotificationAction 
		& INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IArticle> & IAxiosErrorResponse>) => {
		const {articleId, username, content, title, tag, navigate, openNotification} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				content: message,
				type
			})
		}
		const response = await thunkAPI.extra.api({ method: 'put', url: `article/${articleId}`, data: {tag, title, content} })
		callNotification({
			type: response.status >= 400 ? 'error' : 'success',
			message: response.status >= 400 ? response.data.message : 'Article was updated'
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			navigate(`/userinfo/${username}?tab=articles-content`)
			return response
		}
	}
)

export const deleteArticleAction = createAsyncThunk(
	'article/deleteArticle',
	async (data: IArticleRequestData
	& Pick<IUserInfo, 'username'>
	& INotificationAction 
	& INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IArticle> & IAxiosErrorResponse>) => {
		const {articleId, openNotification, navigate, username} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				content: message,
				type
			})
		}
		const response = await thunkAPI.extra.api({ method: 'delete', url: `article/${articleId}` })
		const responseUserArticles = await thunkAPI.extra.api({ method: 'get', url: `article/filter/${username}?page=1&limit=10` })
		callNotification({
			type: response.status >= 400 ? 'error' : 'success',
			message: response.status >= 400 ? response.data.message : 'Article was deleted'
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			navigate(`/userinfo/${username}?tab=articles-content`)
			return {
				...responseUserArticles,
				data: {
					username,
					articles: responseUserArticles.data
				}
			}
			return response
		}
	}
)

export const likeArticleAction = createAsyncThunk(
	'article/likeArticle',
	async (data: Pick<IUserInfo, 'username'> & IArticleRequestData
		& Pick<IArticle, 'likes' | 'tag'>
		& IPaginationInfo
		& INotificationAction 
		& INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IUserInfo> & ILikeArticleResponse & IAxiosErrorResponse>) => {
		const {username, articleId, likes, tag, page, limit} = data
		const responseUserInfo = await thunkAPI.extra.api({ method: 'post', url: `article/like/${articleId}/username/${username}`, data: { likes } })
		const responseGroupArticles = await thunkAPI.extra.api({ method: 'get', url: `article/${tag === 'global' ? 'global/all' : `group/${tag}`}?page=${page}&limit=${limit}` })
		if(responseUserInfo.status >= 400){
			return thunkAPI.rejectWithValue(responseUserInfo) as unknown as IAxiosResponse<null>
		}	else {
			return {
				...responseGroupArticles,
				user: responseUserInfo.data,
				data: { tag,
					articles: responseGroupArticles.data
				} ,
			}
		}
	}
)

export const articleSlice = createSlice({
	name: 'article',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadArticleAction.pending, state => {
				state.loading = true
			})
			.addCase(loadArticleAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle>>action?.payload ?? {}
				state.data = {...data,
					content: `${data?.content}`.split(/\r\n|\n/g)},
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(loadArticleAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle>>action?.payload ?? {}
				state.data = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})

			//загрузка всех статей
			.addCase(loadAllArticlesAction.pending, state => {
				state.loading = true
			})
			.addCase(loadAllArticlesAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>action?.payload ?? {}
				state.groupArticles = [
					...(state.groupArticles ?? []).filter(groupArticle => groupArticle.tag !== data.tag),
					{
						tag: data.tag,
						articles: 	{
							items: (data?.articles?.items ?? []).map(article => ({
								...article, 
								content: `${article?.content}`.split(/\r\n|\n/g)
							})),
							meta: data?.articles?.meta,
						}
					}],
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(loadAllArticlesAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>action?.payload ?? {}
				state.groupArticles = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})

			//загрузка статей по тэгу
			.addCase(loadGroupArticlesAction.pending, state => {
				state.loading = true
			})
			.addCase(loadGroupArticlesAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>action?.payload ?? {}
				state.groupArticles = [
					...(state.groupArticles ?? []).filter(groupArticle => groupArticle.tag !== data.tag),
					{
						tag: data.tag,
						articles: 	{
							items: (data?.articles?.items ?? []).map(article => ({
								...article, 
								content: `${article?.content}`.split(/\r\n|\n/g)
							})),
							meta: data?.articles?.meta,
						}
					}],
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(loadGroupArticlesAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>action?.payload ?? {}
				state.groupArticles = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})

			//удаление статей по тэгу
			.addCase(removeGroupArticlesAction.fulfilled, (state, action) => {
				const { tag }  = <IArticleRequestData>action?.payload ?? {}
				state.groupArticles = [
					...(state.groupArticles ?? []).filter(groupArticle => groupArticle.tag !== tag),
				]
			})

			//загрузка статей пользователя 
			.addCase(loadUserArticlesAction.pending, state => {
				state.loading = true
			})
			.addCase(loadUserArticlesAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserArticle<IArticle>>>action?.payload ?? {}
				state.userArticles = [
					...(state.userArticles ?? []).filter(userArticle => userArticle.username !== data.username),
					{
						username: data.username,
						articles: 	{
							items: (data?.articles?.items ?? []).map(article => ({
								...article, 
								content: `${article?.content}`.split(/\r\n|\n/g)
							})),
							meta: data?.articles?.meta,
						}
					}],
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(loadUserArticlesAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserArticle<IArticle>>>action?.payload ?? {}
				state.userArticles = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})

			//загрузка тэгов
			.addCase(loadTagOptionsAction.pending, state => {
				state.loading = true
			})
			.addCase(loadTagOptionsAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config }  = <IAxiosResponse<ITagOption[]>>action?.payload ?? {}
				state.tags = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(loadTagOptionsAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config }  = <IAxiosResponse<ITagOption[]>>action?.payload ?? {}
				state.tags = null
				state.error = data as unknown as string
				state.loading = true
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
			})

			//создание статьи
			.addCase(createArticleAction.pending, state => {
				state.loading = true
			})
			.addCase(createArticleAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.data =  {...data,
					content: `${data?.content}`.split(/\r\n|\n/g)}
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(createArticleAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.data = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})

			//обновление статьи
			.addCase(updateArticleAction.pending, state => {
				state.loading = true
			})
			.addCase(updateArticleAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.data = {...data,
					content: `${data?.content}`.split(/\r\n|\n/g)}
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(updateArticleAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.tags = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})
			//удаление статьи
			.addCase(deleteArticleAction.pending, state => {
				state.loading = true
			})
			.addCase(deleteArticleAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserArticle<IArticle>>>action?.payload ?? {}
				state.data = null
				state.userArticles = [
					...(state.userArticles ?? []).filter(userArticle => userArticle.username !== data.username),
					{
						username: data.username,
						articles: 	{
							items: (data?.articles?.items ?? []).map(article => ({
								...article, 
								content: `${article?.content}`.split(/\r\n|\n/g)
							})),
							meta: data?.articles?.meta,
						}
					}],
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(deleteArticleAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.data = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})
		// доделать тут
			.addCase(likeArticleAction.pending, state => {
				state.loading = true
			})
			.addCase(likeArticleAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>action?.payload ?? {}
				state.error = null
				state.groupArticles = [
					...(state.groupArticles ?? []).filter(groupArticle => groupArticle.tag !== data.tag),
					{
						tag: data.tag,
						articles: 	{
							items: (data?.articles?.items ?? []).map(article => ({
								...article, 
								content: `${article?.content}`.split(/\r\n|\n/g)
							})),
							meta: data?.articles?.meta,
						}
					}],
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(likeArticleAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>action?.payload ?? {}
				state.groupArticles = []
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})
	}
})

export default articleSlice.reducer
