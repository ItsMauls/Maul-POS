const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'
const AUTH_URL = `${BASE_URL}/auth`
const REPORT_URL = `${BASE_URL}/report`
const SALES_URL = `${BASE_URL}/sales`

export const API_URL = {
    AUTH : {
        login : `${AUTH_URL}/login`,
        refreshToken : `${AUTH_URL}/refresh-token`,
        currentUser : `${AUTH_URL}/current-user`,
        logout : `${AUTH_URL}/logout`
    },
    REPORTS : {
        sellingOut : `${REPORT_URL}/sellingout`
    },
    SALES : {
        getSales : `${SALES_URL}/sales`,
        'info-obat': `${SALES_URL}/info-obat`,
        transaksiPenjualan: `${SALES_URL}/transaksi-penjualan`,
        returPenjualan: `${SALES_URL}/retur-penjualan`
    }
}