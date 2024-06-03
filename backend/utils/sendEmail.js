import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

const sendEmail = async (option) => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      }); 
    
    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: option.email,
        subject: option.subject,
        html: option.message,
    };

    await transport.sendMail(message);
};

export default sendEmail;

