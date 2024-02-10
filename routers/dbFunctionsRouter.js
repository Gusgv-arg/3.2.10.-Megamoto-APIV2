import express from "express"
import { findData } from "../dbFunctions/findData.js"
import { eraseData } from "../dbFunctions/eraseData.js"

export const dbFunctionsRouter = express.Router()

dbFunctionsRouter.get("/leads", findData )
dbFunctionsRouter.delete("/erase", eraseData )
