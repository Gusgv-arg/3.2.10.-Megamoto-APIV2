import Leads from "../models/leads.js";

const filterDate = new Date("2024-02-07");

export const findData = async (req, res) => {
	try {
		const dataToBeFound = await Leads.find({ createdAt: { $gt: filterDate } });
		res.status(200).send(dataToBeFound);
	} catch (error) {
		console.log(
			"An error has ocurred while trying to erase data from Leads DB. ",
			error.message
		);
	}
};
