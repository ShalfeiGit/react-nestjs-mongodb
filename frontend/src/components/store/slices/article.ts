import { createSlice } from '@reduxjs/toolkit'
import type { IInitialState } from '@app/store/store'

export interface IFeedArticles {
	articleId: string,
	authorName: string,
	authorAvatar: string,
	createdAt: number,
	title: string,
	content: string[],
	likes: number,
	liked: boolean,
}
export interface IPagination {
	totalItems: number,
	itemsPerPage: number,
	currentPage: number,
}

export interface IFeeds {
	tabName: string;
	id: string;
  pagination: IPagination;
	feedArticles: IFeedArticles[]
}

const initialState: IInitialState<IFeeds[]> = {
	data: null,
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

export const articleSlice = createSlice({
	name: 'article',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
	}
})

export default articleSlice.reducer
