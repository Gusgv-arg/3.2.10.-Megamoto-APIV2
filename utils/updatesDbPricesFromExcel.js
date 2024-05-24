import XLSX from "xlsx";
import fs from "fs";
import Prices from "../models/prices.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Función para leer el archivo Excel desde Google Drive
async function leerExcel(archivoURL) {
	const response = await axios.get(archivoURL, { responseType: "arraybuffer" });
	const data = new Uint8Array(response.data);
	const workbook = XLSX.read(data, { type: "array" });
	const workbookSheets = workbook.SheetNames;
	const sheet = workbookSheets[0];
	let dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
	dataExcel = dataExcel.filter((objeto) => objeto.A);
	return dataExcel;
}

// Función para actualizar los precios y agregar la propiedad vigencia
export const updateDbPricesFromExcel = async (name) => {
	try {
		// URL del archivo de precios compartido en Google Drive
		const archivoExcelURL =
			"https://docs.google.com/spreadsheets/d/1yD7ab4z94jzcfOkeIjKrtvuVoJabq5foJzP0lIqGVtI/edit?usp=sharing";

		const dataExcel = await leerExcel(archivoExcelURL);

		const fechaActual = new Date().toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});

		// Actualiza el modelo Prices con la información del Excel
		let updates = 0;
		let noPrice = 0;
		let qNewModels = 0;
		let updatedModels = [];
		let newModels = [];

		// Procesa los registros de dataExcel omitiendo el encabezado
		for (let i = 1; i < dataExcel.length; i++) {
			const entrada = dataExcel[i];
			const modelo = entrada.B;
			const precio = Math.round(Number(entrada.C));
			const cilindradas = entrada.D ? entrada.D : "";
			const url = entrada.E ? entrada.E : "";

			// Verifica si el precio es un número válido antes de actualizar el modelo
			if (!isNaN(precio)) {
				const vigencia = fechaActual;
				try {
					// Actualiza el precio y la vigencia, o crea un nuevo documento si no existe. Tambien actualiza url  cilindradas si están en el excel
					const updatedPrice = await Prices.findOneAndUpdate(
						{ modelo: modelo },
						{ precio: precio, vigencia: vigencia },
						{ new: true, upsert: true, rawResult: true }
					);

					// Identifico los modelos nuevos
					if (updatedPrice.lastErrorObject.upserted) {
						console.log(
							"Se creó un nuevo registro con modelo:",
							updatedPrice.value.modelo
						);
						newModels.push(updatedPrice.value.modelo)
						qNewModels++;
					}
					
					// Identifico los modelos actualizados
					updatedModels.push({ modelo, precio });
					updates++;

					if (cilindradas !== "") {
						const updatedCC = await Prices.findOneAndUpdate(
							{ modelo: modelo },
							{ cilindradas: cilindradas }
						);
					}
					if (url !== "") {
						const updatedURL = await Prices.findOneAndUpdate(
							{ modelo: modelo },
							{ url: url }
						);
					}
				} catch (error) {
					console.error("Error al actualizar o crear el documento:", error);
				}
			} else {
				console.error("Precio no válido para el modelo:", modelo);
				(noPrice = noPrice + " "), +modelo;
			}
		}
		console.log(
			`Hay ${
				dataExcel.length - 1
			} registros en el Excel y se actualizaron ${updates} modelos. Faltó actualizar en MegaBot: ${noPrice}.`
		);

		// Crear una lista de modelos presentes en el Excel
		let modelosEnExcel = dataExcel.map((entrada) => entrada.B);

		// Busca y cambia isActive false a los registros que están en la base pero no en el Excel
		try {
			await Prices.updateMany(
				{ modelo: { $nin: modelosEnExcel } },
				{ $set: { isActive: false } }
			);
		} catch (error) {
			console.error("Error al desactivar registros antiguos:", error);
		}

		// Busca los registros con isActive en false
		let registrosDesactivados;
		try {
			registrosDesactivados = await Prices.find({
				isActive: false,
			});
			console.log("Registros desactivados:", registrosDesactivados);
		} catch (error) {
			console.error("Error al buscar registros desactivados:", error);
		}

		// Notify the user in Zenvia
		const channel = "whatsapp";
		let prospectId;
		if (name === "Gustavo Gomez Villafañe") {
			prospectId = "6596d62461f4a300081b28cb";
		} else if (name === "Gg") {
			prospectId = "640f3ca9d5b0fcf829d24a3b";
		}

		const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

		const response = await axios.post(url, {
			content: `- Hay ${
				dataExcel.length - 1
			} registros en el Excel y se actualizaron ${updates} modelos en MegaBot.\n- Listado de modelos actualizados:\n ${updatedModels.map(
				(model) => " " + model.modelo + ": $" + model.precio
			)}\n- Faltó actualizar en MegaBot: ${noPrice}  modelo/s.\n- ${
				registrosDesactivados.length
			} registros desactivados en MegaBot porque no están en el Excel: ${registrosDesactivados.map(
				(registro) => registro.modelo
			)}\n${qNewModels} modelos nuevos que están en el Excel y no estaban en MegaBot: ${newModels.map((newModel)=>newModel.modelo)}`,
		});
	} catch (error) {
		// Notify the user in Zenvia
		const channel = "whatsapp";
		let prospectId;
		if (name === "Gustavo Gomez Villafañe") {
			prospectId = "6596d62461f4a300081b28cb";
		} else if (name === "Gg") {
			prospectId = "640f3ca9d5b0fcf829d24a3b";
		}

		const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

		const response = await axios.post(url, {
			content: error.message,
		});
	}
};
