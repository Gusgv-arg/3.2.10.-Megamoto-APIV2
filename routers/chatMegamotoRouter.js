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

const chatMegamotoRouter = express.Router();

chatMegamotoRouter.post(
	"/webhook-megamoto",
	checkGeneralBotSwitch,
	checkBotOrigin,
	checkIndividualBotSwitch,
	checkNoMessage,
	checkRepeatedWebhookMessage,
	validateRequestData,
	determineOrigin,
	checkAgentResponse,
	quantityToProcess,
	webhookController,
	errorHandler
);

export default chatMegamotoRouter;
