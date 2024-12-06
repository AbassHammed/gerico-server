/* eslint-disable quotes */
import { object, string, number, TypeOf } from 'zod';

export const createPayslipSchema = object({
  body: object({
    uid: string(),
    gross_salary: number({ required_error: 'Le salaire brut est requis' }),
    net_salary: number({ required_error: 'Le salaire net est requis' }),
    start_period: string({ required_error: 'La période de début est requise' }),
    end_period: string({ required_error: 'La période de fin est requise' }),
    pay_date: string({ required_error: 'La date de paiement est requise' }),
    total_hours_worked: string({
      required_error: "Le nombre total d'heures travaillées est requis",
    }),
    hourly_rate: number({ required_error: 'Le taux horaire est requis' }),
    path_to_pdf: string().optional(),
  }),
});

export type CreatePayslipInput = TypeOf<typeof createPayslipSchema>['body'];
