import express from "express";
import { determineOrigin } from "../middlewares/determineOrigin.js";
import { prospectController } from "../controllers/prospectsController.js";
import { validateRequestData } from "../middlewares/validateRequestData.js";
import { webhookController } from "../controllers/webhookController.js";
import { checkRepeatedWebhookMessage } from "../middlewares/checkRepeatedWebhookMessage.js";
import { checkAgentResponse } from "../middlewares/checkAgentResponse.js";
import { checkBotOrigin } from "../middlewares/checkBotOrigin.js";
import { checkBotSwitch } from "../middlewares/checkBotSwitch.js";
import { checkNoMessage } from "../middlewares/checkNoMessage.js";
import { errorHandler } from "../utils/errorHandler.js";

/* Pasos
1. Se recibe el dato
2. Validar data ->middleware
3. Verificar si no fue recibido antes
4. Determinar el origen ->middleware
5. Guardar en la fila
6. Derivar al controller para que procese la respuesta y la envíe al cliente
7. Responder recibido a zenvia */

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

// Gets prospects from Zenvia API
chatMegamotoRouter.get("/prospects", prospectController);

export default chatMegamotoRouter;
