import React, { useState, useEffect } from "react";
import {
  PlaneTakeoff,
  PlaneLanding,
  UserRoundPlus,
  UserRoundMinus,
  Trash2,
} from "lucide-react";
import { FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const FlightCard = ({ flight, onDelete, onUpdate }) => {
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  const [togglingJoin, setTogglingJoin] = useState(false);

  const [joined, setJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(
    flight.participants.length + 1
  );

  const isOwner =
    String(user?._id) === String(flight?.createdBy?._id || flight?.createdBy);

  useEffect(() => {
    if (user && flight.participants) {
      const alreadyJoined = flight.participants.some(
        (p) => String(p._id || p) === String(user._id)
      );
      setJoined(alreadyJoined);
      setParticipantCount(flight.participants.length);
    }
  }, [flight.participants, user]);

  const departureDate = new Date(flight.departureTime); // UTC ISO string

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formattedTime = departureDate.toLocaleTimeString("en-US", {
    timeZone: userTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = departureDate.toLocaleDateString("en-US", {
    timeZone: userTimeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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

  const handleToggleJoin = async () => {
    if (!user) {
      toast.info("Please login to join or leave flights.");
      return;
    }

    setTogglingJoin(true);
    try {
      const res = await axiosInstance.put(`/flights/${flight._id}/join`);
      const updatedFlight = res.data.flight;

      if (onUpdate) onUpdate(updatedFlight);

      const nowJoined = updatedFlight.participants.some(
        (p) => String(p._id || p) === String(user._id)
      );

      toast.success(
        nowJoined ? "You joined the flight!" : "You left the flight!"
      );
    } catch (error) {
      console.error("Join/Leave failed", error);
      toast.error("Could not update participation");
    } finally {
      setTogglingJoin(false);
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this flight?"
    );
    if (confirmed && onDelete) {
      onDelete(flight._id); // Delegate deletion logic to HomePage
    }
  };
  console.log("Flight time UTC:", flight.departureTime);
  console.log("Parsed date object:", departureDate.toString());
  console.log("Detected user timezone:", userTimeZone);
  console.log("Formatted local time:", formattedTime, formattedDate);

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
        <span className="text-xs text-gray-500 ml-2">({userTimeZone})</span>
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

      {/* Notes */}
      {flight.notes && (
        <p className="text-sm text-gray-300 mt-4">
          <span className="text-purple-400 font-medium">Notes:</span>{" "}
          {flight.notes}
        </p>
      )}

      {/* Action Button */}
      <div className="flex justify-end mt-5">
        {isOwner ? (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-full font-medium bg-red-600 hover:bg-red-700 shadow-md"
          >
            <Trash2 size={16} />
            Delete
          </button>
        ) : (
          <button
            onClick={handleToggleJoin}
            disabled={togglingJoin}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 shadow-md ${
              joined
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            } disabled:opacity-50`}
          >
            {togglingJoin ? (
              <span className="animate-pulse">Processing...</span>
            ) : joined ? (
              <>
                <UserRoundMinus size={16} />
                Leave
              </>
            ) : (
              <>
                <UserRoundPlus size={16} />
                Join
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FlightCard;
