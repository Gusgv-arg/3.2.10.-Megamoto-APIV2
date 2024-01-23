import Messages from "../models/messages.js";
import Webhook_Repeated_Messages from "../models/webhook_repeated_messages.js";
import { logError } from "../utils/logError.js";

// Function to check and save repeted messages sent by the webhook
export const checkRepeatedWebhookMessage = async (req, res, next) => {
	const data = req.body;
	const name = data.prospect?.firstName || data.message.visitor.name;
	const message =
		data.interaction.output.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: data.message.contents[0].text
			? data.message.contents[0].text
			: "No message";

	console.log(`1. Webhook notification --> ${name}: "${message}".`);
	if (message === "¡Hola! Quiero más información.") {
		console.log("Entro un ---> ¡Hola! Quiero más información.", data);
	}
	// Check if the message has already been processed
	try {
		const existingIdMessage = await Messages.findOne({
			id_user:
				data.prospect && data.prospect.phones
					? data.prospect.phones[0]
					: data.message.from,
			id_message: data && data.operationId ? data.operationId : data.message.id,
		});

		// Save the duplicated message sent by the webhook
		if (existingIdMessage) {
			await Webhook_Repeated_Messages.create({
				name: name,
				id_user: existingIdMessage.id_user,
				content: message,
				id_message: existingIdMessage.id_message,
				channel: data && data.prospect ? "whatsapp" : "facebook",
			});
			console.log(`2. Received repeated message ---> ${name}: "${message}".`);
			res.status(200).send("Message already received");
		}
	} catch (error) {
		logError(
			error,
			`2. There has been a problem checking in DB: ${name}: "${message}"`
		);
		res.status(500).send(error.message);
	}
	console.log(`2. Ok Non duplicate for --> ${name}: "${message}".`);
	next();
};
