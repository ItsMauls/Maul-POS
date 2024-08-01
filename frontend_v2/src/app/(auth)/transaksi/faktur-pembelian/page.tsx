"use client";
import DefaultPagination from "@/components/Pagination";
import Table from "@/components/Table";
import Toast from "@/components/Toast";
import Toolbar from "@/components/toolbar/Faktur";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "@/constants/api";
import { formatRupiah } from "@/libs/formater";
import { Invoice } from "@/constants/types";
import { PrintButton } from "@/components/pdf/printButtonPO";
import DetailFaktur from "@/components/modal_add/DetailFaktur";
import Image from "next/image";
import imageApproval from "@/assets/images/approval.svg";
import Modal from "@/components/Modal";


const columns = [
    { key: "no_reff", label: "Nomer PO" },
    { key: "tgl_reff", label: "Tanggal PO" },
    { key: "kode_supplier", label: "Kode Supplier" },
    { key: "nama_supplier", label: "Nama Supplier" },
    {
        key: "total_diskon", label: "Total Diskon",
        render: (item: any) => (
            <div className="text-right">
                {formatRupiah(item.total_diskon)}
            </div>
        ),
    },
    {
        key: "total_ppn", label: "Total PPN",
        render: (item: any) => (
            <div className="text-right">
                {formatRupiah(item.total_ppn)}
            </div>
        ),
    },
    {
        key: "total_net", label: "Total Net",
        render: (item: any) => (
            <div className="text-right">
                {formatRupiah(item.total_net)}
            </div>
        ),
    },
    {
        key: "total", label: "Total",
        render: (item: any) => (
            <div className="text-right">
                {formatRupiah(item.total)}
            </div>
        ),
    },
    {
        key: "metode_pembayaran", label: "Metode Pembayaran",
        render: (item: any) => (
            <div className="text-center">
                {item.metode_pembayaran}
            </div>
        ),
    },
    {
        key: "status_invoice",
        label: "Status",
        render: (item: any) => (
            <div className={item.status_invoice !== "N" ? "text-white bg-green-500 rounded text-center p-2" : "text-white bg-red-500 rounded text-center p-2"}>
                {item.status_invoice !== "N" ? "Lunas" : "Belum Lunas"}
            </div>
        ),
    },
    {
        key: "tgl_jatuh_tempo", label: "Tanggal Jatuh Tempo",
        render: (item: any) => (
            <div className="text-center">
                {item.tgl_jatuh_tempo}
            </div>
        ),
    }
];

