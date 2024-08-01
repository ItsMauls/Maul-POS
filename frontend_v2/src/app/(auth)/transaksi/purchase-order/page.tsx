"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Table from "@/components/Table";
import DefaultPagination from "@/components/Pagination";
import Toolbar from "@/components/toolbar/PurchaseOrder";
import { api } from "@/constants/api";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { PrintButton } from "@/components/pdf/printButtonPO";
import { formatRupiah } from "@/libs/formater";
import { PurcaseRequest, PurchaseOrder } from "@/constants/types";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import imageRemove from "@/assets/images/dialog-remove.svg";
import imageApproval from "@/assets/images/approval.svg";

export default function TablePage() {
  const [data, setData] = useState<PurchaseOrder[]>([])
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
  const [selectedItem, setSelectedItem] = useState<PurchaseOrder | null>(null);
  const [gudang, setGudang] = useState<string>("");
  const [modalRemove, setModalRemove] = useState(false);



  const handleSelectedItem = (data: PurchaseOrder) => {
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

    // if (selectedItem) {
    //   if (!confirm("Are you sure you want to switch gudang?")) {
    //     return;
    //   }
    //   const token = Cookies.get("access_token");
    //   const id = selectedItem.id;
    //   const changeGudang = selectedItem.gudang === "01" ? "02" : "01";
    //   const response = await fetch(`${api.purchase.switchGudangPurchaseRequest}?id=${id}`, {
    //     method: "PUT",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ gudang: changeGudang }),
    //   });

    //   if (response.ok) {
    //     fetchPurchaseRequest(currentPage, keyword, pageSize, gudang);
    //     setSelectedItem(null);
    //   } else {
    //     if (response.status === 401) {
    //       refreshToken();
    //       handleGantiTujuanClick();
    //     }
    //     setError("Failed to switch gudang");
    //   }
    // }
  }

  useLayoutEffect(() => {
    const handleF1 = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        handleGantiTujuanClick();
      }
    }

    window.addEventListener("keydown", handleF1);

    return () => {
      window.removeEventListener("keydown", handleF1);
    }

  }
    , [selectedItem]);


  const fetchPurchaseRequest = async (pageNumber: number, keyword: string, pageSize: number, gudang: string, retryCount = 0) => {
    try {
      const token = Cookies.get("access_token");

      const response = await fetch(
        `${api.purchase.allPurchaseOrder}?gudang=${gudang}&page=${pageNumber}&page_size=${pageSize}&keyword=${encodeURIComponent(keyword)}`,
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
          setData([]);
          setPage(data.data.meta);
          return;
        }

        setData(data.data.data);
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

  const columns = [
    { key: "no_ref", label: "Nomer PR", render: (item: any) => item.no_ref },
    { key: "tgl_ref", label: "Tanggal PR" },
    { key: "no_po", label: "Nomer PO", render: (item: any) => item.no_po },
    { key: "tgl_po", label: "Tanggal PO" },
    { key: "nm_supplier", label: "Nama Supplier", render: (item: any) => item?.supplier?.nama },
    {
      key: "total", label: "Total",
      render: (item: any) => (
        <div className="text-right">
          {formatRupiah(item.total)}
        </div>
      ),
    },
    {
      key: "user_approved_1",
      label: "Approved 1",
      render: (item: any) => (
        <div className={item.user_approved_1.name !== "" ? "text-white bg-green-500 rounded text-center p-2" : "text-white bg-red-500 rounded text-center p-2"}>
          {item.user_approved_1.name !== "" ? item?.user_approved_1?.name : "Pending"}
        </div>
      ),
    },
    {
      key: "user_approved_2",
      label: "Approved 2",
      render: (item: any) => (
        <div className={item.user_approved_2.name !== "" ? "text-white bg-green-500 rounded text-center p-2" : "text-white bg-red-500 rounded text-center p-2"}>
          {item.user_approved_2.name !== "" ? item?.user_approved_2?.name : "Pending"}
        </div>
      ),
    },
    { key: "user", label: "User", render: (item: any) => item?.user?.name },
  ];

  const renderButtons = (item: any, index: any) => [
    <PrintButton key={index} id={item?.id_hpo} />,
    <button key={index} className="bg-[#09A599] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Icon icon="mi:document" width="24" height="24" />
      </div>
    </button>,
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


  const handleApproveClick = async () => {
    if (selectedItem) {
      const token = Cookies.get("access_token");
      const id = selectedItem.id_hpo;
      const response = await fetch(`${api.purchase.approvePurchaseOrder}?id=${id}`, {
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
        setSuccess("Purchase order has been approved");
      } else {
        const errorBody = await response.json();
        setError(errorBody?.message || "Failed to approve purchase request");
        setModalApprove(false);
      }
    }
  }

  useEffect(() => {
    fetchPurchaseRequest(currentPage, keyword, pageSize, gudang);
  }, [currentPage, keyword, pageSize, gudang]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleOnSuccessAddPurchase = () => {
    setSuccess("Purchase request has been added");
    fetchPurchaseRequest(1, "", pageSize, gudang)
  }

  const handleApproveButton = () => {
    if (selectedItem) {
      setModalApprove(true);
    } else {
      setError("Please select a purchase request");
    }
  }

  const handleRemove = async () => {
    if (selectedItem) {
      const token = Cookies.get("access_token");
      const id = selectedItem.id_hpo;
      const response = await fetch(`${api.purchase.removePurchaseOrder}?id=${id}`, {
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
      <Toolbar
        onGudangChange={(e) => setGudang(e.target.value)}
        onGantiTujuanClick={handleGantiTujuanClick}
        onSuccess={handleOnSuccessAddPurchase}
        onApproveClick={handleApproveButton}
        onSearchChange={
          (e) => setKeyword(e.target.value)
        }
        onError={
          (e) => setError(e)
        }
      />

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

      <Table
        columns={columns}
        data={data}
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
