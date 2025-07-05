import FlightCard from "../components/FlightCard";

const FlightsView = ({ flights }) => {
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
