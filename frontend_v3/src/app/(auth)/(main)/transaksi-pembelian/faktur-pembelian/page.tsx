'use client'
import { Shortcuts } from "@/components/Shorcuts";
import { Table } from "@/components/Table";
import { SearchBar } from "@/components/ui/Searchbar";
import { createColumns, defaultData } from "@/constants";
import { MdOtherHouses } from "react-icons/md";

export default function Page() {
const meta = {
    totalData: 0
}
    return (
        <> 
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-4">
                <div className="bg-white p-2 rounded-lg items-center gap-x-2 text-black flex">
                    <div className="text-2xl text-blue-500">
                        <MdOtherHouses/>
                    </div>
                    <strong className="font-semibold">Gudang 1</strong> 
                </div>
                <SearchBar
                    rightIcon={<div className="border border-gray-300 font-semibold px-1 rounded-md">\</div>}
                    className={"w-[190px] px-4 border-2 my-4 border-gray-100 font-normal"}
                    id="monitoringSearchbar"
                    placeholder="Cari disini..."
                />
            </div>
            <div className="flex gap-x-4">
                <Shortcuts />
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