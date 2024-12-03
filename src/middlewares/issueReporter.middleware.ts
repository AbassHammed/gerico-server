import { literal, object, string, TypeOf } from 'zod';

export const createIssueSchema = object({
  body: object({
    type: literal('auth').or(literal('payslip')).or(literal('leave')).or(literal('other')),
    priority: literal('high').or(literal('average')).or(literal('normal')),
    subject: string().min(1, 'Le sujet est requis'),
    description: string().min(1, 'La description est requise'),
  }).refine(data => data.type && data.priority && data.subject && data.description, {
    message: 'Tous les champs sont requis',
    path: ['body'],
  }),
});

export const updateIssueSchema = object({
  params: object({
    id: string().min(1, { message: `L'identifiant est requis` }),
  }),
});

export type CreateIssueSchemaBody = Required<TypeOf<typeof createIssueSchema>['body']>;

export type UpdateIssueSchemaParams = Required<TypeOf<typeof updateIssueSchema>['params']>;
