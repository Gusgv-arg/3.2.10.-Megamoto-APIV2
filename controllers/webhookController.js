import { saveGptResponseToWebUser } from "../utils/saveGptResponseToWebUser.js";
import { UserMessageQueue } from "../utils/userMessageQueue.js";

const messageQueue = new UserMessageQueue();

export const webhookController = (req, res) => {
	const origin = req.origin;
	const data = req.body;
	const messageToProcess = { data, origin };
	try {
		if (origin === "web") {
			// For web messages, I pass a callback to manage the response
			messageQueue.enqueueMessage(messageToProcess, async (error, response) => {
				if (error) {
					console.log("An error occurred:", error.message);
					return res
						.status(500)
						.send({
							message:
								"¡Disculpas! Nuestro asistente virtual MegaBot no pudo procesar tu mensaje. ¡Podés intentar más tarde o por Facebook / Instagram!",
						});
				}
				// Save Gpt response in DB
				await saveGptResponseToWebUser(messageToProcess, response);

				// Envía la respuesta procesada al cliente web
				res
					.status(200)
					.send({
						message: response?.greeting
							? response.greeting
							: response?.errorMessage
							? response.errorMessage
							: response.messageGpt,
					});
			});			
		} else {
			// Enqueue the message using the UserMessageQueue instance
			messageQueue.enqueueMessage(messageToProcess);

			// If data reached here it has passed through all the Middlewares
			res.status(200).send("Received");
		}
	} catch (error) {
		console.log("An error occured:", error.message);
		res.status(500).send("An error occured:", error.message);
	}
};
