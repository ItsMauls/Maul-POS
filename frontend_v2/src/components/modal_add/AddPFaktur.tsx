"use client";
import { useState, SyntheticEvent, useEffect, useLayoutEffect, useCallback } from "react";
import Modal from "../Modal";
import Cookies from 'js-cookie';
import { Barang, DetailPurchaseOrder, PurchaseOrder, PurchaseOrderDetail, PurchaseOrderDetailFromRequest, PurchaseOrderDetailResponse, PurchaseRequestDetail } from "@/constants/types";
import { api } from "@/constants/api";
import AsyncSelect from 'react-select/async';
import { useAuth } from "@/context/AuthContext";
import Button from "../Button";
import { formatRupiah } from "@/libs/formater";
import { cn } from "@/libs/cn";

interface Props {
  title: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function AddFaktur({ title, onSuccess, onError }: Props) {
  const { refreshToken } = useAuth();

  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState<PurchaseOrderDetailResponse[]>([]);
  const [header, setHeader] = useState<PurchaseOrder>();
  const [gudang, setGudang] = useState<string>("01");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [tglJatuhTempo, setTglJatuhTempo] = useState<string>("");
  const [metodePembayaran, setMetodePembayaran] = useState<string>("CASH");

  // if modal change, clear all data
  useEffect(() => {
    if (!modal) {
      setHeader(undefined);
      setDetail([]);
    }
  }, [modal]);

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!header) {
      alert("Please select purchase request");
      return;
    }
    if (detail.length === 0) {
      alert("Please add detail purchase");
      return;
    }

    const token = Cookies.get("access_token");
    if (!token) {
      alert("Access token is missing. Please log in.");
      return;
    }

