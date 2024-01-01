import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IAxiosErrorResponse, IAxiosResponse, IInitialState, IThunkApi } from '@app/store/store'
import { ICallNotificationAction, INavigateAction, INotificationAction, TypeResponse } from '@app/shared/layout/types'

export interface IUserInfo {
	username: string;
	email: string;
  bio: string;
  age: number;
	gender: string;
}

export interface ISignIn {
	username?: string
	password?: string
	remember?: boolean
	refresh_token?: string;
}

export interface ISignUp {
	username: string
	email: string
	password: string
}

export interface ISignInResponse extends IUserInfo {
	refresh_token: string;
}

const initialState: IInitialState<IUserInfo | string> = {
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
	async (data: IUserInfo & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IUserInfo>>) => {
		const {openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				content: message,
				type
			})
		}
		const {username, ...dataUserInfo} = userInfo
		const response = await thunkAPI.extra.api({ method: 'put', url: `user/${username}`, data: dataUserInfo })
		callNotification({
			type: response.status >= 400 ? 'error' : 'success',
			message: `${response.data.username} success updated`
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
		}	
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
				type: response.status >= 400 ? 'error' : 'success',
				message: response.data
			})
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
		}	else {
			navigate('/')
		}
		if(userInfo?.remember || userInfo?.refresh_token){
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
			message: response.status >= 400 ? response.data : `${response.data.username} was created`
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
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
	}
)

export const deleteUserInfoAction = createAsyncThunk(
	'userInfo/deleteUserInfo',
	async (data: Pick<IUserInfo, 'username'> & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<void>>) => {
		const { navigate, ...userInfo } = data
		const response = await thunkAPI.extra.api({ method: 'delete', url: `user/${userInfo.username}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
		}	else {
			navigate('/')
		}
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
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action?.payload ?? {}
				state.data = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(updateUserInfoAction.rejected,  (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action?.payload ?? {}
				state.data = null
				state.error = data
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
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action?.payload ?? {}
				state.data = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
				
			})
			.addCase(signInAction.rejected, (state, action)  => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action?.payload ?? {}
				state.data = null
				state.error = data
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
	}
})

export default userInfoSlice.reducer
