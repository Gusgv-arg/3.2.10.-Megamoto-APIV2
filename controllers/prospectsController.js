import dotenv from "dotenv";
import axios from "axios";
import { logError } from "../utils/logError.js";
import fs from 'fs'; 
import { analyzeProspects } from "../analisis/prospectAnalisis.js";
import prospects from "../excel/prospectsData.js"

dotenv.config();

// Gets prospects from Zenvia and saves it in prospectData.js and counts by group, status and origin
export const prospectController = async (req, res)=>{
    try {
        const url = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;
        
               
        const phoneNumber="+5491161405589"
        //const url = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}&phoneNumber=${phoneNumber}`;
        
        const group = "628d15e99cb6020018237d2c";
        //const url = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}&group=${group}`;
                       
        //Channels
        //const url = `https://api.getsirena.com/v1/messaging/channels?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;
        
        //Returns a list of groups and users the App can transfer prospects to.
        //const url = `https://api.getsirena.com/v1/as-user/transfer?api-key=${process.env.ZENVIA_API_TOKEN_PROSPECTS}`;

		const response = await axios.get(url);       

        //Si quiero hacer análisis de cantidades por Grupos, Status y orígen del lead
         // Preparar el contenido para guardar en un archivo .js
         const jsContent = `const prospects = ${JSON.stringify(response.data, null, 2)};\n\nexport default prospects;`;
        
         // Guardar el contenido en un archivo .js
         fs.writeFile('excel/prospectsData.js', jsContent, (err) => {
             if (err) {
                 throw err;
             }
             console.log('Prospects data is saved in a .js file.');
         });
        
         const analisis = analyzeProspects(prospects)

        res.status(200).send({Título: "Se guardaron todos los prospectos en el archivo prospectsData.js. Se muestran cantidades por Grupo, Status y Orígen.",analisis})

    } catch (error) {
        logError(error, "Hubo un error en el proceso -->");
		res.status(500).send({ error: error.message });
    }
}