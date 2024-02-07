import XLSX from "xlsx";
import fs from "fs";

export const jsonTransformController = async (req, res) => {
	// Lee el archivo Excel
	const workbook = XLSX.readFile("excel/LISTA DE PRECIOS 1-2-24 IA.xlsx");
	const sheet_name_list = workbook.SheetNames;
	const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

	// Modifica los datos para crear un array en la propiedad "sinónimos"
	data.forEach(row => {
        if (typeof row['Sinónimos'] === 'string') {
            row['Sinónimos'] = row['Sinónimos'].split(',').map(item => item.trim());
        } else {
            row['Sinónimos'] = []; // Si no es una cadena, asigna un array vacío
        }
    });

	// Convierte los datos a JSON
	const json_data = JSON.stringify(data);

	// Guarda el JSON en un archivo
	fs.writeFileSync("excel/listadePrecios.json", json_data);

	// Imprime un mensaje de confirmación
	console.log("Archivo JSON generado con éxito.");

	res.send("json generado");
};
