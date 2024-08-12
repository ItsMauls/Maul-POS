"use client";
import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import Table from "@/components/Table";
import DefaultPagination from "@/components/Pagination";
import Toolbar from "@/components/toolbar/PurchaseRequest";
import AddPurchase from "@/components/modal_add/AddPurchase";
import { api } from "@/constants/api";
import SearchBar from "@/components/SearchBar"; // Import the SearchBar component
import UserToolbar from "@/components/toolbar/MasterUser";
import DeleteUser from "@/components/modal_add/DeleteUser";

// Define the types
interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  address: string;
  username: string;
  email: string;
  role: Role;
  no?: number;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState({
    page: 1,
    page_size: 10,
    total: 0,
    total_page: 0,
    total_data: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(
    async (pageNumber: number, keyword: string, pageSize: number) => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          setError("Access token is missing. Please log in.");
          return;
        }

        const response = await fetch(
          `${
            api.user.allUser
          }?page=${pageNumber}&page_size=${pageSize}&keyword=${encodeURIComponent(
            keyword
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
          setUsers(data.data.users || []);
          setPage(data.data.meta);
        } else {
          const errorMessage = await response.text();
          console.error("Failed to fetch users:", errorMessage);
          setError("Failed to fetch users. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("An unexpected error occurred. Please try again later.");
      }
    },
    // [currentPage, keyword, pageSize]
    []
  );

  const handleChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page when page size changes
  };

  const handleDeleteUser = () => {
    fetchUsers(currentPage, keyword, pageSize);
  };

  useEffect(() => {
    fetchUsers(currentPage, keyword, pageSize);
  }, [currentPage, keyword, pageSize, fetchUsers]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (user: User) => user.role.name },
  ];

  const renderButtons = (user: any, index: any) => [
    <DeleteUser key={index} user={user} onDelete={handleDeleteUser} />,
  ];

  const getDataWithRowNumbers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return users.map((user, index) => ({
      ...user,
      no: startIndex + index + 1,
    }));
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, page.total_data);

  return (
    <div>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="mb-3 flex flex-row justify-between">
            <UserToolbar
              searchQuery={keyword}
              onSearchChange={handleKeywordChange}
              onTambahClick={() => {}}
              onSuccess={() => fetchUsers(1, "", pageSize)}
            />

            <div>
              <span className="mr-3">
                {startRange} - {endRange} dari {page.total_data}
              </span>
              <select
                name="page-size"
                id="page-size"
                value={pageSize}
                onChange={handleChangePageSize}
                className="border border-gray-300 text-sm rounded-md h-8 w-20 text-center"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
          </div>
          <Table
            columns={columns}
            data={getDataWithRowNumbers()}
            renderButtons={renderButtons}
          />
          <DefaultPagination
            page={currentPage}
            totalData={page.total}
            pageSize={pageSize}
            totalPage={page.total_page}
            paginate={paginate}
          />
        </>
      )}
    </div>
  );
}
