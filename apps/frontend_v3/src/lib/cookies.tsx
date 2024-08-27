import Cookies from "js-cookie";

export const getAccessToken = () => Cookies.get('access_token')
export const getRefreshToken = () => Cookies.get('refresh_token')
export const setAccessToken = (token: string) => Cookies.set('access_token', token)
export const setRefreshToken = (token: string) => Cookies.set('refresh_token', token)
export const removeAccessToken = () => Cookies.remove('access_token')
export const removeRefreshToken = () => Cookies.remove('refresh_token')