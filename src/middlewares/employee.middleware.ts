import { object, string, literal, TypeOf, number, boolean } from 'zod';

export const createEmployeeSchema = object({
  body: object({
    civility: string({ required_error: 'Civility is required' }),
    first_name: string({ required_error: 'First name is required' })
      .min(1, 'First name must be at least 1 character long')
      .max(16, 'First name must be at most 16 characters long'),
    last_name: string({ required_error: 'Last name is required' }).min(
      1,
      'Last name must be at least 1 character long',
    ),
    email: string({ required_error: 'Email is required' }).email('Not a valid email'),
    phone_number: string({ required_error: 'Phone number is required' }),
    is_admin: boolean(),
    hire_date: string({ required_error: 'Hire date is required' }),
    job_title: literal('employee', {
      invalid_type_error: 'User post must be either "employee" or "manager"',
    }).or(
      literal('manager', {
        invalid_type_error: 'User post must be either "employee" or "manager"',
      }),
    ),
    user_departement: string({ required_error: 'The user departement is required.' }),
    address_line1: string({ required_error: 'Address line 1 is required' }),
    address_line2: string().optional(),
    city: string({ required_error: 'City is required' }),
    state: string({ required_error: 'State is required' }),
    postal_code: string({ required_error: 'Postal code is required' }),
    country: string({ required_error: 'Country is required' }),
    date_of_birth: string({ required_error: 'Date of birth is required' }),
    social_security_number: string({ required_error: 'Social security number is required' }),
    remaining_leave_balance: number({ required_error: 'Work hours per month is required' }),
    contract_type: string({ required_error: 'Contract type is required' }),
    marital_status: string({ required_error: 'Marital status is required' }),
    dependants: number({ required_error: 'Number of dependents is required' }),
    company_id: string({ required_error: 'company id is required' }).min(14).max(14),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  }),
});

export const loginSchema = object({
  body: object({
    browser: string({ required_error: 'Browser is required' }),
    os: string({ required_error: 'OS is required' }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
    password: string({
      required_error: 'Password is required',
    })
      .min(8, 'Password must be at least 8 characters long')
      .max(16, 'Password must be at most 16 characters long'),
  }),
});

export const resetPasswordSchema = object({
  body: object({
    uid: string({ required_error: 'UID is required' }),
    reset_code: string({ required_error: 'Reset code is required' }),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Password must be at least 8 characters long',
    ),
    confirm_password: string({ required_error: 'Confirm password is required' }),
  }).refine(data => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  }),
});

// for simplification we are expect the minimum critere for a password to be handle on the front, since we are also using zod there
export const changeDefaultPasswordSchema = object({
  body: object({
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(16, 'Password must be at most 16 characters long'),
    confirmPassword: string({ required_error: 'Confirm password is required' }),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

export const resendResetCodeSchema = object({
  body: object({
    uid: string({ required_error: 'UID is required' }),
  }),
});

export type CreateEmployeeInput = Required<TypeOf<typeof createEmployeeSchema>['body']>;

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

export type LoginInput = TypeOf<typeof loginSchema>['body'];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['body'];

export type ChangeDefaultPasswordInput = TypeOf<typeof changeDefaultPasswordSchema>['body'];

export type ResendResetPasswordCodeInput = TypeOf<typeof resendResetCodeSchema>['body'];
