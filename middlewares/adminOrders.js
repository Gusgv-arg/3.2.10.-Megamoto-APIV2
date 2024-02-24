import axios from "axios";

export const adminOrders = async (req, res, next) => {
	const message =
		data.interaction?.output?.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: data.message?.contents[0].text
			? data.message.contents[0].text
			: "No message";
	const name = data?.prospect?.firstName || data?.message?.visitor?.name;

	if (
		(name === "Gustavo Gomez Villafañe" &&
			message.toLowerCase() === "megabot responde") ||
		(name === "Gg" && message.toLowerCase() === "megabot responde")
	) {
		const url = "https://literally-humble-bee.ngrok-free.app";

		const contact = await axios.post(`${url}/prospects/unclaimed`);

		console.log("CONTACT DESDE ADMIN ORDERS:", contact);

		// Exit the process
		res.status(200).send("Received");
		return;
        
	} else {
		next();
	}
};
