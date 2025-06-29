import { Router } from "express";
import { createRental, getRentals, returnRental, deleteRental } from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", createRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter; 