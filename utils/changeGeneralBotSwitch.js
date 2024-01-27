import BotSwitch from "../models/botSwitch.js";

export const changeGeneralBotSwitch = async (message, name) => {
	let botSwitch = await BotSwitch.findOne();

	try {
		if ((name = "Gustavo Gomez Villafañe")) {
			if (message.toLowerCase() === "megabot on") {
				botSwitch.generalSwitch = "ON";
				await botSwitch.save();
				console.log(`MegaBot has been set to ON for all messages by ${name}`);
			} else if (message.toLowerCase() === "megabot off") {
				botSwitch.generalSwitch = "OFF";
				await botSwitch.save();
				console.log(`MegaBot has been set to OFF for all messages by ${name}`);
			}
			return botSwitch.generalSwitch;
		} else {
			const notAuthorized =
				"Solo Gustavo Gomez Villafañe tiene el permiso general de prender o apagar MegaBot.";
			return notAuthorized;
		}
	} catch (error) {
		console.log(
			"An error occurred while trying to change MegaBot Switch (changeGeneralBotSwitch.js"
		);
		throw error;
	}
};
