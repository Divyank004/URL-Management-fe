import { useParams, Link } from "react-router";
import {ArrowLeft, ExternalLink} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getStatusCodeColor, getStatusColor } from '../utils/getColorsCSS';
import Table from "../components/Table";
import type { TableColumn } from "../components/Table";
import type { URLAnalysisResult } from '../types';

interface BrokenLink {
  url: string;
  statusCode: number;
  type: 'internal' | 'external';
}

interface URLDataWithBrokenLink extends URLAnalysisResult {
  brokenLinks: BrokenLink[];
}

const URLDetailPage = () => {
  const { id } = useParams();
  const rowId = id ? Number(id) - 1 : 0;
  // TODO - Replace mock data with actual API call to fetch the clicked URL details
  const mockData: URLDataWithBrokenLink[] = [
    {
      id: 1,
      url: 'https://example.com',
      title: 'Example Website',
      htmlVersion: 'HTML5',
      internalLinks: 15,
      externalLinks: 8,
      status: 'Running',
      brokenLinks: [
        { url: 'https://example.com/broken-page', statusCode: 404, type: 'internal' },
        { url: 'https://external-site.com/missing', statusCode: 404, type: 'external' },
        { url: 'https://example.com/timeout', statusCode: 408, type: 'internal' }
      ]
    },
    {
      id: 2,
      url: 'https://google.com',
      title: 'Google Search',
      htmlVersion: 'HTML5',
      internalLinks: 25,
      externalLinks: 12,
      status: 'Running',
      brokenLinks: [
        { url: 'https://google.com/broken', statusCode: 404, type: 'internal' },
        { url: 'https://partner-site.com/timeout', statusCode: 410, type: 'external' }
      ]
    },
    {
      id: 3,
      url: 'https://stackoverflow.com',
      title: 'Stack Overflow',
      htmlVersion: 'HTML5',
      internalLinks: 35,
      externalLinks: 15,
      status: 'Running',
      brokenLinks: [
        { url: 'https://stackoverflow.com/broken', statusCode: 404, type: 'internal' }
      ]
    },
    {
      id: 4,
      url: 'https://reddit.com',
      title: 'Reddit',
      htmlVersion: 'HTML5',
      internalLinks: 50,
      externalLinks: 30,
      status: 'Error',
      brokenLinks: [
        { url: 'https://reddit.com/r/deleted', statusCode: 404, type: 'internal' },
        { url: 'https://external.com/image.jpg', statusCode: 404, type: 'external' },
      ]
    }
  ];
  const pieData = [
    { name: 'Internal Links', value: mockData[rowId].internalLinks, color: '#10B981' },
    { name: 'External Links', value: mockData[rowId].externalLinks, color: '#3B82F6' },
  ]
  const columns: TableColumn<BrokenLink>[] =[
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
      name: 'type',
      label: 'Type',
      render: (row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
          ${row.type === 'internal' ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100'}`}
        >
          {row.type}
        </span>
      ),
    },
    {
      name: 'statusCode',
      label: 'Status Code',
      render: (row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusCodeColor(row.statusCode)}`}>
          {row.statusCode}
        </span>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <Link to="/">Back to Table</Link>
          </button>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockData[rowId].title}</h1>
            <a
              href={mockData[rowId].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
            >
              {mockData[rowId].url}
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
            <div className="mt-4 flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(mockData[rowId].status)}`}>
                {mockData[rowId].status}
              </span>
              <span className="text-sm text-gray-500">HTML Version: {mockData[rowId].htmlVersion}</span>
            </div>
          </div>
        </div>

        {/* Pie Chart and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Links Overview</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Internal Links</span>
                <span className="font-semibold text-gray-900">{mockData[rowId].internalLinks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total External Links</span>
                <span className="font-semibold text-gray-900">{mockData[rowId].externalLinks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Broken Internal Links</span>
                <span className="font-semibold text-red-600">{mockData[rowId].brokenLinks.filter(item => item.type === 'internal').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Broken External Links</span>
                <span className="font-semibold text-red-600">{mockData[rowId].brokenLinks.filter(item => item.type === 'external').length}</span>
              </div>
             
            </div>
          </div>
        </div>

        {/* Broken Links Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Broken Links</h2>
          </div>
          <div className="overflow-auto">
            <Table
              rows={mockData[rowId].brokenLinks}
              columns={columns}
              unqieKeyInRows="url"
            >
            </Table>
            {mockData[rowId].brokenLinks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No broken links found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default URLDetailPage;