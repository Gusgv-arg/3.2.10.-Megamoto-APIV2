import axios from "axios";
import { exportLeadsToExcel } from "../utils/exportLeadsToExcel.js";
import { updateDbPricesFromExcel } from "../utils/updatesDbPricesFromExcel.js";

export const adminOrders = async (req, res, next) => {
	const data = req.body;
	const message =
		data.interaction?.output?.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: data.message?.contents[0].text
			? data.message.contents[0].text
			: data.webMessage
			? data.webMessage
			: "No message";
			
	const name = data.prospect?.firstName
		? data.prospect.firstName
		: data.message?.visitor?.name
		? data.message.visitor.name
		: data.webUser
		? data.webUser
		: "No name";
	
	if (
		// Contact leads in a 24hs window
		(name === "Gustavo Gomez Villafañe" &&
			message.toLowerCase() === "megabot responde") ||
		(name === "Gg" && message.toLowerCase() === "megabot responde")
	) {
		const url = "https://literally-humble-bee.ngrok-free.app";
		//const url = "https://three-2-10-megamoto-apiv2.onrender.com";

		const contact = await axios.post(`${url}/prospects/unclaimed`);

		console.log("CONTACT DESDE ADMIN ORDERS:", contact);

		// Exit the process
		res.status(200).send("Received");
		return;
	} else if (
		// Send Leads.xlsx by mail
		(name === "Gustavo Gomez Villafañe" &&
			message.toLowerCase() === "megabot leads") ||
		(name === "Gg" && message.toLowerCase() === "megabot leads")
	) {
		const leads = await exportLeadsToExcel(name);
		// Exit the process
		res.status(200).send("Received");
		return;
	} else if (
		// Update prices from Google drive in MongoDB
		(name === "Gustavo Gomez Villafañe" && message === "megabot precios") ||
		(name === "Gg" && message.toLowerCase() === "megabot precios")
	) {
		const prices = await updateDbPricesFromExcel(name);
		// Exit the process
		res.status(200).send("Received");
		return;
	} else {		
		next();
	}
};
