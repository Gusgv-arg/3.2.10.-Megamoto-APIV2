import express from "express";
import { determineOrigin } from "../middlewares/determineOrigin.js";
import { prospectController } from "../controllers/prospectsController.js";
import { validateRequestData } from "../middlewares/validateRequestData.js";
import { webhookController } from "../controllers/webhookController.js";
import { checkRepeatedWebhookMessage } from "../middlewares/checkRepeatedWebhookMessage.js";
import { checkAgentOrBotResponse } from "../middlewares/checkAgentOrBotResponse.js";

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
	checkRepeatedWebhookMessage,
	validateRequestData,
	determineOrigin,
	checkAgentOrBotResponse,
	webhookController
);

// Posts a message in Zenvia back to the client using AI
/* chatMegamotoRouter.post("/webhook-megamoto", (req, res, next) => {
	const data = req.body;

	//Push data received to queue
	messageQueue.push(data);
	console.log(messageQueue);

	//Process while there is data in the array
	while (messageQueue.length > 0) {
		//Take the oldest record of the array of messages and take it off
		const messageToProcess = messageQueue.shift();

		//If flag is true-->set flag to false && enter the process
		if (flag === true) {
			//Enters the process of the message
			// Dtermine the origin so as to direct to the corresponding controller
			const origin = determineOrigin(data);

			if (origin === "facebook") {
				webhookFacebookController(req, res, next);
				//res.status(200).send("Received!");
			} else if (origin === "whatsApp") {
				if (messageToProcess.prospect.phones[0] === "+5491161405589") {
					webhookWhatsappController(messageToProcess);
				}
				//if (data.prospect.phones[0] === "+5491161405589") {
				//console.log("yooo", data);
				//webhookWhatsappController(req, res, next);
				//} else {
				//	res.status(200).send("Received!");
				//}
			} else if (origin === "bot") {
				res.status(200).send("Received!");
			} else if (origin === "instagram") {
				webhookInstagramController(req, res, next);
				//res.status(200).send("Received!");
			} else if (origin === "Respuesta Agente") {
				//------------ Acá debería actualizar mi BD de Leads ------------------------//
				res.status(200).send("Received!");
			} else {
				res.status(200).send("Received!");
			}
		} else {
			//If flag is false-->wait 5 seconds and check flag
			setTimeout(() => {
				flag = checkFlagToProcessMessage();
			}, 5000);
		}
	}
}); */

// Gets prospects from Zenvia API
chatMegamotoRouter.get("/prospects", prospectController);

export default chatMegamotoRouter;
