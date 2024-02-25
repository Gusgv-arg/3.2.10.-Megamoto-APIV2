import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";
import { logError } from "../utils/logError.js";
import { saveUnclaimedInDb } from "./saveUnclaimedInDb.js";

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
	apiKey: API_KEY,
});

export const sendMessageToUnclaimed = async (unclaimedToContact) => {
	
	// Tomar el array de unclaimed y para c/u
	unclaimedToContact.forEach(async (newLead) => {
		try {
			// Crear el thread
			let threadId;
			const thread = await openai.beta.threads.create();
			threadId = thread.id;

			// Agregar el mensaje al thread
			const greeting = `¡Hola ${newLead.firstName}! 👋 Soy MegaBot, Asistente Virtual de Megamoto. Estoy para ayudarte a comprar tu moto agilizando la atención por parte de nuestros vendedores. A veces me equivoco; por lo que agradezco tu paciencia. ¿Comenzamos por saber que moto estas buscando? 😀`;

			await openai.beta.threads.messages.create(
				threadId,
				{ role: "user", content: "Hola" },
				{
					role: "assistant",
					content: greeting,
				}
			);
            
            // Guardar en mi BD creando un lead
			await saveUnclaimedInDb(newLead, threadId, greeting);
			
            // Hacer el post a Zenvia
            //const prospectId = "6596d62461f4a300081b28cb" //soy yo;
            const prospectId = newLead.senderId;
            const channel= newLead.source.toLowerCase()
		
            let url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;
            
            const response = await axios.post(url, { content: greeting });
    
            const firstFiveWords = greeting.split(" ").slice(0, 5).join(" ");
            
            if (response.data) {
                console.log(`${newLead.firstName} was contacted by MegaBot: "${firstFiveWords}..."`);
            } else {
                console.log(`13. Error contacting unclaimed ${newLead.firstName}`);
            }

		} catch (error) {
			logError(error, "Hubo un error en el proceso -->");
		}
	});
};
