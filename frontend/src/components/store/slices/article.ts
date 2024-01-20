﻿import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
  content: string;
  tag: string
  updatedAt: number;
  likes: number;
  userId: IUserInfo;
}

export interface IArticleRequestData {
	id?: string;
	tag?: string;
	username?: string;
}

export interface ILikeArticleResponse {
	user: IUserInfo
	groupArticles: IGroupArticle[]
}

export interface IGroupArticle {
	tag: string,
	articles: IArticle[]
}

export interface IAdditionalArticleInfo {
	tags: ITagOption[],
	groupArticles: IGroupArticle[],
	userArticles: IGroupArticle,
}

const initialState: IInitialState<IArticle | ITagOption[]> & IAdditionalArticleInfo = {
	data: null,
	tags: null,
	groupArticles: null,
	userArticles: null,
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
		const { id } = data
		const response = await thunkAPI.extra.api({ method: 'get', url: `article/${id}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return response
		}
	}
)

export const loadGroupArticlesAction = createAsyncThunk(
	'article/loadGroupArticles',
	async (data: IArticleRequestData, thunkAPI: IThunkApi<IAxiosResponse<IGroupArticle[]> & IAxiosErrorResponse>) => {
		const { tag } = data
		const response = await thunkAPI.extra.api({ method: 'get', url: `article/group/${tag}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return response
		}
	}
)

export const loadUserArticlesAction = createAsyncThunk(
	'article/loadUserArticles',
	async (data: IArticleRequestData, thunkAPI: IThunkApi<IAxiosResponse<IGroupArticle> & IAxiosErrorResponse>) => {
		const { username } = data
		const response = await thunkAPI.extra.api({ method: 'get', url: `article/sort/${username}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return response
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
		const {username, content, title, tag} = data
		const response = await thunkAPI.extra.api({ method: 'post', url: `article/${username}`, data: {tag, title, content} })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return response
		}
	}
)

export const updateArticleAction = createAsyncThunk(
	'article/updateArticle',
	async (data: IArticleRequestData
		& Pick<IArticle, 'content' | 'title' | 'tag'>
		& INotificationAction 
		& INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IArticle> & IAxiosErrorResponse>) => {
		const {id, content, title, tag} = data
		const response = await thunkAPI.extra.api({ method: 'post', url: `article/${id}`, data: {tag, title, content} })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return response
		}
	}
)

export const deleteArticleAction = createAsyncThunk(
	'article/deleteArticle',
	async (data: IArticleRequestData
	& INotificationAction 
	& INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IArticle> & IAxiosErrorResponse>) => {
		const response = await thunkAPI.extra.api({ method: 'delete', url: 'article/${id}' })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return response
		}
	}
)

export const likeArticleAction = createAsyncThunk(
	'article/likeArticle',
	async (data: Pick<IUserInfo, 'username'> & IArticleRequestData
		& Pick<IArticle, 'content' | 'title' | 'tag'>
		& INotificationAction 
		& INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IUserInfo> & ILikeArticleResponse & IAxiosErrorResponse>) => {
		const {username, id, content, title, tag} = data
		const responseUserInfo = await thunkAPI.extra.api({ method: 'post', url: `article/like/${id}/username/${username}`, data: {tag, title, content} })
		const responseGroupArticles = await thunkAPI.extra.api({ method: 'get', url: `article/group/${tag}` })
		if(responseUserInfo.status >= 400){
			return thunkAPI.rejectWithValue(responseUserInfo) as unknown as IAxiosResponse<null>
		}	else {
			return {
				...responseUserInfo,
				user: responseUserInfo.data,
				groupArticles: responseGroupArticles.data,
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
				state.data = data
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
			.addCase(loadGroupArticlesAction.pending, state => {
				state.loading = true
			})
			.addCase(loadGroupArticlesAction.fulfilled, (state, action) => {
				const {groupArticles, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.groupArticles = groupArticles
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(loadGroupArticlesAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.groupArticles = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})

			.addCase(loadUserArticlesAction.pending, state => {
				state.loading = true
			})
			.addCase(loadUserArticlesAction.fulfilled, (state, action) => {
				const {userArticles, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.userArticles = userArticles
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(loadUserArticlesAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.userArticles = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})

			//добавление тэгов
			.addCase(loadTagOptionsAction.pending, state => {
				state.loading = true
			})
			.addCase(loadTagOptionsAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config }  = <IAxiosResponse<ITagOption[]>>action?.payload ?? {}
				state.tags = data
				state.error = null
				state.loading = true
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
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






			.addCase(createArticleAction.pending, state => {
				state.loading = true
			})
			.addCase(createArticleAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.data = data
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

			.addCase(updateArticleAction.pending, state => {
				state.loading = true
			})
			.addCase(updateArticleAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.data = data
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

			.addCase(deleteArticleAction.pending, state => {
				state.loading = true
			})
			.addCase(deleteArticleAction.fulfilled, (state, action) => {
				const { status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.data = null
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(deleteArticleAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.tags = null
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
				const {groupArticles, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo & ILikeArticleResponse>action?.payload ?? {}
				state.error = null
				state.groupArticles =groupArticles
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(likeArticleAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>action?.payload ?? {}
				state.tags = null
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
