import Leads from "../models/leads.js";

// Middleware that checks the individual botSwitch
export const checkIndividualBotSwitch = async (req, res, next) => {
	const data = req.body;
	const prospectId = data?.prospect?.id ? data.prospect.id : data.webUser;
	const name = data.prospect?.firstName
		? data.prospect.firstName
		: data.message?.visitor?.name
		? data.message.visitor.name
		: data.webUser
		? data.webUser
		: "No name";
	try {
		const lead = await Leads.findOne({ id_user: prospectId });

		if (lead !== null && lead.botSwitch === "OFF") {
			//ACA VER SI A FUTURO NO QUIERO GRABAR LOS MENSAJES ENTRE EL CLIENTE Y VENDEDOR
			//Y SI QUISIERA HACER EL SWITCH INDIVIDUAL TENDRIA Q CAMBIAR LA LOGICA PORQ ESTE MIDDLEWARE SIEMPRE LO SACARIA ESTANDO EL SWITCH EN OFF

			console.log(
				`Exit the process. Individual BotSwitch is turned OFF for: ${name}`
			);
			res
				.status(200)
				.send({
					message:
						"Mensaje recibido. En estos momentos MegaBot se encuentra apagado. Intenta más tarde. !Gracias!",
				});
			return;
		} else {
			next();
		}
	} catch (error) {
		next(error);
	}
};
