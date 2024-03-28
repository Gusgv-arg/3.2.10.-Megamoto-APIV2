import XLSX from "xlsx";
import fs from "fs";
import { precios } from "../excel/listaDePrecios.js";
const archivoExcel = "../excel/LISTA DE PRECIOS 20-03-2024.xlsx";

// Función para leer el archivo Excel y convertirlo en un JSON
function leerExcel(archivo) {
	const workbook = XLSX.readFile(archivo);
	const workbookSheets = workbook.SheetNames;
	const sheet = workbookSheets[0];
	const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
	return dataExcel;
}

// Función para actualizar los precios y agregar la propiedad vigencia
function actualizarPreciosDesdeExcel(archivoExcel) {
	const dataExcel = leerExcel(archivoExcel);
	const fechaActual = new Date().toLocaleDateString("es-ES", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	const noPrices = [];

	precios.forEach((modelo) => {
		const entradaExcel = dataExcel.find(
			(entrada) => entrada.Modelo === modelo.modelo
		);

		if (entradaExcel) {
			//console.log(`Actualizando modelo: ${modelo.modelo} con precio de ${modelo.precio} a un precio de ${entradaExcel.Precio}`);
			modelo.precio = Math.round(entradaExcel.Precio);
			modelo.vigencia = fechaActual;
		} else {
			modelo.precio = "Precio no encontrado";
			noPrices.push(modelo.modelo);
		}
	});
	// Overwrites listaDePrecios.js
	const pathListaDePrecios = "../excel/listaDePrecios.js";
	const contenidoExportacion = `export const precios = ${JSON.stringify(
		precios,
		null,
		2
	)};`;

	fs.writeFile(pathListaDePrecios, contenidoExportacion, "utf8", (error) => {
		if (error) {
			console.error("Error al escribir el archivo:", error);
		} else {
			console.log(
				`Precios actualizados correctamente en listaDePrecios.js. Hay ${noPrices.length} modelo/s no actualizado/s ->${noPrices}`
			);
		}
	});

	// Find models in Excel file that are not in json
	const modelosNoEncontrados = dataExcel.filter(
		(entrada) => !precios.some((modelo) => modelo.modelo === entrada.Modelo)
	);

	if (modelosNoEncontrados.length > 0) {
		console.log(
			`Modelos encontrados en el Excel pero no en el array de precios: ${modelosNoEncontrados
				.map((entrada) => entrada.Modelo)
				.join(", ")}`
		);
	} else {
    console.log("No existen modelos en el excel que no estén el json.")
  }
}

// Ejecuta la función con el nombre de tu archivo Excel
actualizarPreciosDesdeExcel(archivoExcel);

// Si necesitas exportar los precios actualizados, puedes hacerlo aquí.
// Por ejemplo, escribiendo el JSON actualizado a un nuevo archivo o lo que necesites.
