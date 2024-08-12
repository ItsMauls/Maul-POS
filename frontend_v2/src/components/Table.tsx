import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface Column {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  renderButtons?: (item: any, index: number) => React.ReactNode[];
  actionSelect?: (item: any) => void;
}

const Table: React.FC<TableProps> = ({ columns, data, renderButtons, actionSelect }) => {

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const handleSelectedItem = (data: any) => {
    actionSelect && actionSelect(data);
    if (data) {
      if (selectedItem === data) {
        setSelectedItem(null);
        return;
      }
      setSelectedItem(data);
      return;
    }
  };

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto rounded-t-lg">
      <table className="w-full bg-white divide-y divide-gray-200">
        <thead>
          <tr>
            {renderButtons && (
              <th className="px-4 text-left text-xs font-medium text-black uppercase py-3">
                Actions
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 text-center text-xs font-medium text-black uppercase cursor-pointer py-3"
                onClick={() => requestSort(column.key)}
              >
                {column.label}{" "}
                <Icon
                  icon="tabler:caret-up-down-filled"
                  className="inline-block ml-1"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-3">
                No data available
              </td>
            </tr>
          )}
          {data.map((item, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} text-center`}
            >
              {renderButtons && (
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {renderButtons(item, index).map((button, btnIndex) => (
                      <div key={btnIndex}>{button}</div>
                    ))}
                  </div>
                </td>
              )}
              {columns.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  // className=""
                  className={`${selectedItem === item ? "bg-blue-100" : ""} px-4 py-3 text-sm whitespace-nowrap`}
                  onClick={() =>
                    handleSelectedItem(item)
                  }
                >
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
