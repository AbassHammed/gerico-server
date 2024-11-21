import nodemailer, { Transporter } from 'nodemailer';
import Queue from 'better-queue';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { logservice } from '../loggerService';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

class EmailService {
  private transporter: Transporter;
  private queue: Queue;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport(config);
    this.queue = new Queue(
      async (task: EmailOptions, cb) => {
        try {
          await this.processEmail(task);
          cb(null, true);
        } catch (error) {
          cb(error as Error, null);
        }
      },
      {
        maxRetries: 3,
        retryDelay: 1000,
        maxTimeout: 30000,
      },
    );
  }

  private async processEmail(options: EmailOptions): Promise<void> {
    try {
      const html = await this.renderTemplate(options.template, options.context);
      await this.transporter.sendMail({
        from: '"Ressources Humaines Gerico" <abasshammedola@gmail.com>',
        to: options.to,
        subject: options.subject,
        html,
      });
    } catch (error) {
      logservice.error('Error sending email:', error);
      throw error;
    }
  }

  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    const templatePath = path.join(__dirname, '.', 'templates', `${templateName}.hbs`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(context);
  }

  public queueEmail(options: EmailOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push(options, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async sendWelcomeEmail(
    to: string,
    context: { civility: string; lastName: string; defaultPass: string },
  ): Promise<void> {
    await this.queueEmail({
      to,
      subject: 'Bienvenue chez Gerico',
      template: 'welcome',
      context,
    });
  }

  public async sendResetPasswordEmail(
    to: string,
    context: { civility: string; lastName: string; code: string },
  ): Promise<void> {
    await this.queueEmail({
      to,
      subject: 'Réinitialisation de votre mot de passe',
      template: 'reset_password',
      context,
    });
  }

  public async sendConnectionAlertEmail(
    to: string,
    context: {
      civility: string;
      lastName: string;
      loginDate: string;
      operatingSystem: string;
      browser: string;
    },
  ): Promise<void> {
    await this.queueEmail({
      to,
      subject: 'Nouvelle connexion détectée',
      template: 'connection_alert',
      context,
    });
  }
}

export default new EmailService({
  host: process.env.MAIL_HOST as string,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
  },
});
