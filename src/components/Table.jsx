import { useState } from 'react';
import { SquareCheckBig, Square } from 'lucide-react';

const Table = ({rows, columns, rowClicked, showCheckbox = false, rowActions = {} }) => {
    const [selectedRows, setSelectedRows] = useState(new Set());
    
    const selectAllRows = () => {
        if (selectedRows.size === rows.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(rows.map(item => item.id)));
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
                    {rows.map((item) => ( 
                        <tr key={item.id} className="hover:bg-gray-50" onClick={() => rowClicked(item.id)}>                 
                            {showCheckbox && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={(e) => 
                                            {
                                                e.stopPropagation()
                                                rowSelected(item.id)
                                            }
                                        }
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {selectedRows.has(item.id) ? 
                                            (<SquareCheckBig className="h-5 w-5" />) : 
                                            (<Square className="h-5 w-5" />)
                                        }
                                    </button>
                                </td>
                            )}
                            {columns.map((col) => (
                                    <td key={col.name} className="px-6 py-4 whitespace-nowrap">
                                        {col.render ? col.render(item, rowActions) : item[col.name]}
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
)}

export default Table;