import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: process.env.SMTP_EMAIL,
		pass: process.env.SMTP_PASSWORD
	},
});

// Función para enviar el archivo por correo electrónico
export const sendLeadsByMail = async (filePath, name) => {
    const mailOptions = {
        from: process.env.SMTP_EMAIL, 
        to: name, 
        subject: 'Excel con respuestas de MegaBot', 
        text: 'Adjunto el archivo Excel con las respuestas de MegaBot.',
        attachments: [
            {
                filename: 'Leads.xlsx', 
                path: filePath 
            }
        ]
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', info.messageId);
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw error
    }
}