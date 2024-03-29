import XLSX from "xlsx";
import fs from "fs";
import Prices from "../models/prices.js";
import axios from "axios";

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
export const updateDbPricesFromExcel = async (req, res) => {
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
		let noPrice = "";
		// Procesa los registros de dataExcel omitiendo el encabezado
		for (let i = 1; i < dataExcel.length; i++) {
			const entrada = dataExcel[i];
			const modelo = entrada.B;
			const precio = Math.round(Number(entrada.C));

			// Verifica si el precio es un número válido antes de actualizar el modelo
			if (!isNaN(precio)) {
				const vigencia = fechaActual;
				try {
					// Actualiza el precio y la vigencia, o crea un nuevo documento si no existe
					const updatedPrice = await Prices.findOneAndUpdate(
						{ modelo: modelo },
						{ precio: precio, vigencia: vigencia },
						{ new: true, upsert: true }
					);
					updates++;
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

		// Busca y cambia isActive a los registros que están en la base pero no en el Excel
		try {
			await Prices.updateMany(
				{ vigencia: { $ne: fechaActual } },
				{ $set: { isActive: false } }
			);
		} catch (error) {
			console.error("Error al desactivar registros antiguos:", error);
		}

        // Busca los registros con isActive en false
        let registrosDesactivados
        try {
            registrosDesactivados = await Prices.find({ vigencia: { $ne: fechaActual }, isActive: false });
            console.log("Registros desactivados:", registrosDesactivados);
        } catch (error) {
            console.error("Error al buscar registros desactivados:", error);
        }
		res
			.status(200)
			.send(
				`Hay ${
					dataExcel.length - 1
				} registros en el Excel y se actualizaron ${updates} modelos.
                Faltó actualizar en MegaBot: ${noPrice}.
                ${registrosDesactivados.length} registros desactivados porque no están en el Excel: ${registrosDesactivados.map((registro)=>registro.modelo)}`
			);		
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
};
