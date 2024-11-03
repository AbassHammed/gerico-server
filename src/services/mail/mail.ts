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
  CONNECTION_ALERT = 'connection_alert',
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

export interface INewConnectionAlert {
  civility: string;
  lastName: string;
  loginDate: string;
  operatingSystem: string;
  browser: string;
}

export type ITemplate = IWelcomeTemplate | IResetPasswordTemplate | INewConnectionAlert;
