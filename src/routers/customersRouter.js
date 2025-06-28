import { Router } from "express";
import { createCustomer, getCustomers, getCustomerById } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.post("/customers", createCustomer);
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);

export default customersRouter; 