import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IInitialState, IThunkApi } from '@app/store/store'

interface IUser {
	name: string
	email: string
	bio: string
	age: number
	gender: string
}

const initialState: IInitialState<IUser> = {
	data: null,
	error: null,
	loading: false
}

export const loadUserAction = createAsyncThunk(
	'user/loadUser',
	async (_, thunkAPI: IThunkApi<IUser>) => {
		const response = await thunkAPI.extra.api({ method: 'get', url: 'login' })
		return 200 >= response.status && response.status <=300 
			? await thunkAPI.extra.api({ method: 'get', url: 'login' })
			: thunkAPI.rejectWithValue({data: null, error: response.statusText})
	}
)

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadUserAction.pending, (state) => {
				state.loading = true
			})
			.addCase(loadUserAction.fulfilled, (state, action) => {
				state.data = action.payload.data
				state.loading = false
			})
			.addCase(loadUserAction.rejected, (state, action) => {
				state.data = null
				state.error = action.error.message
				state.loading = false
			})
	}
})

export default userSlice.reducer
