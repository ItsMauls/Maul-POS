"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Card from "@/components/Card";
import Table from "@/components/Table";
import DefaultPagination from "@/components/Pagination";
import Toolbar from "@/components/toolbar/PurchaseRequest";
import AddPurchase from "@/components/modal_add/AddPurchase";
import { api } from "@/constants/api";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { PrintButton } from "@/components/pdf/printButton";
import { formatRupiah } from "@/libs/formater";
import { PurcaseRequest } from "@/constants/types";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import imageChangeGudang from "@/assets/images/change-gudang.svg";
import imageRemove from "@/assets/images/dialog-remove.svg";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import imageApproval from "@/assets/images/approval.svg";

export default function TablePage() {
  const [purchaseRequest, setPurchaseRequest] = useState<PurcaseRequest[]>([])
  const [keyword, setKeyword] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalApprove, setModalApprove] = useState(false);
  const [page, setPage] = useState({
    page: 1,
    page_size: 10,
    total: 0,
    total_page: 0,
    total_data: 0,
  });
  const { refreshToken } = useAuth();
  const [selectedItem, setSelectedItem] = useState<PurcaseRequest | null>(null);
  const [gudang, setGudang] = useState<string>("01");
  const [modalChangeGudang, setModalChangeGudang] = useState(false);
  const [modalRemove, setModalRemove] = useState(false);


  const handleSelectedItem = (data: PurcaseRequest) => {
    console.log(data);
    if (data) {
      if (selectedItem === data) {
        setSelectedItem(null);
        return;
      }
      setSelectedItem(data);
      return;
    }
  }

  const handleGantiTujuanClick = async () => {

    if (selectedItem) {
      const token = Cookies.get("access_token");
      const id = selectedItem.id;
      const changeGudang = selectedItem.gudang === "01" ? "02" : "01";
      const response = await fetch(`${api.purchase.switchGudangPurchaseRequest}?id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gudang: changeGudang }),
      });

      if (response.ok) {
        fetchPurchaseRequest(1, "", pageSize, gudang);
        setSelectedItem(null);
        setSuccess(`Barang Berhasil di Pindahkan ke Gudang ${gudang === '01' ? '02' : '01'}`);
      } else {
        if (response.status === 401) {
          refreshToken();
          handleGantiTujuanClick();
        }
        response.json().then((data) => {
          setError(data?.message);
        });
      }

      setModalChangeGudang(false);
    }
  }

  useLayoutEffect(() => {
    const handleF1 = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        setModalChangeGudang(true);
      }
    }

    window.addEventListener("keydown", handleF1);

    return () => {
      window.removeEventListener("keydown", handleF1);
    }

  }
    , [selectedItem]);


  const fetchPurchaseRequest = async (pageNumber: number, keyword: string, pageSize: number, gudang: string, retryCount = 0) => {
    // const token = Cookies.get("access_token");

    try {
      const token = Cookies.get("access_token");

      const response = await fetch(
        `${api.purchase.allPurchaseRequest}?gudang=${gudang}&page=${pageNumber}&page_size=${pageSize}&keyword=${encodeURIComponent(keyword)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.data.meta.total_data === 0) {
          setPurchaseRequest([]);
          setPage(data.data.meta);
          return;
        }

        setPurchaseRequest(data.data.data);
        setPage(data.data.meta);
      } else {
        if (response.status === 401 && retryCount < 1) { // Limit retries to 1
          const refreshSuccess = await refreshToken(); // Assume refreshToken returns a boolean indicating success
          if (refreshSuccess) {
            await fetchPurchaseRequest(pageNumber, keyword, pageSize, gudang, retryCount + 1);
          } else {
            setError("Session expired. Please log in again.");
          }
          return;
        }
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("Failed to fetch data");
    }
  };

  const handleApproveClick = async () => {
    if (selectedItem) {
      const token = Cookies.get("access_token");
      const id = selectedItem.id;
      const response = await fetch(`${api.purchase.approvePurchaseRequest}?id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchPurchaseRequest(currentPage, keyword, pageSize, gudang);
        setSelectedItem(null);
        setModalApprove(false);
        setSuccess("Purchase request has been approved");
      } else {
        const data = await response.json();
        setError(data?.message);
        setModalApprove(false);
      }
    }
  }

  const columns = [
    { key: "no", label: "Nomer PR", render: (item: any) => item.no },
    { key: "tanggal", label: "Tanggal PR" },
    { key: "nm_supplier", label: "Nama Supplier", render: (item: any) => item?.supplier?.nama },
    {
      key: "keterangan",
      label: "Keterangan",
      render: (item: any) => (
        <div className="truncate w-40">
          {item.keterangan}
        </div>
      ),
    },
    { key: "total", label: "Total", render: (item: any) => formatRupiah(item.total) },
    {
      key: "status_approved",
      label: "Status",
      render: (item: any) => (
        <div className={item.status_approved === "Y" ? "text-white bg-green-500 rounded text-center p-2" : "text-white bg-red-500 rounded text-center p-2"}>
          {item.status_approved === "Y" ? "Approved" : "Pending"}
        </div>
      ),
    },
    {
      key: "tanggal_approved",
      label: "Tanggal Approval",
    },
    { key: "user", label: "User", render: (item: any) => item?.user?.name },
  ];

  const handleRemove = async () => {
    if (selectedItem) {
      const token = Cookies.get("access_token");
      const id = selectedItem.id;
      const response = await fetch(`${api.purchase.removePurchaseRequest}?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchPurchaseRequest(currentPage, keyword, pageSize, gudang);
        setSelectedItem(null);
        setModalRemove(false);
        setSuccess("Berhasil Menghapus Purchase Request");
      } else {
        const data = await response.json();
        setError(data?.message);
        setModalRemove(false);
      }
    }
  }

  const renderButtons = (item: any, index: any) => [
    <PrintButton key={index} id={item?.id} />,
    <button key={index} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" onClick={
      () => {
        setSelectedItem(item);
        setModalRemove(true);
      }
    }>
      <div className="flex items-center gap-2">
        <Icon icon="fontisto:trash" width="24" height="24" />
      </div>
    </button>
  ];

  const handleChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  }

  useEffect(() => {
    fetchPurchaseRequest(currentPage, keyword, pageSize, gudang);
  }, [currentPage, keyword, pageSize, gudang]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleOnSuccessAddPurchase = () => {
    fetchPurchaseRequest(1, "", pageSize, gudang)
  }

  const handleApproveButton = () => {
    if (selectedItem) {
      setModalApprove(true);
    } else {
      setError("Tolong Pilih Purchase Request terlebih dahulu");
    }
  }

  const handleChangeGudang = () => {
    if (selectedItem) {
      setModalChangeGudang(true);
    } else {
      setError("Tolong Pilih Purchase Request terlebih dahulu");
    }
  }

  return (
    <div>
      <Modal isOpen={modalApprove} onClose={
        () => {
          setModalApprove(false);
        }
      } >
        <div>
          <div className="flex justify-center">
            <Image src={imageApproval} alt="Change Gudang" />
          </div>
          <p className="text-lg font-bold text-center mt-4">Setujui / Tidak</p>
          <p className="justify-center text-center mt-4">Apakah kamu yakin ingin<br />menyetujui Purchase Request ini?</p>
          <div className="flex gap-4 mt-4 justify-end" >
            <button className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" onClick={
              () => {
                setModalApprove(false);
              }
            }>
              <div className="flex justify-center items-center gap-2">
                <span>Batal</span>
              </div>
            </button>
            <button className="w-full bg-[#09A599] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg" onClick={
              handleApproveClick
            }>
              <div className="flex justify-center items-center gap-2">
                <span>Ya, Setujui</span>
              </div>
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modalChangeGudang} onClose={
        () => {
          setModalChangeGudang(false);
        }
      }>
        <div className="">
          <div className="flex justify-center">
            <Image src={imageChangeGudang} alt="Change Gudang" />
          </div>
          <p className="text-lg font-bold text-center mt-4">Ganti Gudang</p>
          <p className="justify-center text-center mt-4">Saat ini kamu sedang<br />menggunakan <span className="font-bold"> Gudang {gudang}</span></p>
          <div className="flex gap-4 mt-4 justify-end" >
            <Button label={`Ganti Gudang ${gudang === '01' ? '02' : '01'}`} onClick={handleGantiTujuanClick} className="px-20 w-full bg-[#09A599] hover:bg-green-700 text-white" />
          </div>

        </div>
      </Modal>

      <Modal isOpen={modalRemove} onClose={
        () => {
          setModalRemove(false);
        }
      }>
        <div className="">
          <div className="flex justify-center">
            <Image src={imageRemove} alt="Remove Item" />
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


      <Toolbar
        onGudangChange={(e) => setGudang(e.target.value)}
        onGantiTujuanClick={handleChangeGudang}
        onApproveClick={
          handleApproveButton
        }
        onSuccess={handleOnSuccessAddPurchase}
        onSearchChange={(e) => setKeyword(e.target.value)}
      />

      <Table
        columns={columns}
        data={purchaseRequest}
        renderButtons={renderButtons}
        actionSelect={handleSelectedItem}
      />

      <DefaultPagination
        page={currentPage}
        totalData={page.total_data}
        pageSize={pageSize}
        totalPage={page.total_page}
        paginate={paginate}
      />

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
    </div>
  );
}
