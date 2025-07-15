import { useParams, Link } from "react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getStatusCodeColor, getStatusColor } from "../utils/getColorsCSS";
import Table from "../components/Table";
import type { TableColumn } from "../components/Table";
import type { URLAnalysisResult } from "../types";
import { fetchSingleURLAnalysisData } from "../api/services";
import { useEffect, useState } from "react";

interface BrokenLink {
  url: string;
  statusCode: number;
  type: "internal" | "external";
}

interface URLDataWithBrokenLink extends URLAnalysisResult {
  brokenLinks: BrokenLink[];
}

const URLDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<URLDataWithBrokenLink>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchSingleURLAnalysisData(Number(id));
        const urlData: URLDataWithBrokenLink = response.ok
          ? await response.json()
          : [];
        setData(urlData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns: TableColumn<BrokenLink>[] = [
    {
      name: "url",
      label: "URL",
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
      name: "type",
      label: "Type",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
          ${row.type === "internal" ? "text-green-600 bg-green-100" : "text-blue-600 bg-blue-100"}`}
        >
          {row.type}
        </span>
      ),
    },
    {
      name: "statusCode",
      label: "Status Code",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusCodeColor(row.statusCode)}`}
        >
          {row.statusCode}
        </span>
      ),
    },
  ];

  const pieData = [
    { name: "Internal Links", value: data?.internalLinks, color: "#10B981" },
    { name: "External Links", value: data?.externalLinks, color: "#3B82F6" },
  ];

  if (loading && !data) {
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
    data && (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <button className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <Link to="/dashboard">Back to Table</Link>
            </button>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {data.title}
              </h1>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
              >
                {data.url}
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
              <div className="mt-4 flex items-center space-x-4">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(data.status)}`}
                >
                  {data.status}
                </span>
                <span className="text-sm text-gray-500">
                  HTML Version: {data.htmlVersion}
                </span>
              </div>
            </div>
          </div>

          {/* Pie Chart and Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Links Overview
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Internal Links</span>
                  <span className="font-semibold text-gray-900">
                    {data.internalLinks}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total External Links</span>
                  <span className="font-semibold text-gray-900">
                    {data.externalLinks}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Broken Internal Links</span>
                  <span className="font-semibold text-red-600">
                    {data.brokenLinks &&
                      data.brokenLinks.filter(
                        (item) => item.type === "internal",
                      ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Broken External Links</span>
                  <span className="font-semibold text-red-600">
                    {data.brokenLinks &&
                      data.brokenLinks.filter(
                        (item) => item.type === "external",
                      ).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Broken Links Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Broken Links
              </h2>
            </div>
            <div className="overflow-auto">
              <Table
                rows={data.brokenLinks || []}
                columns={columns}
                unqieKeyInRows="url"
              ></Table>
              {data.brokenLinks && data.brokenLinks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No broken links found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default URLDetailPage;
