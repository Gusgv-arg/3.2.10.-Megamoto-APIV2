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
import excelRouter from "./routers/excelRouter.js";
import prospectRouter from "./routers/prospectsRouter.js";
import createBotSwitchInstance from "./utils/createBotSwitchInstance.js";
import { dbFunctionsRouter } from "./routers/dbFunctionsRouter.js";
import { wordRouter } from "./routers/wordRouter.js";
import pricesRouter from "./routers/pricesRouter.js";

dotenv.config();

try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to data base Megamoto");
} catch (error) {
    console.error("Error connecting to database:", error.message);
    // Aquí puedes realizar acciones de manejo de errores, como iniciar una conexión alternativa o mostrar un mensaje al usuario
}

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(
	cors({
		origin: ["http://localhost:3000", "https://three-2-10-megamoto-front.onrender.com", "http://127.0.0.1:5500"],
		credentials: true,
	})
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Looking for General Bot Switch
let botSwitchInstance;
try {
	botSwitchInstance = await BotSwitch.findOne();
	if (botSwitchInstance) {
		console.log(`MegaBot is ${botSwitchInstance.generalSwitch}`);
	} else {
		let botSwitch = new BotSwitch({
			generalSwitch: "ON",
		});
		await botSwitch.save();
		console.log(`BotSwitch created and set to ${botSwitch.generalSwitch}`);
	}
} catch (error) {
	console.error("Error initializing bot switch:", error.message);
	console.log("Retrying to create botSwitchInstance...");
    await createBotSwitchInstance();
}

app.use("/test", test);
app.use("/json", jsonRouter);
app.use("/excel", excelRouter);
app.use("/prices", pricesRouter);
app.use("/word", wordRouter);
app.use("/prospects", prospectRouter);
app.use("/dbfunctions", dbFunctionsRouter);
app.use("/megamoto", chatMegamotoRouter);

// Middleware de manejo de errores
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
