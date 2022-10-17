import * as nodemailer from 'nodemailer';

export class MailService {
  async sendMail(config: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'huynvth2001006@fpt.edu.vn',
        pass: '100224081004miss',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      await transporter.sendMail(config);
    } catch (error) {
      console.log(error);
    }
  }
}
