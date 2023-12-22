import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IInitialState, IThunkApi } from '@app/store/store'
import { ICallNotificationAction, INavigateAction, INotificationAction, TypeResponse } from '@app/pages/layout/types'
import axios from 'axios'

export interface ISignUp {
	username: string
	email: string
	password: string
}

export interface IErrorResponse {
	error?: string
}

const initialState: IInitialState<ISignUp> = {
	data: null,
	error: null,
	loading: false
}

export const signupAction = createAsyncThunk(
	'user/signup',
	async (data: ISignUp & INotificationAction & INavigateAction, thunkAPI: IThunkApi<ISignUp & IErrorResponse>) => {
		const {openNotification, navigate, ...userInfo} = data
		const callNotification = ({type, message, error}: ICallNotificationAction ) => {
			openNotification({
				message: TypeResponse[`${type}`].charAt(0).toUpperCase() + TypeResponse[`${type}`].slice(1),
				description: message,
				type: TypeResponse[`${type}`]
			})
			if(type === TypeResponse['success']){
				navigate('/signin')
			}
		}
		const response = await thunkAPI.extra.api({ method: 'post', url: 'user', data: userInfo, callNotification })
		return response.data.error
			? <ISignUp & IErrorResponse><unknown>thunkAPI.rejectWithValue(response.data.error) 
			: response.data
	}
)

export const signupSlice = createSlice({
	name: 'signup',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(signupAction.pending, (state) => {
				state.loading = true
			})
			.addCase(signupAction.fulfilled, (state, action) => {
				state.data = action.payload
				state.loading = false
			})
			.addCase(signupAction.rejected, (state, action) => {
				state.data = null
				state.error = <IErrorResponse['error']>action.payload
				state.loading = false
			})
	}
})

export default signupSlice.reducer
