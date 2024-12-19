import { object, string, TypeOf } from 'zod';

export const LeaveRequestBodySchema = object({
  body: object({
    uid: string({ required_error: 'Identifiant utilisateur requis' }),
    start_date: string({ required_error: 'Date de début requise' }),
    end_date: string({ required_error: 'Date de fin requise' }),
    reason: string().optional().default('Pas de raison spécifiée'),
    leave_type: string({ required_error: 'Type de congé requis' }),
    request_status: string({ required_error: 'Statut de la demande requis' }),
  }).refine(
    data => data.start_date && data.end_date && data.leave_type && data.uid && data.request_status,
    {
      message: 'Tous les champs sont requis',
    },
  ),
});

export type LeaveRequestBodyType = Required<TypeOf<typeof LeaveRequestBodySchema>['body']>;
