import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
import Messages from "../models/messages.js";

dotenv.config();

//webhook que usa el prompting básico para la base de conocimiento
const API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
	apiKey: API_KEY,
});

let contador = 0;

export const webhookOpenAiController = async (req, res) => {
	const data = req.body;
	try {
		if (data.message) {
			const senderPage = data.message.to;
			const senderId = data.message.from;
			const receivedMessage = data.message.contents[0].text;
			const name = data.message.visitor.name;
			const channel = data.message.channel;
			console.log("mensaje recibido de facebook", receivedMessage);
			console.log("senderId:", senderId);
			console.log("general de facebook", data);
			if (senderId == 6874624262580365) {
				const yo = senderId;
				console.log("yooo", yo);
			} else {
				console.log("no entra aca");
			}

			if (receivedMessage && senderId == 6874624262580365) {
				// Define the maximum number of messages to include in the conversation history
				const MAX_HISTORY_MESSAGES = 2;

				// Fetch the conversation history from the database
				let conversationHistory = await Messages.find({ id_user: senderId });

				// Sort the conversation history in descending order of timestamp
				conversationHistory.sort((a, b) => b.timestamp - a.timestamp);

				// Only keep the last N messages
				conversationHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);

				// Convert the conversation history to the format expected by the OpenAI API
				const historyMessages = conversationHistory.map((message) => ({
					role: message.role,
					content: message.content,
				}));

				// Initial setup of the messages array
				const messages = [
					{
						role: "system",
						content: `'Eres un asistente virtual impulsado por inteligencia artificial de la empresa Megamoto. Estarás encargado de contestar preguntas a potenciales clientes interesados en comprar algunos de sus productos o servicios. Utiliza exclusivamente la información que detallo abajo para contestar; y si no se encuentra pide disculpas:
				  -Megamoto comercializa motos y bicicletas. -Tiene sucursales en Abasto y Merlo. -Se puede financiar la compra en 12 cuotas sin interés con el DNI como único requisito. -Los horarios y días de apertura son de lunes a viernes de 9 a 19hs y los sábados de 9 a 13 horas. -Si un cliente quiere hablar con un vendedor o asesor preguntale al cliente por su celular de contacto o correo electrónico; para que alguien lo contacte. 
				  Siempre debes responder limitándote a la pregunta del cliente de una manera amable, clara y concisa. Si te consultan por temas que no tienen que ver con Megamoto y sus productos pide disculpas y responde que solo fuiste autorizado a responder preguntas específicas sobre Megamoto.'`,
					},
					...historyMessages, // Add the conversation history
					{
						role: "user",
						content: receivedMessage,
					},
				];
				console.log("info enviada a openai", messages);
				const aiResponse = await openai.chat.completions.create({
					model: "gpt-3.5-turbo",
					//model: "gpt-4",
					messages: messages,
					max_tokens: 100,
					temperature: 0,
					stop: "END",
				});

				// Save the received message to the database
				await Messages.create({
					name: name,
					id_user: senderId,
					role: "user",
					content: receivedMessage,
					channel: channel,
				});

				await handleMessage(
					senderPage,
					senderId,
					aiResponse.choices[0].message.content
				);
			} else {
				await handleMessage(
					senderPage,
					senderId,
					"!Hola! Estamos trabajando para que en los próximos días los mensajes sean respondidos por nuestro Asistente de IA y te ayudemos a responder tus consultas más rápido. En breve te contestamos. !Gracias por esperar! "
				);
			}
			res.status(200).send("EVENT_RECEIVED");
		}
	} catch (error) {
		res.status(400).send(error.message);
		console.log(error.message)
	}
};

async function handleMessage(senderPage, senderId, message) {
	try {
		// Save the sent message to the database
		await Messages.create({
			name: "AI",
			id_user: senderId,
			role: "assistant",
			content: message,
			channel: "facebook",
		});

		const response = await axios.post(
			"https://api.zenvia.com/v2/channels/facebook/messages",
			{
				//from: process.env.ZENVIA_FACEBOOK_PAGE_ID,
				//from: "126769713862973",
				from: senderPage,
				to: senderId,
				contents: [
					{
						type: "text",
						text: message,
					},
				],
			},
			{
				headers: {
					//"X-API-TOKEN": process.env.ZENVIA_API_TOKEN,
					//"X-API-TOKEN": "wI7qdG27vCDgqVLbwHuVOVEpIhdhFcfsDNJL",
					"X-API-TOKEN": "awUpUFVSJaZxHJd8phq4KCUR7EWnh_YTnF_q",
				},
			}
		);
		if (response.data) {
			console.log("Message sent successfully", response.data);
		} else {
			console.log("Error sending message");
		}
	} catch (error) {
		res.send(error.message);
		console.log(error.message)
	}
}
