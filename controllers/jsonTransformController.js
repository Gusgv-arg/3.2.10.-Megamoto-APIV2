import pdfParse from 'pdf-parse';

export const jsonTransformController = async (req, res) => {
console.log(req.body)
    try {
        if (!req.body || !req.body.pdfData) {
            return res.status(400).send('No PDF data provided.');
        }

        // Aquí asumimos que el PDF viene como un string en base64 en el cuerpo de la solicitud
        const pdfBuffer = Buffer.from(req.body.pdfData, 'base64');

        const data = await pdfParse(pdfBuffer);

        // Aquí necesitarás implementar una función que procese el texto extraído
        // y lo convierta en un array de objetos con las propiedades deseadas.
        // Esta es una tarea compleja y depende del formato exacto del texto en el PDF.
        const jsonArray = processExtractedText(data.text);

        res.status(200).send(jsonArray);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Esta es una función de ejemplo que tendrás que implementar según el formato de tu PDF
function processExtractedText(text) {
    // Implementa la lógica para procesar el texto y extraer las filas y columnas
    // Esto puede implicar el uso de expresiones regulares, búsqueda de patrones, etc.
    // El siguiente código es solo un esqueleto para empezar.
    const lines = text.split('\n');
    const jsonArray = [];

    for (const line of lines) {
        // Aquí deberías tener una lógica para dividir cada línea en sus partes constituyentes
        // y luego mapear esas partes a las propiedades del objeto.
        const parts = line.split(' '); // Esto es muy probablemente incorrecto y solo es un ejemplo
        if (parts.length === 4) {
            jsonArray.push({
                modelo: parts[0],
                precioContado: parts[1],
                precioBsAs: parts[2],
                precioCaba: parts[3]
            });
        }
    }

    return jsonArray;
}