import React, { useState } from "react";
import {
  PlaneTakeoff,
  PlaneLanding,
  UserRoundPlus,
  UserRoundMinus,
} from "lucide-react";

const FlightCard = ({ flight }) => {
  const [joined, setJoined] = useState(false);

  return (
    <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 text-white rounded-2xl p-5 mb-6 shadow-lg hover:shadow-purple-600 transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={flight.createdBy.profileImage}
          alt="creator"
          className="w-12 h-12 rounded-full border-2 border-purple-500 shadow-md"
        />
        <p className="font-bold text-lg text-purple-400">
          {flight.createdBy.username}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 items-center mb-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">Origin</p>
          <div className="flex items-center gap-2">
            <PlaneTakeoff size={26} className="text-blue-400" />
            <p className="font-medium text-base">{flight.origin}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-5 border-l-2 border-dashed border-gray-600"></div>
          <div className="w-20 border-t-2 border-dashed border-gray-600"></div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">Destination</p>
          <div className="flex items-center gap-2">
            <PlaneLanding size={26} className="text-purple-400" />
            <p className="font-medium text-base">{flight.destination}</p>
          </div>
        </div>
      </div>

      <div className="text-right text-sm text-gray-400 italic mb-1">
        Departure:{" "}
        <span className="text-white font-semibold">{flight.departureTime}</span>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-300 border-t border-zinc-700 pt-2">
        <p className="font-semibold">{flight.airline}</p>
        <p className="text-xs bg-gray-800 px-2 py-1 rounded-full border border-gray-600">
          {flight.server} Server
        </p>
        <p className="text-xs">{flight.participants.length + 1} joining</p>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setJoined(!joined)}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-300 shadow-md ${
            joined
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
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
