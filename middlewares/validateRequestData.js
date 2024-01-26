// Function to validate request data. Returns true or false

export const validateRequestData = (req, res, next) => {
	const data = req.body;
	const name = data.prospect?.firstName || data.message.visitor.name 
	const message = 
	data.interaction.output.message && data.interaction.output.message.content
		? data.interaction.output.message.content
		: data.message?.contents[0].text
		? data.message.contents[0].text
		: "No message";

	if (
		(data &&
			data.message &&
			data.message.contents &&
			data.message.contents[0] &&
			typeof data.message.contents[0] === "string") ||
		(data && data.prospect && data.prospect.phones[0] || data.interaction.proactive === "true" || data.interaction.via === "instagram")
	) { 
		const firstFiveWords = message.split(" ").slice(0, 5).join(" ");
		console.log(`3. Valid Data --> ${name}: "${firstFiveWords}...".`);
		res.status(200).send("Data received!")
		next();
	} else {
		console.log("3. Invalid data from Zenvia", data );
		res.status(401).send("Invalid data sent by Zenvia");
	}
};
