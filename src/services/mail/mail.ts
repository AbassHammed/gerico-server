export interface IEmailConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    password: string;
  };
}

export enum EEmailTemplate {
  WELCOME = 'welcome',
  RESET_PASSWORD = 'reset_password',
}

export interface IWelcomeTemplate {
  civility: string;
  lastName: string;
  defaultPass: string;
}

export interface IResetPasswordTemplate {
  civility: string;
  lastName: string;
  code: string;
}

export type ITemplate = IWelcomeTemplate | IResetPasswordTemplate;
