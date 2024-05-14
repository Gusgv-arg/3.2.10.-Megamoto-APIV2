import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
import Messages from "../models/messages.js";
import Webhook_Repeated_Messages from "../models/webhook_repeated_messages.js";

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const ORGANIZATION = process.env.ORGANIZATION;
const PROYECT = process.env.PROYECT;

const openai = new OpenAI({
	apiKey: API_KEY,
	organization: ORGANIZATION,
	project: PROYECT
});


//webhook original sin refactorizar que maneja la repuesta usando el GPT de Megamoto
export const webhookGptController = async (req, res) => {
	const data = req.body;
	console.log("Mensaje del webhook!:", data.message.contents[0].text);
	console.log("Lo que envía el webhook. TODO COMPLETO!:", data);
	
	// Responds if data is not received correctly
	if (!data || !data.message || !data.message.contents || !data.message.contents[0].text) {
		return res.status(400).send("Invalid request data");
	}

	// Respond the webhook when the event is received
	res.status(200).send("EVENT_RECEIVED")

	// Id of trained assistant
	const assistantId = "asst_AYumOwy3YOeqWOf4zXeR69Rc";

	// Id of message received from webhook
	const idMessageReceived = data.message.id;

	//Check if the message has already been processed
	const existingIdMessage = await Messages.findOne({
		id_user: data.message.from,
		id_message: idMessageReceived,
	});

	// Save the duplicated message sent by the webhook
	if (existingIdMessage) {
		console.log("ERROR DEL WEBHOOK, MENSAJE YA ENVIADO ANTES!!:", existingIdMessage);
		let nombre = ""
		if (data?.message?.visitor?.name){
			 nombre = data.message.visitor.name
		}

		await Webhook_Repeated_Messages.create({
			name: nombre,
			id_user: data.message.from,
			content: data.message.contents[0].text,
			id_message: data.message.id,
			channel: data.message.channel,
		});
		console.log("Mesaje duplicado del webhook grabado en base de datos!!")
	}

	if (data.message && existingIdMessage === null) {
		try {
			const senderPage = data.message.to;
			const senderId = data.message.from;
			const messageId = data.message.id;
			const receivedMessage = data.message.contents[0].text;
			const name = data.message.visitor.name;
			const channel = data.message.channel;

			// Search in db if there is an existing thread for the user
			const existingThread = await Messages.findOne({
				id_user: senderId,
				thread_id: { $exists: true },
			});

			/********** If a thread already exists ***********/
			if (existingThread) {
				console.log("Thread existente para este usuario!!");
				// If thread_id exists:
				// Pass in the user question into the existing thread
				await openai.beta.threads.messages.create(existingThread.thread_id, {
					role: "user",
					content: receivedMessage,
				});

				// Use runs to wait for the assistant response and then retrieve it
				const run = await openai.beta.threads.runs.create(
					existingThread.thread_id,
					{
						assistant_id: assistantId,
					}
				);

				let runStatus = await openai.beta.threads.runs.retrieve(
					existingThread.thread_id,
					run.id
				);

				// Polling mechanism to see if runStatus is completed
				// This should be made more robust to catch errors.
				while (runStatus.status !== "completed") {
					console.log(
						"En el while q SI hay thread. Current status:",
						runStatus.status
					);
					await new Promise((resolve) => setTimeout(resolve, 2000));
					runStatus = await openai.beta.threads.runs.retrieve(
						existingThread.thread_id,
						run.id
					);
				}
				console.log(
					"Run status is completed. Proceeding with sending the message to Zenvia."
				);

				// Get the last assistant message from the messages array
				const messages = await openai.beta.threads.messages.list(
					existingThread.thread_id
				);

				// Find the last message for the current run
				const lastMessageForRun = messages.data
					.filter(
						(message) =>
							message.run_id === run.id && message.role === "assistant"
					)
					.pop();
				console.log(
					"Ultimo mensaje extraído del thread existente:",
					lastMessageForRun.content[0].text
				);

				// 4. Send the response to zenvia
				// Nota: A futuro modificar. Por ahora estoy haciendo que solo me conteste a mi
				if (
					receivedMessage &&
					lastMessageForRun &&
					senderId == 6874624262580365
				) {
					const messageGpt = lastMessageForRun.content[0].text.value;

					// Save the received message to the database
					await Messages.create({
						name: name,
						id_user: senderId,
						role: "user",
						content: receivedMessage,
						id_message: messageId,
						channel: channel,
						thread_id: existingThread.thread_id,
					});

					// Send the message to zenvia
					await handleMessage(
						senderPage,
						senderId,
						messageGpt,
						existingThread.thread_id,
						messageId
					);
					console.log("sali del if luego de haber de que EXISTIA el thread");
					//res.status(200).send("EVENT_RECEIVED");
				} else {
					await handleMessage(
						senderPage,
						senderId,
						"!Hola! Estamos trabajando para que en los próximos días los mensajes sean respondidos por nuestro Asistente de IA y te ayudemos a responder tus consultas más rápido. En breve te contestamos. !Gracias por esperar! "
					);
				}
			} else {
				/****** If thread_id does NOT exist for the user ***********/
				// Create a thread
				const thread = await openai.beta.threads.create();
				console.log("Thread nueva creada!!:", thread);

				// Pass in the user question into the new thread
				await openai.beta.threads.messages.create(thread.id, {
					role: "user",
					content: receivedMessage,
				});

				// Use runs to wait for the assistant response and then retrieve it
				const run = await openai.beta.threads.runs.create(thread.id, {
					assistant_id: assistantId,
				});

				let runStatus = await openai.beta.threads.runs.retrieve(
					thread.id,
					run.id
				);

				// Polling mechanism to see if runStatus is completed
				// IMPORTANT: This should be made more robust to catch errors.
				while (runStatus.status !== "completed") {
					console.log(
						"En el while donde NO HAY thread. Current status:",
						runStatus.status
					);
					await new Promise((resolve) => setTimeout(resolve, 2000));
					runStatus = await openai.beta.threads.runs.retrieve(
						thread.id,
						run.id
					);
				}

				console.log(
					"Run status is completed after creating new thread. Proceeding with sending the message to Zenvia."
				);

				// Get the last assistant message from the messages array
				const messages = await openai.beta.threads.messages.list(thread.id);

				// Find the last message for the current run
				const lastMessageForRun = messages.data
					.filter(
						(message) =>
							message.run_id === run.id && message.role === "assistant"
					)
					.pop();

				// If an assistant message is found, send the message to zenvia
				// Nota: A futuro modificar. Por ahora estoy haciendo que solo me conteste a mi
				if (
					receivedMessage &&
					lastMessageForRun &&
					senderId == 6874624262580365
				) {
					const messageGpt = lastMessageForRun.content[0].text.value;

					// Save the received message to the database
					await Messages.create({
						name: name,
						id_user: senderId,
						role: "user",
						content: receivedMessage,
						id_message: messageId,
						channel: channel,
						thread_id: thread.id,
					});

					// Send the message to zenvia
					await handleMessage(
						senderPage,
						senderId,
						messageGpt,
						thread.id,
						messageId
					);
					//res.status(200).send("EVENT_RECEIVED");
				} else {
					await handleMessage(
						senderPage,
						senderId,
						"!Hola! Estamos trabajando para que en los próximos días los mensajes sean respondidos por nuestro Asistente de IA y te ayudemos a responder tus consultas más rápido. En breve te contestamos. !Gracias por esperar! "
					);
				}
				console.log("sali del if luego de haber CREADO el thread");
			}
		} catch (error) {
			res.status(400).send(error.message);
			console.log(error.message);
		}
	}
};

async function handleMessage(
	senderPage,
	senderId,
	messageGpt,
	threadId,
	messageId
) {
	try {
		// Save the sent message to the database
		await Messages.create({
			name: "AI",
			id_user: senderId,
			role: "assistant",
			content: messageGpt,
			id_message: messageId,
			channel: "facebook",
			thread_id: threadId,
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
						text: messageGpt,
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
		console.log("Error en handleMessage", error.message);
	}
}
