import express from "express";
import { prospectsController } from "../controllers/prospectsController.js";
import { interactionsController } from "../controllers/interactionsController.js";
import { unclaimedController } from "../controllers/unclaimedController.js";


const prospectRouter = express.Router()

// Gets prospects from Zenvia API and makes analisys
prospectRouter.get("/", prospectsController)

// Gets interactions from Zenvia API
prospectRouter.get("/interactions", interactionsController)

// Gets uncalimed prospects from Zenvia API and sends them a message to recontact before 24hs
prospectRouter.post("/unclaimed", unclaimedController)

export default prospectRouter