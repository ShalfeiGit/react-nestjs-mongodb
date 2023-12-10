import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IInitialState, IThunkApi } from '@app/store/store'

interface ISignUp {
	username: string
	email: string
	password: string
}

const initialState: IInitialState<ISignUp> = {
	data: null,
	error: null,
	loading: false
}

export const signupAction = createAsyncThunk(
	'user/signup',
	async (data: ISignUp, thunkAPI: IThunkApi<ISignUp>) => {
		const response = await thunkAPI.extra.api({ method: 'post', url: 'signup', data })
		return 200 >= response.status && response.status <400 
			? response.data
			: thunkAPI.rejectWithValue({data: null, error: response.statusText})
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
			.addCase(signupAction.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(signupAction.rejected, (state, action) => {
				state.error = action.error.message
				state.loading = false
			})
	}
})

export default signupSlice.reducer
