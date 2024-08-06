'use client'
import { useEffect, useState } from "react";
import { Table } from "@/components/Table";
import Button from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Searchbar";
import { FaCirclePlus } from "react-icons/fa6";
import { Limiter } from "@/components/Limiter";
import { useGet } from "@/hooks/useApi";
import { API_URL } from "@/constants/api";
import { ColumnDef } from "@tanstack/react-table";

interface ApiResponse {
  success: boolean;
  message: string;
  data: Array<{
    kd_brgdg: number;
    nm_brgdg: string;
    // ... other properties
  }>;
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export default function InfoObatPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("nm_brgdg");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const { data, error, isLoading } = useGet<ApiResponse>(
        API_URL.SALES["info-obat"],
        {
            limit,
            search: searchTerm,
            sortBy,
            sortOrder
        }
    );

    useEffect(() => {
        console.log('Data changed:', data);
    }, [data]);

    const columns: ColumnDef<ApiResponse['data'][0]>[] = [
        { accessorKey: "kd_brgdg", header: "Kode" },
        { accessorKey: "nm_brgdg", header: "Nama Obat" },
        { accessorKey: "category.name", header: "Kategori" },
        { accessorKey: "hj_ecer", header: "Harga Ecer" },
        { accessorKey: "hj_bbs", header: "Harga BBS" },
        { accessorKey: "q_akhir", header: "Stok" },
    ];

    return (
        <> 
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        rightIcon={<div className="border border-gray-300 font-semibold px-1 rounded-md">\</div>}
                        className={"w-[295px] px-4 border-2 my-4 border-gray-100 font-normal"}
                        id="monitoringSearchbar"
                        placeholder="Cari barang disini..."
                    />
                </div>
                <div className="flex gap-x-4">
                    <Limiter value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
                    <Button 
                        hasIcon
                        icon={<FaCirclePlus />}
                        className={'bg-teal-600 rounded-xl hover:bg-teal-700 text-white'}>
                        Tambah
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error.toString()}</p>
            ) : data && data.data ? (
                <Table
                    columns={columns}
                    defaultData={data.data}
                    meta={data.meta}
                    tableClassName="max-w-[1350px]"
                    pagination
                    enableSorting
                />
            ) : (
                <p>No data available</p>
            )}
        </>
    )
}