import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IAxiosResponse, IInitialState, IThunkApi } from '@app/store/store'
import { ICallNotificationAction, INavigateAction, INotificationAction, TypeResponse } from '@app/pages/layout/types'

export interface ISignUp {
	username: string
	email: string
	password: string
}

const initialState: IInitialState<string> = {
	data: null,
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

export const signUpAction = createAsyncThunk(
	'user/signup',
	async (data: ISignUp & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<string>>) => {
		const {openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message}: ICallNotificationAction ) => {
			openNotification({
				message: TypeResponse[`${type}`].charAt(0).toUpperCase() + TypeResponse[`${type}`].slice(1),
				description: message,
				type: TypeResponse[`${type}`]
			})
			if(type === TypeResponse['success']){
				navigate('/signin')
			}
		}
		const response = await thunkAPI.extra.api({ method: 'post', url: 'user', data: userInfo })
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

export const signUpSlice = createSlice({
	name: 'signup',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
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

export default signUpSlice.reducer
