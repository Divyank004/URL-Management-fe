import { useState, useMemo } from 'react';
import { SquareCheckBig, Square, ChevronLeft, ChevronRight  } from 'lucide-react';
import isEmptyObject from '../utils/isEmptyObject';

export interface TableColumn <T1, T2 = undefined> {
  name: string;
  label: string;
  render?: (row: T1, rowActions: T2) => React.ReactNode;
}

interface TableProps<T1, T2 = undefined> {
  rows: T1[];
  columns: TableColumn<T1, T2>[];
  unqieKeyInRows: string;
  rowClicked?: (row: T1) => void;
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

const Table = <T1, T2 = undefined>({rows, columns, unqieKeyInRows, rowClicked, showCheckbox = false, rowActions, pagination, footer }: TableProps<T1, T2>) => {
    const [selectedRows, setSelectedRows] = useState<Set<T1>>(new Set());
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(pagination?.defaultPageSize ?? 10);

    const paginatedRows = useMemo(() => {
        if(!isEmptyObject(pagination)) {
            const start = pageIndex * pageSize;
            return rows.slice(start, start + pageSize);
        }  else {
            return rows
        }  
    }, [rows, pageIndex, pageSize, pagination]);

    const totalPages = Math.ceil(rows.length / pageSize);

    const selectAllRows = () => {
        if (selectedRows.size === rows.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(rows.map(item => item[unqieKeyInRows])));
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

    return(
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50"> 
                    <tr>
                        {showCheckbox && (
                            <th className="px-6 py-3 text-left">
                                <button
                                    onClick={selectAllRows}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {selectedRows.size === rows.length && rows.length > 0 ? 
                                        (<SquareCheckBig className="h-5 w-5" />) : 
                                        (<Square className="h-5 w-5" />)
                                    }
                                </button>
                            </th>
                        )}
                        {columns.map((item) => (
                            <th key={item.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {item.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedRows.map((item) => ( 
                        <tr key={item[unqieKeyInRows]} className="hover:bg-gray-50" onClick={() => rowClicked && rowClicked(item[unqieKeyInRows])}>                 
                            {showCheckbox && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={(e) => 
                                            {
                                                e.stopPropagation()
                                                rowSelected(item[unqieKeyInRows])
                                            }
                                        }
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {selectedRows.has(item[unqieKeyInRows]) ? 
                                            (<SquareCheckBig className="h-5 w-5" />) : 
                                            (<Square className="h-5 w-5" />)
                                        }
                                    </button>
                                </td>
                            )}
                            {columns.map((col) => (
                                    <td key={col.name} className="px-6 py-4 whitespace-nowrap">
                                        {col.render ? col.render(item, rowActions ?? ({} as T2)) : item[col.name]}
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* No Data */}
            {paginatedRows.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No Data found matching your search.</p>
                </div>
            )}
            {/* Footer */}
            {!isEmptyObject(pagination) && !isEmptyObject(footer) && (
                <div className="px-6 py-4 bg-white border-t border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                        {!isEmptyObject(pagination) && (
                            <div className="flex items-center space-x-4">
                                {/* Page Navigation */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        disabled={pageIndex === 0}
                                        onClick={() => setPageIndex((prev) => prev - 1)}
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50  focus:ring-2 focus:ring-blue-500  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors duration-200"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2"/>
                                        Previous
                                    </button>
                                    
                                    <button
                                        disabled={pageIndex >= totalPages - 1}
                                        onClick={() => setPageIndex((prev) => prev + 1)}
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors duration-200"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 mr-2"/>
                                    </button>
                                </div>

                                {/* Page Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="text-sm text-gray-600 font-medium">
                                        Page <span className="font-semibold text-gray-900">{pageIndex + 1}</span> of{' '}
                                        <span className="font-semibold text-gray-900">{totalPages}</span>
                                    </div>
                                    
                                    {/* Rows per page selector */}
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm text-gray-600 font-medium">
                                            Show:
                                        </label>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                                setPageIndex(0);
                                            }}
                                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-500"
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
                        {!isEmptyObject(footer) && (
                            <button
                                onClick={() => footer?.buttonOne.onAddUrl()}
                                className={footer?.buttonOne.className}
                            >
                                {footer?.buttonOne.title}
                            </button>
                        )}
                    </div>
            </div>
            )}       
        </div>
)}

export default Table;