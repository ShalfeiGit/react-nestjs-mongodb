import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IAxiosErrorResponse, IAxiosResponse, IInitialState, IThunkApi } from '@app/store/store'
import { ICallNotificationAction, INavigateAction, INotificationAction } from '@app/shared/layout/types'

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

export interface ITagOptions {
	[x:string]:string;
}

const initialState: IInitialState<IFeeds[]> & {tags: ITagOptions} = {
	data: null,
	tags: null,
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

export const loadTagOptionsAction = createAsyncThunk(
	'article/loadTagOptions',
	async (data = null, thunkAPI: IThunkApi<IAxiosResponse<ITagOptions> & IAxiosErrorResponse>) => {
		const response = await thunkAPI.extra.api({ method: 'get', url: 'article/options/tag' })
		if(response.status >= 400){
			return thunkAPI.rejectWithValue(response) as unknown as IAxiosResponse<null>
		}	else {
			return response
		}
	}
)

export const articleSlice = createSlice({
	name: 'article',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadTagOptionsAction.pending, state => {
				state.loading = true
			})
			.addCase(loadTagOptionsAction.fulfilled, (state, action) => {
				const tags  = <IAxiosResponse<ITagOptions>>action?.payload ?? {}
				state.tags = tags
				state.loading = false
			})
			.addCase(loadTagOptionsAction.rejected,  (state, action) => {
				state.tags = null
				state.loading = false
			})
	}
})

export default articleSlice.reducer
