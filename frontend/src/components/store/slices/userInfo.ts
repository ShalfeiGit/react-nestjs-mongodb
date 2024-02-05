import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IAxiosErrorResponse, IAxiosResponse, IInitialState, IThunkApi } from '@app/store/store'
import { ICallNotificationAction, INavigateAction, INotificationAction } from '@app/shared/layout/types'
import { IAdditionalArticleInfo, IArticle, ILikeArticleResponse, likeArticleAction } from './article'

export interface IUserInfo {
	id: number;
	username: string;
	email: string;
  bio: string;
  age: number;
	gender: string;
	createdAt: number;
	updatedAt: number;
	refresh_token?: string;
	imageUrl: string;
	avatarUrl: string;
	likedArticle: IArticle[];
}

export interface ISignIn {
	username?: string
	pass?: string
	remember?: boolean
	refresh_token?: string;
}

export interface ISignUp {
	username: string
	email: string
	pass: string
}

export interface IFormData {
	formData: FormData
	cb?(): void,
}

export interface ISignInResponse extends IUserInfo {
	refresh_token: string;
}

const initialState: IInitialState<IUserInfo> = {
	data: null,
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

export const updateUserInfoAction = createAsyncThunk(
	'userInfo/updateUserInfo',
	async (data: IUserInfo & IFormData & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IUserInfo>>) => {
		const {openNotification, navigate, formData, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				content: message,
				type
			})
		}
		const {username, ...dataUserInfo} = userInfo
		const response = await thunkAPI.extra.api({ method: 'put', url: `user/${username}`, data: formData, headers: { 'Content-Type': 'multipart/form-data'} })
		callNotification({
			type: response.status >= 400 ? 'error' : 'success',
			message: response.status >= 400 ? response.data as unknown as string : `${response.data.username} was updated`
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<IUserInfo>
		}	
		return response
	}
)

export const savePreviewUserAvatarAction = createAsyncThunk(
	'userInfo/savePreviewUserAvatar',
	async (data: Pick<IUserInfo, 'username'> & IFormData, thunkAPI: IThunkApi<IAxiosResponse<IUserInfo>>) => {
		const {formData, username, cb} = data
		const response = await thunkAPI.extra.api({ method: 'put', url: `user/${username}/avatar`, data: formData, headers: { 'Content-Type': 'multipart/form-data'} })
	
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<IUserInfo>
		}	
		if(cb){
			cb()
		}
		return response
	}
)


export const deletePreviewUserAvatarAction = createAsyncThunk(
	'userInfo/deletePreviewUserAvatarAction',
	async (data: Pick<IUserInfo, 'username'> & {formData}, thunkAPI: IThunkApi<IAxiosResponse<void>>) => {
		const {formData,   ...userInfo } = data
		const response = await thunkAPI.extra.api({ method: 'delete', url: `user/${userInfo?.username}/avatar` , data: formData, headers: {  'Content-Type': 'multipart/form-data' } })
		return response
	}
)

export const signInAction = createAsyncThunk(
	'userInfo/signIn',
	async (data: ISignIn & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<ISignInResponse> & IAxiosErrorResponse>  ) => {
		const { openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				content: message,
				type
			})
		}
		const response = await thunkAPI.extra.api({ method: 'post', url: 'auth', data: userInfo })
		if(response.status >= 400){
			callNotification({
				type: 'error',
				message: response.data.message
			})
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<IUserInfo>
		}	else {
			if(navigate){
				navigate('/')
			}
		}
		if(response?.data?.refresh_token){
			localStorage.setItem('refresh_token', response.data.refresh_token)
		}
		return response
	}
)

export const signUpAction = createAsyncThunk(
	'userInfo/signUp',
	async (data: ISignUp & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IUserInfo> & IAxiosErrorResponse>) => {
		const {openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				content: message,
				type
			})
		}
		const response = await thunkAPI.extra.api({ method: 'post', url: 'user', data: userInfo })
		callNotification({
			type: response.status >= 400 ? 'error' : 'success',
			message: response.status >= 400 ? response.data.message : `${userInfo.username} was created`
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<IUserInfo>
		}	else {
			navigate('/signIn')
		}
		return response
	}
)

export const resetUserInfoAction = createAsyncThunk(
	'userInfo/resetUserInfo',
	async (data: INavigateAction) => {
		const { navigate } = data
		navigate('/')
		localStorage.clear()
	}
)

export const deleteUserInfoAction = createAsyncThunk(
	'userInfo/deleteUserInfo',
	async (data: Pick<IUserInfo, 'username'> & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<void>>) => {
		const { navigate, ...userInfo } = data
		const response = await thunkAPI.extra.api({ method: 'delete', url: `user/${userInfo?.username}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<IUserInfo>
		}	else {
			navigate('/')
			localStorage.clear()
		}
		return response
	}
)



export const userInfoSlice = createSlice({
	name: 'userInfo',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(updateUserInfoAction.pending, state => {
				state.loading = true
			})
			.addCase(updateUserInfoAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>action?.payload ?? {}
				state.data = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(updateUserInfoAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>action?.payload ?? {}
				state.data = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})
			.addCase(signInAction.pending, state => {
				state.loading = true
			})
			.addCase(signInAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>action?.payload ?? {}
				const {refresh_token, ...updatedDate}  = data
				state.data = updatedDate
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(signInAction.rejected, (state, action)  => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>action?.payload ?? {}
				state.data = null
				state.error = data  as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})
			.addCase(signUpAction.pending, state => {
				state.loading = true
			})
			.addCase(signUpAction.fulfilled, (state, action) => {
				state.loading = false
			})
			.addCase(signUpAction.rejected, (state, action)  => {
				state.loading = false
			})
			.addCase(resetUserInfoAction.fulfilled, (state, action) => {
				state.data = null
				state.error = null
				state.loading = false
				state.status = null
				state.statusText = null
				state.headers = null
				state.config = null
			})
			.addCase(deleteUserInfoAction.fulfilled, (state, action) => {
				state.data = null
				state.error = null
				state.loading = false
				state.status = null
				state.statusText = null
				state.headers = null
				state.config = null
			})
			.addCase(likeArticleAction.fulfilled, (state, action) => {
				const {user}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo & ILikeArticleResponse>action?.payload ?? {}
				state.data = user
				state.error = null
				state.loading = false
			})
	}
})

export default userInfoSlice.reducer
