import nodemailer, { Transporter } from 'nodemailer';
import { IEmailConfig, EEmailTemplate, ITemplate } from './mail';
import { getTemplateContent } from './emailTemplates';
import { logservice } from '../loggerService';

class EmailService {
  private transporter: Transporter;

  constructor(config: IEmailConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: {
        user: config.auth.user,
        pass: config.auth.password,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: '"Ressources Humaines Gerico" <abasshammedola@gmail.com>',
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      logservice.error('Error sending email:', error);
      return false;
    }
  }

  async sendTemplatedEmail(
    to: string,
    template: EEmailTemplate,
    data: ITemplate,
  ): Promise<boolean> {
    const { subject, html } = await getTemplateContent(template, data);
    return this.sendEmail(to, subject, html);
  }
}

export default new EmailService({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
  },
});
