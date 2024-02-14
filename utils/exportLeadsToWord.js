import fs from "fs";
import { Document, Packer, Paragraph, TextRun } from "docx";
import Leads from "../models/leads.js";

export const exportLeadsToWord = async (req, res, next) => {
	try {
		let doc = new Document();
		let leads = await Leads.find({});

		// Aquí almacenarás todos los párrafos
		const paragraphs = leads.forEach(
			(user) =>
				new Paragraph({
					children: [
						new TextRun(`ID Usuario: ${user.id_user} - `),
						new TextRun(`Nombre: ${user.name} - `),
						new TextRun(`Mensaje: ${user.content}`),
					],
				})
		);

		// Agrega una sección al documento con todos los párrafos
		doc.addSection({
			properties: {},
			children: paragraphs, // Usa los párrafos creados a partir del array
		});

		// Genera el buffer y escribe el archivo una sola vez
		const buffer = await Packer.toBuffer(doc);
		fs.writeFileSync("Leads.docx", buffer);

		console.log("Leads DB exported to Leads.docx");
		res.status(200).send("Leads.docx created!");
	} catch (error) {
		console.error("An error occurred while exporting leads to Word:", error);
		next(error);
	}
};
