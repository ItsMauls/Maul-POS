'use client'
import { Table } from "@/components/Table";
import { createColumnsWithAction, dummyDataWithAction } from "@/constants";


export default function Page() {
const meta = {
    totalData: 0
}
    return (
        <> 
       
       <Table
            meta={meta}
            tableClassName="max-w-[1350px]"
            defaultData={dummyDataWithAction}
            columns={createColumnsWithAction}
            pagination
            enableSorting
        />
     
        </>
    )
}