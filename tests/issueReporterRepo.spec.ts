/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import connection from '../src/models/connect';
import IssueReporterRepository from '../src/repositories/issueReporter';
import { ResultSetHeader } from 'mysql2';
import { IIssueReporter } from '../src/models/interface';
import { generateUUIDv4 } from '../src/utils/misc';

describe('IssueReporterRepository', () => {
  let queryStub: sinon.SinonStub;
  const id = generateUUIDv4();

  const mockIssue: IIssueReporter = {
    issue_id: id,
    type: 'leave',
    priority: 'high',
    subject: 'John Doe - Cannot take leave',
    description: 'Unable to log in with correct credentials',
    solved: false,
    issue_date: new Date(),
  };

  beforeEach(() => {
    queryStub = sinon.stub(connection, 'query');
  });

  afterEach(() => {
    queryStub.restore();
  });

  it('should save a new issue', async () => {
    queryStub.yields(null, { affectedRows: 1 } as ResultSetHeader);
    const result = await IssueReporterRepository.save(mockIssue);
    expect(result).to.be.true;
    expect(queryStub.calledOnce).to.be.true;
    expect(queryStub.firstCall.args[1]).to.deep.equal([
      mockIssue.issue_id,
      mockIssue.type,
      mockIssue.priority,
      mockIssue.subject,
      mockIssue.description,
      mockIssue.solved,
      mockIssue.issue_date,
    ]);
  });

  it('should retrieve all issues', async () => {
    queryStub.yields(null, [mockIssue]);
    const result = await IssueReporterRepository.retrieveAll();
    expect(result).to.be.an('array').with.lengthOf(1);
    expect(result[0]).to.deep.equal(mockIssue);
  });

  it('should retrieve an issue by ID', async () => {
    queryStub.yields(null, [mockIssue]);
    const result = await IssueReporterRepository.retrieveById(id);
    expect(result).to.deep.equal(mockIssue);
    expect(queryStub.calledOnce).to.be.true;
    expect(queryStub.firstCall.args[1]).to.deep.equal([id]);
  });

  it('should mark an issue as solved', async () => {
    queryStub.yields(null, { affectedRows: 1 } as ResultSetHeader);
    const result = await IssueReporterRepository.solved(id);
    expect(result).to.be.true;
    expect(queryStub.calledOnce).to.be.true;
    expect(queryStub.firstCall.args[1]).to.deep.equal([id]);
  });

  it('should retrieve only unresolved issues', async () => {
    queryStub.yields(null, [mockIssue]);
    const result = await IssueReporterRepository.retrieveNotSolved();
    expect(result).to.be.an('array').with.lengthOf(1);
    expect(result[0]).to.deep.equal(mockIssue);
    expect(queryStub.calledOnce).to.be.true;
  });

  it('should handle errors during save', async () => {
    queryStub.yields(new Error('Database error'), null);
    try {
      await IssueReporterRepository.save(mockIssue);
    } catch (err) {
      expect(err).to.be.an('error').with.property('message', 'Database error');
    }
  });

  it('should handle errors during retrieval by ID', async () => {
    queryStub.yields(new Error('Database error'), null);
    try {
      await IssueReporterRepository.retrieveById(id);
    } catch (err) {
      expect(err).to.be.an('error').with.property('message', 'Database error');
    }
  });

  it('should handle errors during marking issue as solved', async () => {
    queryStub.yields(new Error('Database error'), null);
    try {
      await IssueReporterRepository.solved(id);
    } catch (err) {
      expect(err).to.be.an('error').with.property('message', 'Database error');
    }
  });

  it('should handle errors during retrieval of unsolved issues', async () => {
    queryStub.yields(new Error('Database error'), null);
    try {
      await IssueReporterRepository.retrieveNotSolved();
    } catch (err) {
      expect(err).to.be.an('error').with.property('message', 'Database error');
    }
  });
});
