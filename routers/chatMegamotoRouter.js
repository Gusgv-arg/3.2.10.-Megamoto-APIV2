import express from "express";
import { determineOrigin } from "../middlewares/determineOrigin.js";
import { validateRequestData } from "../middlewares/validateRequestData.js";
import { webhookController } from "../controllers/webhookController.js";
import { checkRepeatedWebhookMessage } from "../middlewares/checkRepeatedWebhookMessage.js";
import { checkAgentResponse } from "../middlewares/checkAgentResponse.js";
import { checkBotOrigin } from "../middlewares/checkBotOrigin.js";
import { checkGeneralBotSwitch } from "../middlewares/checkGeneralBotSwitch.js";
import { checkNoMessage } from "../middlewares/checkNoMessage.js";
import { errorHandler } from "../utils/errorHandler.js";
import { checkIndividualBotSwitch } from "../middlewares/checkIndividualBotswitch.js";
import { quantityToProcess } from "../middlewares/quantityToProcess.js";
import { checkNewProspect } from "../middlewares/checkNewProspect.js";
import { sendMessageToUser } from "../controllers/sendMessageController.js";
import { adminOrders } from "../middlewares/adminOrders.js";
import { isOpenMiddleware } from "../middlewares/isOpenMiddleware.js";

const chatMegamotoRouter = express.Router();

const targetDate = new Date("2024-03-03");

// Receives data from Zenvia webhook
chatMegamotoRouter.post(
	"/webhook-megamoto",
	isOpenMiddleware,
	adminOrders,
	determineOrigin,
	checkAgentResponse,
	checkBotOrigin,
	checkGeneralBotSwitch,
	checkNewProspect,
	checkIndividualBotSwitch,
	checkNoMessage,
	checkRepeatedWebhookMessage,
	validateRequestData,
	webhookController,
	errorHandler
);

// Sends a message to a user in Zenvia
chatMegamotoRouter.post("/message_to_user", sendMessageToUser)

export default chatMegamotoRouter;
