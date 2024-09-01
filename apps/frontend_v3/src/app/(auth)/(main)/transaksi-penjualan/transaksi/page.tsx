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
import { formatRupiah, roundUp } from "@/utils/currency";
import { ColumnDef } from "@tanstack/react-table";
import { useState, ChangeEvent, useEffect } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { usePost, useGet } from '@/hooks/useApi';
import { API_URL } from '@/constants/api';
import { SHORTCUTS } from "@/constants/shorcuts";

export default function Page() {
  const { data, addItem, removeItem, updateItem, calculateValues, pelanggan, dokter, clearTransaction } = useTransactionStore();
  const [isObatModalOpen, setIsObatModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { mutate: createTransaction } = usePost(API_URL.TRANSAKSI_PENJUALAN.createTransaction);
  const { data: antrianInfo, isLoading: isLoadingAntrianInfo } = useGet(API_URL.ANTRIAN.getCurrentAntrianInfo.replace(':kdCab', 'CAB001'));

  const [headerInfo, setHeaderInfo] = useState({
    Antrian: '',
    Periode: '',
    'No Bon': ''
  });
  
  useEffect(() => {
    if (antrianInfo) {
      const noAntrian = antrianInfo.noAntrian.toString().padStart(2, '0');
      const periode = antrianInfo.periode.replace(/\//g, '');
      const noBon = `R${noAntrian}${periode}`;

      setHeaderInfo(prev => ({
        ...prev,
        Antrian: noAntrian,
        Periode: antrianInfo.periode,
        'No Bon': noBon
      }));
    }
  }, [antrianInfo]);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SHORTCUTS.ADD_ITEM) {
        event.preventDefault();
        handleAddItem(data.length);
      } else if (event.key === SHORTCUTS.DELETE_ITEM) {
        event.preventDefault();
        if (data.length > 0) {
          handleRemoveItem(data.length - 1);
        }
      } else if (event.key === SHORTCUTS.OPEN_OBAT_MODAL) {
        event.preventDefault();
        setSelectedRowIndex(data.length - 1);
        setIsObatModalOpen(true);
      } else if (event.key === SHORTCUTS.CLOSE_MODAL) {
        event.preventDefault();
        setIsObatModalOpen(false);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [data.length]);

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
          name={`jenis`}
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

  const calculateGrandTotal = () => {
    return data.reduce((total, item) => {
      const roundedItemTotal = Math.ceil(item.subJumlah / 100) * 100;
      return total + roundedItemTotal;
    }, 0);
  };

  const handleCreateTransaction = async () => {
    const formattedPelanggan = {
      nama: pelanggan.nama || undefined,
      alamat: pelanggan.alamat || undefined,
      no_telp: pelanggan.no_telp || undefined,
      usia: pelanggan.usia ? parseInt(pelanggan.usia) : undefined,
      instansi: pelanggan.instansi || undefined,
      korp: pelanggan.korp || undefined,
    };

    const formattedDokter = {
      nama: dokter.nama || undefined,
      alamat: dokter.alamat || undefined,
      spesialisasi: dokter.no_telp || undefined,
    };

    const transactionData = {
      pelanggan: formattedPelanggan,
      dokter: formattedDokter,
      jenis_penjualan: "Regular",
      invoice_eksternal: "INV-001",
      catatan: "Transaction note",
      total_harga: calculateTotalAmount(),
      total_disc: data.reduce((total, item) => total + (item.subJumlah * item.disc / 100), 0),
      total_sc_misc: data.reduce((total, item) => total + item.sc + item.misc, 0),
      total_promo: data.reduce((total, item) => total + item.promoValue, 0),
      total_up: data.reduce((total, item) => total + item.up, 0),
      no_voucher: data.find(item => item.noVoucher)?.noVoucher || "",
      interval_transaksi: 0,
      buffer_transaksi: 0,
      kd_cab: "CAB001",
      items: data.map(item => ({
        kd_brgdg: item.kd_brgdg,
        jenis: item.rOption || 'R',
        harga: item.hj_ecer,
        qty: item.qty,
        subjumlah: item.subJumlah || 0,
        disc: item.disc,
        sc_misc: (item.sc || 0) + (item.misc || 0),
        promo: item.promo,
        disc_promo: item.discPromo || 0,
        up: item.up,
      }))
    };
    
    return new Promise<void>((resolve, reject) => {
      createTransaction(transactionData, {
        onSuccess: (data: any) => {
          console.log('Transaction created successfully');
          console.log(data, 'data');
          
          if (data.data.receipt) {
            // Open PDF receipt in a new tab
            const pdfBlob = new Blob([Buffer.from(data.data.receipt, 'base64')], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
          } else {
            console.warn('Receipt data not available');
          }
          // Clear the transaction storage
          clearTransaction();
          resolve();
        },
        onError: (error) => {
          console.error('Failed to create transaction:', error);
          reject(error);
        }
      });
    });
  };

  return (
    <> 
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          {Object.entries(headerInfo).map(([key, value]) => (
            <div key={key} className="flex bg-white drop-shadow-sm rounded-xl px-4 py-2 items-center space-x-2">
              <span className="font-semibold">
                <span className="bg-blue-500 text-xs py-2 rounded-l-xl mr-2 text-blue-500">|</span>
                {key}:
              </span>
              <span>
                {isLoadingAntrianInfo && (key === 'Antrian' || key === 'Periode') ? 'Loading...' : value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2 rounded-xl px-12 drop-shadow-md py-2 bg-white">        
          <span className="font-semibold">Grand Total:</span>
          <span>{formatRupiah(calculateGrandTotal())}</span>
        </div>
      </div>
  
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
              // grandTotal={calculateGrandTotal()}
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
        createTransaction={handleCreateTransaction}
      />
    </>
  );
}