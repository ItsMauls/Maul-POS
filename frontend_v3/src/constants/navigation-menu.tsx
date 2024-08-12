import { FaClipboardUser } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { BsClipboard2DataFill } from "react-icons/bs";
import { FaUser, FaCashRegister, FaRedo, FaDatabase, FaArrowDown, FaArrowUp, FaTicketAlt, FaNewspaper } from 'react-icons/fa';
import { HomeMenuType } from "./type";

export const transaksiPenjualanMenus = [
    {
        name : 'Home',
        link : '/',
        isRedirect: true,
        subMenu : [],
        logo : <MdSpaceDashboard />,
    },
    {
        name : 'Transaksi',
        isRedirect: true,
        link : '/transaksi-penjualan/transaksi',
        logo : <BsClipboard2DataFill />,
        subMenu : []
    },
    {
        name : 'Monitoring',
        link : '/transaksi-penjualan/monitoring',
        isRedirect: true,
        logo : <FaNewspaper />,
        subMenu : []
    },
    {
        name : 'Info Obat',
        link : '/transaksi-penjualan/info-obat',
        isRedirect: true,
        logo : <FaClipboardUser />,
        subMenu : []
    },
    {
        name : 'Retur',
        link : '/transaksi-penjualan/retur',
        isRedirect: true,
        logo : <FaClipboardUser />,
        subMenu : []
    }
]

export const transaksiPembelianMenus = [
    {
        name : 'Home',
        link : '/',
        isRedirect: true,
        subMenu : [],
        logo : <MdSpaceDashboard />,
    },
    {
        name : 'Surat Pesanan',
        isRedirect: true,
        link : '/transaksi-pembelian/surat-pesanan',
        logo : <BsClipboard2DataFill />,
        subMenu : []
    },
    {
        name : 'Penerimaan',
        link : '/transaksi-pembelian/penerimaan',
        isRedirect: true,
        logo : <FaNewspaper />,
        subMenu : []
    },
    {
        name : 'Faktur Pembelian',
        link : '/transaksi-pembelian/faktur-pembelian',
        isRedirect: true,
        logo : <FaClipboardUser />,
        subMenu : []
    },
    {
        name : 'E-Ticket',
        link : '/transaksi-pembelian/e-ticket',
        isRedirect: true,
        logo : <FaClipboardUser />,
        subMenu : []
    }
]

export const masterDataMenus = [
    {
        name : 'Home',
        link : '/',
        isRedirect: true,
        subMenu : [],
        logo : <MdSpaceDashboard />,
    },
    {
        name : 'Manajemen',
        link: '/master-data/manajemen',
        isRedirect: false,        
        logo : <BsClipboard2DataFill />,
        subMenu : [
            {
                link: '/master-instansi',
                name: 'Master Instansi'
            },
            {
                link: '/master-departemen',
                name: 'Master Departemen'
            },
            {
                link: '/master-jabatan',
                name: 'Master Jabatan'
            },
            {
                link: '/master-role',
                name: 'Master Role'
            },
            {
                link: '/master-user',
                name: 'Master User'
            },
            {
                link: '/master-customer',
                name: 'Master Customer'
            },
        ]
    },
    {
        name : 'Produk',
        isRedirect: false,
        link: '/master-data/produk',
        logo : <FaNewspaper />,
        subMenu : [
            {
                link: '/display-barang',
                name: 'Display Barang'
            },
            {
                link: '/master-kategori',
                name: 'Master Kategori'
            },
            {
                link: '/master-supplier',
                name: 'Master Supplier'
            },
            {
                link: '/master-barang',
                name: 'Master Barang'
            },
            {
                link: '/master-cabang',
                name: 'Master Cabang'
            },
        ]
    },
]


export const homeMenus : HomeMenuType[] = [
    { name: 'Setup Kassa', icon: <FaUser /> },
    { name: 'Tutup Kasir', icon: <FaCashRegister /> },
    { name: 'Tutup Kasir Ulang', icon: <FaRedo /> },
    { name: 'Master Data', icon: <FaDatabase />, link: '/master-data/manajemen/master-instansi' },
    { name: 'Transaksi Pembelian', icon: <FaArrowDown />, link: '/transaksi-pembelian/surat-pesanan' },
    { name: 'Transaksi Penjualan', icon: <FaArrowUp />, link: '/transaksi-penjualan/transaksi' },
    { name: 'E-Ticket', icon: <FaTicketAlt />, link: '/e-ticket/overview' },
  ];

export const eticketMenus = [
    {
        name : 'Home',
        link : '/',
        isRedirect: true,
        subMenu : [],
        logo : <MdSpaceDashboard />,
    },
    {
        name : 'E-Ticket',
        isRedirect: true,
        link : '/e-ticket/overview',
        logo : <BsClipboard2DataFill />,
        subMenu : []
    },
]