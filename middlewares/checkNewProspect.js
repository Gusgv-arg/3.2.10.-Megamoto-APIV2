import Leads from "../models/leads.js";

const rejectedMessages = [];

export const checkNewProspect = async (req, res, next) => {
	const data = req.body;
	const prospectCreatedDate = new Date(data.prospect.created.slice(0, 10));
	const name = data.prospect?.firstName;
	const prospectId = data.prospect?.id;
	const message =
		data.interaction.output.message && data.interaction.output.message.content
			? data.interaction.output.message.content
			: data.message?.contents[0].text
			? data.message.contents[0].text
			: "No message";

	console.log(`\n${name} was created on the ${data.prospect.created.slice(0, 10)}`);

	// Target date in which the API will allow messages. 
	const targetDate = new Date("2024-02-20");

	let lead = await Leads.findOne({ id_user: prospectId });


	// Get time of creation and message
	const prospectCreatedTime = new Date(data.prospect.created).getTime();
	console.log("prospectCreatedTime",prospectCreatedDate)
	const receivedTime = new Date(data.received).getTime();
	console.log("receivedTime",receivedTime)
	const timeDifferenceInSeconds = Math.abs(
		(prospectCreatedTime - receivedTime) / 1000
	);

	// Pass if targetDate is met && if time of creation and message are < 2 seconds or if it exists in Leads
	if (
		(prospectCreatedDate >= targetDate && timeDifferenceInSeconds < 60) ||
		lead !== null ||
		name === "Gustavo Gomez Villafañe" ||
		name === "Gg"
	) {
		console.log(
			`Process continues for ${name}, created after ${targetDate} or he is in Leads DB.`
		);
		console.log(
			"prospectCreatedDate:",
			prospectCreatedDate,
			"targetDate:",
			targetDate
		);
		next();
	} else if (
		// Check if its an agent response and if its not in Leads save it with botSwitch OFF
		data.interaction.proactive === true &&
		data.interaction.hasOwnProperty("agent") &&
		lead === null
	) {
		
		const currentDateTime = new Date().toLocaleString();

		// Create Lead with botSwitch in OFF
		lead = await Leads.create({
			name: name,
			id_user: prospectId,
			channel: data.interaction.via? data.interaction.via : data.channel? data.channel : "no channel",
			content: `${currentDateTime} - Vendedor Megamoto: ${message}`,
			thread_id: "",	
			botSwitch: "OFF"			
		});
		console.log(`Exit the process && Lead created with Agent response and botSwitch in OFF for ${name}`);
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
		console.log(rejectedMessages);
		res.status(200).send("Received");
		console.log(`Exit the process for ${name}. Created before: ${targetDate}`);
		return;
	}
};
