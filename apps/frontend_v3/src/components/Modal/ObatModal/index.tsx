import React, { useState, useEffect } from 'react';
import { DataRow } from '@/types';
import { useGet } from '@/hooks/useApi';
import { API_URL } from '@/constants/api';
import { useDebounce } from 'use-debounce';
import { formatRupiah } from '@/utils/currency';

interface ObatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (obat: DataRow) => void;
}

export const ObatModal: React.FC<ObatModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data, isLoading, error } = useGet(
    `${API_URL.SALES["info-obat"]}?limit=10&search=${debouncedSearch}&page=${page}`,
    { enabled: isOpen }
  );

  const obatList = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setSearch('');
      setIsInitialLoad(true);
    }
  }, [isOpen]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (data) {
      setIsInitialLoad(false);
    }
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-3/4 max-h-3/4 overflow-auto">
        <h2 className="text-xl font-bold mb-4">Select Obat</h2>
        <input
          type="text"
          placeholder="Search obat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        {isInitialLoad ? (
          <div className="flex justify-center items-center h-40">
            <div className="spinner"></div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Kode Barang</th>
                  <th>Nama Barang</th>
                  <th>Harga</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {obatList.map((obat) => (
                  <tr
                    className='hover:bg-gray-100 text-center'
                    key={obat.kd_brgdg}>
                    <td>{obat.kd_brgdg}</td>
                    <td>{obat.nm_brgdg}</td>
                    <td>{formatRupiah(obat.hj_ecer)}</td>
                    <td>
                      <button onClick={() => onSelect(obat)} className="bg-blue-500 text-white px-2 py-1 rounded">
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-between">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="bg-gray-300 px-2 py-1 rounded">
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="bg-gray-300 px-2 py-1 rounded">
                Next
              </button>
            </div>
          </>
        )}
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};