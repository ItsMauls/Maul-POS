'use client'
import { Table } from "@/components/Table";
import Button from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Searchbar";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter()
    const handleBack = () => {
        router.push('/transaksi-penjualan/transaksi')
    }
    const columns = [
        { accessorKey: "nomor_bon", header: "Nomor Bon" },
        { accessorKey: "tanggal", header: "Tanggal" },
        { accessorKey: "jam", header: "Jam" },
        { accessorKey: "kasir", header: "Kasir" },
        { accessorKey: "kassa", header: "Kassa" },
        { accessorKey: "shift", header: "Shift" },
        { accessorKey: "customer", header: "Customer" },
        { accessorKey: "alamat", header: "Alamat" },
        { accessorKey: "no_telp", header: "No. Telp" },
        { accessorKey: "grand_total", header: "Grand Total" },
        { accessorKey: "sub_total", header: "Sub Total" },
        { accessorKey: "ru", header: "RU" },
        { accessorKey: "misc", header: "Misc" },
        { accessorKey: "sc", header: "SC" },
        { accessorKey: "dsic", header: "DSIC" },
        { accessorKey: "dokter", header: "Dokter" },
        { accessorKey: "dokter_no_telp", header: "No. Telp Dokter" },
        { accessorKey: "member", header: "Member" },
        { accessorKey: "kd_corp", header: "Kode Corporate" },
        { accessorKey: "corporate", header: "Corporate" }
    ];
    
    const data = [
        {
            nomor_bon: "00123456",
            tanggal: "2025-02-06",
            jam: "14:30",
            kasir: "Budi",
            kassa: "Kassa 1",
            shift: "Pagi",
            customer: "Andi Wijaya",
            alamat: "Jl. Merdeka No. 10, Jakarta",
            no_telp: "081234567890",
            grand_total: 250000,
            sub_total: 230000,
            ru: 20000,
            misc: 5000,
            sc: 3000,
            dsic: 10000,
            dokter: "Dr. Siti",
            dokter_no_telp: "081234567891",
            member: "Yes",
            kd_corp: "CORP123",
            corporate: "PT Sejahtera"
        },
        {
            nomor_bon: "00123457",
            tanggal: "2025-02-06",
            jam: "15:00",
            kasir: "Siti",
            kassa: "Kassa 2",
            shift: "Siang",
            customer: "Rudi Hartono",
            alamat: "Jl. Sudirman No. 20, Jakarta",
            no_telp: "081234567892",
            grand_total: 500000,
            sub_total: 480000,
            ru: 20000,
            misc: 10000,
            sc: 5000,
            dsic: 15000,
            dokter: "Dr. Budi",
            dokter_no_telp: "081234567893",
            member: "No",
            kd_corp: "CORP456",
            corporate: "PT Makmur"
        }
    ];

    const barangColumns = [
        { accessorKey: "kd_barang", header: "Kode Barang" },
        { accessorKey: "nama_barang", header: "Nama Barang" },
        { accessorKey: "qty", header: "Qty" },
        { accessorKey: "isi", header: "Isi" },
        { accessorKey: "harga", header: "Harga" },
        { accessorKey: "misc", header: "Misc" },
        { accessorKey: "disc", header: "Disc" },
        { accessorKey: "promo", header: "Promo" },
        { accessorKey: "total_promo", header: "Total Promo" },
        { accessorKey: "sc", header: "SC" },
        { accessorKey: "ru", header: "RU" },
        { accessorKey: "sub_jumlah", header: "Sub Jumlah" },
        { accessorKey: "jumlah", header: "Jumlah" },
        { accessorKey: "status", header: "Status" },
        { accessorKey: "up_sell", header: "Up Sell" }
    ];
    
    const barangData = [
        {
            kd_barang: "BRG001",
            nama_barang: "Paracetamol",
            qty: 2,
            isi: 10,
            harga: 5000,
            misc: 500,
            disc: 1000,
            promo: "Buy 1 Get 1",
            total_promo: 5000,
            sc: 300,
            ru: 200,
            sub_jumlah: 9000,
            jumlah: 9500,
            status: "Available",
            up_sell: "Vitamin C"
        },
        {
            kd_barang: "BRG002",
            nama_barang: "Ibuprofen",
            qty: 1,
            isi: 20,
            harga: 10000,
            misc: 1000,
            disc: 2000,
            promo: "Discount 10%",
            total_promo: 8000,
            sc: 500,
            ru: 300,
            sub_jumlah: 16000,
            jumlah: 16500,
            status: "Available",
            up_sell: "Pain Relief Gel"
        }
    ];
    return (
        <>
        <div className="flex justify-between">
            <SearchBar 
                leftIcon
                rightIcon={<div className="border border-gray-300 font-semibold px-1 rounded-md">\</div>}
                className={"w-[295px] px-4 border-2 my-4 border-gray-100 font-normal"}
                id="monitoringSearchbar"
                placeholder="Cari Nama Customer"
            />
             <div className="flex justify-between gap-x-4 my-4">
            <Button
                hasIcon
                icon={            
                    <span className="ml-2 py-1 px-2 bg-black text-white rounded-lg text-xs">
                    F10
                    </span>}
                // onClick={() => handleShortcut('Pilih Tanggal')}
                className={'border border-gray-400 rounded-xl py-0'}
            >
                Jadikan Master Resep
            </Button>
            <Button
                hasIcon
                icon={            
                    <span className="ml-2 py-1 px-2 bg-black text-white rounded-lg text-xs"
                    >
                    Enter
                    </span>}
                onClick={handleBack}
                className={'border border-gray-400 rounded-xl py-0'}
            >
                Pilih
            </Button>
            <Button
                hasIcon
                icon={            
                    <span className="ml-2 py-1 px-2 bg-black text-white rounded-lg text-xs"
                    >
                    Esc
                    </span>}
                onClick={handleBack}
                className={'border border-gray-400 rounded-xl py-0'}
            >
                Kembali
            </Button>
            <Button
                hasIcon
                icon={            
                    <span className="ml-2 py-1 px-2 bg-red-500 text-red-500 rounded-lg text-xs"
                    >
                    x
                    </span>}
                // onClick={() => handleShortcut('Pilih Tanggal')}
                className={'border border-gray-400 rounded-xl py-0'}
            >
                Master Resep
            </Button>
             </div>
         </div>
            <Table
                withSearchBar
                columns={columns}
                defaultData={data}
                meta={{ totalCount: data.length }}
                totalData={data.length}
                // tableClassName="max-w-[1350px]"
                // pagination
                enableSorting
            />
            <Table
                withSearchBar
                columns={barangColumns}
                defaultData={barangData}
                meta={{ totalCount: barangData.length }}
                totalData={barangData.length}
                tableClassName="my-6"
                // pagination
                enableSorting
            />
        </>
    )
}
    
