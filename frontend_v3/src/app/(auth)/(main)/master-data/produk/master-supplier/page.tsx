'use client'
import { Table } from "@/components/Table";
import Button from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Searchbar";
import { createColumns, defaultData } from "@/constants";
import { GoDownload } from 'react-icons/go'
import { Limiter } from "@/components/Limiter";

export default function Page() {
const meta = {
    totalData: 0
}
    return (
        <> 
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-4">
                <SearchBar
                    rightIcon={<div className="border border-gray-300 font-semibold px-1 rounded-md">\</div>}
                    className={"w-[295px] px-4 border-2 my-4 border-gray-100 font-normal"}
                    id="monitoringSearchbar"
                    placeholder="Cari Supplier disini..."
                />
            </div>
            <div className="flex gap-x-4">
            <Limiter />
            <Button 
                hasIcon
                icon={<GoDownload />}
                className={'bg-teal-600 px-3 rounded-xl hover:bg-teal-700 text-white'}>Tambah
             </Button>
            </div>
        </div>
        <Table
            meta={meta}
            tableClassName="max-w-[1350px]"
            defaultData={defaultData}
            columns={createColumns}
            pagination
            enableSorting
        />
     
        </>
    )
}