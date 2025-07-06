import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import ProfileDropdown from "../components/ProfileDropdown";
import FlightsView from "./FlightsView";
import CreateFlightModal from "../components/CreateFlightModal";
import CreatePostModal from "../components/CreatePostModal";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import FeedView from "./FeedView";
import SideBar from "../components/SideBar";

function HomePage() {
  const [activeTab, setActiveTab] = useState("flights");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [flights, setFlights] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const user = useSelector((state) => state.user.user);

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (filters.today) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      params.append("departureAfter", start.toISOString());
      params.append("departureBefore", end.toISOString());
    } else if (filters.morning) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(11, 59, 59, 999);
      params.append("departureAfter", start.toISOString());
      params.append("departureBefore", end.toISOString());
    } else if (filters.evening) {
      const start = new Date();
      start.setHours(12, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      params.append("departureAfter", start.toISOString());
      params.append("departureBefore", end.toISOString());
    }

    if (filters.casual) {
      params.append("server", "Casual");
    } else if (filters.training) {
      params.append("server", "Training");
    } else if (filters.expert) {
      params.append("server", "Expert");
    }

    return params.toString();
  };

  const handleDelete = async (flightId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this flight?"
    );
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/flights/${flightId}`);
      setFlights((prev) => prev.filter((f) => f._id !== flightId));
      toast.success("Flight deleted successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete flight");
    }
  };

  useEffect(() => {
    const fetchFilteredFlights = async () => {
      try {
        setLoading(true);
        let res;

        if (filters.myFlights && user?._id) {
          res = await axiosInstance.get("/flights/my-flights");
        } else {
          res = await axiosInstance.get(
            `/flights/search?${buildQueryParams()}`
          );
        }

        setFlights(res.data);
        setHasMore(res.data.length === 10);
        setPage(1);
      } catch (err) {
        console.error("Filter change fetch error:", err);
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "flights" && (user || !filters.myFlights)) {
      fetchFilteredFlights();
    }
  }, [filters, activeTab, user, showModal, refreshKey]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex overflow-x-hidden">
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
      </div>

      <SideBar
        isOpen={sidebarOpen}
        filters={filters}
        setFilters={setFilters}
        activeTab={activeTab}
      />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}

      <div className="flex-1 flex flex-col items-center transition-all duration-300">
        <div className="w-full max-w-5xl flex flex-col md:flex-row md:justify-between md:items-center p-6 border-b border-zinc-800 gap-4">
          <div className="flex gap-6 justify-center md:justify-start text-sm font-semibold">
            <button
              onClick={() => setActiveTab("flights")}
              className={`pb-1 ${
                activeTab === "flights"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Flights
            </button>
            <button
              onClick={() => setActiveTab("feed")}
              className={`pb-1 ${
                activeTab === "feed"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Feed
            </button>
          </div>
          <div className="flex justify-center md:justify-end items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 px-4 py-2 rounded text-sm hover:bg-purple-700"
            >
              {activeTab === "flights" ? "Create Flight" : "Create Post"}
            </button>
            <ProfileDropdown />
          </div>
        </div>

        <div className="w-full max-w-5xl">
          {activeTab === "flights" ? (
            <FlightsView flights={flights} onDelete={handleDelete} />
          ) : (
            <div className="flex-1 p-6 text-white">
              <FeedView refreshKey={refreshKey} />
            </div>
          )}
        </div>

        {showModal && activeTab === "flights" && (
          <CreateFlightModal
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              setRefreshKey((prev) => prev + 1);
            }}
          />
        )}

        {showModal && activeTab === "feed" && (
          <CreatePostModal
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              setRefreshKey((prev) => prev + 1);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
