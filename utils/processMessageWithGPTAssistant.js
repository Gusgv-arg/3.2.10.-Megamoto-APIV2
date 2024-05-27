import OpenAI from "openai";
import dotenv from "dotenv";
import { saveUserMessageInDb } from "./saveUserMessageInDb.js";
import Leads from "../models/leads.js";
import axios from "axios";
import { matchkeyWords } from "./matchKeyWords.js";

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const ORGANIZATION = process.env.ORGANIZATION;
const PROYECT = process.env.PROYECT;

const openai = new OpenAI({
	apiKey: API_KEY,
	organization: ORGANIZATION,
	project: PROYECT
});

export const processMessageWithGPTAssistant = async (newMessage) => {
	const assistantId = process.env.OPENAI_ASSISTANT_ID;
	let threadId;

	// Check if there is an existing thread for the user
	let existingThread;
	try {
		existingThread = await Leads.findOne({
			id_user: newMessage.senderId,
			thread_id: { $exists: true },
		});
	} catch (error) {
		console.error("6. Error fetching thread from the database:", error);
		throw error;
	}

	if (existingThread) {
		threadId = existingThread.thread_id;
		newMessage.firstCustomerMessage = false;
		const firstFiveWords = newMessage.receivedMessage
			.split(" ")
			.slice(0, 5)
			.join(" ");
		//console.log(`6. Existing thread for --> ${newMessage.name}, ID: ${newMessage.senderId}, Message: ${firstFiveWords}. Changed firstCustomerMessage property to false.`);

		// Check if it is an Agent response
		if (newMessage.channel === "Respuesta Agente") {
			// Save agent's response in the threadId without running it
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: `Te envío la respuesta que me envió un vendedor de Megamoto para que tus posibles próximas respuestas estén alineadas con lo que estamos hablando. Respuesta del vendedor: ${newMessage.receivedMessage}`,
			});

			// Exit the process
			console.log(
				`7. Agent response saved in threadId. Customer --> ${newMessage.name}: ${newMessage.receivedMessage}`
			);
			return { threadId };
		} else {
			// Pass in the user question into the existing thread
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: newMessage.receivedMessage,
			});
		}
	} else {
		
		// Create a new thread because its a new customer
		const thread = await openai.beta.threads.create();
		threadId = thread.id;
		//console.log(`6. New thread created --> ${newMessage.name}.`);

		// Create a First Greet & pass it to the new thread
		let greeting;
		// For Web users run the assistant but with greet already saved
		if (newMessage.channel === "web") {
			greeting =
				"¡Hola! 👋 Soy MegaBot, Asistente Virtual de Megamoto, puedo cometer algún error. Estoy para agilizar tu atención y luego un vendedor se pondrá en contacto contigo. ¿Qué moto estás buscando? 😀";
			// Send to GPT the conversation where the first message is a greeting
			await openai.beta.threads.messages.create(
				threadId,
				{
					role: "user",
					content:
						"Hola soy un cliente que entró por la página web de Megamoto y quería información.",
				},
				{
					role: "assistant",
					content: greeting,
				},
				{ role: "user", content: newMessage.receivedMessage }
			);
		} else {
			// For Zenvia users post directly to Zenvia without running the assistant (returns greeting)

			greeting = `¡Hola ${newMessage.name}! 👋 Soy MegaBot, Asistente Virtual de Megamoto, puedo cometer algún error. Estoy para agilizar tu atención y luego un vendedor se pondrá en contacto contigo. ¿Qué moto estás buscando? 😀`;
			
			// Send to GPT the conversation where the first message is a greeting
			await openai.beta.threads.messages.create(
				threadId,
				{ role: "user", content: newMessage.receivedMessage },
				{
					role: "assistant",
					content: greeting,
				}
			);
			// Save the FIRST received message from ZENVIA USER to the database
			const role = "user";
			await saveUserMessageInDb(
				newMessage.name,
				newMessage.senderId,
				role,
				newMessage.receivedMessage,
				newMessage.messageId,
				newMessage.channel,
				threadId
			);
			return { greeting, threadId };
		}
	}
	// Save the received message from USER to the database (web users & Zenvia)
	const role = "user";
	await saveUserMessageInDb(
		newMessage.name,
		newMessage.senderId,
		role,
		newMessage.receivedMessage,
		newMessage.messageId,
		newMessage.channel,
		threadId
	);
	// Run the assistant and wait for completion
	let maxAttempts = 5;
	let currentAttempt = 0;
	let runStatus;
	let run;
	let specialInstructions;

	do {
		try {
			// Check if there are key words and if so pass it to the run
			const instructions = await matchkeyWords(newMessage);

			//Variable created to save in Messages DB
			specialInstructions = instructions;

			if (instructions === "") {
				// Run the assistant normally without streaming
				run = await openai.beta.threads.runs.create(threadId, {
					assistant_id: assistantId,
				});
			} else {
				// run the assistant with special instructions
				console.log(
					"Running assistant with special instructions!!\n",
					instructions
				);
				run = await openai.beta.threads.runs.create(threadId, {
					assistant_id: assistantId,
					//instructions: instructions,
					additional_instructions: instructions,
				});
			}

			runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

			while (runStatus.status !== "completed") {
				await new Promise((resolve) => setTimeout(resolve, 3000));
				runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
			}

			//console.log(`7. Run completed for --> ${newMessage.name}: "${newMessage.receivedMessage}".`);

			break; // Exit the loop if the run is completed
		} catch (error) {
			console.error(
				`7. Error running the assistant for --> ${newMessage.name}: "${newMessage.receivedMessage}", ${error.message}`
			);
			currentAttempt++;
			if (currentAttempt >= maxAttempts || error) {
				console.error("7. Exceeded maximum attempts. Exiting the loop.");
				const errorMessage =
					"Te pido disculpas 🙏, en este momento no puedo procesar tu solicitud ☹️. Por favor intentá mas tarde. ¡Saludos de MegaBot! 🙂";

				// Exit the loop if maximum attempts are exceeded and send an error message to the user
				return { errorMessage, threadId };
			}
		}
	} while (currentAttempt < maxAttempts);

	// Get the last assistant message from the messages array
	const messages = await openai.beta.threads.messages.list(threadId);

	// Find the last message for the current run
	const lastMessageForRun = messages.data
		.filter(
			(message) => message.run_id === run.id && message.role === "assistant"
		)
		.pop();

	// Send the assistants response
	if (newMessage.receivedMessage && lastMessageForRun) {
		let messageGpt = lastMessageForRun.content[0].text.value;

		// Save the received message from the USER to the database
		const role = "user";
		await saveUserMessageInDb(
			newMessage.name,
			newMessage.senderId,
			role,
			newMessage.receivedMessage,
			newMessage.messageId,
			newMessage.channel,
			threadId
		);
		return { messageGpt, threadId, specialInstructions };
	}
};
