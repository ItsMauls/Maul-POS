'use client'
import { useState } from "react";
import { Table } from "@/components/Table";
import Button from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Searchbar";
import { useGet } from "@/hooks/useApi";
import { API_URL } from "@/constants/api";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { MdOtherHouses } from "react-icons/md";
import { GoDownload } from "react-icons/go";


interface ApiResponse {
  success: boolean;
  message: string;
  data: Array<{
    // Define your e-ticket data structure here
    id: number;
    nomor_bon: string;
    tanggal: string;
    // Add other fields as needed
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
  const page = parseInt(searchParams.get('table-page') as string) || 1;

  const { data, error, isLoading } = useGet<ApiResponse>(
    `${API_URL.PURCHASE_PEMBELIAN.eTicket}?limit=${limit}&search=${searchTerm}&page=${page}`
  );

  const columns: ColumnDef<ApiResponse['data'][0]>[] = [
    { accessorKey: "no_lpb", header: "No. LPB" },
    { accessorKey: "jenis_transaksi", header: "Jenis Transaksi" },
    { accessorKey: "tgl_lpb", header: "Tgl LPB" },
    { accessorKey: "polos", header: "Polos" },
    { accessorKey: "no_reff", header: "No. Reff" },
    { accessorKey: "total", header: "Total" },
    { accessorKey: "keterangan", header: "Keterangan" },
    { accessorKey: "userId", header: "User ID" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    router.push(`?page=1&search=${e.target.value}`);
  };

  const handleAddETicket = () => {
    console.log('Add new e-ticket');
    // Implement add e-ticket functionality
  };

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
          placeholder="Cari No. Bon disini..."
        />
      </div>
      <div className="flex gap-x-4">
        <Button
          hasIcon
          icon={<GoDownload />}
          onClick={handleAddETicket}
          className={'bg-teal-600 rounded-xl hover:bg-teal-700 text-white'}
        >
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
    </>
  )
}