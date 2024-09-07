import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DataRow } from '@/types';
import { useGet } from '@/hooks/useApi';
import { API_URL } from '@/constants/api';
import { useDebounce } from 'use-debounce';
import { formatRupiah } from '@/utils/currency';

interface ObatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (obat: any) => void;
}

export const ObatModal: React.FC<ObatModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastInputTime, setLastInputTime] = useState<number>(0);
  const [inputBuffer, setInputBuffer] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useGet<any>(
    `${API_URL.SALES["info-obat"]}?limit=10&search=${debouncedSearch}&page=${page}`,
    { enabled: isOpen }
  );

  const obatList = data?.data || [];
  console.log(obatList, 'obatList');
  const totalPages = data?.meta?.totalPages || 1;

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(-1);
      setSearch('');
      setIsInitialLoad(true);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
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

  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key !== 'Enter') {
        barcodeBuffer += e.key;
      } else if (barcodeBuffer) {
        setSearch(barcodeBuffer);
        barcodeBuffer = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown as unknown as EventListener);

    return () => {
      window.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastInputTime > 50) {
      setInputBuffer('');
    }
    setLastInputTime(currentTime);
    setInputBuffer(prev => prev + e.key);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, obatList.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < obatList.length) {
          handleSelect(obatList[selectedIndex]);
        } else if (obatList.length === 1) {
          handleSelect(obatList[0]);
        }
        break;
    }
  };

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (obat: DataRow) => {
    onSelect({
      kd_brgdg: obat.kd_brgdg,
      nm_brgdg: obat.nm_brgdg,
      hj_ecer: obat.hj_ecer,
      activePromo: obat.activePromo,
      qty: 1,
      rOption: 'R',
    });
    onClose();
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-3/4 max-h-3/4 overflow-auto">
        <h2 className="text-xl font-bold mb-4">Select Obat</h2>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search obat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
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
          <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        ) : (
          <div ref={listRef}>
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
                {obatList.map((obat: any, index: number) => (
                  <tr
                    key={obat.kd_brgdg}
                    className={`hover:bg-gray-100 text-center ${index === selectedIndex ? 'bg-blue-100' : ''}`}
                    onClick={() => handleSelect(obat)}
                  >
                    <td>{obat.kd_brgdg}</td>
                    <td>{obat.nm_brgdg}</td>
                    <td>{formatRupiah(obat.hj_ecer)}</td>
                    <td>
                      <button onClick={() => handleSelect(obat)} className="bg-blue-500 text-white px-2 py-1 rounded">
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};