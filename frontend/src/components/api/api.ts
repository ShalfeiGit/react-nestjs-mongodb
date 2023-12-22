import { IResponseFailedAction, TypeResponse } from '@app/pages/layout/types'
import axios, { AxiosRequestConfig } from 'axios'

const  makeRequest = async ({ method, url, data = null, responseType = 'json', callNotification }: AxiosRequestConfig & IResponseFailedAction) => {
	const response = await axios.request({
		url: `http://localhost:3000/api/${url}`,
		method,
		responseType,
		data: {
			email:'asd@asd.asd',
			password:'1q2w3e4r',
			username:'Valentin2'
		}
	}).catch(function (error) {
		if (error?.response) {
			callNotification({
				type: TypeResponse.failed,
				message: error?.response?.data?.message,
				error: error?.response?.data?.message})
		} 
		return {data: {error: error?.response?.data?.message} }
	})
	return response
}
export interface IResponse<T> {
	data: T
}

export default makeRequest
