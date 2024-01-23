import dotenv from "dotenv";
import axios from "axios";
import { logError } from "../utils/logError.js";

dotenv.config();

// Gets prospects from Zenvia
export const prospectController = async (req, res)=>{
    try {
        const url = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN}`;
        
        const agent = "5ed51c5b44ae9e00047330b2"
        //const url = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN}&agent=${agent}`;
        
        const phoneNumber="+5491161405589"
        //const url = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN}&phoneNumber=${phoneNumber}`;
        
        const group = "628d15e99cb6020018237d2c";
        //const url = `https://api.getsirena.com/v1/prospects?api-key=${process.env.ZENVIA_API_TOKEN}&group=${group}`;
        
        //Prospect interactions by id
        const prospectId = "65a3b2f311281a000a329ca6"
        //const url = `https://api.getsirena.com/v1/prospect/${prospectId}/interactions?api-key=${process.env.ZENVIA_API_TOKEN}`;
        
        //Prospect interactions
        //const url = `https://api.getsirena.com/v1/prospects/interactions?api-key=${process.env.ZENVIA_API_TOKEN}`;
        
        //Channels
        //const url = `https://api.getsirena.com/v1/messaging/channels?api-key=${process.env.ZENVIA_API_TOKEN}`;
        
        //Returns a list of groups and users the App can transfer prospects to.
        //const url = `https://api.getsirena.com/v1/as-user/transfer?api-key=${process.env.ZENVIA_API_TOKEN}`;

		const response = await axios.get(url);
                
        res.status(200).send(response.data)

    } catch (error) {
        logError(error, "Hubo un error en el proceso -->");
		res.status(500).send({ error: error.message });
    }
}