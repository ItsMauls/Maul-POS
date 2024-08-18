'use client'
import { useState } from "react";
import { Table } from "@/components/Table";
import Button from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Searchbar";
import { useGet, usePost } from "@/hooks/useApi";
import { API_URL } from "@/constants/api";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { MdOtherHouses } from "react-icons/md";
import { FaPlus, FaEdit, FaCalendarAlt, FaRedo, FaCheck } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CustomFormModal from "@/components/Modal/CustomFormModal";

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
    // Define your penerimaan data structure here
    id: number;
    nomor_penerimaan: string;
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const page = parseInt(searchParams.get('table-page') as string) || 1;

  const { data, error, isLoading, refetch } = useGet<ApiResponse>(
    `${API_URL.PURCHASE_PEMBELIAN.penerimaan}?limit=${limit}&search=${searchTerm}&page=${page}&date=${selectedDate ? formatDate(selectedDate) : ''}`
  );

  const { mutate: createPenerimaan, isPending: isCreating } = usePost(`${API_URL.PURCHASE_PEMBELIAN.penerimaan}`);

  const columns: ColumnDef<ApiResponse['data'][0]>[] = [
    { accessorKey: "nomor_sp", header: "No. SP" },
    { accessorKey: "nomor_preorder", header: "No. PO" },
    { accessorKey: "tgl_preorder", header: "Tanggal PO" },
    { accessorKey: "scan", header: "Scan SP" },
    { accessorKey: "jns_trans", header: "Jenis Transaksi" },
    { accessorKey: "no_reff", header: "No. Reff" },
    { accessorKey: "tgl_reff", header: "Tanggal Reff" },
    { accessorKey: "nama_supplier", header: "Nama Supplier" },
    { accessorKey: "total", header: "Total Harga" },
    { accessorKey: "keterangan", header: "Keterangan" },    
    { accessorKey: "tanggal_jt", header: "Tanggal JT" },
    { accessorKey: "status", header: "Status Approval" },
    { accessorKey: "tgl_approve", header: "Tanggal Approval" },
    { accessorKey: "tanggal", header: "Tanggal" },
    // Add other columns as needed
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
  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };
  const handleAddModalSave = async (formData: any) => {
    try {
      const penerimaanData = {
        ...formData,
        userId: 1, // Replace with actual user ID
        status_approval: 'pending', // Set initial status
        total: formData.items.reduce((sum: number, item: any) => sum + (item.total || 0), 0),
      };
      console.log(penerimaanData, 'tes');
      
      await createPenerimaan(penerimaanData);
      setIsAddModalOpen(false);
      // Refetch data after successful creation
      refetch();
    } catch (error) {
      console.error("Error creating penerimaan:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleShortcut = (action: string) => {
    switch (action) {
      case 'Tambah':
        console.log('Add new penerimaan');
        setIsAddModalOpen(true);
        // Implement add functionality
        break;        
      case 'Pilih Tanggal':
        setIsDatePickerOpen(true);
        break;
      case 'Reset SP Gantung':
        console.log('Reset SP Gantung');
        // Implement reset SP Gantung functionality
        break;
      case 'Persetujuan':
        console.log('Approval process');
        // Implement approval functionality
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
          placeholder="Cari No. Penerimaan disini..."
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
          {/* <Button
            hasIcon
            icon={<FaEdit />}
            onClick={() => handleShortcut('Ganti Tujuan')}
            className={'bg-teal-600 px-3 rounded-xl hover:bg-teal-700 text-white'}
          >
            Ganti Tujuan
            <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-lg text-xs">
              F1
            </span>
          </Button> */}
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
          {/* <Button
            hasIcon
            icon={<FaRedo />}
            onClick={() => handleShortcut('Reset SP Gantung')}
            className={'bg-teal-600 px-3 rounded-xl hover:bg-teal-700 text-white'}
          >
            Reset SP Gantung
            <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-lg text-xs">
              F10
            </span>
          </Button> */}
          <Button
            hasIcon
            icon={<FaCheck />}
            onClick={() => handleShortcut('Persetujuan')}
            className={'bg-blue-600 px-3 rounded-xl hover:bg-blue-700 text-white'}
          >
            Persetujuan
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
      {isAddModalOpen && (
        <CustomFormModal
          isVisible={isAddModalOpen}
          onClose={handleAddModalClose}
          onSave={handleAddModalSave}
          title="Tambah Penerimaan"
          fields={[
            { name: "nomor_sp", label: "No. SP", type: "text", required: true },
            { name: "nomor_preorder", label: "No. PO", type: "text", required: true },
            { name: "tgl_preorder", label: "Tanggal PO", type: "date", required: true },
            { name: "jns_trans", label: "Jenis Transaksi", type: "text", required: true },
            { name: "no_reff", label: "No. Reff", type: "text", required: true },
            { name: "tgl_reff", label: "Tanggal Reff", type: "date", required: true },
            { name: "nama_supplier", label: "Nama Supplier", type: "text", required: true },
            { name: "tanggal_jt", label: "Tanggal Jatuh Tempo", type: "date", required: true },
            { name: "keterangan", label: "Keterangan", type: "textarea", required: false },
          ]}
          itemColumns={[        
            { key: "kode_barang", label: "Kode Barang", type: "text" },
            { key: "nama_barang", label: "Nama Barang", type: "text" },
            { key: "qty", label: "Qty", type: "number" },
            { key: "harga_satuan", label: "Harga Satuan", type: "number" },
            { key: "disc", label: "Diskon (%)", type: "number" },
            { key: "total", label: "Total", type: "number" },
          ]}
        />
      )}
    </>
    
  )
}