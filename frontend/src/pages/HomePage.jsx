import React, { useState } from "react";
import FlightCard from "../components/FlightCard";
import { Menu } from "lucide-react";
import ProfileDropdown from "../components/ProfileDropdown";

const dummyFlights = [
  {
    origin: "Lucknow",
    destination: "Delhi",
    departureTime: "03 Jul, 09:30 PM",
    airline: "Air India",
    server: "Expert",
    createdBy: {
      username: "Akshat",
      profileImage: "https://via.placeholder.com/40",
    },
    participants: [{}, {}, {}],
  },
];

const Sidebar = ({ isOpen }) => (
  <div
    className={`bg-zinc-900 border-r border-zinc-800 p-6 w-72 min-h-screen fixed top-0 left-0 z-40 transform transition-transform duration-300 md:relative ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0`}
  >
    <div className="flex flex-col items-center gap-2 mt-16 md:mt-0">
      <img
        src="https://via.placeholder.com/80"
        alt="user"
        className="w-20 h-20 rounded-full"
      />
      <h2 className="text-lg font-semibold">Akshat</h2>
      <p className="text-sm text-gray-400">Upcoming flights: 3</p>
      <p className="text-sm text-gray-400">Flights created: 6</p>
    </div>
    <div className="mt-8">
      <h3 className="text-sm text-gray-300 mb-2">Time Filter</h3>
      <input type="range" min="0" max="6" step="1" className="w-full" />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0 hrs</span>
        <span>6 hrs</span>
      </div>
    </div>
  </div>
);

const FlightsView = () => (
  <div className="flex-1 p-6">
    {dummyFlights.map((flight, index) => (
      <FlightCard key={index} flight={flight} />
    ))}
  </div>
);

const FeedView = () => (
  <div className="flex-1 p-6 text-white">
    <p>Feed content goes here...</p>
  </div>
);

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex overflow-x-hidden">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} />

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center transition-all duration-300">
        {/* Navbar */}
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
          <div className="flex justify-center md:justify-end">
            <button className="bg-purple-600 px-4 py-2 rounded text-sm hover:bg-purple-700">
              {activeTab === "flights" ? "Create Flight" : "Create Post"}
            </button>
            <ProfileDropdown />
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-5xl">
          {activeTab === "flights" ? <FlightsView /> : <FeedView />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
