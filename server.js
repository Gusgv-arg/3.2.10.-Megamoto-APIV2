import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import chatMegamotoRouter from "./routers/chatMegamotoRouter.js";
import { errorHandler } from "./utils/errorHandler.js";
import { test } from "./controllers/test.js";
import jsonRouter from "./routers/jsonRouter.js";
import BotSwitch from "./models/botSwitch.js";

dotenv.config();

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected to data base MegamotoDB");
	})
	.catch((err) => {
		console.log(err.message);
	});

const app = express();

app.use(
	cors({
		origin: ["http://localhost:3000"],
		credentials: true,
	})
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Looking for General Bot Switch
let botSwitchInstance = await BotSwitch.findOne();
if (botSwitchInstance){
	console.log(`MegaBot is ${botSwitchInstance.generalSwitch}`)
} else {
	let botSwitch = new BotSwitch({
		generalSwitch: "ON"
	});
	botSwitch.save()
	console.log(`BotSwitch created and set to ${botSwitch.generalSwitch}`)
}

app.use("/test", test);
app.use("/json", jsonRouter);
app.use("/megamoto", chatMegamotoRouter);

// Middleware de manejo de errores
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
