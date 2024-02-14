import express from "express"
import { exportLeadsToWord } from "../utils/exportLeadsToWord.js"


export const wordRouter = express.Router()

wordRouter.post("/", exportLeadsToWord)