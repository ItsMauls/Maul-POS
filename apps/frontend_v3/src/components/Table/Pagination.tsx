'use client'
import { useRouter } from "next/navigation"
import { PaginationButton } from "../ui/Button/PaginationButton";

export const Pagination = ({ table, meta } : {table : any, meta?: any}) => {
    const router = useRouter();        
    
    const {
        totalCount,
        limit,
        currentPage
    } = meta || {};

    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalCount);
    
    return (
        <>
        <div className="h-2" />
            <footer className="gap-x-40 p-6 font-medium text-gray-500 border-t-gray-100 justify-between flex border-t bottom-0 w-full items-center gap-2">
                <div>
                    <h2>{`${startItem}-${endItem} dari ${totalCount}`}</h2>
                </div>               
                <PaginationButton
                    currentPage={currentPage}
                    totalItems={totalCount}
                    itemsPerPage={limit}
                />            
                <span className="flex items-center gap-3 mx-1">
                Ke Halaman
                <input
                    type="number"
                    defaultValue={currentPage}
                    onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) : 1;
                    table.setPageIndex(page - 1);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          const page = e.currentTarget.value ? Number(e.currentTarget.value) : 1;
                          router.push(`?table-page=${page}`);   
                          table.setPageIndex(page - 1);
                        }
                      }}
                    className="border-2 p-2 rounded-xl w-12"
                />
                </span>
            </footer>
        </>
    )
}