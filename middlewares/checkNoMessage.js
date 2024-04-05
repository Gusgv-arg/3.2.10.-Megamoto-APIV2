import axios from "axios";
import Leads from "../models/leads.js";
import dotenv from "dotenv";

dotenv.config();

// Checks No messages and others that the API does no process
export const checkNoMessage = async (req, res, next) => {
	const data = req.body;
	const message =
		data.interaction?.output?.message &&
		data?.interaction?.output?.message.content
			? data.interaction.output.message.content
			: data.message?.contents[0].text
			? data.message.contents[0].text
			: data.webMessage
			? data.webMessage
			: "No message";
	const name = data.prospect?.firstName
		? data.prospect.firstName
		: data.message?.visitor?.name
		? data.message.visitor.name
		: data.webUser
		? data.webUser
		: "No name";

	const prospectId = data?.prospect?.id ? data.prospect.id : data.webUser;
	const channel =
		data.interaction?.via === "whatsApp"
			? "whatsapp"
			: data?.interaction?.via
			? data.interaction.via
			: data?.webUser
			? "web"
			: "other";
	const agentInternalNote = data?.interaction?.output?.comment;
	const meaninglessSymbols = /^(?:[^\w\s]| )+$/;
	const matchMeaninglessSymbols = message.match(meaninglessSymbols);

	let lead;

	try {
		lead = await Leads.findOne({ id_user: prospectId });
	} catch (error) {
		console.log("Theres has been an error looking in leads DB");
		next(error);
	}

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

	// If there is no message in users notification and its in Leads DB advice the user to text
	if (
		message === "No message" &&
		data?.interaction?.proactive === false &&
		lead !== null
	) {
		try {
			// Post a message to the user to send a text message
			const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

			const noMessageResponse = `¡Gracias ${name} por tu contacto!👋 Por el momento no puedo interpretar archivos, imágenes o audios. Te pido que me escribas y así puedo responder a tus dudas y derivarte más rápido con un vendedor. !Saludos de MegaBot! 😀`;

			const response = await axios.post(url, {
				content: noMessageResponse,
			});

			// Exit the process
			res.status(200).send("Received");
			console.log(
				`1. Exiting the process. No message from: ${name}. Requested the user to send a text message.`
			);
			return;
		} catch (error) {
			// Pass the error to the centralized error handling middleware
			console.log("There was an error in checkNoMessage.js");
			next(error);
		}
	} else if (
		message === "No message" &&
		data?.interaction?.proactive === false &&
		lead === null
	) {
		// Exit the process
		res.status(200).send("Received");
		console.log(
			`1. Exiting the process. No message from: ${name} because he is not in Leads DB.`
		);
		return;
	} else if (matchMeaninglessSymbols) {
		// Exit the process
		res.status(200).send({message:"¡Gracias por tu contacto!👋 Por el momento no puedo interpretar archivos, imágenes o audios. Te pido que me escribas y así puedo responder a tus dudas y derivarte más rápido con un vendedor. !Saludos de MegaBot! 😀"});
		console.log(
			`1. Exiting the process. Meaningless symbol in message from: ${name}.`
		);
		return;
	}
	next();
};
