// Inside HomePage.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import FlightCard from "../components/FlightCard";

const FlightsView = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFlights = async () => {
      try {
        const { data } = await axiosInstance.get("/flights");
        setFlights(data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };

    getFlights();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-8">Loading flights...</div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-8">
        No flights available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {flights.map((flight) => (
        <FlightCard key={flight._id} flight={flight} />
      ))}
    </div>
  );
};
export default FlightsView;
