import express from "express";
import { pricesModelCreation } from "../utils/pricesModelCreation.js";
import { updateDbPricesFromExcel } from "../utils/updatesDbPricesFromExcel.js";

const pricesRouter = express.Router();

pricesRouter.post("/", pricesModelCreation);
pricesRouter.post("/update", updateDbPricesFromExcel);

export default pricesRouter;