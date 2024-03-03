import dotenv from "dotenv";
import axios from "axios";
import { saveGPTMessageInDb } from "./saveGPTMessageInDb.js";


dotenv.config();

export const handleMessageToZenvia = async (
	name,
	senderPage,
	senderId,
	messageGpt,
	threadId,
	messageId,
	channel
) => {
	try {
		const role = "assistant";

		// Save GPT message in the database
		await saveGPTMessageInDb(
			name,
			senderId,
			role,
			messageGpt,
			channel,
			threadId,
			messageId
		);		
		

		// Para que solo me conteste a mi
		if (name === "Gustavo Gomez Villafañe" || name === "Gg" || name === "Pablo Rudkiw") {
			const prospectId = senderId;
			const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;
			
			const response = await axios.post(url, { content: messageGpt });

			const firstFiveWords = messageGpt.split(" ").slice(0, 5).join(" ");
						
			if (response.data) {
				console.log(
					`13. GPT response to ${name}: "${firstFiveWords}..." sent successfully to Zenvia.`
				);
			} else {
				console.log(
					`13. Error sending message from ${name}: "${firstFiveWords}..." to Zenvia.`
				);
			}
		}       
		
		// PARA QUE LE CONTESTE A TODOS--------------------------------------------
		// Posts the message to Zenvia
		/* const prospectId = senderId;
		
		let url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;
		
		const response = await axios.post(url, { content: messageGpt });

		const firstFiveWords = messageGpt.split(" ").slice(0, 5).join(" ");
		
		if (response.data) {
			console.log(`13. GPT response to ${name}: "${firstFiveWords}..." sent successfully to Zenvia.`);
		} else {
			console.log(`13. Error sending message from ${name}: "${firstFiveWords}..." to Zenvia.`);
		} */  	
	} catch (error) {
		console.log("13. Error in handleMessageToZenvia:", error.message);
		throw new Error(error.message);
	}
};
