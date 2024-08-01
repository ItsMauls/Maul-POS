import { api } from "@/constants/api";
import { Barang, PurchaseRequestDetail, Satuan } from "@/constants/types";
import { useState } from "react";
import Cookies from "js-cookie";
import { FormEventHandler } from "react";
import AsyncSelect from 'react-select/async';
import { useAuth } from "@/context/AuthContext";

interface params {
    action: (params: PurchaseRequestDetail) => void;
}

export default function ModalAddDetailOrder(params: params) {
    const [showModal, setShowModal] = useState(false);
    const [barangs, setBarangs] = useState<Barang[]>([]);
    const [selectedBarang, setSelectedBarang] = useState<Barang>();
    const [quality, setQuality] = useState(1);
    const { refreshToken } = useAuth();

    const [error, setError] = useState<string | null>(null);

    const handleChangeSelect = (params: any) => {
        console.log(params);
        const barang = barangs.find((barang) => barang.kode_barang === params.value);
        setSelectedBarang(barang);
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        const subTotal = (selectedBarang?.harga_beli ?? 0) * quality;
        e.preventDefault();
        const satuan: Satuan = {
            id: selectedBarang?.satuan.id || 0,
            nama: selectedBarang?.satuan.nama || ""
        };
        params.action(
            {
                nama_barang: selectedBarang?.nama_barang || "",
                kode_barang: selectedBarang?.kode_barang || "",
                qty: quality,
                isi: selectedBarang?.isi || 1,
                harga_beli: selectedBarang?.harga_beli || 0,
                total: subTotal,
                satuan: satuan
            }
        );
        setShowModal(false);
        setSelectedBarang(undefined);
        setQuality(1);
    };

    const handleLoadOptions = async (inputValue: string) => {
        try {
            const token = Cookies.get("access_token");
            if (!token) {
                setError("Access token is missing. Please log in.");
                return;
            }
            const response = await fetch(
                `${api.inventory.allInventory}?page=${1}&page_size=${10}&keyword=${encodeURIComponent(
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
                setBarangs(data.data.barangs || []); // Ensure barangs is an array
                return data.data.barangs.map((barang: Barang) => ({
                    value: barang.kode_barang,
                    label: barang.nama_barang,
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
            setError("An unexpected error occurred. Please try again later.");
            return [];
        }
    }

    return (
        <div>
            <div className="flex justify-center">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                >
                    Tambah Detail Purchase
                </button>

                {showModal && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white w-1/2 p-8 rounded-lg">
                            <h1 className="text-2xl font-bold">Add Detail Purchase</h1>
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-2xl"
                            >
                                &times;
                            </button>
                            <hr className="my-4" />
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label
                                        htmlFor="barang"
                                        className="text-[#666666] text-md font-normal"
                                    >
                                    </label>

                                    <AsyncSelect
                                        cacheOptions
                                        defaultOptions
                                        onChange={handleChangeSelect}
                                        loadOptions={handleLoadOptions}
                                        placeholder="Select Barang"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        name="barang"
                                    />
                                    {selectedBarang && (
                                        <div className="mt-4"><label
                                            htmlFor="qty"
                                            className="text-[#666666] text-md font-normal"
                                        >
                                            Quantity
                                        </label>
                                            <input
                                                className="appearance-none border rounded-lg w-full py-3 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="qty"
                                                type="number"
                                                placeholder="1"
                                                name="qty"
                                                value={quality}
                                                onChange={(e) => setQuality(parseInt(e.target.value))} />

                                            <label
                                                htmlFor="isi"
                                                className="text-[#666666] text-md font-normal"
                                            >
                                                Isi
                                            </label>
                                            <input
                                                className="appearance-none border rounded-lg w-full py-3 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="isi"
                                                type="text"
                                                placeholder="0"
                                                name="isi"
                                                value={`${selectedBarang.isi}  (${selectedBarang.satuan.nama})`}
                                                readOnly
                                            />

                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}
