import Leads from "../models/leads.js";

export const checkAgentResponse = async (req, res, next) => {
	if (req.origin === "Respuesta Agente") {
		const name = req.body.prospect?.firstName || req.body.message.visitor.name;
		const idUser = req.body.prospect.id;
		const lead = await Leads.findOne({ id_user: idUser });
		if (lead === null) {
			// If lead does not exist, exit the process sending response to Zenvia an no next()
			console.log(
				`5. Exit process --> Agent responded to ${name} and he is not in Leads DB`
			);
			return
		} else {
			// If lead exists in DB next()
			next();
		}
	} else {
		next();
	}
};
