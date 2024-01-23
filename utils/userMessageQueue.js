import { exportLeadsToExcel } from "./exportLeadsToExcel.js";
import { handleMessageToZenvia } from "./handleMessageToZenvia.js";
import { processMessageWithGPTAssistant } from "./processMessageWithGPTAssistant.js";
import { saveAgentResponseInDb } from "./saveAgentResponseInDb.js";

// Class definition for the Queue
export class UserMessageQueue {
	constructor() {
		this.queues = new Map();
	}

	async processQueue(senderId) {
		const queue = this.queues.get(senderId);
		if (!queue || queue.processing) return;

		queue.processing = true;

		while (queue.messages.length > 0) {
			// Take the first record and delete form the queue
			const newMessage = queue.messages.shift();

			try {
				// Process the message with the Assistant
				const response = await processMessageWithGPTAssistant(newMessage);

				// Check if it's an agent's response
				if (newMessage.channel === "Respuesta Agente"){
					// Save the agent's response in DB
					await saveAgentResponseInDb(newMessage)

				} else {
					// Send the message to Zenvia
					await handleMessageToZenvia(
						newMessage.name,
						newMessage.senderPage,
						newMessage.senderId,
						response.messageGpt,
						response.threadId,
						newMessage.messageId,
						newMessage.channel
					);
				}

				// Export to Excel Leads DB
				await exportLeadsToExcel();
				
			} catch (error) {
				console.error(
					`14. Error processing message for user ${newMessage.name}: ${error}`
				);
				// Handle error, possibly re-queue the message
			}
		}

		// Change flag to allow next message processing
		queue.processing = false;
	}

	enqueueMessage(messageToProcess) {
		//console.log("Message dentro de enqueue", messageToProcess);
		let name;
		let senderId;
		let messageId;
		let senderPage;
		let receivedMessage;
		let channel;

		//Depending the origin I define the variables according the object I receive
		if (messageToProcess.origin === "whatsApp") {
			name = messageToProcess.data.prospect.firstName;
			senderId = messageToProcess.data.prospect.id;
			messageId = messageToProcess.data.operationId;
			senderPage = messageToProcess.data.prospect.accountId;
			receivedMessage =
				messageToProcess.data.interaction.output.message.content;
			channel = "whatsApp";
		} else if (messageToProcess.origin === "instagram") {
			name = messageToProcess.data.prospect.firstName;
			senderId = messageToProcess.data.prospect.phones[0]
				? messageToProcess.data.prospect.phones[0]
				: "no phone";
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
		}

		// Create a new object for sending it to the assistant
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
			this.queues.set(senderId, { messages: [], processing: false });
		}
		const queue = this.queues.get(senderId);
		queue.messages.push(newMessage);
		console.log(
			`5. Data added to Messages Queue --> ${newMessage.name}: "${newMessage.receivedMessage}".`
		);
		// Process the queue
		this.processQueue(senderId);
	}
}
