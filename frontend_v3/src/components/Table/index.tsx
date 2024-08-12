'use client'

import { cn } from '@/lib/cn';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnSort,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Pagination } from './Pagination';
import { TableTypes } from './type';
import { DataRow } from '@/types';

export const Table = ({
  columns,
  defaultData,
  rowClassName,
  headerClassName,
  pagination,
  tableClassName,
  meta,
  enableSorting = true,
}: TableTypes & { enableSorting?: boolean }) => {
  const [data, setData] = useState<DataRow[]>([...defaultData]);
  const [sorting, setSorting] = useState<ColumnSort[]>([]);

  useEffect(() => {
    setData([...defaultData]);
  }, [defaultData]);

  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className={cn("bg-white rounded-xl max-w-[1028px] drop-shadow-sm overflow-x-scroll", tableClassName)}>
        <table className='min-w-max w-full'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    className={cn('py-5 font-semibold text-start text-sm px-6 text-gray-800 bg-white', headerClassName)}
                    onClick={enableSorting && header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {(enableSorting && header.column.getCanSort() && {
                        asc: <FaSortUp />,
                        desc: <FaSortDown />,
                      }[header.column.getIsSorted() as string]) ?? (header.column.getCanSort() ? <FaSort /> : null)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr 
                className={cn(idx % 2 === 0 ? 'bg-gray-50' : 'bg-white',
                  'border-b-gray-200 text-sm border-b text-gray-500 ',
                  rowClassName
                )}
                key={row.id}
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    className={cn('p-4 ')}                                
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        {pagination && <Pagination meta={meta} table={table}/>}
    </>
  );
};
