import { RowDataPacket } from 'mysql2';

export interface IUser {
  uid: string;
  civility: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  hashed_password: string;
  is_admin: boolean;
  job_title: string;
  job_department: string;
  remaining_leave_balance: number;
  hire_date: Date;
  created_at: Date;
  updated_at: Date;
  departure_date?: Date;
  is_archived: boolean;
  reset_code?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  date_of_birth: Date;
  social_security_number: string;
  marital_status: string;
  contract_type: string;
  dependants: number;
  company_id: string;
}

export interface IUserRowData extends IUser, RowDataPacket {}

export interface IPayslip {
  pid: string;
  uid: string;
  gross_salary: string;
  net_salary: string;
  start_period: Date;
  end_period: Date;
  pay_date: Date;
  total_hours_worked: string;
  hourly_rate: number;
  path_to_pdf: string;
}

export interface IPayslipRow extends IPayslip, RowDataPacket {}

export interface IIssueReporter {
  issue_id: string;
  type: string;
  priority: string;
  subject: string;
  description: string;
  solved: boolean;
  issue_date: Date;
}

export interface IIssueReporterRow extends IIssueReporter, RowDataPacket {}

export interface ISSThreshold {
  threshold_id: string;
  threshold_name: string;
  min_value: number;
  max_value: number;
  is_ceiling: boolean;
}
export interface ISSThresholdRow extends ISSThreshold, RowDataPacket {}

export interface IDeduction {
  deduction_id: string;
  deduction_type: string;
  deduction_name: string;
  part_salarial: number;
  part_patronal: number;
  threshold_id: string;
}

export interface IDeductionRow extends IDeduction, RowDataPacket {}

export interface ICompanyInfo {
  siret: string;
  code_ape: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  collective_convention: string;
}

export interface ICompanyInfoRowData extends ICompanyInfo, RowDataPacket {}

/**
 * Generic repository interface to provide basic CRUD operations
 * @example
 * ```typescript
 * interface ITestRepository<T> extends Required<IRepository<T>>
 * ```
 * this makes the `IRepository` methods compulsory to the extending interface
 */
export interface IRepository<T> {
  /**
   * Saves a new entity to the repository.
   * @param {T} t - The entity to save
   * @returns {Promise<T>} - A promise that resolves to `true` indicating the save was successfull else an error is thrown
   */
  save?(t: T): Promise<true>;

  /**
   * Retrieves all entities from the repository.
   * @returns {Promise<T[]>} - A promise that resolves to an array of entities
   */
  retrieveAll?(): Promise<T[]>;

  /**
   * Retrieves a single entity by its ID.
   * @param {string | number} id - The ID of the entity to retrieve
   * @returns {Promise<T | undefined>} - A promise that resolves to the entity or undefined if not found
   */
  retrieveById?(id: string | number): Promise<T | undefined>;

  /**
   * Updates an existing entity in the repository.
   * @param {T} t - The entity to update
   * @returns {Promise<true>} - A promise that resolves to `true` indicating the update was successfull else an error is thrown
   */
  update?(t: T): Promise<true>;

  /**
   * Deletes an entity by its ID.
   * @param {string | number} t - The ID of the entity to delete
   * @returns {Promise<number>} - A promise that resolves to `true` indicating the delete was successfull else an error is thrown
   */
  delete?(id: string | number): Promise<true>;

  /**
   * Deletes all entities in the repository.
   * @returns {Promise<number>} - A promise that resolves to the count of deleted records
   */
  deleteAll?(): Promise<number>;
}
