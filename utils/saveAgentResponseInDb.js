import Messages from "../models/messages.js";
import Leads from "../models/leads.js";
import { logError } from "./logError.js";

export const saveAgentResponseInDb = async (newMessage, threadId) => {
	// Save the sent message to the database
	
	try {
		// Saves message in Messages DB (stores everything)
		await Messages.create({
			name: newMessage.name,
			id_user: newMessage.senderId,
			role: "Vendedor Megamoto",
			content: newMessage.receivedMessage,
			id_message: newMessage.messageId,
			channel: newMessage.channel,
			thread_id: threadId,			
		});

		const firstFiveWords = newMessage.receivedMessage.split(" ").slice(0, 5).join(" ");
		console.log(
			`11. Store Agent response in Messages DB --> ${newMessage.name}: "${firstFiveWords}..."`
		);

		// Find the lead by threadId
		let lead = await Leads.findOne({ thread_id: threadId });

		// If the lead does not exist for that thread, there is an error and return
		// ACA VER QUE HACER XQ TENDRIA QUE MANEJAR ESTE ERROR
		if (lead === null) {
			console.log(
				`12. An error has ocurred finding in Leads DB for --> ${newMessage.name}`
			);
			return;
		}

		// Obtain current date and hour
		const currentDateTime = new Date().toLocaleString();
		
		// Concatenate the new message to the existing content
		const newContent = `${lead.content}\n${currentDateTime} - Vendedor Megamoto: ${newMessage.receivedMessage}`;

		// Update the lead content and turn botSwitch to OFF
		lead.content = newContent;
		lead.botSwitch = "OFF"

		// Save the updated lead
		await lead.save();

		console.log(
			`12. Updated Leads DB with Agent Message to --> ${newMessage.name}: "${firstFiveWords}..."`
		);

		//return;
	} catch (error) {
		logError(
			error,
			`12. An error occured while saving message for ${newMessage.name}: "${newMessage.receivedMessage}" in Messages or Leads DB.`
		);
		throw new Error(error.message);
	}
};
