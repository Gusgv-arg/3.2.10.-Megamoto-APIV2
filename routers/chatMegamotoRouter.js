import express from "express";
import { determineOrigin } from "../middlewares/determineOrigin.js";
import { validateRequestData } from "../middlewares/validateRequestData.js";
import { webhookController } from "../controllers/webhookController.js";
import { checkRepeatedWebhookMessage } from "../middlewares/checkRepeatedWebhookMessage.js";
import { checkAgentResponse } from "../middlewares/checkAgentResponse.js";
import { checkBotOrigin } from "../middlewares/checkBotOrigin.js";
import { checkBotSwitch } from "../middlewares/checkBotSwitch.js";
import { checkNoMessage } from "../middlewares/checkNoMessage.js";
import { errorHandler } from "../utils/errorHandler.js";

const chatMegamotoRouter = express.Router();

chatMegamotoRouter.post(
	"/webhook-megamoto",
	checkBotSwitch,
	checkBotOrigin,
	checkNoMessage,
	checkRepeatedWebhookMessage,
	validateRequestData,
	determineOrigin,
	checkAgentResponse,
	webhookController,
	errorHandler
);

export default chatMegamotoRouter;
