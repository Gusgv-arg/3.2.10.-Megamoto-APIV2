import XLSX from "xlsx";
import fs from "fs";

let precios = [];

export const jsonTransformController = async (req, res) => {
    try {
        const workbook = XLSX.readFile("excel/LISTA DE PRECIOS 23-2-24 IA.xlsx");
        const sheet_name_list = workbook.SheetNames;
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        precios = data.reduce((acc, item) => {
            const familia = String(item.Familia);
            const existingFamilia = acc.find(
                (fam) => fam.familia === familia
            );
            if (existingFamilia) {
                existingFamilia.modelos.push({
                    modelo: item.Modelo,
					marca: item.Marca,
                    precio: item.Precio,
                });
            } else {
                acc.push({
                    familia: familia,
                    modelos: [
                        { modelo: item.Modelo, marca: item.Marca, precio: item.Precio },
                    ],
                });
            }
            return acc;
        }, []);

        const json_data = `export const precios = ${JSON.stringify(precios)};`;

        fs.writeFileSync("excel/listaDePrecios.js", json_data);

        console.log("Archivo JSON generado con éxito.");
        res.status(200).send(json_data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};