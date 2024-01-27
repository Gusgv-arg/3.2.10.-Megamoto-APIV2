import axios from "axios";
import BotSwitch from "../models/botSwitch.js";
import { changeGeneralBotSwitch } from "../utils/changeGeneralBotSwitch.js";
import dotenv from "dotenv";

dotenv.config();

export const checkGeneralBotSwitch = async (req, res, next) => {
	const data = req.body;
	console.log("Entro esto:",data)
	
	const message =
		data.interaction?.output?.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: "No message";

	const name = data?.prospect.firstName;


	let botSwitchInstance = await BotSwitch.findOne();

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
			// Change the General Bot Switch
			const botSwitch = await changeGeneralBotSwitch(message, name);

			// Notify the user in Zenvia
			const prospectId = data.prospect?.id;
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
			throw error;
		}
	} else {
		console.log("General Bot Switch is turned OFF. MegaBot has been stopped!");
		res.status(200).send("Received");
		return;
	}
};
