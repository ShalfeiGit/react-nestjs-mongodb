import { IAxiosResponse } from '@app/store/store'

import axios, { AxiosRequestConfig } from 'axios'

const  makeRequest = async ({ method, url, data = null, responseType = 'json' }: AxiosRequestConfig) => {
	const response: IAxiosResponse<string> = await axios.request({
		url: `http://localhost:3000/api/${url}`, // Заменить на значение из .env
		method,
		responseType,
		data,
	}).catch(function (error) {
		if (error?.response) {
			const message = error?.response?.data?.message
			return ({...JSON.parse(JSON.stringify(error?.response ?? {})), data: message})
		} 
	})

	return JSON.parse(JSON.stringify(response))
}


export default makeRequest
