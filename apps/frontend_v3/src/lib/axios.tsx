import axios, { AxiosInstance } from "axios";
import { Config } from "../utils/http/type";
import { getAccessToken, setAccessToken, getRefreshToken } from "./cookies";
import { API_URL } from "@/constants/api";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

const createAxiosInstance = (): AxiosInstance => {
	const instance = axios.create();

	instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			if (error.response.status === 401 && !originalRequest._retry) {
				if (isRefreshing) {
					return new Promise((resolve, reject) => {
						failedQueue.push({ resolve, reject });
					}).then(token => {
						originalRequest.headers['Authorization'] = 'Bearer ' + token;
						return instance(originalRequest);
					}).catch(err => {
						return Promise.reject(err);
					});
				}

				originalRequest._retry = true;
				isRefreshing = true;

				const refreshToken = getRefreshToken();
				if (!refreshToken) {
					return Promise.reject(error);
				}

				try {
					const response = await axios.post(API_URL.AUTH.refreshToken, { refresh_token: refreshToken });
					const { access_token } = response.data;
					setAccessToken(access_token);
					instance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
					originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
					processQueue(null, access_token);
					return instance(originalRequest);
				} catch (refreshError) {
					processQueue(refreshError, null);
					return Promise.reject(refreshError);
				} finally {
					isRefreshing = false;
				}
			}

			return Promise.reject(error);
		}
	);

	return instance;
};

const axiosInstance = createAxiosInstance();

export async function request(
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	url: string, data: any, config: Config = { showSuccess: true, showError: true, usingToken: true, headers: {},
	onUploadProgress: (): any => { } }): Promise<any> {
	let {
		headers = {},
		onUploadProgress = () : any => {} 
	} = config

	headers = {
		"Content-Type" : 'application/json',
		...headers
	}

	config = { 
		showSuccess: true,
		showError: true,
		usingToken: true,
		...config 
	};

	if (config.usingToken && getAccessToken()) {
		headers.Authorization = `Bearer ${getAccessToken()}`;
	}
	
	try {            
		const response = await axiosInstance({
			method,
			url,
			data,
			headers,
			responseType : 'json',
			onUploadProgress: (e: any) => onUploadProgress(e)
		})
		return response
	} catch (error) {
		throw error
	}
}