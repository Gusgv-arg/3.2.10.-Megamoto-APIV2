import Leads from "../models/leads.js";

const rejectedMessages = [];

export const checkNewProspect = async (req, res, next) => {
	const data = req.body;
	const targetDate = new Date(req.lastDateSwitchON);
	const prospectCreatedDate = new Date(data?.prospect?.created || new Date());
	const name = data?.prospect?.firstName
		? data.prospect.firstName
		: data.message?.visitor?.name
		? data.message.visitor.name
		: data.webUser
		? data.webUser
		: "No name";
	const prospectId = data?.prospect?.id ? data.prospect.id : data.webUser;
	const message =
		data.interaction?.output?.message &&
		data?.interaction?.output?.message?.content
			? data.interaction.output.message.content
			: data.message?.contents[0].text
			? data.message.contents[0].text
			: data.webMessage
			? data.webMessage
			: "No message";

	console.log(
		`\n${name} was created the ${prospectCreatedDate.toLocaleString()}`
	);

	// Target date in which the API will allow messages.
	console.log("Date since MegaBot is on:", targetDate.toLocaleString());

	// Check if its in Leads because it has to do next()
	let lead = await Leads.findOne({ id_user: prospectId });

	// Get time of creation and message
	const prospectCreatedTime = new Date(data.prospect?.created || new Date());
	console.log("ProspectCreatedTime:", prospectCreatedTime.toLocaleString());

	const receivedTime = new Date();
	console.log("ReceivedTime:", receivedTime.toLocaleString());

	const timeDifferenceInSeconds = Math.abs(
		(prospectCreatedTime - receivedTime) / 1000
	);
	console.log("Difference in seconds:", timeDifferenceInSeconds);

	// Pass if targetDate is met && if time of creation and message are < 60 seconds or if it exists in Leads
	if (
		(prospectCreatedDate >= targetDate && timeDifferenceInSeconds < 60) ||
		name === "Gustavo Gomez Villafañe" ||
		name === "Gg" ||
		name === "Pablo Rudkiw" || data?.webUser
	) {
		console.log(
			`${name} continues. Creation date: ${prospectCreatedDate.toLocaleString()}. MegaBot turned ON: ${targetDate.toLocaleString()}.`
		);
		next();
	} else if (lead !== null) {
		console.log(`${name} continues because he is already in Leads DB.`);
		next();
	} else if (
		// Check if its an agent response and if its not in Leads save it with botSwitch OFF
		data?.interaction?.proactive === true &&
		data?.interaction.hasOwnProperty("agent") &&
		lead === null
	) {
		const currentDateTime = new Date().toLocaleString();

		// Create Lead with botSwitch in OFF
		lead = await Leads.create({
			name: name,
			id_user: prospectId,
			channel: data?.interaction?.via
				? data.interaction.via
				: data?.channel
				? data.channel
				: data?.webUser
				? "web"
				: "no channel",
			content: `${currentDateTime} - Vendedor Megamoto: ${message}`,
			thread_id: "",
			botSwitch: "OFF",
		});
		console.log(
			`Exit. Lead created with Agent response and botSwitch in OFF for ${name}`
		);
		res.status(200).send("Received");
		return;
	} else {
		console.log(
			"prospectCreatedDate:",
			prospectCreatedDate,
			"targetDate:",
			targetDate
		);
		//console.log("Mensaje q reboto--->", data);
		rejectedMessages.push({
			name: name,
			id: prospectId,
			creation_date: data.prospect.created,
			message_date: data.received,
			message: message,
		});
		console.log("Rejected:", rejectedMessages);
		res.status(200).send("Received");
		console.log(
			`Exit the process for ${name}. Created: ${prospectCreatedDate}. Target: ${targetDate}`
		);
		return;
	}
};
