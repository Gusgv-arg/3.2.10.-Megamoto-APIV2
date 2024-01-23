
export const determineOrigin = (req, res, next) => {
	const data = req.body;
	const name = data.prospect?.firstName || data.message.visitor.name;
	const message =
		data.interaction.output.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: data.message.contents[0].text;
	let origin = "";

	if (
		data.interaction?.bot === true &&
		typeof data.interaction?.output.message.content === "string"
	) {
		origin = "bot";
		console.log(
			`4. Origin: Bot message --> ${name}: "${data.interaction?.output.message.content}".`
		);
	} else if (
		(data.interaction?.proactive === true &&
			typeof data.interaction?.output.message.content === "string") ||
		(data.interaction?.proactive === true &&
			typeof data.interaction?.output.message === "string")
	) {
		origin = "Respuesta Agente";
		console.log("Lo q entra x Agente", data)
		console.log(`4. Origin: Agent Message --> ${name}: "${message}".`);		
	} else if (
		data.interaction?.via === "whatsApp" &&
		typeof data.interaction?.output.message.content === "string"
	) {
		origin = "whatsApp";
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
