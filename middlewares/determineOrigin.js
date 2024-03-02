export const determineOrigin = (req, res, next) => {
	const data = req.body;
	const name = data.prospect?.firstName? data.prospect.firstName : data.message.visitor.name;
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
		//console.log(`4. Origin: Agent Message --> ${name}: "${firstTenWords}...".`);
	} else if (data.interaction?.via === "whatsApp") {
		origin = "whatsapp";
		//console.log(`4. Origin: Whatsapp from --> ${name}: "${firstFiveWords}".`);
	} else if (data.interaction?.via === "instagram") {
		origin = "instagram";
		//console.log(`4. Origin: Instagram from --> ${name}: "${firstFiveWords}". Object Instagram ver el senderId --> ${data}`);
	} else if (data?.channel === "facebook" || data.interaction?.via === "facebook") {
		origin = "facebook";
		//console.log(`4. Origin: Facebook from --> ${name}: "${firstFiveWords}".`);
		console.log("FACEBOOK!!!!!!!", data)
		console.log("FACEBOOK MESSAGE!!!!!!!", data.interaction.output.message)
	} else {
		console.log(
			"`4. Exit the process. Data with an origin not processed in API",
			data,
			data.prospect.contactMediums
		);
		res.status(200).send("Received")
		return
	}
	req.origin = origin;
	next();
};
