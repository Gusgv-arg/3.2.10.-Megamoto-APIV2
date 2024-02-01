import express from "express";
import { prospectController } from "../controllers/prospectsController.js";
import { interactionsController } from "../controllers/interactionsController.js";


const prospectRouter = express.Router()

// Gets prospects from Zenvia API
prospectRouter.get("/", prospectController)

// Gets interactions from Zenvia API
prospectRouter.get("/interactions", interactionsController)


export default prospectRouter