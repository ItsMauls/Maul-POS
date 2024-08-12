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
import { FaPlus, FaEdit, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
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
    nomor_pembelian: string;
    jns_trans: string;
    no_reff: string;
    tgl_reff: string;
    id_supplier: number;
    sub_total: number;
    total: number;
    keterangan?: string;
    tanggal_jt: string;
    userId: number;
    status_bayar: string;
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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const page = parseInt(searchParams.get('table-page') as string) || 1;

  const { data, error, isLoading } = useGet<ApiResponse>(
    `${API_URL.PURCHASE_PEMBELIAN.fakturPembelian}?limit=${limit}&search=${searchTerm}&page=${page}&date=${selectedDate ? formatDate(selectedDate) : ''}`
  );

  const columns: ColumnDef<ApiResponse['data'][0]>[] = [
    { accessorKey: "nomor_pembelian", header: "No. Pembelian" },
    { accessorKey: "jns_trans", header: "Jenis Transaksi" },
    { accessorKey: "no_reff", header: "No. Referensi" },
    { accessorKey: "tgl_reff", header: "Tanggal Referensi" },
    { accessorKey: "id_supplier", header: "ID Supplier" },
    { accessorKey: "sub_total", header: "Sub Total" },
    { accessorKey: "total", header: "Total" },
    { accessorKey: "tanggal_jt", header: "Tanggal Jatuh Tempo" },
    { accessorKey: "status_bayar", header: "Status Pembayaran" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    router.push(`?page=1&search=${e.target.value}`);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    if (date) {
      router.push(`?page=1&date=${formatDate(date)}`);
    } else {
      router.push(`?page=1`);
    }
  };

  const handleShortcut = (action: string) => {
    switch (action) {
      case 'Tambah':
        console.log('Add new faktur');
        // Implement add functionality
        break;
      case 'Ganti Tujuan':
        console.log('Change destination');
        // Implement change destination functionality
        break;
      case 'Pilih Tanggal':
        setIsDatePickerOpen(true);
        break;
      case 'Pelunasan':
        console.log('Process payment');
        // Implement payment functionality
        break;
    }
  };

  return (
    <> 
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-x-4">
        <div className="bg-white p-2 rounded-lg items-center gap-x-2 text-black flex">
          <div className="text-2xl text-blue-500">
            <MdOtherHouses/>
          </div>
          <strong className="font-semibold">Gudang 1</strong> 
        </div>
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          rightIcon={<div className="border border-gray-300 font-semibold px-1 rounded-md">\</div>}
          className={"w-[295px] px-4 border-2 my-4 border-gray-100 font-normal"}
          id="monitoringSearchbar"
          placeholder="Cari No. Pembelian disini..."
        />
      </div>
      <div className="flex gap-x-4">        
        <div className="flex gap-x-2">
          <Button
            hasIcon
            icon={<FaPlus />}
            onClick={() => handleShortcut('Tambah')}
            className={'bg-teal-600 px-3 rounded-xl hover:bg-teal-700 text-white'}
          >
            Tambah
            <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-lg text-xs">
              Insert
            </span>
          </Button>
          <Button
            hasIcon
            icon={<FaEdit />}
            onClick={() => handleShortcut('Ganti Tujuan')}
            className={'bg-teal-600 px-3 rounded-xl hover:bg-teal-700 text-white'}
          >
            Ganti Tujuan
            <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-lg text-xs">
              F1
            </span>
          </Button>
          <Button
            hasIcon
            icon={<FaCalendarAlt />}
            onClick={() => handleShortcut('Pilih Tanggal')}
            className={'bg-teal-600 px-3 rounded-xl hover:bg-teal-700 text-white'}
          >
            Pilih Tanggal
            <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-lg text-xs">
              F3
            </span>
          </Button>
          <Button
            hasIcon
            icon={<FaMoneyBillWave />}
            onClick={() => handleShortcut('Pelunasan')}
            className={'bg-teal-600 px-3 rounded-xl hover:bg-teal-700 text-white'}
          >
            Pelunasan
          </Button>
        </div>
      </div>
    </div>
    {isDatePickerOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            inline
            showYearDropdown
            scrollableMonthYearDropdown
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setIsDatePickerOpen(false)}
              className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDateChange(selectedDate)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    )}
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