import Leads from "../models/leads.js";

export const checkAgentResponse = async (req, res, next) => {
	const data = req.body;
	const name = data.prospect?.firstName
		? data.prospect.firstName
		: data.message?.visitor.name
		? data.message.visitor.name
		: data.webUser
		? data.webUser
		: "No name";

	if (req.origin === "Respuesta Agente") {
		const idUser = req.body.prospect.id;
		const lead = await Leads.findOne({ id_user: idUser });
		if (lead === null) {
			// If lead does not exist, exit the process sending response to Zenvia an no next()
			console.log(
				`Exiting process --> Agent responded to ${name} and he is not in Leads DB`
			);
			res.status(200).send("Received");
			return;
		} else {
			// If lead exists in DB next()
			next();
		}
	} else {
		next();
	}
};
