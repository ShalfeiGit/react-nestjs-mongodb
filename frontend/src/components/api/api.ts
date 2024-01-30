import { IAxiosResponse } from '@app/store/store'

import axios, { AxiosRequestConfig } from 'axios'

const  makeRequest = async ({ method, url, data = null, responseType = 'json' }: AxiosRequestConfig) => {
	const response: IAxiosResponse<string> = await axios.request({
		url: `http://localhost:3000/api/${url}`, // Заменить на значение из .env
		method,
		responseType,
		data,
		withCredentials:true,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		}
	}).catch(async err => {
		if(err.response.status === 401){
			debugger
			const refreshToken = localStorage.getItem('refresh_token')
			//запрос обновления cookie
			const responseAuth = await axios.request({
				url: 'http://localhost:3000/api/auth', // Заменить на значение из .env
				method: 'post',
				responseType,
				data: {'refresh_token':  refreshToken} ,
				withCredentials:true,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
				}
			})
			if(responseAuth.status < 400){
				localStorage.setItem('refresh_token', responseAuth.data.refresh_token)
				const repeatResponse: IAxiosResponse<string>  = await axios.request({
					url: `http://localhost:3000/api/${url}`, // Заменить на значение из .env
					method,
					responseType,
					data,
					withCredentials:true,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
					}
				})
				return JSON.parse(JSON.stringify(repeatResponse))
			}
			const message = responseAuth?.data?.message
			return ({...JSON.parse(JSON.stringify(responseAuth ?? {})), data: message})
		}
		return JSON.parse(JSON.stringify(err.response))
	})

	return JSON.parse(JSON.stringify(response))
}


export default makeRequest
