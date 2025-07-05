import React, { useEffect, useState, useRef, useCallback } from "react";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import ProfileDropdown from "../components/ProfileDropdown";
import FlightsView from "./FlightsView";
import CreateFlightModal from "../components/CreateFlightModal";
import CreatePostModal from "../components/CreatePostModal";
import axiosInstance from "../utils/axiosInstance";

const Sidebar = ({ isOpen, filters, setFilters }) => {
  const user = useSelector((state) => state.user.user);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
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
  const observer = useRef();

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append("skip", page * 10);
    params.append("limit", 10);

    const now = new Date();

    if (filters.today) {
      const start = new Date(now.setHours(0, 0, 0, 0));
      const end = new Date(now.setHours(23, 59, 59, 999));
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

    if (filters.myFlights && user?._id) {
      params.append("createdBy", user._id);
    }

    return params.toString();
  };

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const query = buildQueryParams();
      const { data } = await axiosInstance.get(`/flights/search?${query}`);
      if (page === 0) {
        setFlights(data);
      } else {
        setFlights((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === 10);
    } catch (err) {
      console.error("Fetch Flights Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setFlights([]);
    setHasMore(true);
  }, [filters]);

  useEffect(() => {
    fetchFlights();
  }, [page, filters]);

  const lastFlightRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleCreateClick = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

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
              onClick={handleCreateClick}
              className="bg-purple-600 px-4 py-2 rounded text-sm hover:bg-purple-700"
            >
              {activeTab === "flights" ? "Create Flight" : "Create Post"}
            </button>
            <ProfileDropdown />
          </div>
        </div>

        <div className="w-full max-w-5xl">
          {activeTab === "flights" ? (
            <FlightsView flights={flights} lastFlightRef={lastFlightRef} />
          ) : (
            <div className="p-6 text-white">Feed coming soon...</div>
          )}
        </div>

        {showModal && activeTab === "flights" && (
          <CreateFlightModal
            onClose={handleModalClose}
            onCreated={() => {
              setPage(0);
              setFlights([]);
              setHasMore(true);
            }}
          />
        )}

        {showModal && activeTab === "feed" && (
          <CreatePostModal onClose={handleModalClose} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
