"use client";
import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import Table from "@/components/Table";
import DefaultPagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar"; // Import the SearchBar component
import { api } from "@/constants/api";
import { Barang, Satuan } from "@/constants/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import imageDocument from "@/assets/images/search-document.svg";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import AsyncSelect from 'react-select/async';



// Define the types


export default function MasterBarangPage() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [modalRemove, setModalRemove] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [page, setPage] = useState({
    page: 1,
    page_size: 5,
    total: 0,
    total_page: 0,
    total_data: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Barang>({ kode_barang: "", nama_barang: "", isi: 0, satuan: { id: 0, nama: "" }, harga_jual: 0, harga_beli: 0 });
  const [allSatuan, setAllSatuan] = useState<Satuan[]>([]);

  const fetchAllSatuan = useCallback(async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        setError("Access token is missing. Please log in.");
        return;
      }

      const response = await fetch(api.inventory.allSatuan, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllSatuan(data.data || []);
      } else {
        const errorMessage = await response.text();
        console.error("Failed to fetch satuan:", errorMessage);
        setError("Failed to fetch satuan. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching satuan:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  }, []);

  useEffect(() => {
    fetchAllSatuan();
  }, [fetchAllSatuan]);

  const fetchBarangs = useCallback(
    async (pageNumber: number, keyword: string, pageSize: number) => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          setError("Access token is missing. Please log in.");
          return;
        }

        const response = await fetch(
          `${api.inventory.allInventory}?page=${pageNumber}&page_size=${pageSize}&keyword=${encodeURIComponent(
            keyword
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
          setBarangs(data.data.barangs || []); // Ensure barangs is an array
          setPage(data.data.meta);
        } else {
          const errorMessage = await response.text();
          console.error("Failed to fetch barangs:", errorMessage);
          setError("Failed to fetch barangs. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching barangs:", error);
        setError("An unexpected error occurred. Please try again later.");
      }
    },
    []
  );

  const handleChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchBarangs(currentPage, keyword, pageSize);
  }, [currentPage, keyword, pageSize, fetchBarangs]);



  const columns = [
    { key: "kode_barang", label: "Kode Barang" },
    { key: "nama_barang", label: "Nama Barang" },
    { key: "isi", label: "Isi" },
    {
      key: "satuan_nama",
      label: "Satuan",
      render: (item: any) => item.satuan.nama
    },
    { key: "harga_jual", label: "Harga Jual" },
    { key: "harga_beli", label: "Harga Beli" },
  ];

  const renderButtons = (barang: Barang, index: number) => [
    <button key={index} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" onClick={
      () => {
        setSelectedItem(barang);
        setModalView(true);
      }
    }>
      <div className="flex items-center gap-2">
        <Icon icon="hugeicons:view" width="24" height="24" />
      </div>
    </button>,
    <button key={index} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg" onClick={
      () => {
        setSelectedItem(barang);
        setModalEdit(true);
      }
    }>
      <div className="flex items-center gap-2">
        <Icon icon="akar-icons:edit" width="24" height="24" />
      </div>
    </button>,
    <button key={index} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" onClick={
      () => {
        setSelectedItem(barang);
        setModalRemove(true);
      }
    }>
      <div className="flex items-center gap-2">
        <Icon icon="fontisto:trash" width="24" height="24" />
      </div>
    </button>
  ];

  const getDataWithRowNumbers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return barangs.map((barang, index) => ({
      ...barang,
      no: startIndex + index + 1,
    }));
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleRemove = async () => {
    if (!selectedItem) {
      return;
    }

    const token = Cookies.get("access_token");
    if (!token) {
      alert("Access token is missing. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `${api.inventory.deleteInventory}?id=${selectedItem.kode_barang}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchBarangs(currentPage, keyword, pageSize);
        setSuccess("Berhasil menghapus barang.");
        setModalRemove(false);
      } else {
        const data = await response.json();
        setError(data?.message || "Failed to delete barang.");
        setModalRemove(false);
      }
    } catch (error: any) {
      console.error("Error deleting barang:", error);
      setError("An unexpected error occurred.");
      setModalRemove(false);
    }
  }

  const handleEdit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) {
      return;
    }

    const token = Cookies.get("access_token");
    if (!token) {
      alert("Access token is missing. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `${api.inventory.updateInventory}?id=${selectedItem.kode_barang}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedItem)
        }
      );

      if (response.ok) {
        fetchBarangs(currentPage, keyword, pageSize);
        setSuccess("Berhasil mengupdate barang.");
        setModalEdit(false);
      } else {
        const data = await response.json();
        setError(data?.message || "Failed to update barang.");
        setModalEdit(false);
      }
    } catch (error: any) {
      console.error("Error updating barang:", error);
      setError("An unexpected error occurred.");
      setModalEdit(false);
    }
  }

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, page.total_data);




  return (
    <div>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="mb-3 flex flex-row justify-between">
            <div>
              <SearchBar value={keyword} onChange={handleKeywordChange} />
            </div>
            <div>
              <span className="mr-3">
                {startRange} - {endRange} dari {page.total_data}
              </span>
              <select
                name="page-size"
                id="page-size"
                value={pageSize}
                onChange={handleChangePageSize}
                className="border border-gray-300 text-sm rounded-md py-3 w-12 text-center"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
          </div>
          <Table
            columns={columns}
            data={getDataWithRowNumbers()}
            renderButtons={renderButtons}
          />
          <DefaultPagination
            page={currentPage}
            totalData={page.total}
            pageSize={pageSize}
            totalPage={page.total_page}
            paginate={paginate}
          />

          <Modal isOpen={modalRemove} onClose={
            () => {
              setModalRemove(false);
            }
          }>
            <div className="">
              <div className="flex justify-center">
                <Image src={imageDocument} alt="Remove Item" />
              </div>
              <p className="text-lg font-bold text-center mt-4">Yakin Hapus?</p>
              <p className="justify-center text-center mt-4">Dengan menghapus item yang dipilih,<br />semua informasi terkait akan hilang</p>
              <div className="flex gap-4 mt-4 justify-end" >
                <button className="w-full bg-[#09A599] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg" onClick={
                  () => {
                    setModalRemove(false);
                  }
                }>
                  <div className="flex justify-center items-center gap-2">
                    <span>Batal</span>
                  </div>
                </button>
                <button className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" onClick={
                  handleRemove
                }>
                  <div className="flex justify-center items-center gap-2">
                    <span>Ya, Hapus</span>
                  </div>
                </button>
              </div>

            </div>
          </Modal>

          <Modal isOpen={modalView} onClose={
            () => {
              setModalView(false);
            }
          }>
            <div className="sm">
              <div className="flex justify-center">
                <Image src={imageDocument} alt="Remove Item" />
              </div>
              <p className="text-lg font-bold text-center mt-4">Detail Barang</p>
              <p className="justify-center text-center mt-4">Kode Barang: {selectedItem?.kode_barang}</p>
              <p className="justify-center text-center mt-4">Nama Barang: {selectedItem?.nama_barang}</p>
              <p className="justify-center text-center mt-4">Isi: {selectedItem?.isi}</p>
              <p className="justify-center text-center mt-4">Satuan: {selectedItem?.satuan.nama}</p>
              <p className="justify-center text-center mt-4">Harga Jual: {selectedItem?.harga_jual}</p>
              <p className="justify-center text-center mt-4">Harga Beli: {selectedItem?.harga_beli}</p>
              <div className="flex gap-4 mt-4 justify-end" >
                <button className="w-full bg-[#09A599] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg" onClick={
                  () => {
                    setModalView(false);
                  }
                }>
                  <div className="flex justify-center items-center gap-2">
                    <span>Tutup</span>
                  </div>
                </button>
              </div>
            </div>
          </Modal>

          <Modal size="md" isOpen={modalEdit} title="Edit Barang" onClose={
            () => {
              setModalEdit(false);
            }
          }>
            <div className="">
              <div className="flex justify-center">
                <Image src={imageDocument} alt="Edit Item" />
              </div>
              <p className="text-lg font-bold text-center mt-4">Kode Barang: {selectedItem?.kode_barang}</p>
              <form onSubmit={handleEdit}
               className="mt-4">
                {/* <div className="mb-4">
                  <label htmlFor="kode_barang" className="block text-md font-medium text-gray-700">Kode Barang</label>
                  <input type="text" name="kode_barang" id="kode_barang" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" value={selectedItem?.kode_barang} disabled />
                </div> */}
                <div className="mb-4">
                  <label htmlFor="nama_barang" className="block text-md font-medium text-gray-700">Nama Barang</label>
                  <input onChange={
                    (e) => {
                      setSelectedItem(prevItem => ({
                        ...prevItem,
                        nama_barang: e.target.value
                      }));
                    }
                  } type="text" name="nama_barang" id="nama_barang" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" value={selectedItem?.nama_barang} />
                </div>
                <div className="mb-4">
                  <label htmlFor="isi" className="block text-md font-medium text-gray-700">Isi</label>
                  <input onChange={
                    (e) => {
                      const newItem = { ...selectedItem };
                      newItem.isi = parseInt(e.target.value);
                      setSelectedItem(newItem as Barang);
                    }
                  } type="text" name="isi" id="isi" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" value={selectedItem?.isi} />
                </div>
                <div className="mb-4">
                  <label htmlFor="satuan" className="block text-md font-medium text-gray-700">Satuan</label>
                  <select onChange={
                    (e) => {
                      const newItem = { ...selectedItem };
                      newItem.satuan = allSatuan.find((satuan) => satuan.nama === e.target.value) || { id: 0, nama: "" };
                      setSelectedItem(newItem as Barang);
                    }
                  }
                    defaultValue={
                      selectedItem?.satuan?.nama
                    }
                    name="satuan" id="satuan" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2">
                    {allSatuan.map((satuan) => (
                      <option key={satuan.id} value={satuan.nama}>{satuan.nama}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="harga_jual" className="block text-md font-medium text-gray-700">Harga Jual</label>
                  <input onChange={
                    (e) => {
                      const newItem = { ...selectedItem };
                      newItem.harga_jual = parseInt(e.target.value);
                      setSelectedItem(newItem as Barang);
                    }
                  } type="text" name="harga_jual" id="harga_jual" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" value={selectedItem?.harga_jual} />
                </div>
                <div className="mb-4">
                  <label htmlFor="harga_beli" className="block text-md font-medium text-gray-700">Harga Beli</label>
                  <input onChange={
                    (e) => {
                      const newItem = { ...selectedItem };
                      newItem.harga_beli = parseInt(e.target.value);
                      setSelectedItem(newItem as Barang);
                    }
                  } type="text" name="harga_beli" id="harga_beli" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" value={selectedItem?.harga_beli} />
                </div>

                <div className="flex gap-4 mt-4 justify-end" >
                  <button className="w-full bg-[#09A599] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg" onClick={
                    () => {
                      setModalEdit(false);
                    }
                  }>
                    <div className="flex justify-center items-center gap-2">
                      <span>Batal</span>
                    </div>
                  </button>
                  {/* <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" onClick={handleEdit}
                  >
                    <div className="flex justify-center items-center gap-2">
                      <span>Simpan</span>
                    </div>
                  </button> */}
                  <input type="submit" value="Simpan" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" />

                </div>
              </form>

            </div>
          </Modal>

          {error &&
            <>
              <Toast type="danger" message={error} onClose={
                () => {
                  setError(null);
                }
              } />
            </>
          }

          {success &&
            <>
              <Toast type="success" message={success} onClose={
                () => {
                  setSuccess(null);
                }
              } />
            </>
          }
        </>
      )}
    </div>
  );
}
