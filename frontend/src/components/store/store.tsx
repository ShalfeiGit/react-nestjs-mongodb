import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import userReducer from '@app/store/slices/userSlice'
import makeRequest, { IResponse } from '@app/api/api'
import { GetThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export const store = configureStore({
	reducer: {
		user: userReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			thunk: {
				extraArgument: {
					api: makeRequest
				}
			}
		})
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type IThunkApi<T> = GetThunkAPI<{
	extra: { api: ({ method, url, data, responseType }: AxiosRequestConfig) => AxiosResponse<T> }
}>
export interface IInitialState<T> extends IResponse<T> {
	error: string
	loading: boolean
}

export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
