import { useState, useMemo } from "react";
import {
  SquareCheckBig,
  Square,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import isObjNullOrUndefined from "../utils/isObjNullOrUndefined";

export interface TableColumn<T1, T2 = undefined> {
  name: string;
  label: string;
  render?: (row: T1, rowActions: T2) => React.ReactNode;
}

interface TableProps<T1, T2 = undefined> {
  rows: T1[];
  columns: TableColumn<T1, T2>[];
  unqieKeyInRows: string;
  rowClicked?: (uniqueKeyInRow: string) => void;
  showCheckbox?: boolean;
  rowActions?: T2;
  pagination?: {
    defaultPageSize?: number;
    pageSizeOptions: number[];
  };
  footer?: {
    buttonOne: {
      title: string;
      className: string;
      onAddUrl: () => void;
    };
  };
}

const Table = <T1, T2 = undefined>({
  rows = [],
  columns,
  unqieKeyInRows,
  rowClicked,
  showCheckbox = false,
  rowActions,
  pagination,
  footer,
}: TableProps<T1, T2>) => {
  const [selectedRows, setSelectedRows] = useState<Set<T1>>(new Set());
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(
    pagination?.defaultPageSize ?? 5,
  );

  const paginatedRows = useMemo(() => {
    if (!isObjNullOrUndefined(pagination)) {
      const start = pageIndex * pageSize;
      return rows.slice(start, start + pageSize);
    } else {
      return rows;
    }
  }, [rows, pageIndex, pageSize, pagination]);

  const totalPages = Math.ceil(rows.length / pageSize);

  const selectAllRows = () => {
    if (selectedRows.size === rows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(rows.map((item) => item[unqieKeyInRows])));
    }
  };
  const rowSelected = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-lg">
      <div className="bg-white/10 h-80 sm:h-100 md:h-120 lg:h-140 max-h-full md:max-h-screen overflow-y-auto">
        <table className="min-w-full ">
          <thead className="bg-white/2 sticky top-0 z-10">
            <tr>
              {showCheckbox && (
                <th className="px-2 py-1.5 sm:px-6 sm:py-3 text-left">
                  <button
                    onClick={selectAllRows}
                    className="text-white hover:text-gray-200"
                  >
                    {selectedRows.size === rows.length && rows.length > 0 ? (
                      <SquareCheckBig className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </th>
              )}
              {columns.map((item) => (
                <th
                  key={item.name}
                  className="px-2 py-1.5 sm:px-6 sm:py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white/10 divide-y divide-gray-200">
            {paginatedRows.map((item) => (
              <tr
                key={item[unqieKeyInRows]}
                className="cursor-pointer"
                onClick={() => rowClicked && rowClicked(item[unqieKeyInRows])}
              >
                {showCheckbox && (
                  <td className=" px-2 py-1 sm:px-6 sm:py-3  whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        rowSelected(item[unqieKeyInRows]);
                      }}
                      className="text-white hover:text-gray-200"
                    >
                      {selectedRows.has(item[unqieKeyInRows]) ? (
                        <SquareCheckBig className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.name}
                    className="px-2 py-1 sm:px-6 sm:py-3  whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(item, rowActions ?? ({} as T2))
                      : item[col.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* No Data */}
        {paginatedRows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No Data found.</p>
          </div>
        )}
      </div>
      {/* Footer */}
      {!isObjNullOrUndefined(pagination) && !isObjNullOrUndefined(footer) && (
        <div className="px-6 py-4 bg-white border-t border-gray-200 shadow-sm bg-white/5 backdrop-blur-lg">
          <div className="flex flex-col sm:flex-row justify-center sm:items-center sm:justify-between gap-4 ">
            {!isObjNullOrUndefined(pagination) && (
              <div className="flex items-center space-x-5">
                {/* Page Navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    disabled={pageIndex === 0}
                    onClick={() => setPageIndex((prev) => prev - 1)}
                    className="inline-flex items-center px-1 sm:px-3 py-2 text-sm font-medium bg-white/10 border-white/20 rounded-md hover:bg-white/30 focus:ring-2 focus:ring-purple-500"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" color="white" />
                    <span className="hidden sm:block text-white">Previous</span>
                  </button>

                  <button
                    disabled={pageIndex >= totalPages - 1}
                    onClick={() => setPageIndex((prev) => prev + 1)}
                    className="inline-flex items-center px-1 sm:px-3 py-2 text-sm font-medium bg-white/10 border-white/20 rounded-md hover:bg-white/30 focus:ring-2 focus:ring-purple-500"
                  >
                    <span className="hidden sm:block text-white">Next</span>
                    <ChevronRight className="h-4 w-4 mr-2" color="white" />
                  </button>
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  Page <span className="font-semibold ">{pageIndex + 1}</span> /{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                {/* Page Info */}
                <div className="flex items-center space-x-2 text-gray-300">
                  {/* Rows per page selector */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Show:</label>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageIndex(0);
                      }}
                      className="bg-white/10 border border-white/20  text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {pagination?.pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size} rows
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            {!isObjNullOrUndefined(footer) && (
              <button
                onClick={() => footer?.buttonOne.onAddUrl()}
                className={`text-center px-4 py-2 text-sm font-medium bg-white/10 border border-white/20  text-white rounded-md shadow-sm hover:bg-white/30  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${footer?.buttonOne.className}`}
              >
                {footer?.buttonOne.title}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
