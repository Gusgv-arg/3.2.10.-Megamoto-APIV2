import BotSwitch from "../models/botSwitch.js";
import Leads from "../models/leads.js";

// Function that changes the general bot switch in BotSwitch DB. Will return ON, OFF or a not allowed message 
export const changeBotSwitch = async (message, name, prospectId) => {
	
	try {
		// Change General Bot Switch
		if ((name = "Gustavo Gomez Villafañe") || (name = "Gustavo Glunz")) {
			let botSwitch = await BotSwitch.findOne();
			
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
			// Change Individual Bot Switch
			try {
				const lead = await Leads.findOne({ id_user: prospectId });

				if (lead && message.toLowerCase() === "megabot on") {
					lead.botSwitch = "ON";
					await lead.save();
					console.log(`Invividual MegaBot has been set to ON for ${name}`);
					return lead.botSwitch;

				} else if (lead && message.toLowerCase() === "megabot off") {
					lead.botSwitch = "OFF";
					await lead.save();
					console.log(`Individual MegaBot has been set to OFF for ${name}`);
					return lead.botSwitch;

				} else {
					console.log(
						`Megabot never answered to ${prospectId}; so he is not registered in Leads DB.`
					);
					const response =
						`${name} nunca fue atendido por Megabot; por lo que no podes apagarlo o prenderlo.`;
					return response
				}
			} catch (error) {
				console.log(
					"An error occurred while trying to change MegaBot Individual Switch (changeBotSwitch.js"
				);
				next(error);
			}
		}
	} catch (error) {
		console.log(
			"An error occurred while trying to change MegaBot Switch (changeGeneralBotSwitch.js"
		);
		next(error);
	}
};
