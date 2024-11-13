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
  user_departement: string;
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

export interface IEmployee {
  uid: string;
  civility: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  employee_post: 'employee' | 'manager';
  // ce champ me parait redondant par rapport au `employee_post` mais on peut
  //justifier sa presence par le fait que l'entreprise peut decider de laisser
  //seulement certains manager de gerer les congées et fdp
  is_admin: boolean;
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
  state: string;
  country: string;
  dob: Date;
  ss_number: string;
  work_hours_month: number;
  contrat_type: string;
  marital_status: 'married' | 'divorced' | 'single' | 'partnership' | 'widowed' | string;
  dependents: number;
}

export interface IIssueReporter {
  issue_id: string;
  type: 'auth' | 'leave' | 'payslip' | 'other';
  priority: 'high' | 'average' | 'normal';
  subject: string;
  description: string;
  solved: boolean;
  issue_date: Date;
}

export interface IIssueReporterRow extends IIssueReporter, RowDataPacket {}

export interface IEmployeeRow extends IEmployee, RowDataPacket {}

export interface IEmployeeLog extends RowDataPacket {
  log_id: string;
  uid: string;
  request_type: 'leave' | 'profile_update' | 'other';
  message: string;
  log_timestamp: Date;
}

export interface ILeaveRequest extends RowDataPacket {
  leave_request_id: string;
  uid: string;
  request_status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  start_date: Date;
  end_date: Date;
  reason: string;
}

export interface ICompany extends RowDataPacket {
  siret: string;
  code_ape: string;
  name: string;
  addr_line1: string;
  addr_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  convention_collective: string;
}

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
