'use client'
import { Table } from "@/components/Table";
import Button from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Searchbar";
import { useRouter } from "next/navigation";
import { useGet } from "@/hooks/useApi";
import { API_URL } from "@/constants/api";
import { formatRupiah } from "@/utils/currency";
import { useEffect, useState } from "react";

interface KeranjangData {
    id: number;
    id_antrian: number;
    items: Array<{
        sc: number;
        up: number;
        qty: number;
        disc: number;
        misc: number;
        index: number;
        promo: number;
        jumlah: number;
        hj_ecer: number;
        // ... other item properties
    }>;
    pelanggan: {
        id: number;
        korp: string;
        nama: string;
        usia: number;
        alamat: string;
        noTelp: string;
    };
    dokter: Record<string, any>;
    total_harga: string;
    total_disc: string;
    total_sc_misc: string;
    total_promo: string;
    total_up: string;
    no_voucher: string;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    data: KeranjangData[];
}

export default function Page() {
    const router = useRouter();
    const { data: response, isLoading, error } = useGet<ApiResponse>(API_URL.TRANSAKSI_PENJUALAN.getKeranjang);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedKeranjang, setSelectedKeranjang] = useState<KeranjangData | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    console.log(selectedKeranjang);
    

    const handleBack = () => {
        router.push('/transaksi-penjualan/transaksi');
    }

    const handleRowSelect = (index: number) => {
        setSelectedRow(index);
        const selectedData = filteredData[index];
        setSelectedKeranjang(selectedData);
    };

    const filteredData = response?.data?.filter(item => 
        item.pelanggan?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const keranjangColumns = [
        { 
            accessorKey: "id_antrian", 
            header: "Nomor Antrian",
        },
        { 
            accessorKey: "pelanggan.nama", 
            header: "Nama Customer",
            cell: ({ row }) => row.original.pelanggan?.nama || '-'
        },
        { 
            accessorKey: "pelanggan.alamat", 
            header: "Alamat",
            cell: ({ row }) => row.original.pelanggan?.alamat || '-'
        },
        { 
            accessorKey: "pelanggan.noTelp", 
            header: "No. Telp",
            cell: ({ row }) => row.original.pelanggan?.noTelp || '-'
        },
        { 
            accessorKey: "dokter.nama", 
            header: "Dokter",
            cell: ({ row }) => row.original.dokter?.nama || '-'
        },
        { 
            accessorKey: "total_harga", 
            header: "Total",
            cell: ({ row }) => formatRupiah(parseFloat(row.original.total_harga) || 0)
        },
        { 
            accessorKey: "created_at", 
            header: "Tanggal",
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('id-ID')
        },
    ];

    const itemColumns = [
        {
            accessorKey: "index",
            header: "No",
            cell: ({ row }) => row.index + 1
        },
        {
            accessorKey: "nm_brgdg",
            header: "Nama Barang",
            cell: ({ row }) => row.original.nm_brgdg || '-'
        },
        {
            accessorKey: "qty",
            header: "Qty",
        },
        {
            accessorKey: "hj_ecer",
            header: "Harga",
            cell: ({ row }) => formatRupiah(row.original.hj_ecer || 0)
        },
        {
            accessorKey: "disc",
            header: "Disc (%)",
        },
        {
            accessorKey: "sc",
            header: "SC",
            cell: ({ row }) => formatRupiah(row.original.sc || 0)
        },
        {
            accessorKey: "misc",
            header: "Misc",
            cell: ({ row }) => formatRupiah(row.original.misc || 0)
        },
        {
            accessorKey: "jumlah",
            header: "Jumlah",
            cell: ({ row }) => formatRupiah(row.original.jumlah || 0)
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <SearchBar 
                    leftIcon
                    rightIcon={<div className="border border-gray-300 font-semibold px-1 rounded-md">\</div>}
                    className={"w-[295px] px-4 border-2 my-4 border-gray-100 font-normal"}
                    id="monitoringSearchbar"
                    placeholder="Cari Nama Customer"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex justify-between gap-x-4 my-4">
                    <Button
                        hasIcon
                        icon={            
                            <span className="ml-2 py-1 px-2 bg-black text-white rounded-lg text-xs">
                                Enter
                            </span>
                        }
                        onClick={handleBack}
                        className={'border border-gray-400 rounded-xl py-0'}
                    >
                        Pilih
                    </Button>
                    <Button
                        hasIcon
                        icon={            
                            <span className="ml-2 py-1 px-2 bg-black text-white rounded-lg text-xs">
                                Esc
                            </span>
                        }
                        onClick={handleBack}
                        className={'border border-gray-400 rounded-xl py-0'}
                    >
                        Kembali
                    </Button>
                </div>
            </div>

            {/* Tabel Keranjang */}
            <Table
                columns={keranjangColumns}
                defaultData={filteredData}
                meta={{ totalCount: filteredData.length }}
                totalData={filteredData.length}
                enableSorting
                onRowClick={handleRowSelect}
                selectedRow={selectedRow}
            />

            {/* Tabel Items */}
            {selectedKeranjang && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Detail Items</h3>
                    <Table
                        columns={itemColumns}
                        defaultData={selectedKeranjang.items}
                        meta={{ totalCount: selectedKeranjang.items.length }}
                        totalData={selectedKeranjang.items.length}
                        enableSorting={false}
                    />
                </div>
            )}
        </div>
    );
}
    
