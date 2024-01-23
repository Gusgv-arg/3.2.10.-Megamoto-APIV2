import express from "express";
import { jsonTransformController } from "../controllers/jsonTransformController.js";

const jsonRouter = express.Router();

jsonRouter.post("/", jsonTransformController);

export default  jsonRouter;