export default function Page() {
    const [data, setData] = useState<Invoice[]>([])
    const [keyword, setKeyword] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [page, setPage] = useState({
        page: 1,
        page_size: 10,
        total: 0,
        total_page: 0,
        total_data: 0,
    });
    const [gudang, setGudang] = useState<string>("");
    const [modalPelunasan, setModalPelunasan] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Invoice | null>(null);
    const [keterangan, setKeterangan] = useState("");

    const renderButtons = (data: Invoice, index: any) => [
        <PrintButton key={index} id="print-button" />,
        <DetailFaktur key={index} id={data?.id} />,
    ];

    const fetchData = async () => {
        try {
            const token = Cookies.get("access_token");
            const response = await fetch(
                `${api.purchase.allInvoice}?page=${currentPage}&page_size=${pageSize}&keyword=${keyword}&gudang=${gudang}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = await response.json();

            if (result.status_code === 200) {
                if (result.data.meta.total_data === 0) {
                    setData([]);
                    return;
                }
                setData(result.data.data);
                setPage(result.data.meta);
            }

            if (result.status_code === 401) {
                setError("Unauthorized");
            }

            if (result.status_code === 500) {
                setError("Internal Server Error");
            }

        } catch (error) {
            setError("Internal Server Error");
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, keyword, gudang]);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSelectedItem = (data: Invoice) => {
        if (data) {
            if (selectedItem === data) {
                setSelectedItem(null);
                return;
            }
            setSelectedItem(data);
            return;
        }
    }

    const handlePelunasan = async () => {
        try {
            const token = Cookies.get("access_token");
            const response = await fetch(
                `${api.purchase.pelunasanInvoice}?id=${selectedItem?.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: selectedItem?.id,
                        keterangan: keterangan,
                        metode_pembayaran: selectedItem?.metode_pembayaran,
                    }),
                }
            );
            const result = await response.json();

            if (result.status_code === 200) {
                setSuccess("Faktur berhasil dilunasi");
                setModalPelunasan(false);
                fetchData();
            }

            if (result.status_code === 401) {
                setError("Unauthorized");
            }

            if (result.status_code === 500) {
                setError("Internal Server Error");
            }

        } catch (error) {
            setError("Internal Server Error");
        }
    };

    return (
        <div>
            <Toolbar
                onError={
                    (error: string) => {
                        setError(error);
                    }
                }
                onGudangChange={
                    (event: React.ChangeEvent<HTMLSelectElement>) => {
                        setGudang(event.target.value);
                    }
                }
                onSearchChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                        setKeyword(event.target.value);
                    }
                }
                onApproveClick={
                    () => {
                        if (selectedItem?.status_invoice === "N") {
                            setModalPelunasan(true);
                        } else {
                            setError("Faktur sudah lunas");
                        }
                    }
                }
                onSuccess={
                    () => {
                        setSuccess("Berhasil Membuat Faktur");
                        fetchData();
                    }
                }
            />

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

            <Modal isOpen={modalPelunasan} onClose={
                () => {
                    setModalPelunasan(false);
                }
            } >
                <div>
                    <div className="flex justify-center">
                        <Image src={imageApproval} alt="Change Gudang" />
                    </div>
                    <p className="text-lg font-bold text-center mt-4">Lunasi Sekarang?</p>
                    <p className="text-sm text-center mt-2">Apakah anda yakin ingin melunasi faktur ini?</p>
                    <div className="flex justify-center mt-4">
                        <form>
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="no_faktur" className="text-sm">No. Faktur</label>
                                    <input type="text" id="no_faktur" className="border border-gray-300 rounded-lg p-2 w-72" readOnly value={
                                        selectedItem?.no_invoice
                                    } />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="no_po" className="text-sm">No PO</label>
                                    <input type="text" id="no_po" className="border border-gray-300 rounded-lg p-2 w-72" readOnly value={
                                        selectedItem?.no_reff
                                    } />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <div className="flex flex-col">
                                    <label htmlFor="supplier" className="text-sm">Supplier</label>
                                    <input type="text" id="supplier" className="border border-gray-300 rounded-lg p-2 w-72" readOnly value={
                                        selectedItem?.nama_supplier
                                    } />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="tgl_jth_tempo" className="text-sm">Tanggal Jatuh Tempo</label>
                                    <input type="text" id="tgl_jth_tempo" className="border border-gray-300 rounded-lg p-2 w-72" readOnly value={
                                        selectedItem?.tgl_jatuh_tempo
                                    } />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <div className="flex flex-col">
                                    <label htmlFor="total" className="text-sm">Total</label>
                                    <input type="text" id="total" className="border border-gray-300 rounded-lg p-2 w-72" readOnly value={
                                        formatRupiah(selectedItem?.total || 0)
                                    } />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="metode_pembayaran" className="text-sm">Metode Pembayaran</label>
                                    <input type="text" id="metode_pembayaran" className="border border-gray-300 rounded-lg p-2 w-72" readOnly value={
                                        selectedItem?.metode_pembayaran
                                    } />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4 w-full">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="keterangan" className="text-sm">Keterangan</label>
                                    <input type="text" id="keterangan" className="border border-gray-300 rounded-lg p-2 w-full" value={keterangan} onChange={
                                        (event) => {
                                            setKeterangan(event.target.value);
                                        }
                                    } />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="flex gap-4 mt-4 justify-end" >
                        <button className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" onClick={
                            () => {
                                setModalPelunasan(false);
                            }
                        }>
                            <div className="flex justify-center items-center gap-2">
                                <span>Batal</span>
                            </div>
                        </button>
                        <button className="w-full bg-[#09A599] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg" onClick={handlePelunasan}>
                            <div className="flex justify-center items-center gap-2">
                                <span>Ya, Setujui</span>
                            </div>
                        </button>
                    </div>
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
        </div>
    )
}