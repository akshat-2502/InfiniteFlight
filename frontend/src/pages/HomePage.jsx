import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import ProfileDropdown from "../components/ProfileDropdown";
import FlightsView from "./FlightsView";
import CreateFlightModal from "../components/CreateFlightModal";
import CreatePostModal from "../components/CreatePostModal";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, filters, setFilters }) => {
  const user = useSelector((state) => state.user.user);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: checked };
      if (name === "casual" || name === "training" || name === "expert") {
        return {
          ...prev,
          casual: false,
          training: false,
          expert: false,
          [name]: checked,
        };
      }
      return updated;
    });
  };

  return (
    <div
      className={`bg-zinc-900 border-r border-zinc-800 p-6 w-72 min-h-screen fixed top-0 left-0 z-40 transform transition-transform duration-300 md:relative ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex flex-col items-center gap-2 mt-16 md:mt-0">
        <img
          src={user?.profileImage || "https://via.placeholder.com/80"}
          alt="user"
          className="w-20 h-20 rounded-full"
        />
        <h2 className="text-lg font-semibold">{user?.username || "User"}</h2>
        <label className="block mt-4 text-sm text-gray-300">
          <input
            type="checkbox"
            name="myFlights"
            checked={filters.myFlights || false}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          My Flights
        </label>
      </div>

      <div className="mt-8">
        <h3 className="text-sm text-gray-300 mb-2">Filter Flights</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <label className="block">
            <input
              type="checkbox"
              name="today"
              checked={filters.today || false}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Today
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="morning"
              checked={filters.morning || false}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            12am – 11:59am
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="evening"
              checked={filters.evening || false}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            12pm – 11:59pm
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="casual"
              checked={filters.casual || false}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Casual Server
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="training"
              checked={filters.training || false}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Training Server
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="expert"
              checked={filters.expert || false}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Expert Server
          </label>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [flights, setFlights] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

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

        // ✅ Only call my-flights if user is loaded
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

    // ✅ Only run if user is loaded
    if (activeTab === "flights" && (user || !filters.myFlights)) {
      fetchFilteredFlights();
    }
  }, [filters, activeTab, user]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex overflow-x-hidden">
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} filters={filters} setFilters={setFilters} />

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
              <p>Feed content goes here...</p>
            </div>
          )}
        </div>

        {showModal && activeTab === "flights" && (
          <CreateFlightModal
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setFilters({ ...filters });
              setShowModal(false);
            }}
          />
        )}

        {showModal && activeTab === "feed" && (
          <CreatePostModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
