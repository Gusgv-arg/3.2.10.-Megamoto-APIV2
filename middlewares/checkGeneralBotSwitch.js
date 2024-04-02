import axios from "axios";
import BotSwitch from "../models/botSwitch.js";
import { changeBotSwitch } from "../utils/changeBotSwitch.js";
import dotenv from "dotenv";
import { saveData } from "../utils/saveData.js";

dotenv.config();

export const checkGeneralBotSwitch = async (req, res, next) => {
	const data = req.body;
	//console.log("Entro esto:",data)

	//await saveData(data)

	const message =
		data.interaction?.output?.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: data.message?.contents[0].text
			? data.message.contents[0].text
			: "No message";

	const name = data.prospect?.firstName
		? data.prospect.firstName
		: data.message.visitor.name;

	try {
		let botSwitchInstance = await BotSwitch.findOne();
		// Next() if general switch is ON or message is not megabot on/off or name is different from me and "Gg" or origin is an Agent response to a user that is in Leads DB
		if (
			(botSwitchInstance.generalSwitch === "ON" &&
				message.toLowerCase() !== "megabot off" &&
				message.toLowerCase() !== "megabot on") ||
			(name === "Gustavo Gomez Villafañe" &&
				message.toLowerCase() !== "megabot off" &&
				message.toLowerCase() !== "megabot on") ||
			(name === "Gg" &&
				message.toLowerCase() !== "megabot off" &&
				message.toLowerCase() !== "megabot on") ||
			req.origin === "Respuesta Agente"
		) {
			const lastDateSwitchON = botSwitchInstance.updatedAt;
			req.lastDateSwitchON = lastDateSwitchON;
			next();
		} else if (
			message.toLowerCase() === "megabot off" ||
			message.toLowerCase() === "megabot on"
		) {
			try {
				// Change Bot Switch
				const prospectId = data.prospect?.id;
				const botSwitch = await changeBotSwitch(message, name, prospectId);

				// Notify the user in Zenvia
				const channel = "whatsapp";
				const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

				if (botSwitch === "ON" || botSwitch === "OFF") {
					const response = await axios.post(url, {
						content: `MegaBot fue puesto en ${botSwitch}`,
					});
				} else {
					const response = await axios.post(url, {
						content: botSwitch,
					});
				}

				// Exit the process
				res.status(200).send("Received");
				return;
			} catch (error) {
				console.log(
					"There has been an error while checking General Switch in checkGeneralBotSwitch.js.",
					error.message
				);
				// Pass the error to the centralized error handling middleware
				next(error);
			}

			// General Bot Switch is off
		} else {
			console.log(
				"Exiting the process, General Bot Switch is turned OFF. MegaBot is stopped!"
			);
			res.status(200).send("Received");
			return;
		}
	} catch (error) {
		console.log(
			"An error ocurred in checkgeneralBotSwitch.js when looking general switch"
		);
		next(error);
	}
};
