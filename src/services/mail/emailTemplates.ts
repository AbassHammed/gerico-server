import { EEmailTemplate, ITemplate, IResetPasswordTemplate, IWelcomeTemplate } from './mail';

export async function getTemplateContent(
  template: EEmailTemplate,
  data: ITemplate,
): Promise<{ subject: string; html: string }> {
  switch (template) {
    case EEmailTemplate.WELCOME: {
      const welcomeData = data as IWelcomeTemplate;
      return {
        subject: 'Welcome to Gerico HR!',
        html: await welcomeTemplate(welcomeData),
      };
    }
    case EEmailTemplate.RESET_PASSWORD: {
      const resetData = data as IResetPasswordTemplate;
      return {
        subject: 'Password Reset Request',
        html: await resetPasswordTemplate(resetData),
      };
    }
    default:
      throw new Error('Unknown email template');
  }
}

async function welcomeTemplate({
  civility,
  lastName,
  defaultPass,
}: IWelcomeTemplate): Promise<string> {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
          .header { background-color: #0073e6; color: white; padding: 20px; text-align: center; font-size: 24px; }
          .content { padding: 20px; color: #555; line-height: 1.6; }
          .button { display: inline-block; padding: 12px 20px; background-color: #0073e6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { background-color: #f4f4f4; color: #666; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Welcome to Gerico HR</div>
          <div class="content">
            <p>Dear ${civility} ${lastName},</p>
            <p>Welcome to the Gerico HR platform! We are thrilled to have you join us.</p>
            <p>Your account has been created successfully, and here is your default password:</p>
            <div style="font-size: 18px; font-weight: bold; background-color: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block;">
              ${defaultPass}
            </div>
            <p>For your security, please log in and change your password at your earliest convenience. Click the button below to get started.</p>
            <a href="https://gericohr.com/login" class="button">Log In to Gerico HR</a>
          </div>
          <div class="footer">© 2024 Gerico HR. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;
}

async function resetPasswordTemplate({
  civility,
  lastName,
  code,
}: IResetPasswordTemplate): Promise<string> {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
          .header { background-color: #0073e6; color: white; padding: 20px; text-align: center; font-size: 24px; }
          .content { padding: 20px; color: #555; line-height: 1.6; }
          .code { font-size: 18px; font-weight: bold; background-color: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block; }
          .footer { background-color: #f4f4f4; color: #666; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Password Reset Request</div>
          <div class="content">
            <p>Dear ${civility} ${lastName},</p>
            <p>We received a request to reset your password. Please use the code below to proceed with resetting your password:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 15 minutes. If you did not request a password reset, please disregard this email or contact our support team.</p>
          </div>
          <div class="footer">© 2024 Gerico HR. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;
}
