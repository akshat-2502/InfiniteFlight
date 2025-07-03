import Flight from "../models/Flight.js";

//get al  flight
export const getAllFlights = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const flights = await Flight.find()
      .sort({ departureTime: 1 }) // soonest flights first
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "username profileImage")
      .populate("participants", "username profileImage");

    res.status(200).json(flights);
  } catch (error) {
    console.error("Get All Flights Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//CREATING FLIGHT
export const createFlight = async (req, res) => {
  try {
    const { origin, destination, departureTime, server, airline, notes } =
      req.body;

    // Validate required fields
    if (!origin || !destination || !departureTime || !server) {
      return res.status(400).json({
        message: "Origin, destination, departureTime, and server are required.",
      });
    }

    const newFlight = new Flight({
      origin,
      destination,
      departureTime,
      server,
      airline,
      notes,
      createdBy: req.user._id,
      participants: [req.user._id], // creator is first participant
    });

    const savedFlight = await newFlight.save();

    res.status(201).json(savedFlight);
  } catch (error) {
    console.error("Create Flight Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong while creating flight." });
  }
};

//FILTERING FLIGHT
export const searchFlights = async (req, res) => {
  try {
    const { origin, destination, server, departureAfter, departureBefore } =
      req.query;

    const query = {};

    if (origin) query.origin = new RegExp(origin, "i"); // case-insensitive
    if (destination) query.destination = new RegExp(destination, "i");
    if (server) query.server = server;

    // Departure time range (optional)
    if (departureAfter || departureBefore) {
      query.departureTime = {};
      if (departureAfter) query.departureTime.$gte = new Date(departureAfter);
      if (departureBefore) query.departureTime.$lte = new Date(departureBefore);
    }

    const flights = await Flight.find(query)
      .populate("createdBy", "username profileImage")
      .populate("participants", "username profileImage");

    res.status(200).json(flights);
  } catch (error) {
    console.error("Search Flights Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// JOIN FLIGHT API
export const toggleJoinFlight = async (req, res) => {
  try {
    const flightId = req.params.id;
    const userId = req.user._id;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    const isAlreadyParticipant = flight.participants.includes(userId);

    if (isAlreadyParticipant) {
      // Remove user
      flight.participants.pull(userId);
      await flight.save();
      return res
        .status(200)
        .json({ message: "You have left the flight", flight });
    } else {
      // Add user
      flight.participants.push(userId);
      await flight.save();
      return res
        .status(200)
        .json({ message: "You have joined the flight", flight });
    }
  } catch (error) {
    console.error("Toggle Join Flight Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//GET SINGLE FLIGHT
export const getSingleFlight = async (req, res) => {
  try {
    const flightId = req.params.id;

    const flight = await Flight.findById(flightId)
      .populate("createdBy", "username profileImage")
      .populate("participants", "username profileImage");

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.status(200).json(flight);
  } catch (error) {
    console.error("Get Single Flight Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//DELETING THE FLIGHT
export const deleteFlight = async (req, res) => {
  try {
    const flightId = req.params.id;
    const userId = req.user._id;

    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Only creator can delete
    if (flight.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this flight" });
    }

    await Flight.findByIdAndDelete(flightId);

    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    console.error("Delete Flight Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
