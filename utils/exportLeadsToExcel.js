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
		
		// Crea un nuevo libro de trabajo
		const wb = xlsx.utils.book_new();
		
		// Convierte los datos a hoja de trabajo
		const ws = xlsx.utils.json_to_sheet(leadsForXlsx);
		
		// Añade la hoja de trabajo al libro
		xlsx.utils.book_append_sheet(wb, ws, "Leads");
		
		// Escribe el libro en un archivo .xlsx
		xlsx.writeFile(wb, 'excel/Leads.xlsx');
		console.log("Leads DB exported to Leads.xls");
		
		// Obtiene la ruta del directorio actual de forma compatible con ES Modules
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const filePath = path.join(__dirname, '../excel/Leads.xlsx');
		
		const dirDeploy = "https://github.com/Gusgv-arg/3.2.10.-Megamoto-APIV2/tree/main/excel/Leads.xlsx"

		// Mandar el mail
		//sendLeadsByMail(filePath, name) // Para enviar desde localhost
		sendLeadsByMail(dirDeploy, name) // Para enviar desde producción
		
        //res.status(200).sendFile(filePath);
		//res.status(200).send("Leads.xls created!");
		//res.status(200).send("Archivo Leads enviado por mail a Gustavo Glunz");

	} catch (error) {
		console.error("An error occurred while exporting leads to Excel:", error);
		throw error;
	}
};
