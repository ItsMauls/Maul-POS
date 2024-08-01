const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api'
const AUTH_URL = `${BASE_URL}/auth`
const REPORT_URL = `${BASE_URL}/report`

export const api = {
    auth : {
        login : `${AUTH_URL}/login`,
        refreshToken : `${AUTH_URL}/refresh-token`,
        currentUser : `${AUTH_URL}/current-user`,
        logout : `${AUTH_URL}/logout`
    },
    reports : {
        sellingOut : `${REPORT_URL}/sellingout`
    }
}