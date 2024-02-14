import { UserMessageQueue } from "../utils/userMessageQueue.js";

const messageQueue = new UserMessageQueue();

export const webhookController = (req, res) => {
	const origin = req.origin;
	const data = req.body;
	const messageToProcess = { data, origin };
	try {
		
		// Enqueue the message using the UserMessageQueue instance
		messageQueue.enqueueMessage(messageToProcess);
		
		// If data reached here it has passed through all the Middlewares
		res.status(200).send("Received");
		
	} catch (error) {
		console.log("An error occured:", error.message)
		res.status(500).send("An error occured:", error.message);

	}
};
