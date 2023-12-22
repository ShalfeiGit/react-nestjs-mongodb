import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IInitialState, IThunkApi } from '@app/store/store'

interface ISignIn {
	username: string
	password: string
}

const initialState: IInitialState<ISignIn> = {
	data: null,
	error: null,
	loading: false
}

export const signinAction = createAsyncThunk(
	'user/signin',
	async (data: ISignIn, thunkAPI: IThunkApi<ISignIn>) => {
		const response = await thunkAPI.extra.api({ method: 'post', url: 'signin', data })
		return 200 >= response.status && response.status <400 
			? response.data
			: thunkAPI.rejectWithValue({data: null, error: response.statusText})
	}
)

export const signinSlice = createSlice({
	name: 'signin',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(signinAction.pending, (state) => {
				state.loading = true
			})
			.addCase(signinAction.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(signinAction.rejected, (state, action) => {
				state.error = action.error.message
				state.loading = false
			})
	}
})

export default signinSlice.reducer
