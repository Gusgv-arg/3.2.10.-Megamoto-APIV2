import dotenv from "dotenv";
import axios from "axios";
import { logError } from "../utils/logError.js";
import fs from "fs";
import { analyzeProspects } from "../analisis/prospectAnalisis.js";
import { analyzeProspectsData } from "../analisis/unclaimedAnalisis.js";


dotenv.config();

// Gets prospects from Zenvia, saves data in different files (prospectsData.js, allUnclaimedProspects.js and unclaimedProspectsToBeContacted). Makes 2 analisys: 1) Counts by group, status and origin. 2) Counts unclaimed per day 
export const prospectsController = async (req, res) => {
	try {
		const url = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;

		const response = await axios.get(url);
		
		// Prepare the response to save in a .js file. This will allow global analysis
		const jsContent = `const prospects = ${JSON.stringify(
			response.data,
			null,
			2
		)};\n\nexport default prospects;`;

		// Guardar el contenido en un archivo .js
		fs.writeFile("excel/prospectsData.js", jsContent, (err) => {
			if (err) {
				throw err;
			}
			console.log("Prospects data is saved in a .js file.");
		});			

		// Para guardar solo algunos campos
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
		);
		console.log(filteredProspects)

		// Filter and save ALL unclaimed prospects
		const allUnclaimedProspects = filteredProspects.filter(
			(prospect) => prospect.status === "unclaimed"
		);

		console.log("Unclaimed total:", allUnclaimedProspects.length);

		const JsContent = `const allUnclaimedProspects = ${JSON.stringify(
			allUnclaimedProspects,
			null,
			2
		)};\n\nexport default allUnclaimedProspects;`;

		fs.writeFile("excel/allUnclaimedProspects.js", JsContent, (err) => {
			if (err) {
				throw err;
			}
			console.log("All unclaimed prospects data is saved in a .js file.");
		});

		// Filter and save "unclaimed" to be contacted before 24hs
		const unclaimedProspectsToBeContacted = filteredProspects.filter(
			(prospect) => {
				const prospectCreatedTime = new Date(prospect.created);
				const currentTime = new Date();
				const timeDiff = currentTime - prospectCreatedTime;
				const timeDiffInHours = timeDiff / (1000 * 60 * 60); // Convertir la diferencia a horas

				return prospect.status === "unclaimed" && timeDiffInHours < 24;
			}
		);

		console.log(
			"Unclaimed a contactar:",
			unclaimedProspectsToBeContacted.length
		);

		const filteredJsContent = `const unclaimedProspectsToBeContacted = ${JSON.stringify(
			unclaimedProspectsToBeContacted,
			null,
			2
		)};\n\nexport default unclaimedProspectsToBeContacted;`;

		fs.writeFile(
			"excel/unclaimedProspectsToBeContacted.js",
			filteredJsContent,
			(err) => {
				if (err) {
					throw err;
				}
				console.log("Filtered prospects data is saved in a .js file.");
			}
		);

		//Makes analysis from prospects.
		const analisis = analyzeProspects();
		const analisis2 = analyzeProspectsData()

		res.status(200).send({
			Título:
				"Se guardaron prospectos a ser contactados en unclaimedProspectsToBeContacted.js; y todos los prospectos en allUnclaimedProspects.js. Se muestran cantidades por Grupo, Status y Orígen.",
			analisis,
			analisis2
		});
	} catch (error) {
		logError(error, "Hubo un error en el proceso -->");
		res.status(500).send({ error: error.message });
	}
};
