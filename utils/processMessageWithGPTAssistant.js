import OpenAI from "openai";
import dotenv from "dotenv";
import { saveUserMessageInDb } from "./saveUserMessageInDb.js";
import Leads from "../models/leads.js";

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
	apiKey: API_KEY,
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
		console.log(
			`6. Existing thread for --> ${newMessage.name}. Changed firstCustomerMessage property to false.`
		);

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

		// Check if it's a "No message"
		} else if (newMessage.receivedMessage === "No message") {
			// Tell the assistant to respond with a tailored question
			const gptQuestion = `¡Gracias ${newMessage.name} por tu contacto! Para que pueda responder a tu pregunta necesitaría que me escribas y así poder ayudarte.`

			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: `Como no envié un mensaje escrito, para que podamos atendernos mejor te pido me respondas lo siguiente: ${gptQuestion}`,
			});
		
		} else {
			// Pass in the user question into the existing thread
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: newMessage.receivedMessage,
			});
		}

	} else {
		// Create a new thread
		const thread = await openai.beta.threads.create();
		threadId = thread.id;
		console.log(`6. New thread created --> ${newMessage.name}.`);

		let greeting = `¡Hola ${newMessage.name}! Soy MegaBot, un Asistente Virtual de Megamoto. Puedo cometer errores, pero para que un vendedor pueda atenderte más rápido decime que moto estas buscando, de donde sos, y como queres pagar.`;

		// Pass in the user name into the new thread and instruct the assistant to greet
		await openai.beta.threads.messages.create(
			threadId,
			{
				role: "user",
				content: `Quiero que me saludes con esta frase para saber quien sos, saber y entender que podrías cometer errores, y que debo responder para que puedas atenderme mejor: ${greeting}`,
			},
			{ max_tokens: 100, temperature: 0 }
		);
	}

	// Run the assistant and wait for completion
	let maxAttempts = 5;
	let currentAttempt = 0;
	let runStatus;
	let run;

	do {
		try {
			if (newMessage.firstCustomerMessage === true) {
				//If its a new customer set new Instructions
				let instructions =
					"Por cuestiones legales de Argentina, deberás saludar al cliente como él te solicita sin modificar y/o agregar nada en tu saludo. Es muy importante que el cliente se de por notificado que podrías cometer errores";
				
				run = await openai.beta.threads.runs.create(
					threadId,
					{
						assistant_id: assistantId,
						instructions: instructions,
					},
					{ max_tokens: 50, temperature: 0 }
				);
			} else {
				// Run the assistant normally
				run = await openai.beta.threads.runs.create(
					threadId,
					{
						assistant_id: assistantId,
					},
					{ max_tokens: 50, temperature: 0 }
				);
			}

			runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

			while (runStatus.status !== "completed") {
				await new Promise((resolve) => setTimeout(resolve, 2000));
				runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
			}

			console.log(
				`7. Run completed for --> ${newMessage.name}: "${newMessage.receivedMessage}".`
			);

			break; // Exit the loop if the run is completed
		} catch (error) {
			console.error(
				`7. Error running the assistant for --> ${newMessage.name}: "${newMessage.receivedMessage}", ${error.message}`
			);
			currentAttempt++;
			if (currentAttempt >= maxAttempts) {
				console.error("7. Exceeded maximum attempts. Exiting the loop.");
				break; // Exit the loop if maximum attempts are exceeded
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
		console.log(
			`10. Sending GPT response --> ${newMessage.name}: "${messageGpt}".`
		);
		return { messageGpt, threadId };
	}
};
