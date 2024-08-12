"use client";
import { useState, SyntheticEvent, useEffect, useLayoutEffect, useCallback } from "react";
import Modal from "../Modal";
import Cookies from 'js-cookie';
import { DetailInvoice,  PurchaseOrder,  PurchaseOrderDetailResponse } from "@/constants/types";
import { api } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/libs/formater";
import { cn } from "@/libs/cn";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  id: number;
}

export default function DetailFaktur({ id }: Props) {
  const [modal, setModal] = useState(false);
  const [gudang, setGudang] = useState<string>("01");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DetailInvoice>();

  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        alert("Access token is missing. Please log in.");
        return;
      }

      const response = await fetch(`${api.purchase.detailInvoice}?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data.data);
      } else {
        const data = await response.json();
        alert(data?.message || "Failed to fetch data");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  } , [id]);
 
  useEffect(() => {
    if (modal) {
      fetchDetail();
    }
  }, [modal]);

  // if modal change, clear all data
  useEffect(() => {
    if (!modal) {
      setData(undefined);
    }
  }, [modal]);

  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      <button  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg" onClick={handleChange}>
        <div className="flex items-center gap-2">
          <Icon icon="hugeicons:view" width="24" height="24" />
        </div>
      </button>
      <Modal title={"Detail Faktur"} isOpen={modal} onClose={handleChange} size="lg">
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              <span className="ml-4 text-xl font-medium">Loading...</span>
            </div>
          </div>
        )}
        <div className="bg-[#FFFFFF] rounded-xl m-6">
          <form className="grid grid-cols-4 gap-4">
            <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-2">
              <label
                htmlFor="gudang"
                className="block mb-2 text-sm font-medium"
              >
                Gudang
              </label>
              <input
                type="text"
                value={gudang}
                readOnly
                className="p-1 rounded border border-gray-500 w-full"
              />
            </div>
            <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-2">
              <label
                htmlFor="pr"
                className="block mb-2 text-sm font-medium"
              >
                Nomor PO
              </label>
              <input type="text" className="p-1 rounded border border-gray-500 w-full" value={data?.header?.no_reff}/>

            </div>
            {data && (
              <>
                <div className="col-span-4 sm:col-span-2 md:col-span-2">
                  <label
                    htmlFor="supplier"
                    className="block mb-2 text-sm font-medium"
                  >
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={data?.header?.nama_supplier}
                    readOnly
                    className="p-1 rounded border border-gray-500 w-full"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2 md:col-span-2">
                  <label
                    htmlFor="tanggal"
                    className="block mb-2 text-sm font-medium"
                  >
                    Tanggal PO
                  </label>
                  <input
                    type="text"
                    value={data?.header?.tgl_reff}
                    readOnly
                    className="p-1 rounded border border-gray-500 w-full"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2 md:col-span-2">
                  <label
                    htmlFor="total"
                    className="block mb-2 text-sm font-medium"
                  >
                    Total PO
                  </label>
                  <input
                    type="text"
                    value={formatRupiah(data?.header?.total || 0)}
                    readOnly
                    className="p-1 rounded border border-gray-500 w-full"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2 md:col-span-2">
                  <label
                    htmlFor="metode_pembayaran"
                    className="block mb-2 text-sm font-medium"
                  >
                    Metode Pembayaran
                  </label>
                  <input type="text" value={data?.header?.metode_pembayaran} readOnly className="p-1 rounded border border-gray-500 w-full" />
                </div>

                <div className="col-span-4 sm:col-span-2 md:col-span-2">
                  <label
                    htmlFor="jatuh_tempo"
                    className="block mb-2 text-sm font-medium"
                  >
                    Jatuh Tempo
                  </label>
                  <input
                    type="text"
                    value={data?.header?.tgl_jatuh_tempo}
                    readOnly
                    className="p-1 rounded border border-gray-500 w-full"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2 md:col-span-2">
                  <label
                    htmlFor="keterangan"
                    className="block mb-2 text-sm font-medium"
                  >
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={data?.pembayaran?.keterangan}
                    readOnly
                    className="p-1 rounded border border-gray-500 w-full"
                  />
                </div>

              </>
            )}
          </form>
        </div>
        <div className="bg-[#FFFFFF] rounded-xl p-4 m-6">
          {(data?.detail?.length ?? 0) > 0 && (
            <div className="max-h-[350px] overflow-y-auto overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200">Kode Barang</th>
                    <th className="px-6 py-3 border-b border-gray-200">
                      Nama Barang
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200">Batch</th>
                    <th className="px-6 py-3 border-b border-gray-200">Qty</th>
                    <th className="px-6 py-3 border-b border-gray-200">Isi</th>
                    <th className="px-6 py-3 border-b border-gray-200">Harga</th>
                    <th className="px-6 py-3 border-b border-gray-200">Disc</th>
                    <th className="px-6 py-3 border-b border-gray-200">Disc Nominal</th>
                    <th className="px-6 py-3 border-b border-gray-200">
                      Sub Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.detail.map((item, index) => (
                    <tr key={index} className={
                      cn("text-center", {
                        "bg-gray-100": index % 2 === 0,
                        "bg-white": index % 2 !== 0,
                      })
                    }>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.kode_barang}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item?.barang?.nama_barang}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.batch}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.qty}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.isi}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {formatRupiah(item.harga || 0)}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.disc.toFixed(2)}%
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {formatRupiah(item.disc_nominal || 0)}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {formatRupiah(item.total || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end mt-4 gap-2">
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total PPN: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  data?.header?.total_ppn || 0
                )}
              </span>
            </div>
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total Discount: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  data?.header?.total_diskon || 0
                )}
              </span>
            </div>
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total No PPN: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  data?.header?.total_net || 0
                )}
              </span>
            </div>
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  data?.header?.total || 0
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 p-4">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" onClick={handleChange}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
