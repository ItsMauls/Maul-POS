"use client";
import { useState, SyntheticEvent, useEffect, useLayoutEffect, useCallback } from "react";
import Modal from "../Modal";
import Cookies from 'js-cookie';
import { Barang, PurcaseRequest, PurchaseOrderDetail, PurchaseOrderDetailFromRequest, PurchaseRequestDetail, User } from "@/constants/types";
import ModalAddDetailPurchase from "./ModalAddDetailPurchase";
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

export default function AddPurchaseOrder({ title, onSuccess, onError }: Props) {
  const [user, setUser] = useState<User>();
  const { refreshToken } = useAuth();

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState<PurchaseOrderDetailFromRequest[]>([]);
  const [header, setHeader] = useState<PurcaseRequest>();
  const [gudang, setGudang] = useState<string>("01");
  const [isLoading, setIsLoading] = useState(false);
  const [ppn, setPpn] = useState(11);
  const [options, setOptions] = useState([]);

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

    // create detail order
    const detailSubmit: PurchaseOrderDetail[] = detail.map((item) => {
      return {
        kd_brgdg: item.barang.kode_barang,
        batch: item.batch,
        tgl_expired: item.tgl_expired,
        qty: item.qty,
        isi: item.isi,
        harga_ppn: 0,
        hrg_nppn: 0,
        ppn: ppn,
        hrg_ppn: 0,
        disc: item.disc,
        hrg_disc: 0,
        disc_nominal: item.disc_nominal,
        tot_disc: 0,
        total_nppn: item.barang.harga_beli * item.qty,
        total_ppn: item.barang.harga_beli * item.qty * ppn / 100,
        total: 0,
        new_item: item.new_item || false,
        detail: item.detail || 0,
      }
    });

    fetch(api.purchase.addPurchaseOrder, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_hpr: header?.id,
        kd_sup: header?.supplier.id,
        detail: detailSubmit,
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

  function addDetail(newDetail: PurchaseRequestDetail) {
    const barang: Barang = {
      kode_barang: newDetail.kode_barang,
      nama_barang: newDetail.nama_barang,
      harga_beli: newDetail.harga_beli,
      isi: newDetail.isi,
      satuan: newDetail.satuan,
      harga_jual: 0
    }

    const newData: PurchaseOrderDetailFromRequest = {
      barang: barang,
      qty_pesan: 0,
      qty: newDetail.qty,
      harga_ppn: newDetail.harga_beli,
      isi: newDetail.isi,
      id: 0,
      detail: 0,
      batch: "",
      tgl_expired: "",
      new_item: true,
      qty_terpenuhi: 0,
      disc: 0,
      disc_nominal: 0
    }

    setDetail([...detail, newData]);
  }

  function deleteDetail(index: number) {
    const newDetails = detail.filter((_, i) => i !== index);
    setDetail(newDetails);
  }

  function tambahBatch(index: number) {
    if (detail[index].qty_pesan === 1) {
      return;
    }
    const newDetail = detail[index];
    const newDetails = [...detail.slice(0, index + 1), newDetail, ...detail.slice(index + 1)];
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
      const response = await fetch(`${api.purchase.detailPurchaseRequest}?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // setSelectedPurchaseRequest(data.data);
        setHeader(data.data.header);
        for (const item of data.data.detail) {
          if (item.qty_pesan <= item.qty_terpenuhi) {
            continue;
          }
          item.disc = 0;
          item.disc_nominal = 0;
          setDetail((prev) => [...prev, { ...item, qty: item.qty_pesan - item.qty_terpenuhi }]);
        }
        // setDetail(data.data.detail);
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
        `${api.purchase.allPurchaseRequestForPO}?page=${1}&page_size=${10}&gudang=${gudang}&keyword=${encodeURIComponent(
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
        return data.data.data.map((data: PurcaseRequest) => ({
          value: data.id,
          label: data.no + " (" + data.supplier.nama + ")",
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
  }, [gudang, handleLoadOptions] );

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
        label="Tambah PO"
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
                Nomor PR
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
                    Tanggal PR
                  </label>
                  <input
                    type="text"
                    value={header.tanggal}
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
                    value={header.keterangan}
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
                    Total PR
                  </label>
                  <input
                    type="text"
                    value={formatRupiah(header.total)}
                    readOnly
                    className="p-1 rounded border border-gray-500 w-full"
                  />
                </div>
                
                {header.user_approved.name && (
                  <>
                    <div className="col-span-4 sm:col-span-2 md:col-span-2">
                      <label
                        htmlFor="aproved_by"
                        className="block mb-2 text-sm font-medium"
                      >
                        Disetujui Oleh
                      </label>
                      <input
                        id="aproved_by"
                        type="text"
                        value={`${header.user_approved.name} (${header.user_approved.role.name})`}
                        readOnly
                        className="p-1 rounded border border-gray-500 w-full"
                      />
                    </div>
                  </>
                )}
                <div className="col-span-4 sm:col-span-2 md:col-span-4">
                  <label
                    htmlFor="document"
                    className="block mb-2 text-sm font-medium">
                    Dokumen Fisik
                    </label>
                  <input
                    type="file"
                    className="p-1 rounded border border-gray-500 w-full"
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
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">Purchase Detail</h3>
            <ModalAddDetailPurchase action={addDetail} />
          </div>
          {(detail?.length ?? 0) > 0 && (
            <div className="max-h-[350px] overflow-y-auto overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200"></th>
                    <th className="px-6 py-3 border-b border-gray-200">Kode Barang</th>
                    <th className="px-6 py-3 border-b border-gray-200">
                      Nama Barang
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200">Batch</th>
                    <th className="px-6 py-3 border-b border-gray-200">Tanggal Expired</th>
                    <th className="px-6 py-3 border-b border-gray-200">Qty PR</th>
                    <th className="px-6 py-3 border-b border-gray-200">Qty PO</th>
                    <th className="px-6 py-3 border-b border-gray-200">Isi</th>
                    <th className="px-6 py-3 border-b border-gray-200">
                      Harga Beli
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
                        "bg-yellow-100": item.id === 0
                      })
                    }>
                      <td className="px-2 py-2 border-b border-gray-200">
                        <Button onClick={() => deleteDetail(index)} className="bg-red-500 text-white px-4 py-2 rounded" label="Hapus" />
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.barang.kode_barang}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.barang.nama_barang}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <input className="p-1 rounded border border-gray-500 max-w-[60%] text-center" type="text" value={item.batch} onChange={
                          (e) => {
                            const newDetail = { ...item, batch: e.target.value };
                            const newDetails = detail.map((detail, i) => i === index ? newDetail : detail);
                            setDetail(newDetails);
                          }
                        } />
                        <Button onClick={
                          () => tambahBatch(index)
                        } className={
                          cn("bg-green-500 text-white px-4 py-2 rounded ml-2", {
                            "cursor-not-allowed": item.qty_pesan === 1
                          })
                        } label="+" />
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <input className="p-1 rounded border border-gray-500 max-w-[150px] text-center" type="date" value={item.tgl_expired} onChange={
                          (e) => {
                            const newDetail = { ...item, tgl_expired: e.target.value };
                            const newDetails = detail.map((detail, i) => i === index ? newDetail : detail);
                            setDetail(newDetails);
                          }
                        } />
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.qty_pesan}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <input className="p-1 rounded border border-gray-500 max-w-20 text-center" type="text" defaultValue={item.qty_pesan} value={item.qty} onChange={
                          (e) => {
                            if (isNaN(parseInt(e.target.value))) {
                              e.target.value = '0';
                            }
                            if (parseInt(e.target.value) < 0) return;
                            if (parseInt(e.target.value) > item.qty_pesan && item.id != 0) return;
                            const newDetail = { ...item, qty: parseInt(e.target.value) };
                            const newDetails = detail.map((detail, i) => i === index ? newDetail : detail);
                            setDetail(newDetails);
                          }
                        } />
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {item.isi}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {formatRupiah(item.barang.harga_beli || 0)}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <input className="p-1 rounded border border-gray-500 max-w-20 text-center" type="text" value={item.disc} onChange={
                          (e) => {
                            if (isNaN(parseInt(e.target.value))) {
                              e.target.value = '0';
                            }
                            if (parseInt(e.target.value) < 0) return;
                            if (parseInt(e.target.value) > 100) return;
                            const newDetail = { ...item, disc: parseInt(e.target.value), disc_nominal: (item.barang.harga_beli * item.qty * parseInt(e.target.value)) / 100 };
                            const newDetails = detail.map((detail, i) => i === index ? newDetail : detail);
                            setDetail(newDetails);
                          }
                        } />
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <input className="p-1 rounded border border-gray-500 max-w-[150px] text-center" type="text" value={item.disc_nominal}
                          onChange={
                            (e) => {
                              if (isNaN(parseInt(e.target.value))) {
                                e.target.value = '0';
                              }
                              if (parseInt(e.target.value) < 0) return;
                              const newDetail = {
                                ...item,
                                disc_nominal: parseInt(e.target.value),
                                disc: ((parseInt(e.target.value) * 100) / (item.barang.harga_beli * item.qty))
                              };
                              const newDetails = detail.map((detail, i) => i === index ? newDetail : detail);
                              setDetail(newDetails);
                            }
                          }
                        />
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {formatRupiah((item.barang.harga_beli * item.qty) - item.disc_nominal || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}
          <div className="flex justify-end mt-4 gap-2">
            <label htmlFor="ppn" className="text-lg font-medium">PPN</label>
            <input type="number" id="ppn" className="p-1 rounded border border-gray-500 w-20 text-center" value={ppn} onChange={
              (e) => {
                if (isNaN(parseInt(e.target.value))) {
                  e.target.value = '0';
                }
                setPpn(parseInt(e.target.value))
              }
            }
            />
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total PPN: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  // detail.reduce((acc, item) => acc + (item.harga_ppn * item.qty) - (item.harga_ppn * item.qty / 1.11), 0)
                  detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0) * ppn / 100
                )}
              </span>
            </div>
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total Discount: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  // detail.reduce((acc, item) => acc + item.harga_ppn * item.qty, 0)
                  detail.reduce((acc, item) => acc + item.disc_nominal, 0)
                )}
              </span>
            </div>
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total No PPN: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  // detail.reduce((acc, item) => acc + (item.harga_ppn * item.qty), 0)
                  detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0)
                )}
              </span>
            </div>
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  // detail.reduce((acc, item) => acc + (item.harga_ppn * item.qty * 1.11), 0)
                  detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0) + (detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0) * ppn / 100)
                )}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
