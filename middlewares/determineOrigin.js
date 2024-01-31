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

	const firstTenWords = message.split(" ").slice(0, 10).join(" ");
	const firstFiveWords = message.split(" ").slice(0, 5).join(" ");

	if (data.interaction.proactive === true) {
		origin = "Respuesta Agente";
		console.log(`4. Origin: Agent Message --> ${name}: "${firstTenWords}...".`);
	} else if (
		data.interaction?.via === "whatsApp" &&
		typeof data.interaction?.output.message.content === "string"
	) {
		origin = "whatsapp";
		console.log(`4. Origin: Whatsapp from --> ${name}: "${firstFiveWords}".`);
	} else if (
		data.interaction?.via === "instagram" &&
		typeof data.interaction?.output.message.content === "string"
	) {
		origin = "instagram";
		console.log(
			`4. Origin: Instagram from --> ${name}: "${firstFiveWords}". Object Instagram ver el senderId --> ${data}`
		);
	} else if (
		data?.channel === "facebook" &&
		typeof data.message.contents[0].text === "string"
	) {
		origin = "facebook";
		console.log(`4. Origin: Facebook from --> ${name}: "${firstFiveWords}".`);
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
