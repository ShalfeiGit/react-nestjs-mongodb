import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IAxiosResponse, IInitialState, IThunkApi } from '@app/store/store'
import { ICallNotificationAction, INavigateAction, INotificationAction, TypeResponse } from '@app/pages/layout/types'

export interface ISignIn {
	username?: string
	password?: string
	remember?: boolean
	refresh_token?: string;
}

export interface ISignInResponse {
  username: string;
  email: string;
  bio: string;
  age: number;
  gender: string;
	refresh_token: string;
}

const initialState: IInitialState<ISignInResponse & string> = {
	data: null,
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

export const signInAction = createAsyncThunk(
	'user/signin',
	async (data: ISignIn & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<ISignInResponse & string>>) => {
		const {openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				message: TypeResponse[`${type}`].charAt(0).toUpperCase() + TypeResponse[`${type}`].slice(1),
				description: message,
				type: TypeResponse[`${type}`]
			})
		}
		const response = await thunkAPI.extra.api({ method: 'post', url: 'auth', data: userInfo })

		if(response.status >= 400){
			callNotification({
				type: response.status >= 400 ? TypeResponse.failed : TypeResponse.success,
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

export const signInSlice = createSlice({
	name: 'signin',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
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
	}
})

export default signInSlice.reducer
