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
    employee_post: literal('employee', {
      invalid_type_error: 'User post must be either "employee" or "manager"',
    }).or(
      literal('manager', {
        invalid_type_error: 'User post must be either "employee" or "manager"',
      }),
    ),
    address_line1: string({ required_error: 'Address line 1 is required' }),
    address_line2: string().optional(),
    city: string({ required_error: 'City is required' }),
    state: string({ required_error: 'State is required' }),
    postal_code: string({ required_error: 'Postal code is required' }),
    country: string({ required_error: 'Country is required' }),
    dob: string({ required_error: 'Date of birth is required' }),
    ss_number: string({ required_error: 'Social security number is required' }),
    work_hours_month: number({ required_error: 'Work hours per month is required' }),
    contrat_type: string({ required_error: 'Contract type is required' }),
    marital_status: string({ required_error: 'Marital status is required' }),
    dependents: number({ required_error: 'Number of dependents is required' }),
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

export type CreateEmployeeInput = Required<TypeOf<typeof createEmployeeSchema>['body']>;

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

export type LoginInput = TypeOf<typeof loginSchema>['body'];