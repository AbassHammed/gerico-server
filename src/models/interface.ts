import { RowDataPacket } from 'mysql2';

export interface IUser extends RowDataPacket {
  uid: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  hire_date: Date;
  created_at: Date;
  user_post: 'employee' | 'manager';
  updated_at?: Date;
  departure_date?: Date;
  is_admin: boolean;
  is_archived: boolean;
  reset_code?: string;
}

export interface IUserLog extends RowDataPacket {
  log_id: string;
  uid: string;
  request_type: 'leave' | 'profile_update' | 'other';
  message: string;
}

export interface ILeaveRequest extends RowDataPacket {
  leave_request_id: string;
  uid: string;
  request_status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  leave_request_start: Date;
  leave_request_end: Date;
}

export interface ITest extends RowDataPacket {
  id: number;
  // name: string;
  age: number;
  city: string;
}
