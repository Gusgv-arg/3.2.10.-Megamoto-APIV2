import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Checks No messages and other that the API does no process
export const checkNoMessage = async (req, res, next) => {
	const data = req.body;
	const message =
		data.interaction?.output?.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: data.message?.contents[0].text
			? data.message.contents[0].text
			: "No message";

	const name = data.prospect?.firstName;
	const prospectId = data.prospect?.id;
	const channel = data.interaction?.via;
	const agentInternalNote = data?.interaction?.output?.comment;

	if (message === "No message") {
		console.log("Entro un no message", data);
	}

	// Exit if its an internal change
	if (agentInternalNote) {
		res.status(200).send("Received");
		console.log(
			`Exit the process. Internal note for: ${name}: ${agentInternalNote}`
		);
		return;
	}

	// Exit if the data object has no interaction or message property
	if (!data.hasOwnProperty("interaction") || !data.hasOwnProperty("message")) {
		console.log("El objeto data NO tiene la propiedad interaction o message");
		//console.log("data.prospect.leads", data?.prospect.leads);
		//console.log("data.prospect.contactMediums", data?.prospect.contactMediums);
		console.log("1. Exiting process. API does not manage this notification.");
		res.status(200).send("Received");
		return;
	}

	// If there is no message in users notification advice the user to text
	if (message === "No message" && data?.interaction?.proactive === false) {
		try {
			// Post a message to the user to send a text message
			const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

			const noMessageResponse = `¡Gracias ${name} por tu contacto! Para atenderte más rápido escribí tu consulta en texto así nuestro Asistente Virtual podrá responder tus dudas y derivarte con un vendedor.`;

			//DESCOMENTAR CUANDO ESTEMOS EN PRODUCCION!!!
			/* const response = await axios.post(url, {
				content: noMessageResponse,
			}); */
			console.log(
				"Aca se hubiera enviado una respuesta al usuario diciendo que envíe un texto. En producción hay que descomentar el axios.post"
			);

			res.status(200).send("Received");
			// Exit the process
			console.log(
				`1. Exiting the process. No message from: ${name}. Requested the user to send a text message.`
			);
			return;
		} catch (error) {
			console.log("There was an error in checkNoMessage.js");
			// Pass the error to the centralized error handling middleware
			next(error);
		}
	} else {
		next();
	}
};
