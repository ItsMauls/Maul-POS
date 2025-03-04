'use client'
import { SingleAccordion } from "@/components/Accordion/SingleAccordion";
import { Card } from "@/components/Card";
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
import { useState, useEffect } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { usePost, useGet } from '@/hooks/useApi';
import { API_URL } from '@/constants/api';
import { SHORTCUTS } from "@/constants/shorcuts";
import { MiscModal } from "@/components/Modal/MiscModal/index";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSetupKassaStore } from "@/store/setupKassa";


interface AntrianInfo {
  noAntrian: number;
  periode: string;
}

export default function Page() {
  const { 
    data, 
    posType,
    addItem, 
    removeItem, 
    updateItem, 
    calculateValues, 
    pelanggan, 
    dokter, 
    setAntrian, 
    clearTransaction ,
    updateTotals,
    setPosType
  } = useTransactionStore();
  console.log(data, 'DATA');
  
  const [isObatModalOpen, setIsObatModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [change, setChange] = useState(0);
  const [paymentData, setPaymentData] = useState<any>({});
  const { mutate: createTransaction } = usePost(API_URL.TRANSAKSI_PENJUALAN.createTransaction);
  const { data: antrianInfo, isLoading: isLoadingAntrianInfo, refetch: refetchAntrianInfo } = useGet<AntrianInfo>(API_URL.ANTRIAN.getCurrentAntrianInfo.replace(':kdCab', 'CAB001'));
  const { register } = useForm();
  const router = useRouter();
  const { setTipePOS, tipePOS } = useSetupKassaStore();

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

      setAntrian({
        noAntrian,
        periode: antrianInfo.periode,
        noBon
      });

      updateTotals(
       { 
        total_harga: calculateGrandTotal(),
        total_disc: data.reduce((total, item) => total + (item.subJumlah * item.disc / 100), 0),
        total_sc_misc: data.reduce((total, item) => total + item.sc + item.misc, 0),
        total_promo: data.reduce((total, item) => total + item.promoValue, 0),
        total_up: data.reduce((total, item) => total + item.up, 0)
      }
      )
    }
  }, [antrianInfo, setAntrian, updateTotals]);

  const handleAddItem = (index: number) => {
    addItem(index);
  };

  const handleRemoveItem = (index: number) => {
    removeItem(index);
  };
  console.log(data, 'items');
  const handleObatSelect = (obat: DataRow) => {    
    if (selectedRowIndex !== null) {
      const currentItem = data[selectedRowIndex];
      let adjustedPrice = obat.hj_ecer;
      let sc = 0;

      // Hanya tambahkan SC jika rOption sudah dipilih
      if (currentItem.rOption === 'R') {
        sc = 6000;
      } else if (currentItem.rOption === 'RC') {
        sc = 12000;
      }

      const updatedItem = calculateValues({
        ...currentItem,
        kd_brgdg: obat.kd_brgdg,
        nm_brgdg: obat.nm_brgdg,
        hj_ecer: adjustedPrice,
        sc: sc,
        subJumlah: (adjustedPrice * (currentItem.qty || 1)) + sc,
        activePromo: obat.activePromo,
      });
      updateItem(selectedRowIndex, updatedItem);
    }
    setIsObatModalOpen(false);
  };

  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Add this function to handle row selection
  const handleRowSelect = (index: number) => {
    setSelectedRow(index);
    setSelectedRowIndex(index);
  };

  const [isMiscModalOpen, setIsMiscModalOpen] = useState(false);
  const [miscOptions, _] = useState([
    { value: 'salep', label: 'Salep', price: 5000 },
    { value: 'kapsul', label: 'Kapsul', price: 3000 },
    // Add more misc options as needed
  ]);
  console.log(paymentData, 'paymentData');
  
  const handlePaymentData = (paymentData: any) => {
    setPaymentData(paymentData);
    // if (paymentData.paymentType === 'CASH') {
      const cashAmount = paymentData && paymentData.cashPayment && paymentData.cashPayment.amount;
      const changeAmount = cashAmount - calculateGrandTotal();
      setChange(changeAmount);
    // } else {
    //   setChange(0);
    // }
  };

  const handleMiscSelect = (miscOption: { value: string, label: string, price: number }) => {
    if (selectedRow !== null) {
      const updatedItem = {
        ...data[selectedRow],
        misc: miscOption.price,
        subJumlah: data[selectedRow].subJumlah + miscOption.price
      };
      updateItem(selectedRow, updatedItem);
    }
    setIsMiscModalOpen(false);
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
      } else if (event.key === 'F12') {
        event.preventDefault();
        if (selectedRow !== null) {
          setIsMiscModalOpen(true);
        }
      } else if (event.key === SHORTCUTS.BON_GANTUNG) {
        router.push('/transaksi-penjualan/tunda')
      } else if (event.key === SHORTCUTS.SWITCH_POS_TYPE) {
        event.preventDefault();
        const newTipePOS = tipePOS === '01 - Swalayan' ? '02 - Resep' : '01 - Swalayan';
        setTipePOS(newTipePOS);
        toast.success(`Beralih ke POS ${newTipePOS}`);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [data.length, selectedRow, handleAddItem, handleRemoveItem, setTipePOS, tipePOS]);

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
          name={`items.${row.index}.rOption`}
          register={register}
          options={[
            { value: "R", label: "R" },
            { value: "RC", label: "RC" }
          ]}
          placeholder="Select"
          value={row.original.rOption}
          onChange={(e) => {
            const newROption = e.target.value;
            let sc = 0;

            // Tentukan SC berdasarkan rOption
            if (newROption === 'R') {
              sc = 6000;
            } else if (newROption === 'RC') {
              sc = 12000;
            }

            // Update item dengan SC yang baru
            const updatedItem = calculateValues({
              ...row.original,
              rOption: newROption,
              sc: sc
            });

            updateItem(row.index, updatedItem);
          }}
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
      cell: ({ row }) => {
        const [localQty, setLocalQty] = useState(row.original.qty || 1) as any;
    
        return (
          <input
            type="number"
            value={localQty}
            onChange={(e) => setLocalQty(parseInt(e.target.value) || 1)}
            onBlur={() => {
              const newQty = parseInt(localQty) || 1;
              const updatedItem = calculateValues({
                ...row.original,
                qty: newQty,
                subJumlah: (row.original.hj_ecer * newQty) + (row.original.sc || 0)
              });
              updateItem(row.index, updatedItem);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newQty = parseInt(localQty) || 1;
                const updatedItem = calculateValues({
                  ...row.original,
                  qty: newQty,
                  subJumlah: (row.original.hj_ecer * newQty) + (row.original.sc || 0)
                });
                updateItem(row.index, updatedItem);
              }
            }}
            className="w-12"
            min="1"
          />
        );
      },
    },
    {
      accessorKey: "subJumlah",
      header: "Sub Jumlah",
      cell: ({ row }) => `${formatRupiah(row.original.subJumlah)}`,
    },
    {
      accessorKey: "activePromo.diskon",
      header: "Disc (%)",
      cell: ({ row }) => {
        const activePromo = row.original.activePromo;
        if (activePromo) {
          return `${activePromo.diskon}%`;
        }
        return '-';
      },
    },
    {
      accessorKey: "sc",
      header: "SC",
      cell: ({ row }) => {
        let sc = 0;
        if (row.original.rOption === 'R') {
          sc = 6000;
        } else if (row.original.rOption === 'RC') {
          sc = 12000;
        }
        const totalSC = sc + (row.original.misc || 0);
        return formatRupiah(totalSC);
      },
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
      accessorKey: "activePromo",
      header: "Promo",
      cell: ({ row }) => {
        const activePromo = row.original.activePromo;   

        if (activePromo) {
          return (
            <div>
              <div>{activePromo.nama}</div>
              {activePromo.jenis_promo === 'PERSENTASE_DISKON' && (
                <div>{activePromo.diskon}%</div>
              )}
            </div>
          );
        }
        return "No active promo";
      },
    },
    {
      accessorKey: "discPromo",
      header: "Disc Promo",
      cell: ({ row }) => {
        const activePromo = row.original.activePromo;
        if (activePromo) {
          switch (activePromo.jenis_promo) {
            case 'PERSENTASE_DISKON':
              return `${formatRupiah(row.original.discPromo)}`;
            case 'POTONGAN_HARGA':
              return formatRupiah(activePromo.diskon);
            case 'BUY_ONE_GET_ONE':
              return `Buy ${activePromo.kuantitas_beli} Get ${activePromo.kuantitas_gratis}`;
            default:
              return '-';
          }
        }
        return '-';
      },
    },
    {
      accessorKey: "promoValue",
      header: "Promo Value",
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

  const calculateGrandTotal = () => {
    return data.reduce((total, item) => {
      let itemTotal = item.subJumlah;
      
      // Add SC based on rOption
      if (item.rOption === 'R') {
        itemTotal += 6000;
      } else if (item.rOption === 'RC') {
        itemTotal += 12000;
      }
      
      // Add misc charge
      itemTotal += item.misc || 0;
      
      // Round up to nearest 100
      const roundedItemTotal = Math.ceil(itemTotal / 100) * 100;
      
      return total + roundedItemTotal;
    }, 0);
  };

  const handleCreateTransaction = async (paymentData: any) => {
    if (!paymentData || Object.keys(paymentData).length === 0) {
      console.error('Payment data is not available');
      return Promise.reject('Payment data is required');
    }

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
      invoice_eksternal: `INV-${headerInfo['No Bon']}`,
      catatan: "Transaction note",
      total_harga: calculateGrandTotal(),
      total_disc: data.reduce((total, item) => total + (item.subJumlah * item.disc / 100), 0),
      total_sc_misc: data.reduce((total, item) => total + item.sc + item.misc, 0),
      total_promo: data.reduce((total, item) => total + item.promoValue, 0),
      total_up: data.reduce((total, item) => total + item.up, 0),
      no_voucher: data.find(item => item.noVoucher)?.noVoucher || "",
      interval_transaksi: 0,
      buffer_transaksi: 0,
      kd_cab: "CAB001",
      payment_data: paymentData,
      change: paymentData.cashPayment ? paymentData.cashPayment.amount - calculateGrandTotal() : 0,
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
        activePromo: item.activePromo,
      }))
    };
    console.log(transactionData, 'transactionData');
    
    return new Promise<void>((resolve, reject) => {
      createTransaction(transactionData, {
        onSuccess: (data: any) => {
          console.log('Transaction created successfully');
          console.log(data, 'data');
          
          if (data.data.receipt) {
            const pdfBlob = new Blob([Buffer.from(data.data.receipt, 'base64')], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
          } else {
            console.warn('Receipt data not available');
          }
          // Clear the transaction storage
          clearTransaction();
          // Refetch antrian info and refresh the page
          refetchAntrianInfo();
          // router.refresh();
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
            onRowClick={handleRowSelect}
            selectedRow={selectedRow}
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
          {/* <Card className="h-[242px]">
            <AdditionalTransaksiContent />
          </Card> */}
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
        totalAmount={calculateGrandTotal()}
        onPaymentComplete={(paymentData) => {
          handlePaymentData(paymentData);
          handleCreateTransaction(paymentData);
        }}
        // createTransaction={() => handleCreateTransaction()}
      />

      <MiscModal
        isOpen={isMiscModalOpen}
        onClose={() => setIsMiscModalOpen(false)}
        onSelect={handleMiscSelect}
        options={miscOptions}
      />
    </>
  );
}