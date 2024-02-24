import Leads from "../models/leads.js";
import { logError } from "./logError.js";

// Saves for the unclaimed prospects the greeting in Leads DB
export const saveUnclaimedInDb = async (newLead, threadId, greeting) => {
	try {
		// Find the lead by threadId
		let lead = await Leads.findOne({ thread_id: threadId });

		if (lead === null) {
			// Obtain current date and hour
			const currentDateTime = new Date().toLocaleString();

			// Create a new lead in DB
			lead = await Leads.create({
				name: newLead.firstName,
				id_user: newLead.id,
				channel: newLead.source.toLowerCase(),
				content: `${currentDateTime} - ${newLead.firstName}: Hola\n${currentDateTime} - MegaBot: ${greeting}`,
				thread_id: threadId,
				botSwitch: "ON",
			});
			return;
		} else {
			// Concatenate the new message to the existing content
			const newContent = `${lead.content}\nHasta acá thread anterior: ${lead.thread_id}\n${currentDateTime} - ${newLead.firstName}: Hola\n${currentDateTime} - MegaBot: ${greeting}`;

			// Update the lead
			lead.content = newContent;
			lead.thread_id = threadId;
			lead.channel = newLead.source.toLowerCase(), 
			lead.botSwitch = "ON";

			// Save the updated lead
			await lead.save();

			return;
		}
	} catch (error) {
		logError(error, "Hubo un error en el proceso -->");
		throw error;
	}
};
