import { object, string, TypeOf, number, boolean } from 'zod';

export const createEmployeeSchema = object({
  body: object({
    civility: string({ required_error: 'La civilité est requise' }),
    first_name: string({ required_error: 'Le prénom est requis' })
      .min(1, 'Veuillez saisir un prénom comportant au moins un caractère.')
      .max(16, 'Veuillez saisir un prénom de 16 caractères maximum.'),
    last_name: string({ required_error: 'Le nom de famille est requis' }).min(
      1,
      'Veuillez saisir un nom de famille comportant au moins un caractère.',
    ),
    email: string({ required_error: `L'adresse e-mail est requise` }).email(
      `Veuillez entrer une adresse e-mail valide`,
    ),
    phone_number: string({ required_error: 'Le numéro de téléphone est requis' }),
    is_admin: boolean(),
    hire_date: string({ required_error: `La date d'embauche est requise` }),
    job_title: string({ required_error: `L'intitulé du poste est requis` }),
    job_department: string({ required_error: `Le département de l'utilisateur est requis` }),
    address_line1: string({ required_error: `Le champ 'Adresse ligne 1' est requis` }),
    address_line2: string().optional(),
    city: string({ required_error: 'La ville est requise' }),
    postal_code: string({ required_error: 'Le Code Postal est requis' }),
    country: string({ required_error: 'Le pays est requis' }),
    date_of_birth: string({ required_error: 'La date de naissance est requise' }),
    social_security_number: string({ required_error: 'Le numéro de Sécurité Social est requis' }),
    remaining_leave_balance: number({
      required_error: `Le nombre d'heures de travail par mois est requis`,
    }),
    contract_type: string({ required_error: 'Le type de contrat est requis' }),
    marital_status: string({ required_error: `L'état civil est requis` }),
    dependants: number({ required_error: 'Le nombre de personnes à charge est requis' }),
    company_id: string({ required_error: `L'identifiant de l'entreprise (siret) est requis` })
      .min(14)
      .max(14),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: `L'adresse e-mail est requise`,
    }).email(`Veuillez entrer une adresse e-mail valide`),
  }),
});

export const loginSchema = object({
  body: object({
    browser: string({ required_error: 'Un navigateur est requis' }),
    os: string({ required_error: `Le système d'exploitation est requis` }),
    email: string({
      required_error: `L'adresse e-mail est requise`,
    }).email(`Veuillez entrer une adresse e-mail valide`),
    password: string({
      required_error: 'Le mot de passe est requis',
    })
      .min(8, 'Veuillez saisir un mot de passe comportant au moins 8 caractère.')
      .max(16, 'Veuillez saisir un mot de passe de 16 caractères maximum.'),
  }),
});

export const resetPasswordSchema = object({
  body: object({
    uid: string({ required_error: `L'identifiant de utilisateur est requis` }),
    reset_code: string({ required_error: 'Le code de réinitialisation est requis' }),
    password: string({ required_error: 'Le mot de passe est requis' }).min(
      8,
      'Password must be at least 8 characters long',
    ),
    confirm_password: string({ required_error: 'La confirmation du mot de passe est requise' }),
  }).refine(data => data.password === data.confirm_password, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm_password'],
  }),
});

// for simplification we are expect the minimum critere for a password to be handle on the front, since we are also using zod there
export const changeDefaultPasswordSchema = object({
  body: object({
    password: string({ required_error: 'Le mot de passe est requis' })
      .min(8, 'Veuillez saisir un mot de passe comportant au moins 8 caractère.')
      .max(16, 'Veuillez saisir un mot de passe de 16 caractères maximum.'),
    confirmPassword: string({ required_error: 'La confirmation du mot de passe est requise' }),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }),
});

export const resendResetCodeSchema = object({
  body: object({
    uid: string({ required_error: `L'identifiant de utilisateur est requis` }),
  }),
});

export type CreateEmployeeInput = Required<TypeOf<typeof createEmployeeSchema>['body']>;

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

export type LoginInput = TypeOf<typeof loginSchema>['body'];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['body'];

export type ChangeDefaultPasswordInput = TypeOf<typeof changeDefaultPasswordSchema>['body'];

export type ResendResetPasswordCodeInput = TypeOf<typeof resendResetCodeSchema>['body'];
