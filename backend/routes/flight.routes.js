import express from "express";
import {
  createFlight,
  deleteFlight,
  getAllFlights,
  getSingleFlight,
  searchFlights,
  toggleJoinFlight,
} from "../controller/flight.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getAllFlights);
router.get("/search", searchFlights);
router.post("/create", authenticateUser, createFlight);
router.put("/:id/join", authenticateUser, toggleJoinFlight);
router.get("/:id", getSingleFlight);
router.delete("/:id", authenticateUser, deleteFlight);
export default router;
