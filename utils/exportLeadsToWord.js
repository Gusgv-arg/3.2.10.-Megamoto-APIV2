import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { Document, Packer, Paragraph, TextRun } from "docx";
import Leads from "../models/leads.js";

// Definir __filename y __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para dividir contenido y crear TextRun con saltos de línea antes de fechas y horas
function splitContentWithLineBreaks(content) {
    const regex = /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})/g;
    const parts = content.split(regex);
    let result = [];
    
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) { // Las fechas estarán en las posiciones impares del array
            result.push(new TextRun({
                text: '\n' + parts[i],
                break: 1
            }));
        } else {
            result.push(new TextRun(parts[i]));
        }
    }
    
    return result;
}

export const exportLeadsToWord = async (req, res, next) => {
    try {
        // Obtener los datos de Leads
        let leads = await Leads.find({});

        // Crear párrafos a partir de los datos de los leads, ajustando el contenido
        const paragraphs = leads.map((user) => 
            new Paragraph({
                children: [
                    new TextRun({
                        text: `ID Usuario: ${user.id_user} - `,
                        bold: true,
                        break: 1
                    }),
                    new TextRun({
                        text: `Nombre: ${user.name} - `,
                        bold: true,
                        break: 1
                    }),
                    ...splitContentWithLineBreaks(user.content),
                    new TextRun({
                        text: '\n\n',
                    })
                ],
            })
        );

        // Crear el documento de Word con configuración inicial y los párrafos
        let doc = new Document({
            sections: [{
                properties: {}, // Propiedades de la sección (puedes añadir más configuraciones aquí si es necesario)
                children: paragraphs // Agrega los párrafos directamente aquí
            }]
        });

        // Definir la ruta de salida (un nivel arriba)
        const outputDirectory = path.resolve(__dirname, '../exports');
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }
        const outputPath = path.join(outputDirectory, 'Leads.docx');

        // Generar el buffer y escribir el archivo
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(outputPath, buffer);

        console.log(`Leads DB exported to ${outputPath}`);
        if (res) {
            res.status(200).send("Leads.docx created!");
        }
    } catch (error) {
        console.error("An error occurred while exporting leads to Word:", error);
        if (next) {
            next(error);
        }
    }
};
