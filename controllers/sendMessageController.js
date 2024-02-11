import axios from "axios";
import dotenv from "dotenv"

dotenv.config()

export const sendMessageToUser = async (req, res) => {
	const channel = "whatsapp"
    const miProspectId = "6596d62461f4a300081b28cb"
    
    const prospectId= "65c669441c36b60008a2170c"
    
    const message = "Estimado José, lo contactamos del equipo de soporte de Megamoto para informarle que detectamos que nuestro Asistente virtual, MegaBot, le brindó información que no es correcta. En breve lo contactará un vendedor para seguir con el proceso. !Que tenga buen día!";
    
    try {
		const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

        const response = await axios.post(url, {
			content: message,
		});
		res.status(200).send(`Mensaje enviado a ${prospectId}: ${message}`);
	} catch (error) {
        console.log("Error enviando mensaje manual al usuario de Zenvia:", error.message)
        res.status(500).send(`Error al enviar mensaje al usuario ${prospectId}: ${error.message}`)
    }
};
