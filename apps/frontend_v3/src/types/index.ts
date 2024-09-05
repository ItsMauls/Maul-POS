export interface DataRow {
  index: number;
  rOption: string;
  kd_brgdg: string;
  nm_brgdg: string;
  hj_ecer: number;
  qty: number;
  subJumlah: number;
  disc: number;
  sc: number;
  misc: number;
  jumlah: number;
  promo: number;
  discPromo: number;
  promoValue: number;
  up: number;
  noVoucher: string;
  activePromo?: {
    id: number;
    nama: string;
    diskon: number;
    jenis_promo: string;
    min_pembelian?: number;
    max_diskon?: number;
    kuantitas_beli?: number;
    kuantitas_gratis?: number;
  } | null;
}