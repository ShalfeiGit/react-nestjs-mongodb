import { IResponseFailedAction, TypeResponse } from '@app/pages/layout/types'
import { IAxiosResponse } from '@app/store/store'

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const  makeRequest = async ({ method, url, data = null, responseType = 'json', callNotification }: AxiosRequestConfig & IResponseFailedAction) => {
	const response: IAxiosResponse<string> = await axios.request({
		url: `http://localhost:3000/api/${url}`,
		method,
		responseType,
		data
	}).catch(function (error) {
		if (error?.response) {
			console.log(error?.response)
			const message = error?.response?.data?.message
			callNotification({
				type: TypeResponse.failed,
				message,
				error: message
			})
			return ({...JSON.parse(JSON.stringify(error?.response ?? {})), data: message})
		} 
	})

	return response
}


export default makeRequest
