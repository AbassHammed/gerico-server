/* eslint-disable @typescript-eslint/no-unused-expressions */
import dotenv from 'dotenv';
dotenv.config();
import { expect } from 'chai';
import sinon from 'sinon';
import { ResultSetHeader } from 'mysql2';
import connection from '../src/models/connect';
import EmployeeRepository from '../src/repositories/user.repo';
import { IEmployee } from '../src/models/interface';

describe('EmployeeRepository', () => {
  let queryStub: sinon.SinonStub;

  beforeEach(() => {
    queryStub = sinon.stub(connection, 'query');
  });

  afterEach(() => {
    queryStub.restore();
  });

  const mockEmployee: IEmployee = {
    uid: '1',
    civility: 'Mr',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '123456789',
    password: 'password',
    employee_post: 'manager',
    is_admin: true,
    hire_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    departure_date: null,
    is_archived: false,
    reset_code: '1234',
    address_line1: '123 Main St',
    address_line2: null,
    city: 'Sample City',
    state: 'State',
    postal_code: '12345',
    country: 'Country',
    dob: new Date('1980-01-01'),
    ss_number: '123-45-6789',
    work_hours_month: 160,
    contrat_type: 'Permanent',
    marital_status: 'Single',
    dependents: 0,
  };

  it('should save a new employee', async () => {
    queryStub.yields(null, { affectedRows: 1 } as ResultSetHeader);
    const result = await EmployeeRepository.save(mockEmployee);
    expect(result).to.be.true;
    expect(queryStub.calledOnce).to.be.true;
  });

  it('should retrieve all employees', async () => {
    queryStub.yields(null, [mockEmployee]);
    const employees = await EmployeeRepository.retrieveAll();
    expect(employees).to.be.an('array').that.is.not.empty;
    expect(employees[0]).to.include(mockEmployee);
  });

  it('should retrieve an employee by ID', async () => {
    queryStub.yields(null, [mockEmployee]);
    const employee = await EmployeeRepository.retrieveById('1');
    expect(employee).to.include(mockEmployee);
  });

  it('should return undefined if employee ID is not found', async () => {
    queryStub.yields(null, []);
    const employee = await EmployeeRepository.retrieveById('999');
    expect(employee).to.be.undefined;
  });

  it('should retrieve an employee by email', async () => {
    queryStub.yields(null, [mockEmployee]);
    const employee = await EmployeeRepository.retrieveByEmail('john.doe@example.com');
    expect(employee).to.include(mockEmployee);
  });

  it('should return undefined if employee email is not found', async () => {
    queryStub.yields(null, []);
    const employee = await EmployeeRepository.retrieveByEmail('notfound@example.com');
    expect(employee).to.be.undefined;
  });

  it('should update an existing employee', async () => {
    queryStub.yields(null, { affectedRows: 1 } as ResultSetHeader);
    const result = await EmployeeRepository.update(mockEmployee);
    expect(result).to.be.true;
  });

  it('should throw an error if updating non-existing employee', async () => {
    queryStub.yields(new Error('Employee not found'), null);
    try {
      await EmployeeRepository.update(mockEmployee);
    } catch (error) {
      expect(error.message).to.equal('Employee not found');
    }
  });

  it('should delete an employee by ID', async () => {
    queryStub.yields(null, { affectedRows: 1 } as ResultSetHeader);
    const result = await EmployeeRepository.delete('1');
    expect(result).to.be.true;
  });

  it('should throw an error if deleting non-existing employee by ID', async () => {
    queryStub.yields(new Error('Employee not found'), null);
    try {
      await EmployeeRepository.delete('999');
    } catch (error) {
      expect(error.message).to.equal('Employee not found');
    }
  });

  it('should archive an employee by ID', async () => {
    queryStub.yields(null, { affectedRows: 1 } as ResultSetHeader);
    const result = await EmployeeRepository.archive('1');
    expect(result).to.be.true;
  });

  it('should throw an error if archiving non-existing employee by ID', async () => {
    queryStub.yields(new Error('Employee not found'), null);
    try {
      await EmployeeRepository.archive('999');
    } catch (error) {
      expect(error.message).to.equal('Employee not found');
    }
  });

  it('should delete all employees', async () => {
    queryStub.yields(null, { affectedRows: 10 } as ResultSetHeader);
    const result = await EmployeeRepository.deleteAll();
    expect(result).to.equal(1);
  });

  it('should throw an error if unable to delete all employees', async () => {
    queryStub.yields(new Error('Unable to delete employees'), null);
    try {
      await EmployeeRepository.deleteAll();
    } catch (error) {
      expect(error.message).to.equal('Unable to delete employees');
    }
  });
});
