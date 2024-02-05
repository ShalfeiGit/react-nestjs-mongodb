import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IAxiosResponse, IInitialState, IThunkApi } from '@app/store/store'
import { INavigateAction, INotificationAction } from '@app/shared/layout/types'

export interface IOtherAuthorInfo {
	username: string;
	email: string;
  bio: string;
  age: number;
	gender: string;
	avatarUrl: string;
}

const initialState: IInitialState<IOtherAuthorInfo> = {
	data: null,
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

export const getOtherAuthorInfoAction = createAsyncThunk(
	'othersUserInfo/getOtherAuthorInfo',
	async (data: Pick<IOtherAuthorInfo, 'username'> & INotificationAction & INavigateAction, thunkAPI: IThunkApi<IAxiosResponse<IOtherAuthorInfo>>) => {
		const { username } = data
		const response = await thunkAPI.extra.api({ method: 'get', url: `user/author/${username}` })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<string>
		}	
		return response
	}
)

export const othersUserInfoSlice = createSlice({
	name: 'otherAuthorInfo',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getOtherAuthorInfoAction.pending, state => {
				state.loading = true
			})
			.addCase(getOtherAuthorInfoAction.fulfilled, (state, action) => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IOtherAuthorInfo>>action?.payload ?? {}
				state.data = data
				state.error = null
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config
				state.loading = false
			})
			.addCase(getOtherAuthorInfoAction.rejected, (state, action)  => {
				const {data, status, statusText, headers, config}  = <IAxiosResponse<IOtherAuthorInfo>>action?.payload ?? {}
				state.data = null
				state.error = data as unknown as string
				state.status = status
				state.statusText = statusText
				state.headers = headers
				state.config = config 
				state.loading = false
			})
	}
})

export default othersUserInfoSlice.reducer
