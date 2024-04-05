export const checkBotOrigin = (req, res, next) => {
	const data = req.body;

	const name = data.prospect?.firstName
		? data.prospect.firstName
		: data.message?.visitor.name
		? data.message.visitor.name
		: data.webUser
		? data.webUser
		: "No name";
		
	if (
		(data.interaction?.bot === true && name !== "Gg") ||
		(data.interaction?.agent?.lastName === "Bot 🤖" && name !== "Gg") ||
		(data.interaction?.proactive === true &&
			!data.interaction.hasOwnProperty("agent")) // Si viene interaction.agent es un vendedor
	) {
		const firstFiveWords = data.interaction?.output.message.content
			.split(" ")
			.slice(0, 5)
			.join(" ");
		console.log(
			`\n1. Exit the process --> Bot message to --> ${name}: "${firstFiveWords}".`
		);
		res.status(200).send("Data received!");
		return;
	}	
	next();
};
