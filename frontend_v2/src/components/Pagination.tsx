import React, { useEffect, useState } from "react";

interface PaginationProps {
  page: number;
  totalData: number;
  pageSize: number;
  totalPage: number;
  paginate: (number: number) => void;
}

export default function DefaultPagination({
  page,
  totalData,
  pageSize,
  totalPage,
  paginate,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(page);

  useEffect(() => {
    setInputPage(page);
  }, [page])

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputPage(value ? Number(value) : 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputPage >= 1 && inputPage <= totalPage) {
        paginate(inputPage);
      }
    }
  };

  const handleBlur = () => {
    if (inputPage >= 1 && inputPage <= totalPage) {
      paginate(inputPage);
    } else {
      setInputPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(totalPage, page + 1);

    // Left arrow
    pageNumbers.push(
      <button
        key="prev"
        onClick={() => paginate(page - 1)}
        disabled={page === 1}
        className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
          page === 1
            ? "text-gray-300 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50"
        } rounded-l-md`}
      >
        <span className="sr-only">Previous</span>
        <svg
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    // Page numbers
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            page === 1
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          1
        </button>,
        startPage > 2 && (
          <span
            key="ellipsis-start"
            className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white text-gray-700"
          >
            ...
          </span>
        )
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            i === page
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPage) {
      pageNumbers.push(
        endPage < totalPage - 1 && (
          <span
            key="ellipsis-end"
            className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white text-gray-700"
          >
            ...
          </span>
        ),
        <button
          key={totalPage}
          onClick={() => paginate(totalPage)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            page === totalPage
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {totalPage}
        </button>
      );
    }

    // Right arrow
    pageNumbers.push(
      <button
        key="next"
        onClick={() => paginate(page + 1)}
        disabled={page === totalPage}
        className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
          page === totalPage
            ? "text-gray-300 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50"
        } rounded-r-md`}
      >
        <span className="sr-only">Next</span>
        <svg
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 mr-2">
            <span className="font-medium mr-1">{(page - 1) * pageSize + 1}</span>-
            <span className="font-medium mx-1">{Math.min(page * pageSize, totalData)}</span>
            dari
            <span className="font-medium mx-1">{totalData}</span>
            results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-2"
            aria-label="Pagination"
          >
            {renderPageNumbers()}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span>Ke Halaman</span>
          <input
            type="text"
            value={inputPage}
            onChange={handlePageInput}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            className="border border-gray-300 text-sm rounded-md h-8 w-10 text-center"
          />
        </div>
      </div>
    </div>
  );
}
