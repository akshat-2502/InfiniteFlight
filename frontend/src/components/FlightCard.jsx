import React, { useState, useEffect } from "react";
import {
  PlaneTakeoff,
  PlaneLanding,
  UserRoundPlus,
  UserRoundMinus,
} from "lucide-react";
import { FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const FlightCard = ({ flight }) => {
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  const [joined, setJoined] = useState(false);

  const [participantCount, setParticipantCount] = useState(
    flight.participants.length + 1
  );

  // ✅ Check if current user is already joined
  useEffect(() => {
    if (user && flight.participants) {
      const alreadyJoined = flight.participants.some((p) => p._id === user._id);
      setJoined(alreadyJoined);
    }
  }, [user, flight.participants]);

  // Format departure time
  const departureDate = new Date(flight.departureTime);
  const formattedTime = departureDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedDate = departureDate.toLocaleDateString("en-GB");

  // Server badge color
  const getServerColor = (server) => {
    switch (server) {
      case "Expert":
        return "bg-blue-600 text-white";
      case "Training":
        return "bg-yellow-500 text-black";
      case "Casual":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-700 text-white";
    }
  };

  // ✅ Handle Join / Leave
  const handleToggleJoin = async () => {
    if (!isLoggedIn) {
      navigate("/authentication");
      return;
    }

    try {
      const res = await axiosInstance.put(`/flights/${flight._id}/join`);

      const updatedParticipants = res.data.flight.participants; // ✅ Fix here
      setJoined(updatedParticipants.includes(user._id));
      setParticipantCount(updatedParticipants.length + 1);
    } catch (error) {
      console.error("Join/Leave error:", error);
    }
  };

  return (
    <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-700 rounded-2xl p-6 mb-6 shadow-lg hover:shadow-purple-700 transition-all duration-300">
      {/* Creator */}
      <div className="flex items-center gap-4 mb-5">
        <img
          src={flight.createdBy.profileImage}
          alt="creator"
          className="w-12 h-12 rounded-full border-2 border-purple-500"
        />
        <p className="font-semibold text-lg text-purple-400">
          {flight.createdBy.username}
        </p>
      </div>

      {/* Origin → Destination */}
      <div className="flex justify-between items-center relative mb-4">
        <div className="flex items-center gap-2">
          <PlaneTakeoff size={20} className="text-blue-400" />
          <p className="text-base font-medium">{flight.origin}</p>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-32 border-t-2 border-dashed border-gray-600"></div>

        <div className="flex items-center gap-2">
          <p className="text-base font-medium">{flight.destination}</p>
          <PlaneLanding size={20} className="text-purple-400" />
        </div>
      </div>

      {/* Time */}
      <p className="text-sm text-gray-400 mb-1">
        Departure:{" "}
        <span className="text-white font-semibold">
          {formattedTime} – {formattedDate}
        </span>
      </p>

      {/* Info row */}
      <div className="flex justify-between items-center text-sm text-gray-300 border-t border-zinc-700 pt-4 mt-2">
        <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs border border-gray-600">
          Airline – {flight.airline || "N/A"}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getServerColor(
            flight.server
          )}`}
        >
          {flight.server} Server
        </span>

        <span className="flex items-center gap-1 text-xs">
          <FaUserFriends className="text-gray-400" />
          {participantCount} joining
        </span>
      </div>

      {/* Join/Leave button */}
      <div className="flex justify-end mt-5">
        <button
          onClick={handleToggleJoin}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 shadow-md ${
            joined
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          }`}
        >
          {joined ? <UserRoundMinus size={16} /> : <UserRoundPlus size={16} />}
          {joined ? "Leave" : "Join"}
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
