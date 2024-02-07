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
	const name = data?.prospect.firstName;

	let botSwitchInstance = await BotSwitch.findOne();

	// Next() if general switch is ON or message is nos megabot on/off
	if (
		botSwitchInstance.generalSwitch === "ON" &&
		message.toLowerCase() !== "megabot off" &&
		message.toLowerCase() !== "megabot on"
	) {
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
		console.log("General Bot Switch is turned OFF. MegaBot has been stopped!");
		res.status(200).send("Received");
		return;
	}
};
