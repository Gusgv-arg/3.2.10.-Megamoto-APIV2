import OpenAI from "openai";
import dotenv from "dotenv";
import { saveUserMessageInDb } from "./saveUserMessageInDb.js";
import Leads from "../models/leads.js";
import axios from "axios";
import { matchkeyWords } from "./matchKeyWords.js";

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

		// Create a First Greet, pass it to the new thread, and post directly to Zenvia without running the assistant
		let greeting1 = `¡Hola ${newMessage.name}! 👋 Soy MegaBot, Asistente Virtual de Megamoto. Te pido que seas lo más preciso posible pero tené en cuenta que a veces cometo errores 🙏. Todo será reconfirmado por un vendedor que para atenderte más rápido necesita saber que moto estas buscando, como queres pagar, tu DNI si vas a pagar financiado, un teléfono, y de donde sos. 😀`;

		const greeting2 = `¡Hola ${newMessage.name}! 👋 Soy MegaBot, Asistente Virtual de Megamoto. Para que un vendedor pueda atenderte más rápido por favor informame: 1) Modelo. 2) Teléfono. 3) Localidad. 4) Método de pago. 5) DNI (si vas a pagar financiado). Estoy en etapa de prueba y puedo equivocarme; luego de que me envíes los datos, un vendedor te contactará para confirmar la propuesta. ¡Saludos y gracias por el contacto! 😀`;

		const greeting = `¡Hola ${newMessage.name}! 👋 Soy MegaBot, Asistente Virtual de Megamoto. Mi objetivo es ayudarte a comprar tu moto agilizando la atención por parte de nuestros vendedores. A veces me equivoco; por lo que agradezco tu paciencia. ¿Si queres comencemos por saber que moto estas buscando? 😀`
		
		const form = "https://whatsform.com/cI7aIJ"

		await openai.beta.threads.messages.create(
			threadId,
			{ role: "user", content: newMessage.receivedMessage },
			{
				role: "assistant",
				content: greeting,
			}
		);

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
		return { greeting, threadId };
	}

	// Run the assistant and wait for completion
	let maxAttempts = 5;
	let currentAttempt = 0;
	let runStatus;
	let run;

	do {
		try {
			// Check if there are key words and if so pass it to the run
			const instructions = matchkeyWords(newMessage);

			if (instructions === "") {
				// Run the assistant normally
				run = await openai.beta.threads.runs.create(
					threadId,
					{
						assistant_id: assistantId,
					}
				);
			} else if (instructions.bici || instructions.trabajo || instructions.dni) {
				run = await openai.beta.threads.runs.create(
					threadId,
					{
						assistant_id: assistantId,
						instructions: instructions.bicicletaInstructions ? instructions.bicicletaInstructions : instructions.trabajoInstructions ? instructions.trabajoInstructions : instructions.financeInstructions,
					}
				);
			} else {
				console.log("Run con aditional instructions!!!!", instructions);
				run = await openai.beta.threads.runs.create(
					threadId,
					{
						assistant_id: assistantId,
						//instructions: instructions,
						additional_instructions: instructions,
					}
				);
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
		return { messageGpt, threadId };
	}
};
