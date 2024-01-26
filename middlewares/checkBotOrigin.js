export const checkBotOrigin = (req, res, next) => {
	const data = req.body;
	const name = data.prospect?.firstName || data.message.visitor.name;

	if (
		data.interaction?.bot === true &&
		typeof data.interaction?.output.message.content === "string"
	) {
		console.log(
			`1. Exit the process --> Bot message to --> ${name}: "${data.interaction?.output.message.content}".`
		);
        res.status(200).send("Data received!")
        return
	}
	next();
};
