import Messages from "../models/messages.js";
import Leads from "../models/leads.js";
import { logError } from "./logError.js";

export const saveGptResponseToWebUser = async (messageToProcess, response) => {
	const messageFromGpt = response?.greeting
    ? response.greeting
    : response?.errorMessage
    ? response.errorMessage
    : response.messageGpt
    
    // Save the sent message to the database
	try {
		// Saves message in Messages DB (stores everything)
		await Messages.create({
			name: messageToProcess.data.webUser,
			id_user: messageToProcess.data.webUser,
			role: "MegaBot",
			content: messageFromGpt,
			id_message: messageToProcess.data.webUser,
			channel: "web",
			thread_id: response.threadId,
			instructions: "falta grabar Instructions",
		});

		// Find the lead by threadId
		let lead = await Leads.findOne({ thread_id: response.threadId });

		// If the lead does not exist for that thread, there is an error and return
		// ACA VER QUE HACER XQ TENDRIA QUE MANEJAR ESTE ERROR
		if (lead === null) {
			console.log(
				`11. An error has ocurred finding in Leads DB for --> ${messageToProcess.data.webUser}`
			);
			return;
		}

		// Obtain current date and hour
		const currentDateTime = new Date().toLocaleString("es-AR", {
			timeZone: "America/Argentina/Buenos_Aires",
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});

		// Concatenate the new message to the existing content
		const newContent = `${lead.content}\n${currentDateTime} - MegaBot: ${messageFromGpt}`;

		// Update the lead content
		lead.content = newContent;

		// Save the updated lead
		await lead.save();
		console.log(
			`11. Updated Leads DB with GPT Message to --> ${messageToProcess.data.webUser}: "${messageFromGpt}..."`
		);
		//return;
	} catch (error) {
		logError(
			error,
			`12. An error occured while saving message for ${messageToProcess.data.webUser}: "${messageFromGpt}" in Messages or Leads DB.`
		);
		throw new Error(error.message);
	}
};
