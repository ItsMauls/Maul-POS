import { cn } from "@/lib/cn";
import Link from "next/link";
import { useCallback, useState } from "react";
import useSearchParams from "./useSearchParams";

interface UsePaginationTypes {
  totalItems: number;
  itemsPerPage: number;
  currentPage?: number;
}

export const usePagination = ({
    totalItems,
    itemsPerPage,
    currentPage : currPage = 1
} : UsePaginationTypes) => {
  const [currentPage, setCurrentPage] = useState(currPage);
  const { setSearchParams } = useSearchParams()
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {        
        setCurrentPage(currentPage - 1);
        setSearchParams(`table-page`, (currentPage - 1).toString())
    }
  }, [currentPage, setSearchParams]);
  
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        setSearchParams(`table-page`, (currentPage + 1).toString())
    }
  }, [currentPage, totalPages, setSearchParams]);

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(
          <Link
            key={i}
            href={`?table-page=${i}`}
            className={cn(
              `relative inline-flex rounded-lg items-center border px-4 py-2 text-sm font-medium focus:z-20`,
              i === currentPage
                ? "bg-blue-600 border border-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Link>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push(
          <span
            key={i}
            className="relative rounded-lg inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
          >
            ...
          </span>
        );
      }
    }
    return (
        <div className="px-3 space-x-3">
          {pageNumbers}
        </div>
      );
  };

  return {
    handlePrevPage,
    handleNextPage,
    renderPageNumbers,
    setCurrentPage,
    totalPages,
    currentPage
   };
};