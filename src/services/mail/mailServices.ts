import Queue from 'better-queue';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { logservice } from '../loggerService';
import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

class EmailService {
  private queue: Queue;
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
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
      await this.resend.emails.send({
        from: 'Gerico Transport <support@gericotransport.fr>',
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

  public async sendLeaveRequestPendingEmail(
    to: string,
    context: {
      civility: string;
      lastName: string;
      leaveType: string;
      startDate: string;
      endDate: string;
      reason: string;
    },
  ): Promise<void> {
    await this.queueEmail({
      to,
      subject: 'Demande de congé soumise',
      template: 'leave_pending',
      context,
    });
  }

  public async sendLeaveRequestResponseEmail(
    to: string,
    context: {
      civility: string;
      lastName: string;
      statusColor: 'green' | 'red';
      status: 'acceptée' | 'refusée';
      leaveType: string;
      startDate: string;
      endDate: string;
      reason?: string;
    },
  ): Promise<void> {
    const subject =
      context.status === 'acceptée' ? 'Demande de congé acceptée' : 'Demande de congé refusée';
    const isAccepted = context.status === 'acceptée';
    await this.queueEmail({
      to,
      subject,
      template: 'leave_result',
      context: { ...context, isAccepted },
    });
  }

  public async sendReminderEmail(
    to: string,
    context: {
      civility: string;
      lastName: string;
      deadlineDate: string;
      daysLeft: string;
    },
  ): Promise<void> {
    await this.queueEmail({
      to,
      subject: 'Rappel de congé',
      template: 'leave_remain',
      context,
    });
  }

  public async sendPayslipAvailableEmail(
    to: string,
    context: {
      civility: string;
      lastName: string;
      payPeriod: string;
      depositDate: string;
      documentLink: string;
    },
  ): Promise<void> {
    await this.queueEmail({
      to,
      subject: 'Bulletin de paie disponible',
      template: 'payslip',
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

export default new EmailService();
