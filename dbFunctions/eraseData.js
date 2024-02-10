import Leads from "../models/leads.js";

const filterDate = new Date("2024-02-07");

export const eraseData = async (req, res) => {
	try {
		const dataToBeErased = await Leads.deleteMany({ createdAt: { $gt: filterDate } });

        res.status(200).send(dataToBeErased)     
	} catch (error) {
		console.log("An error while trying to erase", error.message);
	}
};
