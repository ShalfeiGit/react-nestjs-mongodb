import axios, { AxiosRequestConfig } from 'axios'

const makeRequest = ({ method, url, data = null, responseType = 'json' }: AxiosRequestConfig) => {
	const axiosInstance = axios.create({
		baseURL: 'http://localhost:3000/api/',
		timeout: 1000,
		headers: { Authorization: 'AUTH_TOKEN' }
	})

	return axiosInstance.request({
		method,
		url,
		responseType,
		data
	})

}
export interface IResponse<T> {
	data: T
}

export default makeRequest
