'use client'
import { useState } from "react";
import { Table } from "@/components/Table";
import Button from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Searchbar";
import DatePicker from 'react-datepicker'; // Import react-datepicker
import { GoDownload } from 'react-icons/go'
import { Limiter } from "@/components/Limiter";
import { useGet } from "@/hooks/useApi";
import { API_URL } from "@/constants/api";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css"; 

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Array<{
    no_bon: number;
    tanggal: string;
    jam: string;
    kasir: string;
    kassa: string;
    shift: string;
    customer: string;
    alamat: string;
    instansi: string;
    dokter: string;
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const page = parseInt(searchParams.get('table-page') as string) || 1;

  const { data, error, isLoading } = useGet<ApiResponse>(
    `${API_URL.SALES["transaksiPenjualan"]}?limit=${limit}&search=${searchTerm}&page=${page}&date=${selectedDate ? formatDate(selectedDate) : ''}`
  );

  const columns: ColumnDef<ApiResponse['data'][0]>[] = [
    { accessorKey: "no_bon", header: "No. Bon" },
    { accessorKey: "tanggal", header: "Tanggal" },
    { accessorKey: "jam", header: "Jam" },
    { accessorKey: "kasir", header: "Kasir" },
    { accessorKey: "kassa", header: "Kassa" },
    { accessorKey: "shift", header: "Shift" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "alamat", header: "Alamat" },
    { accessorKey: "instansi", header: "Instansi" },
    { accessorKey: "dokter", header: "Dokter" },
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

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      router.push(`?page=1&date=${formatDate(date)}`);
    } else {
      router.push(`?page=1`);
    }
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
          placeholder="Cari No. Bon/Kasir disini..."
        />
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className={"px-4 py-2 border-2 border-gray-100 font-normal pr-8"}
            placeholderText="Select date"
            withPortal
            showYearDropdown
            scrollableMonthYearDropdown
          />
          {selectedDate && (
            <button
              onClick={() => handleDateChange(null)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Clear date</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-x-4">
        <Limiter value={limit} onChange={handleLimitChange} />
        <Button 
          hasIcon
          icon={<GoDownload />}
          className={'bg-teal-600 px-3 rounded-xl hover:bg-teal-700 text-white'}>
          Export
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