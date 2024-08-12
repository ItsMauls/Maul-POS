import { usePagination } from "@/hooks/usePagination";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { PaginationButtonTypes } from "./type";



export const PaginationButton = ({ totalItems = 100, itemsPerPage = 10, currentPage } : PaginationButtonTypes) => {
  const { 
        handlePrevPage,
        handleNextPage,
        renderPageNumbers,
    } = usePagination({
        totalItems,
        itemsPerPage,
        currentPage
    });

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevPage}
          className="relative mx-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={handlePrevPage}
              className="rounded-lg relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
            >
              <span className="sr-only">Previous</span>
              <IoMdArrowDropleft className="text-xl font-bold"/>
            </button>
            {renderPageNumbers()}
            <button
              onClick={handleNextPage}
              className="rounded-lg relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
            >
              <span className="sr-only">Next</span>
              <IoMdArrowDropright className="text-xl font-bold"/>
            </button>           
          </nav>
        </div>
      </div>
    </div>
  );
};