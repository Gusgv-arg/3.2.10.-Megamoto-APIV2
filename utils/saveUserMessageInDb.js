import Messages from "../models/messages.js";
import Leads from "../models/leads.js";
import { logError } from "./logError.js";

export const saveUserMessageInDb = async (
	name,
	senderId,
	role,
	userMessage,
	messageId,
	channel,
	threadId
) => {
	// Save the sent message to the database
	try {
		// Saves message in Messages DB (stores everything)
		await Messages.create({
			name: name,
			id_user: senderId,
			role: role,
			content: userMessage,
			id_message: messageId,
			channel: channel,
			thread_id: threadId,
		});
		console.log("If it's a new customer there is no 7. (running the assistant).")
		console.log(`8. Store in Messages DB --> ${name}: "${userMessage}".`);

		// Find the lead by threadId
		let lead = await Leads.findOne({ thread_id: threadId });

		// If the lead does not exist for that thread, create it and return
		if (lead === null) {
			// Obtain current date and hour
			const currentDateTime = new Date().toLocaleString();

			lead = await Leads.create({
				name: name,
				id_user: senderId,
				channel: channel,
				content: `${currentDateTime} - ${name}: ${userMessage}`,
				thread_id: threadId,
			});
			console.log(`9. New lead created in Leads DB --> ${name}`);
			return;
		}
		// Obtain current date and hour
		const currentDateTime = new Date().toLocaleString();

		// Concatenate the new message to the existing content
		const newContent = `${lead.content}\n${currentDateTime} - ${name}: ${userMessage}`;

		// Update the lead content
		lead.content = newContent;

		// Save the updated lead
		await lead.save();

		console.log(`9. Updated Leads DB --> ${name}: "${userMessage}".`);

		return;
	} catch (error) {
		logError(
			error,
			`An error occured while saving message from ${name}: "${userMessage}" in Messages or Leads DB.`
		);
		throw new Error(error.message);
	}
};
