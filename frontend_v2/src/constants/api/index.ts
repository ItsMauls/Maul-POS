const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_URL = `${BASE_URL}/auth`;
const USER_URL = `${BASE_URL}/user`;

export const api = {
    auth: {
        login: `${AUTH_URL}/login`,
        refreshToken: `${AUTH_URL}/refresh-token`,               
        logout: `${AUTH_URL}/logout`,
        currentUser : `${AUTH_URL}/current-user`,
    },
    user: {
        allUser: `${USER_URL}/all`,
        signature: `${USER_URL}/signature`,
        allRole: `${USER_URL}/roles`,
        addUser: `${USER_URL}/create`,
        deleteUser: `${USER_URL}/delete`,
    },
    inventory: {
        allInventory: `${BASE_URL}/inventory/master-barang/all`,   
        addInventory: `${BASE_URL}/inventory/master-barang/by-id`,
        detailInventory: `${BASE_URL}/inventory/master-barang`,
        updateInventory: `${BASE_URL}/inventory/master-barang`,
        deleteInventory: `${BASE_URL}/inventory/master-barang`,  
        allSatuan: `${BASE_URL}/inventory/satuan/all`,   
    },
    purchase: {
        allPurchaseRequest: `${BASE_URL}/purchase/request/all`,
        allPurchaseRequestForPO: `${BASE_URL}/purchase/request/all-for-po`,
        addPurchaseRequest: `${BASE_URL}/purchase/request`,
        switchGudangPurchaseRequest: `${BASE_URL}/purchase/request/switch-gudang`,
        detailPurchaseRequest: `${BASE_URL}/purchase/request`,
        approvePurchaseRequest: `${BASE_URL}/purchase/request/approve`,
        removePurchaseRequest: `${BASE_URL}/purchase/request`,
        allPurchaseOrder: `${BASE_URL}/purchase/order/all`,
        addPurchaseOrder: `${BASE_URL}/purchase/order`,
        detailPurchaseOrder: `${BASE_URL}/purchase/order`,
        approvePurchaseOrder: `${BASE_URL}/purchase/order/approve`,
        removePurchaseOrder: `${BASE_URL}/purchase/order`,
        addInvoice: `${BASE_URL}/purchase/invoice`,
        allInvoice: `${BASE_URL}/purchase/invoice/all`,
        detailInvoice: `${BASE_URL}/purchase/invoice`,
        pelunasanInvoice: `${BASE_URL}/purchase/invoice/pelunasan`,
    },
    supplier: {
        allSupplier: `${BASE_URL}/supplier/all`,
    },
}