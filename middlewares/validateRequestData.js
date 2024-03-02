// Function to validate request data. Returns true or false
export const validateRequestData = (req, res, next) => {
	const data = req.body;
	const message =
		data.interaction.output.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: data.message?.contents[0].text
			? data.message.contents[0].text
			: "No message";

	// Object has to have the properties according its origin
	if (
		(req.origin === "whatsapp" &&
			data.prospect.hasOwnProperty("firstName") &&
			data.prospect.hasOwnProperty("id") &&
			data.hasOwnProperty("operationId") &&
			data.prospect.hasOwnProperty("accountId") &&
			data.interaction.output.message.hasOwnProperty("content")) ||
		(req.origin === "instagram" &&
			data.prospect.hasOwnProperty("firstName") &&
			data.prospect.hasOwnProperty("id") &&
			data.hasOwnProperty("operationId") &&
			data.prospect.hasOwnProperty("accountId") &&
			data.interaction.output.message.hasOwnProperty("content")) ||
		(req.origin === "Respuesta Agente" &&
			data.prospect.hasOwnProperty("firstName") &&
			data.prospect.hasOwnProperty("id") &&
			data.hasOwnProperty("operationId") &&
			data.prospect.hasOwnProperty("accountId") &&
			data.interaction.output.message.hasOwnProperty("content"))
	) {
		const firstFiveWords = message.split(" ").slice(0, 5).join(" ");
		//console.log(`5. Valid Data --> ${data.prospect.firstName}: "${firstFiveWords}...".`);
		next();
	} else if (
		req.origin === "facebook" &&
		data.interaction.output.message.visitor.hasOwnProperty("name") &&
		data.interaction.output.message.hasOwnProperty("from") &&
		data.interaction.output.message.hasOwnProperty("id") &&
		data.interaction.output.message.hasOwnProperty("to") &&
		data.interaction.output.message.contents[0].hasOwnProperty("text")
	) {
		const firstFiveWords = message.split(" ").slice(0, 5).join(" ");
		//console.log(`5. Valid Data --> ${name}: "${firstFiveWords}...".`);
		next();
	} else {
		console.log("3. Invalid data from Zenvia", data);
		res
			.status(200)
			.send("Data received but this API cannot process this object");
		return;
	}
};
