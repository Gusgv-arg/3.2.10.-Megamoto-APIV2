import dotenv from "dotenv";
import axios from "axios";
import { logError } from "../utils/logError.js";
import { sendMessageToUnclaimed } from "../utils/sendMessageToUnclaimed.js";
import { excludeProactive } from "../utils/excludeProactive.js";
import { searchProspectsNames } from "../utils/searchProspectsnames.js";

dotenv.config();

export const noResponsesController = async (req, res) => {
	try {
		//Prospect interactions all
		const url = `https://api.getsirena.com/v1/prospects/interactions?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;

		const response = await axios.get(url);
		
		// Just take the fields needed
		const neededFields = response.data.map(
			({ prospectId, createdAt, proactive, output, via }) => ({
				senderId: prospectId,
				createdAt,
				proactive,
				output: output.question?.question
					? output.question.question
					: output.message?.content
					? output.message.content
					: output?.comment
					? output.comment
					: "",
				source: via,
			})
		);
		
		// Exclude ids that have a proactive or bot true
		const excludedProactive = excludeProactive(neededFields);
		//console.log("excluded", excludedProactiveAndbot)

		// Filter messages for the last 24hs
		const noResponses24hs = excludedProactive.filter((message) => {
			const messageCreatedTime = new Date(message.createdAt);
			const currentTime = new Date();
			const timeDiff = currentTime - messageCreatedTime;
			const timeDiffInHours = timeDiff / (1000 * 60 * 60); // Convertir la diferencia a horas
			return message.proactive === false && timeDiffInHours < 24;
		});
		//console.log("Menos de 24hs:", noResponses24hs);

		// Look for the names of ids
		const noResponses24WithNames = await searchProspectsNames(noResponses24hs)
		//console.log(noResponses24WithNames)

		// Send the unclaimedToContact to the function that will Post the message to Zenvia
		sendMessageToUnclaimed(noResponses24WithNames)

		res.status(200).send(noResponses24WithNames);
	} catch (error) {
		logError(error, "Hubo un error en el proceso -->");
		res.status(500).send({ error: error.message });
	}
};
