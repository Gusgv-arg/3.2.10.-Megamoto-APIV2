import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendErrorMessage = async (message) => {
	const prospectId = message.senderId;
	const channel = message.channel;

	const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

	const errorMessage =
		"Te pido disculpas 🙏, ocurrió un error interno ☹️. Por favor intentá mas tarde. Saludos de MegaBot!! 🙂";

	const response = await axios.post(url, { content: errorMessage });

	if (response.data) {
		console.log("Error message sent successfully to Zenvia.");
	} else {
		console.log("Error sending Error message to Zenvia.");
	}
};
