export const checkBotOrigin = (req, res, next) => {
	const data = req.body;
	const name = data.prospect?.firstName || data.message.visitor.name;
	if (data.interaction.proactive === true) {
		console.log("data con proactive = true", data);
		//console.log("leads", req.body.prospect.leads);
		console.log("output.performer", req.body.interaction.output.performer);
	}
	if (
		data.interaction?.bot === true ||
		data.interaction?.agent?.lastName === "Bot 🤖" ||
		(data.interaction.proactive === true &&
			!data.interaction.hasOwnProperty("agent"))
	) {
		console.log(
			`\n1. Exit the process --> Bot message to --> ${name}: "${data.interaction?.output.message.content}".`
		);
		res.status(200).send("Data received!");
		return;
	}
	next();
};
