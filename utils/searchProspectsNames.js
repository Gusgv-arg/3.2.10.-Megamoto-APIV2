import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const searchProspectsNames = async (noResponses24hs) => {
	try {
		const url2 = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;
		const prospects = await axios.get(url2);
		//console.log(prospects);

		for (let i = 0; i < noResponses24hs.length; i++) {
			const prospectId = noResponses24hs[i].senderId;
			noResponses24hs[i].firstName = " "
			const prospectName = prospects.data.find(
				(prospect) => prospect.id === prospectId
			);
			console.log("prospectName", prospectName)
			if (prospectName) {
				noResponses24hs[i].firstName = prospectName.firstName;
				// Realizar operaciones con firstName
			} else {
                noResponses24hs[i].firstName = "Estimado";            
			}
            i++;
		}
		return noResponses24hs;
	} catch (error) {
		console.log("Error", error.message);
		throw error;
	}
};
