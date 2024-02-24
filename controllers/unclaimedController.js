import dotenv from "dotenv";
import axios from "axios";
import { logError } from "../utils/logError.js";
import { sendMessageToUnclaimed } from "../utils/sendMessageToUnclaimed.js";

dotenv.config();

export const unclaimedController = async (req, res) => {
	try {
		const url = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;

		const response = await axios.get(url);

		// Just take the fields needed
		const neededData = response.data.map(
			({ id, created, group, firstName, status, phones, emails, leads }) => ({
				id,
				created,
				group,
				firstName,
				status,
				phones: phones[0],
				emails: emails[0],
				source: leads[0].source,
			})
		);

		// Filter and save ALL unclaimed prospects
		const unclaimedToContact = neededData.filter((prospect) => {
			const prospectCreatedTime = new Date(prospect.created);
			const currentTime = new Date();
			const timeDiff = currentTime - prospectCreatedTime;
			const timeDiffInHours = timeDiff / (1000 * 60 * 60); // Convertir la diferencia a horas
			return prospect.status === "unclaimed" && timeDiffInHours < 24;
		});

		// Send the unclaimedToContact to the function that will Post the message to Zenvia
        sendMessageToUnclaimed(unclaimedToContact)
        
        res.status(200).send(unclaimedToContact);

	} catch (error) {
		logError(error, "Hubo un error en el proceso -->");
		res.status(500).send({ error: error.message });
	}
};
