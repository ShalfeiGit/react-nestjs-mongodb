import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IAxiosResponse, IInitialState, IThunkApi } from '@app/store/store'
import { ICallNotificationAction, INavigateAction, INotificationAction, TypeResponse } from '@app/pages/layout/types'

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

export interface ISignInResponse {
  username: string;
  email: string;
  bio: string;
  age: number;
  gender: string;
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

export const getUserInfoAction = createAsyncThunk(
	'userInfo/getUserInfo',
	async (data: Pick<IUserInfo, 'username'> & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IUserInfo>>) => {
		const { username } = data
		const response = await thunkAPI.extra.api({ method: 'get', url: `user/${username}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
		}	
		return response
	}
)

export const updateUserInfoAction = createAsyncThunk(
	'userInfo/updateUserInfo',
	async (data: IUserInfo & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IUserInfo & string>>) => {
		const {openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				message: TypeResponse[`${type}`].charAt(0).toUpperCase() + TypeResponse[`${type}`].slice(1),
				description: message,
				type
			})
		}
		const {username, ...dataUserInfo} = userInfo
		const response = await thunkAPI.extra.api({ method: 'put', url: `user/${username}`, data: dataUserInfo })
		callNotification({
			type: response.status >= 400 ? 'error' : 'success',
			message: response.data
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
		}	
		return response
	}
)

export const signInAction = createAsyncThunk(
	'userInfo/signIn',
	async (data: ISignIn & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<ISignInResponse & string>>) => {
		const {openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				message: TypeResponse[`${type}`].charAt(0).toUpperCase() + TypeResponse[`${type}`].slice(1),
				description: message,
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
		}	
		if(userInfo?.remember || userInfo?.refresh_token){
			localStorage.setItem('refresh_token', response.data.refresh_token)
		}
		if(!userInfo?.refresh_token){
			navigate('/')
		}
		return response
	}
)

export const signUpAction = createAsyncThunk(
	'user/signUp',
	async (data: ISignUp & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<string>>) => {
		const {openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				message: TypeResponse[`${type}`].charAt(0).toUpperCase() + TypeResponse[`${type}`].slice(1),
				description: message,
				type
			})
			if(type === TypeResponse['success']){
				navigate('/signIn')
			}
		}
		const response = await thunkAPI.extra.api({ method: 'post', url: 'user', data: userInfo })
		callNotification({
			type: response.status >= 400 ? 'error' : 'success',
			message: response.data
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
		}	
		return response
	}
)

export const resetUserInfoAction = createAsyncThunk(
	'signin/resetUserInfo',
	async () => {}
)


export const userInfoSlice = createSlice({
	name: 'userInfo',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(updateUserInfoAction.pending, (state) => {
				state.loading = true
			})
			.addCase(updateUserInfoAction.fulfilled, (state, action) => {
				const {status, statusText, headers, config}  = <IAxiosResponse<string>>action?.payload ?? {}
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(updateUserInfoAction.rejected, (state, action)  => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action?.payload ?? {}
				state.data = null
				state.error = data
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})
			.addCase(getUserInfoAction.pending, (state) => {
				state.loading = true
			})
			.addCase(getUserInfoAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>action?.payload ?? {}
				state.data = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(getUserInfoAction.rejected, (state, action)  => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action?.payload ?? {}
				state.data = null
				state.error = data
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})
			.addCase(signInAction.pending, (state) => {
				state.loading = true
			})
			.addCase(signInAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<ISignInResponse & string>>action?.payload ?? {}
				state.data = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(signInAction.rejected, (state, action)  => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<ISignInResponse & string>>action?.payload ?? {}
				state.data = null
				state.error = data
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
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
			.addCase(signUpAction.pending, (state) => {
				state.loading = true
			})
			.addCase(signUpAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action?.payload ?? {}
				state.data = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(signUpAction.rejected, (state, action)  => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action?.payload ?? {}
				state.data = null
				state.error = data
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})
	}
})

export default userInfoSlice.reducer
