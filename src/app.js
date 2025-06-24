import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gamesRouter from "./routers/gamesRouter.js";
import customersRouter from "./routers/customersRouter.js";
import rentalsRouter from "./routers/rentalsRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 