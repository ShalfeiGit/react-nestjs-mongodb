import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import signinReducer from '@app/store/slices/signinSlice'
import signupReducer, { ISignUp } from '@app/store/slices/signupSlice'
import makeRequest, { IResponse } from '@app/api/api'
import { GetThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { IResponseFailedAction } from '@app/pages/layout/types'

export const store = configureStore({
	reducer: {
		signin: signinReducer,
		signup: signupReducer
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
	extra: { api: ({ method, url, data, responseType, callNotification }: AxiosRequestConfig & IResponseFailedAction) => Promise<AxiosResponse<T>>,
	rejectWithValue: (value: {data: string, error: string}) => ISignUp 
}
}>
export interface IInitialState<T> extends IResponse<T> {
	error: string
	loading: boolean
}

export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
