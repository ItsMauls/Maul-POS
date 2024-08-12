'use client'
import { useEffect, useState } from "react";
import { Table } from "@/components/Table";
import Button from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Searchbar";
import { FaCirclePlus } from "react-icons/fa6";
import { Limiter } from "@/components/Limiter";
import { useGet, usePost } from "@/hooks/useApi";
import { API_URL } from "@/constants/api";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { AddDrugModal } from "@/components/Modal/AddDrugModal";

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

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [limit, setLimit] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastUsedId, setLastUsedId] = useState<number | null>(null);
    const page = parseInt(searchParams.get('table-page') as string) || 1;

    const { data, error, isLoading, refetch } = useGet<ApiResponse>(
        `${API_URL.SALES["info-obat"]}?limit=${limit}&search=${searchTerm}&page=${page}`
    );
    const lastId: any = data?.meta.totalCount;
    
    const { mutate: saveDrug } = usePost(`${API_URL.SALES["info-obat"]}`);

    const columns: ColumnDef<ApiResponse['data'][0]>[] = [
        { accessorKey: "kd_brgdg", header: "Kode" },
        { accessorKey: "nm_brgdg", header: "Nama Obat" },
        { accessorKey: "kategori.name", header: "Kategori" },   
        { accessorKey: "hj_ecer", header: "Harga Ecer" },
        { accessorKey: "hj_bbs", header: "Harga BBS" },
        { accessorKey: "q_akhir", header: "Stok" },
    ];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        router.push(`?page=1&search=${e.target.value}`);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(e.target.value);
        setLimit(newLimit);
        router.push(`?page=1&limit=${newLimit}`);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setLastUsedId(lastId);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveDrug = async (drugData: any) => {
        try {
            console.log(drugData, 'drugData');
            
            await saveDrug(drugData);
            refetch();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving drug:", error);
        }
    };
    // useEffect(() => {
    //     if (isModalOpen) {
    //         setLimit(30);
    //         const maxId = Math.max(...data.data.map(item => (item.kd_brgdg)));    
             
    //         setLastUsedId(maxId);
    //     } else {
    //         setLastUsedId(null);
    //         setLimit(10);
    //     }
    // }, [data, isModalOpen]);

    return (
        <> 
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={handleSearch}
                        rightIcon={<div className="border border-gray-300 font-semibold px-1 rounded-md">\</div>}
                        className={"w-[295px] px-4 border-2 my-4 border-gray-100 font-normal"}
                        id="monitoringSearchbar"
                        placeholder="Cari barang disini..."
                    />
                </div>
                <div className="flex gap-x-4">
                    <Limiter value={limit} onChange={handleLimitChange} />
                    <Button 
                        hasIcon
                        icon={<FaCirclePlus />}
                        className={'bg-teal-600 rounded-xl hover:bg-teal-700 text-white'}
                        onClick={handleOpenModal}>
                        Tambah
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error.toString()}</p>
            ) : data ? (            
                <Table
                    columns={columns}
                    defaultData={data?.data || []}
                    meta={data?.meta || {}}
                    totalData={data?.meta?.totalCount || 0}
                    tableClassName="max-w-[1350px]"
                    pagination
                    enableSorting
                />
            ) : (
                <p>No data available</p>
            )}
            <AddDrugModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveDrug}
                lastUsedId={lastUsedId}
            />
        </>
    )
}