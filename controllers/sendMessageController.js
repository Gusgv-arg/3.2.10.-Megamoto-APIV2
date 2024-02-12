import axios from "axios";
import dotenv from "dotenv"
import Leads from "../models/leads.js"

dotenv.config()

export const sendMessageToUser = async (req, res) => {
	const channel = "whatsapp"
    const miProspectId = "6596d62461f4a300081b28cb"
    
    const prospectId= "6596d62461f4a300081b28cb"
    
    const message = "Prueba envio de mensaje al cliente y apagado del switch";

    //Aca debería hacer que el switch individual se ponga en off
    
    const messageError = "Estimado, lo contactamos del equipo de soporte de Megamoto para informarle que detectamos que nuestro Asistente virtual, MegaBot, le brindó información que no es correcta. En breve lo contactará un vendedor para seguir con el proceso. !Que tenga buen día!";
    
    try {
		// Post message to the user in Zenvia
        const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

        const response = await axios.post(url, {
			content: message,
		});

        // Turn botSwitch to OFF in Leads DB
        const lead = await Leads.findOne({id_user: prospectId})
        lead.botSwitch = "OFF"
        await lead.save()


		res.status(200).send(`Mensaje enviado a ${prospectId}: ${message}. BotSwitch fue puesto en OFF.`);
	} catch (error) {
        console.log("Error enviando mensaje manual al usuario de Zenvia:", error.message)
        res.status(500).send(`Error al enviar mensaje al usuario ${prospectId}: ${error.message}`)
    }
};
