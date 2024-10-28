import { object, string, date, literal, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    first_name: string({ required_error: 'First name is required' })
      .min(1, 'First name must be at least 1 character long')
      .max(16, 'First name must be at most 16 characters long'),
    last_name: string({ required_error: 'Last name is required' }).min(
      1,
      'Last name must be at least 1 character long',
    ),
    phone_number: string({ required_error: 'Phone number is required' }),
    email: string({ required_error: 'Email is required' }).email('Not a valid email'),
    hire_date: date({ required_error: 'Hire date is required' }),
    user_post: literal('employee', {
      invalid_type_error: 'User post must be either "employee" or "manager"',
    }).or(
      literal('manager', {
        invalid_type_error: 'User post must be either "employee" or "manager"',
      }),
    ),
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

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

export type LoginInput = TypeOf<typeof loginSchema>['body'];
