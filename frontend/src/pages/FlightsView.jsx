import FlightCard from "../components/FlightCard";

const FlightsView = ({ flights, lastFlightRef, loading }) => {
  if (flights.length === 0 && !loading) {
    return (
      <div className="text-center text-gray-400 mt-8">
        No flights available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {flights.map((flight, index) => {
        const isLast = index === flights.length - 1;
        return (
          <div key={flight._id} ref={isLast ? lastFlightRef : null}>
            <FlightCard flight={flight} />
          </div>
        );
      })}
      {loading && (
        <div className="text-center text-gray-400 mt-4">
          Loading more flights...
        </div>
      )}
    </div>
  );
};

export default FlightsView;
