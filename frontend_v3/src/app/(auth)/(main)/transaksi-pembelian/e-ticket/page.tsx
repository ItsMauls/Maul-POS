'use client'
import { Table } from "@/components/Table";
import Button from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Searchbar";
import { createColumnsWithAction, dummyDataWithAction } from "@/constants";
import { GoDownload } from "react-icons/go";


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
                    placeholder="Cari No. Bon disini..."
                />
            </div>
            <div className="flex gap-x-4">
            <Button
                hasIcon
                icon={<GoDownload />}
                className={'bg-teal-600 rounded-xl hover:bg-teal-700 text-white'}>Tambah
             </Button>
            </div>
        </div>
       {/* <Table
            meta={meta}
            tableClassName="max-w-[1350px]"
            defaultData={dummyDataWithAction}
            columns={createColumnsWithAction}
            pagination
            enableSorting
        /> */}
        </>
    )
}