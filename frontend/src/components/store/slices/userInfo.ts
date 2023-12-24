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
	async (data: IUserInfo & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IUserInfo & string>>) => {
		const {openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				message: TypeResponse[`${type}`].charAt(0).toUpperCase() + TypeResponse[`${type}`].slice(1),
				description: message,
				type: TypeResponse[`${type}`]
			})
			if(type === TypeResponse['success']){
				navigate('/')
			}
		}
		const {username, ...dataUserInfo} = userInfo
		const response = await thunkAPI.extra.api({ method: 'patch', url: `user/${username}`, data: dataUserInfo })
		callNotification({
			type: response.status >= 400 ? TypeResponse.failed : TypeResponse.success,
			message: response.data
		})
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
		}	
		return response
	}
)

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
				const {status, statusText, headers, config}  = <IAxiosResponse<string>>action.payload
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(updateUserInfoAction.rejected, (state, action)  => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action.payload
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
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>action.payload
				state.data = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(getUserInfoAction.rejected, (state, action)  => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<string>>action.payload
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
