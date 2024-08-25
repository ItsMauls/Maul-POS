'use client'
import { SingleAccordion } from "@/components/Accordion/SingleAccordion";
import { Card } from "@/components/Card";
import { AdditionalTransaksiContent } from "@/components/Content/AdditionalTransaksiContent";
import { DokterCardContent } from "@/components/Content/DokterCardContent";
import { PelangganCardContent } from "@/components/Content/PelangganCardContent";
import { TransaksiCardContent } from "@/components/Content/TransaksiCardContent";
import { ObatModal } from "@/components/Modal/ObatModal";
import { Table } from "@/components/Table";
import { DataRow } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

// Sample data - replace this with your actual data source
const defaultData: DataRow[] = [
  {
    index: 0,
    rOption: "R",
    kdBarang: "BRG001",
    namaBarang: "Paracetamol",
    harga: 10000,
    qty: 2,
    subJumlah: 20000,
    disc: 0,
    sc: 0,
    misc: 0,
    jumlah: 20000,
    promo: 0,
    discPromo: 0,
    promoValue: 0,
    up: 0,
    noVoucher: "-",
  },
  // Add more sample data as needed
];

export default function Page() {
  const [data, setData] = useState<DataRow[]>(defaultData);
  const [isObatModalOpen, setIsObatModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const handleAddItem = (index: number) => {
    const newItem: DataRow = {
      index: data.length,
      rOption: "R",
      kdBarang: `BRG${(data.length + 1).toString().padStart(3, '0')}`,
      namaBarang: "New Item",
      harga: 0,
      qty: 1,
      subJumlah: 0,
      disc: 0,
      sc: 0,
      misc: 0,
      jumlah: 0,
      promo: 0,
      discPromo: 0,
      promoValue: 0,
      up: 0,
      noVoucher: "-",
    };
    setData([...data.slice(0, index + 1), newItem, ...data.slice(index + 1)]);
  };

  const handleRemoveItem = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const handleObatSelect = (obat: DataRow) => {
    if (selectedRowIndex !== null) {
      const newData = [...data];
      newData[selectedRowIndex] = {
        ...newData[selectedRowIndex],
        kdBarang: obat.kdBarang,
        namaBarang: obat.namaBarang,
        harga: obat.harga,
        // Update other fields as necessary
      };
      setData(newData);
    }
    setIsObatModalOpen(false);
  };

  const accordionMenus = [
    {
      trigger: 'Pelanggan',
      content : <PelangganCardContent />
    }, {
      trigger: 'Dokter',
      content: <DokterCardContent />
    }
  ]
  

  const createColumns: ColumnDef<DataRow>[] = [
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleRemoveItem(row.index)}
            className="text-red-500 font-bold px-2 py-1 rounded"
          >
            -
          </button>
          <button
            onClick={() => handleAddItem(row.index)}
            className="text-green-500 font-bold px-2 py-1 rounded"
          >
            +
          </button>
        </div>
      ),
    },
    {
      accessorKey: "index",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "rOption",
      header: "R",
      cell: ({ row }) => row.original.rOption,
    },
    {
      accessorKey: "kdBarang",
      header: "Kd Barang",
    },
    {
      accessorKey: "namaBarang",
      header: "Nama Barang",
      cell: ({ row }) => (
        <input
          type="text"
          value={row.original.namaBarang}
          onClick={() => {
            setSelectedRowIndex(row.index);
            setIsObatModalOpen(true);
          }}
          readOnly
          className="w-full cursor-pointer"
        />
      ),
    },
    {
      accessorKey: "harga",
      header: "Harga",
      cell: ({ row }) => `Rp ${row.original.harga.toLocaleString()}`,
    },
    {
      accessorKey: "qty",
      header: "Qty",
    },
    {
      accessorKey: "subJumlah",
      header: "Sub Jumlah",
      cell: ({ row }) => `Rp ${row.original.subJumlah.toLocaleString()}`,
    },
    {
      accessorKey: "disc",
      header: "Disc (%)",
    },
    {
      accessorKey: "sc",
      header: "SC",
    },
    {
      accessorKey: "misc",
      header: "Misc",
    },
    {
      accessorKey: "jumlah",
      header: "Jumlah",
      cell: ({ row }) => `Rp ${row.original.jumlah.toLocaleString()}`,
    },
    {
      accessorKey: "promo",
      header: "Promo (%)",
    },
    {
      accessorKey: "discPromo",
      header: "Disc Promo",
      cell: ({ row }) => `Rp ${row.original.discPromo.toLocaleString()}`,
    },
    {
      accessorKey: "promoValue",
      header: "Promo",
      cell: ({ row }) => `Rp ${row.original.promoValue.toLocaleString()}`,
    },
    {
      accessorKey: "up",
      header: "UP",
    },
    {
      accessorKey: "noVoucher",
      header: "No Voucher",
    },
  ];

  const meta = {
    totalData: data.length
  };

  return (
    <> 
      <div className="flex space-x-4">
        <div className="flex-1">
          <Table
            meta={meta}
            defaultData={data}
            columns={createColumns}
            enableSorting={false}
          />
        </div>
        <div className="w-[280px] space-y-4">
          <Card className="h-[448px]">
            <TransaksiCardContent />
          </Card>
          {accordionMenus.map((val, index) => (
            <SingleAccordion 
              key={index}
              trigger={val.trigger}
              content={val.content}
            />
          ))}
          <Card className="h-[242px]">
            <AdditionalTransaksiContent />
          </Card>
        </div>
      </div>
      <ObatModal
        isOpen={isObatModalOpen}
        onClose={() => setIsObatModalOpen(false)}
        onSelect={handleObatSelect}
      />
    </>
  );
}