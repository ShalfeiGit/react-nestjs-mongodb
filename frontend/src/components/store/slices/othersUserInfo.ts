import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IAxiosResponse, IInitialState, IThunkApi } from '@app/store/store'
import { INavigateAction, INotificationAction } from '@app/shared/layout/types'

export interface IOthersUserInfo {
	username: string;
	email: string;
  bio: string;
  age: number;
	gender: string;
}

const initialState: IInitialState<IOthersUserInfo | string> = {
	data: null,
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

export const getOthersUserInfoAction = createAsyncThunk(
	'othersUserInfo/getUserInfo',
	async (data: Pick<IOthersUserInfo, 'username'> & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IOthersUserInfo>>) => {
		const { username } = data
		const response = await thunkAPI.extra.api({ method: 'get', url: `user/${username}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
		}	
		return response
	}
)

export const othersUserInfoSlice = createSlice({
	name: 'othersUserInfo',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getOthersUserInfoAction.pending, state => {
				state.loading = true
			})
			.addCase(getOthersUserInfoAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IOthersUserInfo>>action?.payload ?? {}
				state.data = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(getOthersUserInfoAction.rejected, (state, action)  => {
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

export default othersUserInfoSlice.reducer
