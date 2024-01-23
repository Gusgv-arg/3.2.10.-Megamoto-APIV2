import { UserMessageQueue } from "../utils/userMessageQueue.js";

const messageQueue = new UserMessageQueue();

export const webhookController = (req, res) => {
	const origin = req.origin;
	const data = req.body;
	const messageToProcess = { data, origin };

	// Enqueue the message using the UserMessageQueue instance
	messageQueue.enqueueMessage(messageToProcess);
};
