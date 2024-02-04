import Leads from "../models/leads.js";

// Middleware that checks the individual botSwitch
export const checkIndividualBotSwitch = async (req, res, next) => {
	const data = req.body;
	const prospectId = data.prospect?.id;
	const name = data.prospect?.firstName;
	const lead = await Leads.findOne({ id_user: prospectId });

	if (lead!== null && lead.botSwitch === "OFF") {
		res.status(200).send("Received");
		console.log(`Exit the process. BotSwitch is turned OFF for: ${name}`);

		//ACA VER SI A FUTURO NO QUIERO GRABAR LOS MENSAJES ENTRE EL CLIENTE Y VENDEDOR
		//Y SI QUISIERA HACER EL SWITCH INDIVIDUAL TENDRIA Q CAMBIAR LA LOGICA PORQ ESTE MIDDLEWARE SIEMPRE LO SACARIA ESTANDO EL SWITCH EN OFF

		return;
	} else {
		next();
	}
};
