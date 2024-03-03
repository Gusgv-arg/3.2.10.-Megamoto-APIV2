export const checkBotOrigin = (req, res, next) => {
	const data = req.body;
//	console.log(data)
	const name = data.prospect?.firstName? data.prospect.firstName : data.message.visitor.name;
	/* if (data.interaction.proactive === true) {
		console.log("data con proactive = true", "Nombre:", name, "\nBot:",data.interaction?.bot, "\nAgent:", data.interaction?.agent?.firstName, "\nPerformer:", data.interaction.output.message.performer );
		console.log("data", data);
		console.log("data.interaction.output.message", data.interaction.output.message);
	} */
	if (
		data.interaction?.bot === true && name !=="Gg" ||
		data.interaction?.agent?.lastName === "Bot 🤖" && name !=="Gg" ||
		(data.interaction.proactive === true &&
			!data.interaction.hasOwnProperty("agent"))  // Si viene interaction.agent es un vendedor
	) {
		const firstFiveWords = data.interaction?.output.message.content.split(" ").slice(0, 5).join(" ");
		console.log(
			`\n1. Exit the process --> Bot message to --> ${name}: "${firstFiveWords}".`
		);
		res.status(200).send("Data received!");
		return;
	}
	next();
};
