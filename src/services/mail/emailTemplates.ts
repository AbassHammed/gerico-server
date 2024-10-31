import {
  EEmailTemplate,
  ITemplate,
  IResetPasswordTemplate,
  IWelcomeTemplate,
  INewConnectionAlert,
} from './mail';

export async function getTemplateContent(
  template: EEmailTemplate,
  data: ITemplate,
): Promise<{ subject: string; html: string }> {
  switch (template) {
    case EEmailTemplate.WELCOME: {
      const welcomeData = data as IWelcomeTemplate;
      return {
        subject: 'Welcome to Gerico',
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
    case EEmailTemplate.CONNECTION_ALERT: {
      const newConnectionData = data as INewConnectionAlert;
      return {
        subject: 'Nouvelle connexion à votre compte',
        html: await connectionAlert(newConnectionData),
      };
    }
    default:
      throw new Error('Unknown email template');
  }
}

const reusableFooter = `
  <div style="font-size: 10px; color: #666; margin-top: 20px; text-align: center; line-height: 1.5;">
    Si vous rencontrez des difficultés pour vous identifier sur gerico.com, vous pouvez demander une assistance via le formulaire d'assistance.
    Conformément au règlement général sur la protection des données, vous disposez d’un droit d’information, d’accès, de rectification,
    aux informations qui vous concernent, d’effacement, de portabilité, d’un droit d’opposition ou d’une limitation du traitement des données.
    Pour exercer vos droits ou pour toute question sur le traitement de vos données dans ce dispositif, vous pouvez contacter l'administrateur.
  </div>
`;

async function welcomeTemplate({
  civility,
  lastName,
  defaultPass,
}: IWelcomeTemplate): Promise<string> {
  return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; }
            .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
            .header { background-color: #0073e6; color: white; padding: 20px; text-align: center; font-size: 24px; }
            .content { padding: 20px; color: #555; line-height: 1.6; }
            .password-box { font-size: 18px; font-weight: bold; background-color: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block; margin-top: 15px; }
            .footer { background-color: #f4f4f4; color: #666; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">Bienvenue chez Gérico!</div>
            <div class="content">
              <p>Bonjour ${civility} ${lastName},</p>
              <p>Bienvenue dans l’équipe de Gérico! Nous sommes ravis de vous accueillir et d’entamer ensemble cette nouvelle aventure.</p>
              <p>Pour faciliter votre prise en main, voici votre mot de passe temporaire :</p>
              <div class="password-box">${defaultPass}</div>
              <p>Nous vous invitons à vous connecter dès maintenant pour personnaliser votre mot de passe et découvrir nos outils internes. Cliquez sur le lien ci-dessous pour vous connecter.</p>
              <a href="https://gericohr.com/login" class="button">Connexion à Gérico</a>
            </div>
            <div class="footer">© 2024 Gérico. Tous droits réservés.</div>
            ${reusableFooter}
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
          body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; }
          .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
          .header { background-color: #0073e6; color: white; padding: 20px; text-align: center; font-size: 24px; }
          .content { padding: 20px; color: #555; line-height: 1.6; }
          .code-box { font-size: 18px; font-weight: bold; background-color: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block; margin-top: 15px; }
          .footer { background-color: #f4f4f4; color: #666; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Réinitialisation de votre mot de passe</div>
          <div class="content">
            <p>Bonjour ${civility} ${lastName},</p>
            <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Utilisez le code ci-dessous pour compléter la procédure :</p>
            <div class="code-box">${code}</div>
            <p>Si vous n'avez pas initié cette demande, veuillez ignorer cet e-mail ou contacter notre support interne.</p>
          </div>
          <div class="footer">© 2024 Gérico. Tous droits réservés.</div>
          ${reusableFooter}
        </div>
      </body>
    </html>
  `;
}

async function connectionAlert({
  civility,
  lastName,
  browser,
  operatingSystem,
  loginDate,
}: INewConnectionAlert) {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
          .header { background-color: #0073e6; color: white; padding: 20px; text-align: center; font-size: 24px; }
          .content { padding: 20px; color: #555; line-height: 1.6; }
          .info { background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-top: 10px; font-size: 15px; }
          .footer { background-color: #f4f4f4; color: #666; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Nouvelle connexion à votre compte</div>
          <div class="content">
            <p>Bonjour ${civility} ${lastName},</p>
            <p>Une nouvelle connexion a été détectée sur votre compte Gérico. Voici les détails de la connexion :</p>
            <div class="info">
              <p><strong>Date de connexion :</strong> ${loginDate}</p>
              <p><strong>Système d'exploitation :</strong> ${operatingSystem}</p>
              <p><strong>Navigateur Web :</strong> ${browser}</p>
            </div>
            <p>Si cette connexion ne vous semble pas familière, veuillez contacter notre équipe de support pour sécuriser votre compte.</p>
          </div>
          <div class="footer">© 2024 Gérico. Tous droits réservés.</div>
          ${reusableFooter}
        </div>
      </body>
    </html>
  `;
}
