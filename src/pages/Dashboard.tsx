import { useState, useEffect } from 'react';
import { Search, Trash2, RotateCcw} from 'lucide-react';
import { useNavigate } from "react-router";
import Table from '../components/Table';
import { getStatusColor } from '../utils/getColorsCSS';
import PopupForm from '../components/PopupForm'
import type { URLAnalysisResult } from '../types';
import type { TableColumn } from '../components/Table';
import { postNewUrl, fetchAllURLsAnalysisData } from '../api/services';

const Dashboard = () => {
  const [data, setData] = useState<URLAnalysisResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const navigate = useNavigate();
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        const response = await fetchAllURLsAnalysisData();
        const urlData: URLAnalysisResult[] = response.ok ? await response.json() : [];
        setData(urlData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
   
  const filteredURLData: URLAnalysisResult[] = data.filter(item =>
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteSelectedRow = (id) => {
    console.log('delete id', id)
  };

  const rerunURLAnalysis = (id) => {
    console.log(`Rerunning analysis for ID: ${id}`);
  };

  const openDetailsPage = (id: string) => {
    const item = data.find((entry) => entry.id === Number(id));
    if (item && item.status === 'Done') {
      navigate(`/url/${id}`);
    } else {
      alert('Analysis is not complete yet. Please wait until it is done.');
    } 
  }
  
  interface TableRowActionsContext {
  onDelete?: (id: number) => void;
  onRerun?: (id: number) => void;
  }

  const columns: TableColumn<URLAnalysisResult, TableRowActionsContext>[] = [
    {
      name: 'url',
      label: 'URL',
      render: (row) => (
        <a
          href={row.url}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.url}
        </a>
      ),
    },
    {
      name: 'title',
      label: 'Title',
      render: (row) => (
        <div className="text-sm font-medium text-gray-900">{row.title || '-'}</div>
      ),
    },
    {
      name: 'htmlVersion',
      label: 'HTML Version',
      render: (row) => (
        <div className="text-sm font-medium text-gray-900">{row.htmlVersion || '-'}</div>
      ),
    },
    {
      name: 'internalLinks',
      label: 'Internal Links',
      render: (row) => (
        <div className="text-sm font-medium text-gray-900">{row.internalLinks ?? '-'}</div>
      ),
    },
    {
      name: 'externalLinks',
      label: 'External Links',
      render: (row) => (
        <div className="text-sm font-medium text-gray-900">{row.externalLinks ?? '-'}</div>
      ),
    },
    {
      name: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: 'actions',
      label: 'Actions',
      render: (row,  { onDelete, onRerun } ) => (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(row.id);
              }}
              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRerun?.(row.id);
              }}
              className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm border border-blue-600 rounded hover:bg-blue-50"
              title='Rerun'
            >
              <RotateCcw className="h-4 w-4 inline mr-1" />
              Rerun
            </button>
          </div>
        ),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  async function addURL(newEntry: URLAnalysisResult) {
    try{
      const response = await postNewUrl(newEntry);
      if (response.ok) {
        const addedUrl: URLAnalysisResult = await response.json();
        setData((prevData) => [addedUrl, ...prevData]);
      } else {
        alert('Failed to add new URL');
      }
    }
    catch (error) {
      console.error('Error adding new URL:', error);
      alert('Error adding new URL');
    }
  }
  
  return (
    <div className="min-h-full bg-white-150 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-center text-2xl font-bold text-gray-900">URL Management</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search URLs or titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          rows={filteredURLData}
          columns={columns}
          unqieKeyInRows="id"
          showCheckbox
          rowClicked={(row) => openDetailsPage(row)}
          rowActions={{
            onDelete: deleteSelectedRow,
            onRerun: rerunURLAnalysis,
          }}
          pagination ={{ pageSizeOptions: [5, 10, 20], defaultPageSize: 10 }}
          footer={{
            buttonOne: 
              {
                title: 'Add new URL',
                onAddUrl: () => setShowPopup(true),
                className: ''
              }
          }}
        />
        {/* AddURL Popup Modal */}
        {showPopup && (
          <PopupForm
            showPopup={showPopup}
            onNewEntry={(newEntry) => addURL(newEntry)}
            onClosePopup={() => setShowPopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;