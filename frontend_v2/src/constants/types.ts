export interface User {
    id: number;
    name: string;
    address: string;
    username: string;
    email: string;
    role: Role;
    signature: string;
}

export interface createUser {
    name: string;
    username: string;
    email: string;
    password: string;
    address: string;
    role_id: number;
}

export interface Role {
    id: number;
    name: string;
}

export interface Barang {
    kode_barang: string;
    nama_barang: string;
    isi: number;
    satuan: Satuan;
    harga_jual: number;
    harga_beli: number;
}

export interface Satuan {
    id: number;
    nama: string;
}


export interface Supplier {
    id: string;
    nama: string;
    alamat: string;
    email: string;
}

export interface PurcaseRequest {
    id: number;
    no: string;
    tanggal: string;
    keterangan: string;
    supplier: Supplier;
    user: User;
    status_approved: string;
    tanggal_approved: string;
    user_approved: User;
    total: number;
    gudang: string;
}

export interface PurchaseRequestDetail {
    kode_barang: string;
    nama_barang: string;
    satuan: Satuan;
    qty: number;
    isi: number;
    harga_beli: number;
    total: number;
}

export interface PurchaseRequestDetailBarang {
    id: number;
    detail: number;
    barang: Barang;
    qty_pesan: number;
    isi: number;
    harga_ppn: number;
}

export interface DetailPurchaseRequest {
    header: PurcaseRequest;
    detail: PurchaseRequestDetailBarang[];
};

export interface DetailPurchaseOrder {
    header: PurchaseOrder;
    detail: PurchaseOrderDetailResponse[];
};

export interface PurchaseOrder {
    id_hpo: number;
    id_hpr: number;
    no_po: string;
    tgl_po: string;
    user: User;
    no_ref: string;
    tgl_ref: string;
    supplier: Supplier;
    total: number;
    total_diskon: number;
    total_ppn: number;
    biaya_lain: number;
    total_net: number;
    round: number;
    user_approved_1: User;
    user_approved_2: User;
    gudang: string;
}

export interface PurchaseOrderDetailResponse {
    id_hpo: number;
    id_dpo: number;
    detail: number;
    barang: Barang;
    batch: string;
    tgl_expired: string;
    qty: number;
    isi: number;
    hrg_nppn: number;
    ppn: number;
    hrg_ppn: number;
    disc: number;
    disc_nominal: number;
    tot_disc: number;
    total_nppn: number;
    total_ppn: number;
    total: number;
    new_item: boolean;
    id_hpr: number;
}

export interface PurchaseOrderDetail {
    kd_brgdg: string;
    batch: string;
    tgl_expired: string;
    qty: number;
    isi: number;
    hrg_nppn: number;
    ppn: number;
    hrg_ppn: number;
    disc: number;
    disc_nominal: number;
    tot_disc: number;
    total_nppn: number;
    total_ppn: number;
    total: number;
    new_item: boolean;
    detail: number;
}

export interface PurchaseOrderDetailFromRequest {
    id: number;
    detail: number;
    barang: Barang;
    qty_pesan: number;
    isi: number;
    harga_ppn: number;
    qty: number;
    batch: string;
    tgl_expired: string;
    new_item: boolean;
    qty_terpenuhi: number;
    disc : number;
    disc_nominal: number;
}


// {
//     "id": 1,
//     "no_invoice": "INV01/2024070001",
//     "kode_supplier": "151",
//     "nama_supplier": "TEST",
//     "tgl_invoice": "13/07/2024",
//     "tgl_jatuh_tempo": "15/08/2024",
//     "total": 5237508,
//     "total_ppn": 519032,
//     "total_diskon": 35000,
//     "total_net": 4718476,
//     "metode_pembayaran": "CASH",
//     "status_invoice": "N",
//     "gudang": "01",
//     "no_reff": "PO01/1",
//     "tgl_reff": "09/07/2024"
// }

export interface Invoice {
    id: number;
    no_invoice: string;
    kode_supplier: string;
    nama_supplier: string;
    tgl_invoice: string;
    tgl_jatuh_tempo: string;
    total: number;
    total_ppn: number;
    total_diskon: number;
    total_net: number;
    metode_pembayaran: string;
    status_invoice: string;
    gudang: string;
    no_reff: string;
    tgl_reff: string;
}


// "id": 16,
// "id_invoice": 6,
// "kode_barang": "093576",
// "nama_barang": "BEAR BRAND SUSU 189ML",
// "batch": "xam56734",
// "tgl_expired": "15/07/2025",
// "qty": 100,
// "isi": 1,
// "harga": 8830,
// "disc": 20,
// "disc_nominal": 176600,
// "total": 784104

export interface InvoiceDetail {
    id: number;
    id_invoice: number;
    kode_barang: string;
    nama_barang: string;
    batch: string;
    tgl_expired: string;
    qty: number;
    isi: number;
    harga: number;
    disc: number;
    disc_nominal: number;
    total: number;
    barang: Barang;
}

export interface Pembayaran {
    id: number;
    id_invoice: number;
    tgl_pembayaran: string;
    total_pembayaran: number;
    metode_pembayaran: string;
    keterangan: string;
}

export interface DetailInvoice {
    header: Invoice;
    detail: InvoiceDetail[];
    pembayaran: Pembayaran;
}