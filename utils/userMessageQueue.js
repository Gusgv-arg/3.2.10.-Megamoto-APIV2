import { handleMessageToZenvia } from "./handleMessageToZenvia.js";
import { processMessageWithGPTAssistant } from "./processMessageWithGPTAssistant.js";
import { saveAgentResponseInDb } from "./saveAgentResponseInDb.js";
import { saveGPTMessageInDb } from "./saveGPTMessageInDb.js";
import { saveGptResponseToWebUser } from "./saveGptResponseToWebUser.js";
import { sendErrorMessage } from "./sendErrorMessage.js";

// Class definition for the Queue
export class UserMessageQueue {
	constructor() {
		this.queues = new Map();
	}

	async processQueue(senderId) {
		const queue = this.queues.get(senderId);
		//console.log("Queue:", queue);
		if (!queue || queue.processing) return;

		queue.processing = true;

		while (queue.messages.length > 0) {
			// Take the first record and delete it from the queue
			const newMessage = queue.messages.shift();
			
			//return
			try {
				// PARA REPENSAR EL PROCESO

				// Process the message with the Assistant
				const response = await processMessageWithGPTAssistant(newMessage);
				
				if (newMessage.channel === "Respuesta Agente") {
					// Save the agent's response in DB
					await saveAgentResponseInDb(newMessage, response.threadId);
				} else if (newMessage.channel === "web") {
					// Excecute callback for be able to respond the user (res object)
					queue.responseCallback(null, response);
				} else {
					// Send message to Zenvia: can be the greeting, GPT response or error message &&
					// Save Gpt message in DB called by handleMessageToZenvia (can refactor this like web origin)
					await handleMessageToZenvia(
						newMessage.name,
						newMessage.senderPage,
						newMessage.senderId,
						response.messageGpt
							? response.messageGpt
							: response.greeting
							? response.greeting
							: response.errorMessage,
						response.threadId,
						newMessage.messageId,
						newMessage.channel,
						response.specialInstructions
					);
				}
			} catch (error) {
				console.error(
					`14. Error processing message for user ${newMessage.name}: ${error}`
				);
				// Send error message to the user
				const errorMessage = await sendErrorMessage(newMessage);

				// Change flag to allow next message processing
				queue.processing = false;

				// If there is an error for a web message, I use callback function to send the error to the user
				if (newMessage.channel === "web" && queue.responseCallback) {
					queue.responseCallback(error, null);
				}

				// Return to webhookController that has res.
				return errorMessage;
			}
		}
		// Change flag to allow next message processing
		queue.processing = false;
	}

	enqueueMessage(messageToProcess, responseCallback = null) {
		let name;
		let senderId;
		let messageId;
		let senderPage;
		let receivedMessage;
		let channel;
		
		//Depending the origin I define the variables according the object I receive
		if (messageToProcess.origin === "whatsapp") {
			name = messageToProcess.data.prospect.firstName;
			senderId = messageToProcess.data.prospect.id;
			messageId = messageToProcess.data.operationId;
			senderPage = messageToProcess.data.prospect.accountId;
			receivedMessage = messageToProcess.data.interaction.output.message.content
				? messageToProcess.data.interaction.output.message.content
				: "No message";
			channel = "whatsapp";
		} else if (messageToProcess.origin === "instagram") {
			console.log(
				"\nEntro Instagram ver propiedad del senderID!!",
				messageToProcess
			);
			name = messageToProcess.data.prospect.firstName;
			senderId = messageToProcess.data.prospect.id;
			messageId = messageToProcess.data.operationId;
			senderPage = messageToProcess.data.prospect.accountId;
			receivedMessage =
				messageToProcess.data.interaction.output.message.content;
			channel = "instagram";
		} else if (messageToProcess.origin === "facebook") {
			name = messageToProcess.data.message.visitor.name;
			senderId = messageToProcess.data.message.from;
			messageId = messageToProcess.data.message.id;
			senderPage = messageToProcess.data.message.to;
			receivedMessage = messageToProcess.data.message.contents[0].text;
			channel = "facebook";
		} else if (messageToProcess.origin === "Respuesta Agente") {
			name = messageToProcess.data.prospect.firstName;
			senderId = messageToProcess.data.prospect.id;
			messageId = messageToProcess.data.operationId;
			senderPage = messageToProcess.data.prospect.accountId;
			receivedMessage =
				messageToProcess.data.interaction.output.message.content;
			channel = "Respuesta Agente";
		} else if (messageToProcess.origin === "web") {
			name = messageToProcess.data.webUser;
			senderId = messageToProcess.data.webUser;
			messageId = messageToProcess.data.webUser;
			senderPage = messageToProcess.data.webUser;
			receivedMessage = messageToProcess.data.webMessage;
			channel = "web";
		}

		// Create a new object for sending it to the queue
		const newMessage = {
			name: name,
			senderId: senderId,
			messageId: messageId,
			senderPage: senderPage,
			receivedMessage: receivedMessage,
			channel: channel,
			firstCustomerMessage: true,
			agentResponse: false,
		};

		if (!this.queues.has(senderId)) {
			this.queues.set(senderId, {
				messages: [],
				processing: false,
				responseCallback: null,
			});
		}

		const queue = this.queues.get(senderId);

		// If web message, I save the callback
		if (messageToProcess.origin === "web") {
			queue.responseCallback = responseCallback;
		}

		queue.messages.push(newMessage);

		const firstFiveWords = newMessage.receivedMessage
			.split(" ")
			.slice(0, 5)
			.join(" ");

		//console.log(`5. Data added to Messages Queue --> ${newMessage.name}: "${firstFiveWords}".`);
		// Process the queue
		this.processQueue(senderId);
	}
}
