import express from "express";
import { exportLeadsToExcel } from "../utils/exportLeadsToExcel.js";

const excelRouter = express.Router();

excelRouter.post("/", exportLeadsToExcel);

export default excelRouter;
