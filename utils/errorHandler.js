import { logError } from "./logError.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Middleware for error handling
export const errorHandler = async (err, req, res, next) => {
	logError(err.message, "Unhandled error!! -->");

	/* const prospectId = req.body.prospect.id;
	const channel = "whatsapp"; //ACA TENGO Q VER COMO RECIBIR EL CHANNEL!!!!!!!

	const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

	const errorMessage =
		"Te pido disculpas 🙏, ocurrió un error interno ☹️. Por favor intentá mas tarde. Saludos de MegaBot!! 🙂";

	const response = await axios.post(url, { content: errorMessage });

	if (response.data) {
		console.log("Error message sent successfully to Zenvia.");
	} else {
		console.log("Error sending Error message to Zenvia.");
	} */
	res.status(500).send({ error: err.message });
};
