import { createSlice } from '@reduxjs/toolkit'
import type { IInitialState } from '@app/store/store'

export interface IUserInfo {
	username: string;
	email: string;
  bio: string;
  age: number;
	gender: string;
	createdAt: number;
	updatedAt: number;
}

export interface ISignIn {
	username?: string
	password?: string
	remember?: boolean
	refresh_token?: string;
}

export interface ISignUp {
	username: string
	email: string
	password: string
}

export interface ISignInResponse extends IUserInfo {
	refresh_token: string;
}

const initialState: IInitialState<IUserInfo> = {
	data: null,
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

export const popularTagsSlice = createSlice({
	name: 'popularTags',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
	}
})

export default popularTagsSlice.reducer
