import Button from "@/components/ui/Button";
import { DataRow } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { IoMdPrint } from "react-icons/io";
import { FaTrash } from "react-icons/fa";

export const defaultData = [
    {
        no : 1, 
        namaLengkap: 'Muhammad Rangga',
        role: 'Area Manager',
        departemen: 'FAT',        
        area: 'Pusat, Tangerang',
        cabang : 'Biak, Pademangan',
        // action : 50
    },
    {
        no : 2, 
        namaLengkap: 'Pak Tarno',
        role: 'BM',
        departemen: 'FAT',        
        area: 'Selatang, Jakarta',
        cabang : 'Kalibata, Timur',
        // action : 50
    },
    {
        no : 3, 
        namaLengkap: 'Pak Tarno',
        role: 'BM',
        departemen: 'FAT',        
        area: 'Selatang, Jakarta',
        cabang : 'Kalibata, Timur',
        // action : 50
    },
    {
        no : 4, 
        namaLengkap: 'Pak Tarno',
        role: 'BM',
        departemen: 'FAT',        
        area: 'Selatang, Jakarta',
        cabang : 'Kalibata, Timur',
        // action : 50
    },
    {
        no : 5, 
        namaLengkap: 'Pak Tarno',
        role: 'BM',
        departemen: 'FAT',        
        area: 'Selatang, Jakarta',
        cabang : 'Kalibata, Timur',
        // action : 50
    },
    {
        no : 6, 
        namaLengkap: 'Pak Tarno',
        role: 'BM',
        departemen: 'FAT',        
        area: 'Selatang, Jakarta',
        cabang : 'Kalibata, Timur',
        // action : 50
    },
    {
        no : 7, 
        namaLengkap: 'Pak Tarno',
        role: 'BM',
        departemen: 'FAT',        
        area: 'Selatang, Jakarta',
        cabang : 'Kalibata, Timur',
        // action : 50
    },
    {
        no : 8, 
        namaLengkap: 'Pak Tarno',
        role: 'BM',
        departemen: 'FAT',        
        area: 'Selatang, Jakarta',
        cabang : 'Kalibata, Timur',
        // action : 50
    },
    {
        no : 9, 
        namaLengkap: 'Pak Tarno',
        role: 'BM',
        departemen: 'FAT',        
        area: 'Selatang, Jakarta',
        cabang : 'Kalibata, Timur',
        // action : 50
    },
  ]

  interface DataRowAction {    
    nomorSp: string;
    tanggalPr: string;
    jnsTrans: string;
    namaSupplier: string;
    total: number;
    keterangan: string;
  }

  export const dummyDataWithAction: DataRowAction[] = [
    {      
      nomorSp: 'SP-001',
      tanggalPr: '2024-07-01',
      jnsTrans: 'Pembelian',
      namaSupplier: 'Supplier A',
      total: 1500000,
      keterangan: 'Pembelian alat tulis',
    },
    {      
      nomorSp: 'SP-002',
      tanggalPr: '2024-07-02',
      jnsTrans: 'Pembelian',
      namaSupplier: 'Supplier B',
      total: 2500000,
      keterangan: 'Pembelian komputer',
    },
    {      
      nomorSp: 'SP-003',
      tanggalPr: '2024-07-03',
      jnsTrans: 'Pembelian',
      namaSupplier: 'Supplier C',
      total: 500000,
      keterangan: 'Pembelian makanan ringan',
    },
    {      
      nomorSp: 'SP-004',
      tanggalPr: '2024-07-04',
      jnsTrans: 'Pembelian',
      namaSupplier: 'Supplier D',
      total: 3200000,
      keterangan: 'Pembelian meja kantor',
    },
    {      
      nomorSp: 'SP-005',
      tanggalPr: '2024-07-05',
      jnsTrans: 'Pembelian',
      namaSupplier: 'Supplier E',
      total: 1250000,
      keterangan: 'Pembelian kursi kantor',
    },
  ];

  
export const createColumns = (enableSorting = true): ColumnDef<DataRow>[] => [
    {
      accessorKey: 'no',
      header: 'No',
      cell: (info) => <h1 className="text-center mx-auto">{info.getValue() as number}</h1>,
      enableSorting,
    },
    {
      accessorFn: (row) => row.namaLengkap,
      id: 'namaLengkap',
      cell: (info) => <i>{info.getValue() as number}</i>,
      header: 'Nama Lengkap',
      enableSorting,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (info) => info.renderValue(),
      enableSorting,
    },
    {
      accessorKey: 'departemen',
      header: 'Departemen',
      enableSorting,
    },
    {
      accessorKey: 'area',
      header: 'Area',
      enableSorting,
    },
    {
      accessorKey: 'cabang',
      header: 'Cabang',
      enableSorting,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      enableSorting,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {}}
            className="bg-emerald-500 text-xl text-white p-1 hover:underline"
          >
           < IoMdPrint />
          </Button>
          <Button
            onClick={() => {}}
            className="bg-red-500 text-lg text-white p-1 hover:underline"
          >
            < FaTrash />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'action2',
      header: 'Action 2',
      enableSorting,
    },
    {
      accessorKey: 'action3',
      header: 'Action 3',
      enableSorting,
    },
    {
      accessorKey: 'action4',
      header: 'Action 4',
      enableSorting,
    },
    {
      accessorKey: 'action5',
      header: 'Action 5',
      enableSorting,
    },
    {
      accessorKey: 'action6',
      header: 'Action 6',
      enableSorting,
    },
    {
      accessorKey: 'action7',
      header: 'Action 7',
      enableSorting,
    },
    {
      accessorKey: 'action8',
      header: 'Action 8',
      enableSorting,
    },
  ];

export const createColumnsWithAction = (enableSorting = true): ColumnDef<DataRow>[] => [
    {
      accessorKey: 'action',
      header: 'Action',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-2 text-center">
          <Button
            onClick={() => {}}
            className="bg-emerald-500 text-xl text-white p-1 hover:underline"
          >
           < IoMdPrint />
          </Button>
          <Button
            onClick={() => {}}
            className="bg-red-500 text-lg text-white p-1 hover:underline"
          >
            < FaTrash />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'nomorSp',
      header: 'Nomor SP',
      enableSorting,
    },
    {
      accessorKey: 'tanggalPr',
      header: 'Tanggal PR',
      enableSorting,
    },
    {
      accessorKey: 'jnsTrans',
      header: 'Jns Trans',
      enableSorting,
    },
    {
      accessorKey: 'namaSupplier',
      header: 'Nama Supplier',
      enableSorting,
    },
    {
      accessorKey: 'total',
      header: 'Total',
      enableSorting,
    },
    {
      accessorKey: 'keterangan',
      header: 'Keterangan',
      enableSorting,
    },    
  ];
  // nomer sp, tgl pr, jnsTrans, namaSupploer, total, keterangan