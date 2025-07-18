import Table from "../components/Table";
import PopupForm from "../components/PopupForm";
import { useNavigate } from "react-router";
import { deleteURL } from "../api/services";
import { getStatusColor } from "../utils/getColorsCSS";
import { useState, useEffect } from "react";
import { Search, Trash2, RotateCcw, X, LogOut, User } from "lucide-react";
import { postNewUrl, fetchAllURLsAnalysisData } from "../api/services";
import { getURLAnalysisResult, reRunAnalysis } from "../api/services";
import type { URLAnalysisResult, TableColumn } from "../types";

const Dashboard = () => {
  const [data, setData] = useState<URLAnalysisResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [crawlJobId, setCrawlJobId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchAllURLsAnalysisData();
        const urlData: URLAnalysisResult[] = response.ok
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
    if (crawlJobId) {
      const interval = setInterval(pollResult, 1000); // Poll every second
      return () => clearInterval(interval);
    }
  }, [crawlJobId]);

  const filteredURLData: URLAnalysisResult[] = data.filter(
    (item) =>
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteSelectedRow = async (rowId: number) => {
    try {
      const response = await deleteURL(rowId);
      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.id !== rowId));
        alert("URL deleted successfully.");
      } else {
        alert("Failed to delete URL. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting URL:", error);
      alert("Error deleting URL");
    }
  };

  const rerunURLAnalysis = async (id: number) => {
    console.log(`Rerunning analysis for ID: ${id}`);
    try {
      const response = await reRunAnalysis(id.toString());
      if (response.ok) {
        setCrawlJobId(id.toString());
        alert("Analysis rerun initiated successfully.");
      } else {
        alert("Failed to rerun analysis. Please try again later.");
      }
    } catch (error) {
      console.error("Error rerunning analysis:", error);
      alert("Error rerunning analysis");
    }
  };

  const openDetailsPage = (id: string) => {
    const item = data.find((entry) => entry.id === Number(id));
    if (item && item.status === "Done") {
      navigate(`/url/${id}`);
    } else {
      alert("Analysis is not complete yet. Please wait until it is done.");
    }
  };

  const pollResult = async () => {
    if (!crawlJobId) return;
    try {
      const response = await getURLAnalysisResult(crawlJobId);
      if (!response.ok) {
        throw new Error("Failed to fetch result");
      }
      const data = await response.json();

      if (data.status === "Running") {
        console.log("Analysis in progress:", data);
        setData((prevData) =>
          prevData.map((item) =>
            item.id === Number(crawlJobId) ? data : item,
          ),
        );
        return;
      }

      if (data.status === "Done" || data.status === "Failed") {
        console.log("Polling result:", data);
        setData((prevData) =>
          prevData.map((item) =>
            item.id === Number(crawlJobId) ? data : item,
          ),
        );
        console.log("polling completed:", data);
        // Stop polling if job is done or failed
        setCrawlJobId(null);
      }
    } catch (err) {
      throw new Error("Failed to fetch result", err);
    }
  };

  interface TableRowActionsContext {
    onDelete?: (id: number) => void;
    onRerun?: (id: number) => void;
  }

  const columns: TableColumn<URLAnalysisResult, TableRowActionsContext>[] = [
    {
      name: "url",
      label: "URL",
      render: (row) => (
        <a
          href={row.url}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:underline"
        >
          {row.url}
        </a>
      ),
    },
    {
      name: "title",
      label: "Title",
      render: (row) => (
        <div className="text-sm font-medium text-white">{row.title || "-"}</div>
      ),
    },
    {
      name: "htmlVersion",
      label: "HTML Version",
      render: (row) => (
        <div className="text-sm font-medium text-white">
          {row.htmlVersion || "-"}
        </div>
      ),
    },
    {
      name: "internalLinks",
      label: "Internal Links",
      render: (row) => (
        <div className="text-sm font-medium text-white">
          {row.internalLinks ?? "-"}
        </div>
      ),
    },
    {
      name: "externalLinks",
      label: "External Links",
      render: (row) => (
        <div className="text-sm font-medium text-white">
          {row.externalLinks ?? "-"}
        </div>
      ),
    },
    {
      name: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "actions",
      label: "Actions",
      render: (row, { onDelete, onRerun }) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(row.id);
            }}
            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRerun?.(row.id);
            }}
            className="text-center px-2 py-1 sm:px-3 text-sm font-medium bg-white/10 border border-white/20  text-white rounded-md shadow-sm hover:bg-white/30  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title="Rerun"
          >
            <RotateCcw className="h-4 w-4 inline mr-1" />
            Rerun
          </button>
        </div>
      ),
    },
  ];

  function handleProfile() {
    alert("Profile feature is not implemented yet.");
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    navigate("/");
  }

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
    try {
      const response = await postNewUrl(newEntry);
      if (response.ok) {
        const addedUrl: URLAnalysisResult = await response.json();
        setData((prevData) => [addedUrl, ...prevData]);
        // trigger polling for the url analysis
        setCrawlJobId(addedUrl.id.toString());
      } else {
        alert("Failed to add new URL");
      }
    } catch (error) {
      console.error("Error adding new URL:", error);
      alert("Error adding new URL");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky z-50 mb-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">URL Management</h1>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-3">
              {/* Profile Button */}
              <button
                onClick={handleProfile}
                className="flex items-center space-x-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  Divyank Dhadi
                </span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block text-sm font-medium">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="rounded-lg border border-white/20 shadow-2xl ">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg px-6 py-4 border-b border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search URLs or titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-3"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-5 w-5" color="white"></X>
                </button>
              )}
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
          pagination={{ pageSizeOptions: [5, 10, 20], defaultPageSize: 10 }}
          footer={{
            buttonOne: {
              title: "Add new URL",
              onAddUrl: () => setShowPopup(true),
              className: "",
            },
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
