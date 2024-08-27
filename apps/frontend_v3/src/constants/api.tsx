const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005/api'
const AUTH_URL = `http://localhost:3007/api/auth`
const USER_URL = `http://localhost:3006/api/users`
const PAYMENT_URL = `http://localhost:3010/api/payment`
const REPORT_URL = `${BASE_URL}/report`
const SALES_URL = `${BASE_URL}/sales/`
const PURCHASE_PEMBELIAN_URL = `http://localhost:3003/api/inventory-pembelian`

export const API_URL = {
    AUTH : {
        login : `${AUTH_URL}/login`,
        refreshToken : `${AUTH_URL}/refresh-token`,
        logout : `${AUTH_URL}/logout`
    },
    ANTRIAN : {
        createAntrian : `${SALES_URL}/antrian/add`,
        finishAntrian : `${SALES_URL}/antrian/finish`,
        getAntrianToday : `${SALES_URL}/antrian/today`,
        getCurrentAntrianInfo : `${SALES_URL}/antrian/current-antrian-info/:kdCab`
    },
    PAYMENT : {
        createPayment : `${PAYMENT_URL}`,
        getPayment : `${PAYMENT_URL}`
    },
    USER : {
        currentUser : `${USER_URL}/current-user`
    },
    REPORTS : {
        sellingOut : `${REPORT_URL}/sellingout`
    },
    SALES : {
        getSales : `${SALES_URL}/sales`,
        'info-obat': `${SALES_URL}/info-obat`,
        transaksiPenjualan: `${SALES_URL}/transaksi-penjualan`,
        returPenjualan: `${SALES_URL}/retur-penjualan`
    },
    TRANSAKSI_PENJUALAN : {
        createTransaction : `${SALES_URL}/transaksi-penjualan`
    },
    PURCHASE_PEMBELIAN : {
        fakturPembelian : `${PURCHASE_PEMBELIAN_URL}/faktur-pembelian`,
        penerimaanSupplier : `${PURCHASE_PEMBELIAN_URL}/penerimaan-supplier`,
        eTicket : `${PURCHASE_PEMBELIAN_URL}/e-ticket`,
        penerimaan : `${PURCHASE_PEMBELIAN_URL}/penerimaan`,
        suratPesanan : `${PURCHASE_PEMBELIAN_URL}/surat-pesanan`,
        supplier : `${PURCHASE_PEMBELIAN_URL}/supplier`
    }
}