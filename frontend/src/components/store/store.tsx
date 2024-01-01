import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import userInfoReducer from '@app/store/slices/userInfo'
import othersUserInfoReducer from '@app/store/slices/othersUserInfo'
import makeRequest from '@app/api/api'
import { GetThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { AxiosRequestConfig, AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from 'axios'
import { IResponseFailedAction } from '@app/shared/layout/types'

export const store = configureStore({
	reducer: {
		userInfo: userInfoReducer,
		othersUserInfo: othersUserInfoReducer,
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
	extra: { api: ({ method, url, data, responseType, callNotification }: AxiosRequestConfig & IResponseFailedAction) => Promise<T>,
	rejectWithValue: (value: IAxiosResponse<T>) => IAxiosResponse<T>
}
}>

export interface IAxiosResponse<T> {
	data: T
	status: number
	statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: InternalAxiosRequestConfig<T>
}

export interface IAxiosErrorResponse {
	statusText: string
	data: string
	statusCode: number;
}

export interface IInitialState<T> extends IAxiosResponse<T> {
	error: string
	loading: boolean
}

export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
