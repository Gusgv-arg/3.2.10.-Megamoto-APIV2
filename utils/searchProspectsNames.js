import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const searchProspectsNames = async (noResponses24hs) => {
	try {
		const url2 = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;
		const prospects = await axios.get(url2);

		for (let i = 0; i < noResponses24hs.length; i++) {
			let prospectId = noResponses24hs[i].senderId;
			noResponses24hs[i].firstName = " ";
			let prospectName = prospects.data.find(
				(prospect) => prospect.id === prospectId
			);

			if (prospectName) {
				noResponses24hs[i].firstName = prospectName.firstName;
			} else if (prospectName === undefined) {
				noResponses24hs[i].firstName = "Estimado";
			}
		}
		return noResponses24hs;
	} catch (error) {
		console.log("Error", error.message);
		throw error;
	}
};
