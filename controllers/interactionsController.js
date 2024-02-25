import dotenv from "dotenv";
import axios from "axios";
import { logError } from "../utils/logError.js";
import fs from "fs";

dotenv.config();

// Gets prospects from Zenvia
export const interactionsController = async (req, res) => {
	try {
		//Prospect interactions by id
		const prospectId = "65b87910df8c1b00080224a0";
		//const url = `https://api.getsirena.com/v1/prospect/${prospectId}/interactions?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;

		//Prospect interactions all
		const url = `https://api.getsirena.com/v1/prospects/interactions?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;

		const response = await axios.get(url);

		/* // Para guardar solo algunos campos
		const filteredProspects = response.data.map(
			({ id, created, group, firstName, status, phones, emails, leads }) => ({
				id,
				created,
				group,
				firstName,
				status,
				phones: phones[0],
				emails: emails[0],
				source: leads[0].source,
			})
		) */;

		// Preparar el contenido para guardar en un archivo .js
		const jsContent = `const interactions = ${JSON.stringify(
			response.data,
			null,
			2
		)};\n\nexport default interactions;`;

		// Guardar el contenido en un archivo .js
		fs.writeFile("excel/prospectsInteractions.js", jsContent, (err) => {
			if (err) {
				throw err;
			}
			console.log("Prospects data is saved in a .js file");
		});

		res.status(200).send("Prospects interactions saved in prospectsInteractions.js");
	} catch (error) {
		logError(error, "Hubo un error en el proceso -->");
		res.status(500).send({ error: error.message });
	}
};
