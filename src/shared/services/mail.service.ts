import * as nodemailer from 'nodemailer';

export class MailService {
  async sendMail(config: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'huynvth2001006@fpt.edu.vn',
        pass: '100224081004mis',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail(config);
  }
}
