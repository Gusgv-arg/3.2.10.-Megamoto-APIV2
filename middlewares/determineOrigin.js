export const determineOrigin = (req, res, next) => {
	const data = req.body;
	const name = data.prospect?.firstName || data.message.visitor.name;
	const message =
		data.interaction.output.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: data.message?.contents[0].text
			? data.message.contents[0].text
			: "No message";

	let origin = "";

	if (data.interaction.proactive === true) {
		origin = "Respuesta Agente";
		const firstTenWords = message.split(" ").slice(0, 10).join(" ");
		console.log(`4. Origin: Agent Message --> ${name}: "${firstTenWords}...".`);
	} else if (
		data.interaction?.via === "whatsApp" &&
		typeof data.interaction?.output.message.content === "string"
	) {
		origin = "whatsapp";
		console.log(`4. Origin: Whatsapp from --> ${name}: "${message}".`);
	} else if (
		data.interaction?.via === "instagram" &&
		typeof data.interaction?.output.message.content === "string"
	) {
		origin = "instagram";
		console.log(
			`4. Origin: Instagram from --> ${name}: "${message}". Object Instagram --> ${data}`
		);
	} else if (
		data?.channel === "facebook" &&
		typeof data.message.contents[0].text === "string"
	) {
		origin = "facebook";
		console.log(`4. Origin: Facebook from --> ${name}: "${message}".`);
	} else if (message === "No message") {
		origin = "No message";
		console.log(`4. Origin: No message from --> ${name}".`);
	} else {
		origin = "orígen desconocido o el mensaje no es texto!!!!!";
		console.log(
			"`4. Data with an origin not processed in API",
			data,
			data.prospect.contactMediums
		);
	}

	req.origin = origin;
	next();
};
