﻿import axios, { AxiosRequestConfig } from 'axios'

const makeRequest = ({ method, url, data = null, responseType = 'json' }: AxiosRequestConfig) => {
	const axiosInstance = axios.create({
		baseURL: 'http://localhost:8080/api/',
		timeout: 1000,
		headers: { Authorization: 'AUTH_TOKEN' }
	})

	axiosInstance.request({
		method,
		url,
		responseType,
		data
	})
}

export default makeRequest
