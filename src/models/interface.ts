/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { RowDataPacket } from 'mysql2';

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface ILeaveRequest {
  leave_request_id: string;
  request_status: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  reason?: string;
  leave_type: string;
  uid: string;
}

export interface ILeaveRequestRowData extends ILeaveRequest, RowDataPacket {}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

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
  gross_salary: number;
  net_salary: number;
  start_period: Date;
  end_period: Date;
  pay_date: Date;
  total_hours_worked: string;
  hourly_rate: number;
  path_to_pdf?: string;
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

export enum LogType {
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  LEAVE_REQUEST_PENDING = 'LEAVE_REQUEST_PENDING',
  LEAVE_REQUEST_ACCEPTED = 'LEAVE_REQUEST_ACCEPTED',
  LEAVE_REQUEST_REFUSED = 'LEAVE_REQUEST_REFUSED',
  PAYSLIP_AVAILABLE = 'PAYSLIP_AVAILABLE',
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  LOGIN_ALERT = 'LOGIN_ALERT',
}

export interface LogEntry {
  log_id: string;
  uid: string;
  log_type: LogType;
  log_message: string;
  log_date: Date;
  is_read: boolean;
}

export interface LogEntryRowData extends LogEntry, RowDataPacket {}

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
   * @param t - The entity to save
   * @returns - A promise that resolves to `true` indicating the save was successfull else an error is thrown
   */
  save?(t: T): Promise<true>;

  /**
   * Retrieves all entities from the repository.
   * @returns - A promise that resolves to an array of entities
   */
  retrieveAll?(params: PaginationParams): Promise<PaginatedResult<T>>;

  /**
   * Retrieves a single entity by its ID.
   * @param id - The ID of the entity to retrieve
   * @returns - A promise that resolves to the entity or undefined if not found
   */
  retrieveById?(id: string | number): Promise<T | undefined>;

  /**
   * Updates an existing entity in the repository.
   * @param t - The entity to update
   * @returns - A promise that resolves to `true` indicating the update was successfull else an error is thrown
   */
  update?(t: T): Promise<true>;

  /**
   * Deletes an entity by its ID.
   * @param t - The ID of the entity to delete
   * @returns - A promise that resolves to `true` indicating the delete was successfull else an error is thrown
   */
  delete?(id: string | number): Promise<true>;

  /**
   * Deletes all entities in the repository.
   * @returns - A promise that resolves to the count of deleted records
   */
  deleteAll?(): Promise<number>;
}

export interface JwtPayload {
  uid: string;
}

/**
 * Interface for JSON Web Token (JWT) utility.
 */
export interface IJwt {
  /**
   * Encodes the given payload into a JWT string.
   *
   * @param payload - The payload to encode as a JWT.
   * @returns The JWT string.
   */
  encode(payload: JwtPayload): string;

  /**
   * Decodes a JWT string, returning the original payload if the signature is valid.
   *
   * @param token - The JWT string to decode.
   * @returns The decoded payload as an object.
   * @throws Error if the token format is invalid or the signature is incorrect.
   */
  decode(token: string): JwtPayload;
}
