'use client'
import { SingleAccordion } from "@/components/Accordion/SingleAccordion";
import { Card } from "@/components/Card";
import { AdditionalTransaksiContent } from "@/components/Content/AdditionalTransaksiContent";
import { DokterCardContent } from "@/components/Content/DokterCardContent";
import { PelangganCardContent } from "@/components/Content/PelangganCardContent";
import { TransaksiCardContent } from "@/components/Content/TransaksiCardContent";
import { ObatModal } from "@/components/Modal/ObatModal";
import { PaymentModal } from "@/components/Modal/PaymentModal";
import { SelectField } from "@/components/SelectField";
import { Table } from "@/components/Table";
import { DataRow } from "@/types";
import { formatRupiah } from "@/utils/currency";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect, ChangeEvent } from "react";
import { useTransactionStore } from "@/store/transactionStore";

export default function Page() {
  const { data, addItem, removeItem, updateItem, calculateValues } = useTransactionStore();
  const [isObatModalOpen, setIsObatModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleAddItem = (index: number) => {
    addItem(index);
  };

  const handleRemoveItem = (index: number) => {
    removeItem(index);
  };

  const handleObatSelect = (obat: DataRow) => {
    if (selectedRowIndex !== null) {
      const updatedItem = calculateValues({
        ...data[selectedRowIndex],
        kd_brgdg: obat.kd_brgdg,
        nm_brgdg: obat.nm_brgdg,
        hj_ecer: obat.hj_ecer,
      });
      updateItem(selectedRowIndex, updatedItem);
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
      cell: ({ row }) => (
        <SelectField
          label=""
          name={`rOption-${row.index}`}
          register={() => {}}
          options={[
            { value: "R", label: "R" },
            { value: "RC", label: "RC" }
          ]}
          placeholder="Select"
          value={row.original.rOption}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => updateItem(row.index, { rOption: e.target.value })}
        />
      ),
    },
    {
      accessorKey: "kd_brgdg",
      header: "Kd Barang",
    },
    {
      accessorKey: "nm_brgdg",
      header: "Nama Barang",
      cell: ({ row }) => (
        <input
          type="text"
          value={row.original.nm_brgdg}
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
      accessorKey: "hj_ecer",
      header: "Harga",
      cell: ({ row }) => `${formatRupiah(row.original.hj_ecer)}`,
    },
    {
      accessorKey: "qty",
      header: "Qty",
    },
    {
      accessorKey: "subJumlah",
      header: "Sub Jumlah",
      cell: ({ row }) => `${formatRupiah(row.original.subJumlah)}`,
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
      cell: ({ row }) => `${formatRupiah(row.original.jumlah)}`,
    },
    {
      accessorKey: "promo",
      header: "Promo (%)",
    },
    {
      accessorKey: "discPromo",
      header: "Disc Promo",
      cell: ({ row }) => `${formatRupiah(row.original.discPromo)}`,
    },
    {
      accessorKey: "promoValue",
      header: "Promo",
      cell: ({ row }) => `${formatRupiah(row.original.promoValue)}`,
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

  const calculateTotalAmount = () => {
    return data.reduce((total, item) => total + item.jumlah, 0);
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
            <TransaksiCardContent 
              data={data} 
              onPaymentClick={() => setIsPaymentModalOpen(true)}
            />
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
      <PaymentModal
        transactionId={Math.random().toString(36).substring(2, 15)}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={calculateTotalAmount()}
      />
    </>
  );
}