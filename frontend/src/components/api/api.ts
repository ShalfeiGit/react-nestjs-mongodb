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
	}).catch(function (error) {
		if (error?.response) {
			const message = error?.response?.data?.message
			return ({...JSON.parse(JSON.stringify(error?.response ?? {})), data: message})
		}
	})

	if(response.status === 401){
		const refreshToken =  localStorage.getItem('refresh_token')
		if(refreshToken){
			//запрос обновления cookie
			const response = await axios.request({
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
			if(response.status < 400){
				localStorage.setItem('refresh_token', response.data.refresh_token)
			}

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
			}).catch(function (error) {
				if (error?.response) {
					const message = error?.response?.data?.message
					return ({...JSON.parse(JSON.stringify(error?.response ?? {})), data: message})
				} 
			})
			return JSON.parse(JSON.stringify(repeatResponse))
		}
		return JSON.parse(JSON.stringify(response))
	}

	return JSON.parse(JSON.stringify(response))
}


export default makeRequest
