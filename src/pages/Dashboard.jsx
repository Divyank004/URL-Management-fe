import { useState, useEffect } from 'react';
import { Search, Trash2, RotateCcw, Plus, SquareCheckBig, Square } from 'lucide-react';
import PopupModal from '../components/PopupModal';
import { useNavigate } from "react-router";
import Table from '../components/Table';
import { getStatusColor } from '../utils/getColorsCSS';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddURLModal, setshowAddURLModal] = useState(false);
  const navigate = useNavigate();
  
  // TODO - fetch data from be
  const urlData = [
    {
      id: 1,
      url: 'https://example.com',
      title: null,
      htmlVersion: null,
      internalLinks: null,
      externalLinks: null,
      inaccessibleLinks: null,
      status: 'Queued',
      loginForm: null
    },
    {
      id: 2,
      url: 'https://google.com',
      title: 'Google Search',
      htmlVersion: 'HTML5',
      internalLinks: 25,
      externalLinks: 12,
      inaccessibleLinks: 10,
      status: 'Running',
      loginForm: true
    },
    {
      id: 3,
      url: 'https://stackoverflow.com',
      title: 'Stack Overflow',
      htmlVersion: 'HTML5',
      internalLinks: 35,
      externalLinks: 15,
      inaccessibleLinks: 20,
      status: 'Done',
      loginForm: true
    },
    {
      id: 4,
      url: 'https://reddit.com',
      title: 'Reddit',
      htmlVersion: 'HTML5',
      internalLinks: 50,
      externalLinks: 30,
      inaccessibleLinks: 0,
      status: 'Error',
      loginForm: true
    }
  ];
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO - Fetch data from backend 
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(urlData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
   
  const filteredData = data.filter(item =>
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteSelectedRow = (id) => {
    console.log('delete id', id)
  };

  const rerunURLAnalysis = (id) => {
    console.log(`Rerunning analysis for ID: ${id}`);
  };

  const openDetailsPage = (item) => {
    console.log('item', item)
    navigate(`/url/${ item}`);
  }
  const columns=[
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
      label: 'Titles',
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
        <div className="text-sm font-medium text-gray-900">{row.internalLinks || '-'}</div>
      ),
    },
    {
      name: 'externalLinks',
      label: 'External Links',
      render: (row) => (
        <div className="text-sm font-medium text-gray-900">{row.externalLinks || '-'}</div>
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
      render: (row, { onDelete, onRerun }) => (
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

  return (
    <div className="min-h-full bg-white-150 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">URL Management</h1>
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
          rows={data}
          columns={columns}
          showCheckbox
          rowClicked={(row) => openDetailsPage(row)}
          actions={{
            onDelete: deleteSelectedRow,
            onRerun: rerunURLAnalysis,
          }}
        >
        </Table>

        {/* No Data */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No URLs found matching your search.</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing {filteredData.length} of {data.length} URLs
            </p>
            <button
              onClick={() => setshowAddURLModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add new URL
            </button>
          </div>
        </div>

        {/* AddURL Popup Modal */}
        {showAddURLModal && (
          <PopupModal
            showAddURLModal={showAddURLModal}
            onData={(newEntry) => setData(prev => [...prev, newEntry])}
            onHandleCloseModal={() => setshowAddURLModal(false)}
          />)}
      </div>
    </div>
  );
};

export default Dashboard;