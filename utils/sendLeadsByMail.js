import axios from "axios"
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: process.env.SMTP_EMAIL,
		pass: process.env.SMTP_PASSWORD,
	},
});

// Función para enviar el archivo por correo electrónico
export const sendLeadsByMail = async (filePath, name) => {
	const mailOptions = {
		from: process.env.SMTP_EMAIL,
		to: name,
		subject: "Excel con respuestas de MegaBot",
		text: "Adjunto el archivo Excel con las respuestas de MegaBot.",
		attachments: [
			{
				filename: "Leads.xlsx",
				path: filePath,
			},
		],
	};

	try {
		let info = await transporter.sendMail(mailOptions);

		// Notify the user in Zenvia
		const channel = "whatsapp";
		let prospectId;
		if (name === "gusgvillafane@gmail.com") {
			prospectId = "6596d62461f4a300081b28cb";
		} else if(name==="gustavoglunz@gmail.com"){
			prospectId = "6596d62461f4a300081b28cb";            
        }

		const url = `https://api.getsirena.com/v1/prospect/${prospectId}/messaging/${channel}?api-key=${process.env.ZENVIA_API_TOKEN}`;

		const response = await axios.post(url, {
			content: `Se envió Leads.xlsx a ${name}`,
		});

		console.log("Correo enviado: %s", info.messageId);
	} catch (error) {
		console.error("Error al enviar correo:", error);
		throw error;
	}
};
