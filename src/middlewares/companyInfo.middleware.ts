/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { object, string, type TypeOf } from 'zod';

export const createCompanyInfoSchema = object({
  body: object({
    siret: string().min(1, { message: 'Le SIRET est requis' }),
    code_ape: string().min(1, { message: 'Le code APE est requis' }),
    name: string().min(1, { message: 'Le nom est requis' }),
    address_line1: string().min(1, { message: "La première ligne d'adresse est requise" }),
    address_line2: string().optional(),
    city: string().min(1, { message: 'La ville est requise' }),
    postal_code: string().min(1, { message: 'Le code postal est requis' }),
    country: string().min(1, { message: 'Le pays est requis' }),
    collective_convention: string(),
  }),
});

export type CompanyInfoBodyType = Required<TypeOf<typeof createCompanyInfoSchema>['body']>;
