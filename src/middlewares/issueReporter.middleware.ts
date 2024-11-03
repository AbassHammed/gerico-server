import { literal, object, string, TypeOf } from 'zod';

export const createIssueSchema = object({
  body: object({
    type: literal('auth').or(literal('payslip')).or(literal('leave')).or(literal('other')),
    priority: literal('high').or(literal('average')).or(literal('normal')),
    subject: string().min(1, 'Subject is required'),
    description: string().min(1, 'Description is required'),
  }).refine(data => data.type && data.priority && data.subject && data.description, {
    message: 'All fields are required',
    path: ['body'],
  }),
});

export const updateIssueSchema = object({
  params: object({
    id: string().min(1, { message: 'ID is required' }),
  }),
});

export type CreateIssueSchemaBody = Required<TypeOf<typeof createIssueSchema>['body']>;

export type UpdateIssueSchemaParams = Required<TypeOf<typeof updateIssueSchema>['params']>;
