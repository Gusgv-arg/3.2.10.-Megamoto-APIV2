import Leads from "../models/leads.js";

export const checkAgentResponse = async (req, res, next) => {
	const name = req.body.prospect?.firstName || req.body.message.visitor.name;

	if (req.origin === "Respuesta Agente") {
		const idUser = req.body.prospect.id;
		const lead = await Leads.findOne({ id_user: idUser });
		if (lead === null) {
			// If lead does not exist, exit the process sending response to Zenvia an no next()
			console.log(
				`6. Exit process --> Agent responded to ${name} and he is not in Leads DB`
			);
			res.status(200).send("Received")
			return;
		} else {
			// If lead exists in DB next()
			next();
		}
	} else {
		next();
	}
};
