import path from 'path'; 
import { fileURLToPath } from 'url';
import xlsx from "xlsx";
import Leads from "../models/leads.js";
import { sendLeadsByMail } from './sendLeadsByMail.js';


//export const exportLeadsToExcel = async (req, res, next) => {
export const exportLeadsToExcel = async (name) => {
	//const data = req.body
	//const name = data.prospect.firstName

	if (name === "Gustavo Gomez Villafañe"){
		name = "gusgvillafane@gmail.com"
	} else if(name === "Gg"){
		name = "gustavoglunz@gmail.com"
	}
	
	try {
		// Obtén todos los leads de la base de datos
		const leads = await Leads.find({});
		
		// Convierte los leads a un formato que xlsx pueda entender
		const leadsForXlsx = leads.map((lead) => ({
			name: lead.name,
			channel: lead.channel,
			content: lead.content,
			id_user: lead.id_user,
			createdAt: lead.createdAt,
		}));
		
		const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(leadsForXlsx);
        xlsx.utils.book_append_sheet(wb, ws, "Leads");
        
        // Define un nombre de archivo temporal para el archivo Excel
        const tempFilePath = 'excel/Leads.xlsx';
        xlsx.writeFile(wb, tempFilePath);
        console.log("Leads DB exported to Leads.xlsx");
        
        // Obtiene la ruta completa del archivo temporal
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.join(__dirname, '../', tempFilePath);
        
        // Envía el archivo por correo electrónico
        await sendLeadsByMail(filePath, name);                

	} catch (error) {
		console.error("An error occurred while exporting leads to Excel:", error);
		throw error;
	}
};