    fetch(api.purchase.addInvoice, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_po : header.id_hpo,
        tgl_jatuh_tempo : tglJatuhTempo,
        metode_pembayaran : metodePembayaran,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code !== 200) {
          onError && onError(data.message);
          // alert("Failed: " + data.message);
          return;
        }
        // alert("Success");
        setModal(false);
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (onError) {
          onError("Failed to add purchase order");
        }
      });
  }

  function handleChange() {
    setModal(!modal);
  }

  function deleteDetail(index: number) {
    const newDetails = detail.filter((_, i) => i !== index);
    setDetail(newDetails);
  }

  const handleSelectedPR = (option: any) => {
    if (!option) {
      return;
    }
    setHeader(undefined);
    setDetail([]);
    getPurchaseRequestByID(option.value);
  }

  const getPurchaseRequestByID = async (id: string) => {
    try {
      setIsLoading(true);
      const token = Cookies.get("access_token");
      if (!token) {
        return;
      }
      const response = await fetch(`${api.purchase.detailPurchaseOrder}?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // setSelectedPurchaseRequest(data.data);
        setHeader(data.data.header);
        setDetail(data.data.detail);
      } else {
        if (response.status === 401) {
          await refreshToken();
          getPurchaseRequestByID(id);
        }
        return null;
      }
    } catch (error) {
      console.error("Error fetching purchase request by id:", error);
      return null;
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleLoadOptions = useCallback(async (inputValue: string) => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        return [];
      }
      const response = await fetch(
        `${api.purchase.allPurchaseOrder}?page=${1}&page_size=${10}&gudang=${gudang}&keyword=${encodeURIComponent(
          inputValue
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.data.data.map((data: PurchaseOrder) => ({
          value: data.id_hpo,
          label: data.no_po + " (" + data.supplier.nama + ")",
        }));
      } else {
        if (response.status === 401) {
          await refreshToken();
          return handleLoadOptions(inputValue);
        }
        return [];
      }
    } catch (error) {
      console.error("Error fetching barangs:", error);
      return [];
    }
  }, [gudang]);

  useEffect(() => {
    const loadOptions = async () => {
      const defaultOptions = await handleLoadOptions("");
      setOptions(defaultOptions);
    }
    loadOptions();
  }, [gudang, handleLoadOptions]);

  useLayoutEffect(() => {
    function handleKeyboardEvent(event: KeyboardEvent) {
      switch (event.key) {
        case "Insert":
          setModal(true);
          break;
        case "Escape":
          setModal(false);
          break;
        case "F2":
          // Lakukan aksi untuk F2
          break;
        // Tambahkan kasus lainnya sesuai kebutuhan
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyboardEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, []);

  return (
    <div>
      <Button
        className="bg-[#09A599] text-white px-4 py-2 rounded"
        onClick={handleChange}
        label="Buat Invoice"
        shortcut="insert"
      />

      <Modal title={title} isOpen={modal} onClose={handleChange} size="lg">
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              <span className="ml-4 text-xl font-medium">Loading...</span>
            </div>
          </div>
        )}
        <div className="bg-[#FFFFFF] rounded-xl m-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
            <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-2">
              <label
                htmlFor="gudang"
                className="block mb-2 text-sm font-medium"
              >
                Gudang
              </label>
              <select
                id="gudang"
                className="p-1 rounded border border-gray-500 w-full h-10"
                value={gudang}
                onChange={(e) => setGudang(e.target.value)}
              >
                <option value="01">Gudang 1</option>
                <option value="02">Gudang 2</option>
              </select>
            </div>
            <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-2">
              <label
                htmlFor="pr"
                className="block mb-2 text-sm font-medium"
              >
                Nomor PO
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions={options}
                onChange={handleSelectedPR}
                loadOptions={handleLoadOptions}
                placeholder="Cari No PR"
                className="basic-single"
                classNamePrefix="select"
                isSearchable={true}
                name="pr"
                id="pr"
                required
              />
            </div>
            {header && (
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
                    value={header.supplier.nama}
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
                    value={header.tgl_po}
                    readOnly
                    className="p-1 rounded border border-gray-500 w-full"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2 md:col-span-2">
                  <label
                    htmlFor="created_by"
                    className="block mb-2 text-sm font-medium"
                  >
                    Dibuat Oleh
                  </label>
                  <input
                    id="created_by"
                    type="text"
                    value={`${header.user.name} (${header.user.role.name})`}
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
                    value={formatRupiah(header.total)}
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
                  {/* dropdown select */}
                  <select
                    id="metode_pembayaran"
                    className="p-1 rounded border border-gray-500 w-full h-10"
                    required
                    value={metodePembayaran}
                    onChange={(e) => setMetodePembayaran(e.target.value)}
                  >
                    <option value="CASH">Cash</option>
                    <option value="KREDIT">Kredit</option>
                  </select>
                </div>

                <div className="col-span-4 sm:col-span-2 md:col-span-2">
                  <label
                    htmlFor="jatuh_tempo"
                    className="block mb-2 text-sm font-medium"
                  >
                    Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    id="jatuh_tempo"
                    className="p-1 rounded border border-gray-500 w-full"
                    required
                    value={tglJatuhTempo}
                    onChange={(e) => setTglJatuhTempo(e.target.value)}
                  />
                </div>

              </>
            )}


            <div className="col-span-4 flex justify-end">
              <button
                type="submit"
                className="bg-[#09A599] text-white px-4 py-2 rounded"
              >
                Submit
              </button>

            </div>
          </form>
        </div>
        <div className="bg-[#FFFFFF] rounded-xl p-4 m-6">
          {(detail?.length ?? 0) > 0 && (
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
                    <th className="px-6 py-3 border-b border-gray-200">
                      PPN
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200">
                      Total NPPN
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200">Disc</th>
                    <th className="px-6 py-3 border-b border-gray-200">Disc Nominal</th>
                    <th className="px-6 py-3 border-b border-gray-200">
                      Sub Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detail.map((item, index) => (
                    <tr key={index} className={
                      cn("text-center", {
                        "bg-gray-100": index % 2 === 0,
                        "bg-white": index % 2 !== 0,
                      })
                    }>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.barang.kode_barang}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.barang.nama_barang}
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
                        {formatRupiah(item.hrg_nppn || 0)}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {formatRupiah(item.total_ppn || 0)}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {formatRupiah(item.total_nppn || 0)}
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
                  // detail.reduce((acc, item) => acc + (item.harga_ppn * item.qty) - (item.harga_ppn * item.qty / 1.11), 0)
                  // detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0) * ppn / 100
                  header?.total_ppn || 0
                )}
              </span>
            </div>
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total Discount: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  // detail.reduce((acc, item) => acc + item.harga_ppn * item.qty, 0)
                  // detail.reduce((acc, item) => acc + item.disc_nominal, 0)
                  header?.total_diskon || 0
                )}
              </span>
            </div>
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total No PPN: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  // detail.reduce((acc, item) => acc + (item.harga_ppn * item.qty), 0)
                  // detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0)
                  header?.total_net || 0
                )}
              </span>
            </div>
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  // detail.reduce((acc, item) => acc + (item.harga_ppn * item.qty * 1.11), 0)
                  // detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0) + (detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0) * ppn / 100)
                  header?.total || 0
                )}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
