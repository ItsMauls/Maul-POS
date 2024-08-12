"use client";
import { useState, SyntheticEvent, useEffect, useLayoutEffect } from "react";
import Modal from "../Modal";
import Cookies from 'js-cookie';
import { PurchaseRequestDetail, Supplier, User } from "@/constants/types";
import ModalAddDetailPurchase from "./ModalAddDetailPurchase";
import { api } from "@/constants/api";
import AsyncSelect from 'react-select/async';
import { useAuth } from "@/context/AuthContext";
import Button from "../Button";
import { formatRupiah } from "@/libs/formater";



interface AddUserProps {
  title: string;
  onSuccess?: () => void;
}

export default function AddPurchase({ title, onSuccess }: AddUserProps) {
  const [user, setUser] = useState<User>();
  const { refreshToken } = useAuth();

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const [nama, setNama] = useState(user?.name);
  const [kode, setKode] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tanggalTempo, setTanggalTempo] = useState("");
  const [noPR, setPR] = useState("");
  const [noReferensi, setNoReferensi] = useState("");
  const [tanggalReferensi, setTanggalReferensi] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseRequestDetail[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [suppliers, setSupplier] = useState<Supplier[]>();

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!selectedSupplier) {
      alert("Supplier is required");
      return;
    }

    if (purchaseDetails.length === 0) {
      alert("Purchase details is required");
      return;
    }

    const token = Cookies.get("access_token");
    if (!token) {
      alert("Access token is missing. Please log in.");
      return;
    }

    fetch(api.purchase.addPurchaseRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        keterangan,
        kode_supplier: selectedSupplier?.id,
        detail: purchaseDetails,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // alert("Success");
        setModal(false);
        setKeterangan("");
        setTanggalTempo("");
        setPurchaseDetails([]);
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // alert("Failed: " + error.message);
      });
  }

  function handleChange() {
    setModal(!modal);
  }

  function addDetail(newDetail: PurchaseRequestDetail) {
    setPurchaseDetails([...purchaseDetails, newDetail]);
  }

  function deleteDetail(index: number) {
    const newDetails = purchaseDetails.filter((_, i) => i !== index);
    setPurchaseDetails(newDetails);
  }

  const handleSelectedSupplier = (option: any) => {
    const sup = suppliers?.find((supplier) => supplier.id === option.value);
    setSelectedSupplier(sup);
  }

  const handleLoadOptions = async (inputValue: string) => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        return;
      }
      const response = await fetch(
        `${api.supplier.allSupplier}?page=${1}&page_size=${10}&keyword=${encodeURIComponent(
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
        setSupplier(data.data.data);
        return data.data.data.map((supplier: Supplier) => ({
          value: supplier.id,
          label: supplier.nama + "(" + supplier.id + ")",
        }));
      } else {
        if (response.status === 401) {
          await refreshToken();
          handleLoadOptions(inputValue);
        }
        return [];
      }
    } catch (error) {
      console.error("Error fetching barangs:", error);
      return [];
    }
  }

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
        label="Tambah PR"
        shortcut="insert"
      />

      <Modal title={title} isOpen={modal} onClose={handleChange} size="lg">
        <div className="bg-[#FFFFFF] rounded-xl p-4 m-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
            <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-1">
              <label htmlFor="nama" className="block mb-2 text-sm font-medium">
                Nama
              </label>
              <input
                type="text"
                id="nama"
                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                placeholder="Nama"
                value={user?.name}
                disabled
              />
            </div>
            {/* <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-1">
              <label htmlFor="kode" className="block mb-2 text-sm font-medium">
                Kode
              </label>
              <input
                type="number"
                id="kode"
                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                placeholder="Kode"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                required
              />
            </div> */}
            <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-1">
              <label
                htmlFor="tanggal"
                className="block mb-2 text-sm font-medium"
              >
                Tanggal
              </label>
              <input
                type="date"
                id="tanggal"
                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                value={
                  new Date().toISOString().slice(0, 10)
                }
                // onChange={(e) => setTanggal(e.target.value)}
                disabled
              />
            </div>
            <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-1">
              <label
                htmlFor="tanggalTempo"
                className="block mb-2 text-sm font-medium"
              >
                Tanggal Jatuh Tempo
              </label>
              <input
                type="date"
                id="tanggalTempo"
                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                value={tanggalTempo}
                onChange={(e) => setTanggalTempo(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-1">
              <label
                htmlFor="keterangan"
                className="block mb-2 text-sm font-medium"
              >
                Keterangan
              </label>
              <input
                type="text"
                id="keterangan"
                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                placeholder="Keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 col-span-4 sm:col-span-2 md:col-span-1">
              <label
                htmlFor="supplier"
                className="block mb-2 text-sm font-medium"
              >
                Supplier
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                onChange={handleSelectedSupplier}
                loadOptions={handleLoadOptions}
                placeholder="Pilih Supplier"
                className="basic-single"
                classNamePrefix="select"
                isSearchable={true}
                name="barang"
                required
              />
            </div>
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
          <h3 className="text-lg font-medium mb-4">Add Purchase Details</h3>
          <div className="mb-4 flex justify-end">
            <ModalAddDetailPurchase action={addDetail} />
          </div>
          {purchaseDetails.length > 0 && (
            <div className="max-h-60 overflow-y-auto">

              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200"></th>
                    <th className="px-6 py-3 border-b border-gray-200">Kode Barang</th>
                    <th className="px-6 py-3 border-b border-gray-200">
                      Nama Barang
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200">Qty</th>
                    <th className="px-6 py-3 border-b border-gray-200">Isi</th>
                    <th className="px-6 py-3 border-b border-gray-200">
                      Harga Beli
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200">
                      Sub Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseDetails.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="px-6 py-4 border-b border-gray-200">
                        <button onClick={
                          () => deleteDetail(index)
                        } className="bg-red-500 text-white px-4 py-2 rounded">
                          Delete
                        </button>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {item.kode_barang}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {item.nama_barang}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <input className="p-1 rounded border border-gray-500 max-w-20 text-center" type="text" value={item.qty} onChange={
                          (e) => {
                            if (isNaN(parseInt(e.target.value))) {
                              e.target.value = '0';
                            }
                            // if (parseInt(e.target.value) < 0) return;
                            const newDetail = { ...item, qty: parseInt(e.target.value) };
                            const newDetails = purchaseDetails.map((detail, i) => i === index ? newDetail : detail);
                            setPurchaseDetails(newDetails);
                          }
                        } />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {item.isi}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {formatRupiah(item.harga_beli)}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {formatRupiah(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}
          <div className="flex justify-end mt-4">
            <div className=" bg-red-200 rounded p-3">
              <span className="text-lg font-medium">Total: </span>
              <span className="text-lg font-medium ml-2">
                {formatRupiah(
                  purchaseDetails.reduce((acc, item) => acc + item.total, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
