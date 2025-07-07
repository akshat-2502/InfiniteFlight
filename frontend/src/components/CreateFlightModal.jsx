import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CreateFlightModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureTime: "",
    server: "",
    airline: "",
    notes: "",
  });

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login to create a flight.");
      return;
    }

    const { origin, destination, departureTime, server } = formData;

    if (!origin || !destination || !departureTime || !server) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const allowedServers = ["Casual", "Training", "Expert"];
    if (!allowedServers.includes(server)) {
      toast.error("Invalid server selected.");
      return;
    }

    try {
      const utcDepartureTime = new Date(formData.departureTime).toISOString();
      const finalData = { ...formData, departureTime: utcDepartureTime };

      await axiosInstance.post("/flights/create", finalData);
      toast.success("Flight created successfully!");
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create flight.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0 overflow-y-auto">
      <div className="relative w-full sm:w-[90%] md:w-[600px] max-w-lg bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg p-6 my-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white text-center">
          Create Flight
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="origin"
            placeholder="Enter Origin Airport Code"
            value={formData.origin}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
            required
          />
          <input
            type="text"
            name="destination"
            placeholder="Enter Destination Airport Code"
            value={formData.destination}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
            required
          />
          <input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
            required
          />
          <select
            name="server"
            value={formData.server}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
            required
          >
            <option value="">Select Server</option>
            <option value="Casual">Casual</option>
            <option value="Training">Training</option>
            <option value="Expert">Expert</option>
          </select>
          <input
            type="text"
            name="airline"
            placeholder="Airline (optional)"
            value={formData.airline}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none resize-none"
            rows={3}
          ></textarea>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded"
          >
            Create Flight
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFlightModal;
