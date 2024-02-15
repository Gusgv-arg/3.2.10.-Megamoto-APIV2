import Leads from "../models/leads.js";

const filterDate = new Date("2024-02-14");

const nextDay = new Date(filterDate);
nextDay.setDate(filterDate.getDate() + 1); // Incrementa un día para incluir hasta el final del día

export const eraseData = async (req, res) => {
	try {
		//const dataToBeErased = await Leads.deleteMany({ createdAt: { $gt: filterDate } });
		const dataToBeErased = await Leads.deleteMany({ createdAt: { $gte: filterDate, $lt: nextDay } });

        res.status(200).send(dataToBeErased)     
	} catch (error) {
		console.log("An error while trying to erase", error.message);
	}
};
