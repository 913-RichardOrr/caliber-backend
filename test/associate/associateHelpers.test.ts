//Tests for associate lambda handler and helpers

import * as associateLambda from '../../associateLambda/associateHelpers';
import { Client } from 'pg';

const mockConnect = jest.fn();
const mockQuery = jest.fn();
const mockEnd = jest.fn();
jest.mock('pg', () => {
  return {
    Client: jest.fn(() => ({
      connect: mockConnect,
      query: mockQuery,
      end: mockEnd,
    })),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('tests for getAssociate', () => {
  const body: associateLambda.QCFeedback = {
    batchId: 'YYMM-mmmDD-Stuff',
    weekNumber: 1,
    associateId: 'example@example.net',
    noteContent: 'blablabla',
    technicalStatus: 2,
  };
  const testPath =
    'blablabla/batches/YYMM-mmmDD-Stuff/weeks/1/associates/example@example.net';
  test('that getAssociate calls pg', async () => {
      mockQuery
        .mockResolvedValueOnce(body);
  
      const res = await associateLambda.getAssociate(
        testPath
      );
      //expect(res).toBe(body);
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockConnect).toHaveBeenCalledTimes(1);
  
      expect(mockQuery.mock.calls[0][0]).toBe(
        `select "batchId", "weekNumber", "associateId", "noteContent", "technicalStatus" from "qcNotes" where "batchId" = $1::text && "weekNumber" = $2::integer && "associateId" = $3::text`);
  
      expect(mockQuery.mock.calls[0][1]).toEqual([
        body.batchId,
        body.weekNumber,
        body.associateId,
      ]);
  
      expect(mockEnd).toHaveBeenCalledTimes(1);
    });

  test('that getAssociate returns a promise with associate data.', async () => {
    const mockResult = body;
    mockQuery
        .mockResolvedValueOnce({rows: [body]});
  
      const res = await associateLambda.getAssociate(
        testPath
      );
    //expect(result).toBeTruthy();
    expect(res).toEqual(mockResult);
  });

  test('that nonexistent path returns null.', async () => {
    const result = await associateLambda.getAssociate(
      '/batches/fakeBatchId/12/associates/fakeAssociateId'
    );
    expect(result).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
  
  test('that invalid input returns null and does not call anything.', async () => {
    const result = await associateLambda.getAssociate(
      'this is definitely not a path'
    );
    expect(result).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(0);
    expect(mockQuery).toHaveBeenCalledTimes(0);
    expect(mockEnd).toHaveBeenCalledTimes(0);
  });
});

describe('tests for putAssociate', () => {
  let path = '/batches/batch1/weeks/1/associates/testAssociateId';
  let body = '{"noteContent":"test note","technicalStatus":2}';

  test('that an incorrect input does not break anything', async () => {
    let response = await associateLambda.putAssociate(
      '{"wrongPropertyBody":"some value"}',
      '{"wrongPropertyPath":"some other value"}'
    );
    expect(response).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(0);
    expect(mockConnect).toHaveBeenCalledTimes(0);
    expect(mockConnect).toHaveBeenCalledTimes(0);
  });

  test('that putAssociate returns the object', async () => {
    let response = await associateLambda.putAssociate(body, path);
    let expectedResponse = {
      batchId: 'batch1',
      weekNumber: 1,
      associateId: 'testAssociateId',
      noteContent: 'test note',
      technicalStatus: 2,
    };

    expect(response).toStrictEqual(expectedResponse);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});

describe('tests for patchAssociate', () => {
  const original: associateLambda.QCFeedback = {
    batchId: 'YYMM-mmmDD-Stuff',
    weekNumber: 1,
    associateId: 'example@example.net',
    noteContent: 'blablabla',
    technicalStatus: 2,
  };
  const testPath =
    'blablabla/batches/YYMM-mmmDD-Stuff/weeks/1/associates/example@example.net';

  test("That updating an associate's note calls pg with correct query", async () => {
    const testUpdateObject = { noteContent: 'Updated blablabla' };

    const updatedObject = original;
    updatedObject.noteContent = testUpdateObject.noteContent;

    mockQuery
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce({ rows: [updatedObject] });

    const res = await associateLambda.patchAssociate(
      testPath,
      JSON.stringify(testUpdateObject)
    );
    expect(res).toBe(updatedObject);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockConnect).toHaveBeenCalledTimes(1);

    expect(mockQuery.mock.calls[0][0]).toBe(
      'update "qcNotes" set "noteContent" = $1::text where "associateId" = $2::text and "weekNumber" = $3::integer and "batchId" = $4::text'
    );

    expect(mockQuery.mock.calls[0][1]).toEqual([
      testUpdateObject.noteContent,
      original.associateId,
      original.weekNumber,
      original.batchId,
    ]);

    expect(mockQuery.mock.calls[1][0]).toBe(
      'select "batchId", "weekNumber", "associateId", "noteContent", "technicalStatus" from "qcNotes" where "associateId" = $2::text and "weekNumber" = $3::integer and "batchId" = $4::text'
    );

    expect(mockQuery.mock.calls[1][1]).toEqual([
      testUpdateObject.noteContent,
      original.associateId,
      original.weekNumber,
      original.batchId,
    ]);

    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test("That updating an associate's status calls pg with correct query", async () => {
    const testUpdateObject = { technicalStatus: 3 };

    const updatedObject = original;
    updatedObject.technicalStatus = testUpdateObject.technicalStatus;

    mockQuery
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce({ rows: [updatedObject] });

    const res = await associateLambda.patchAssociate(
      testPath,
      JSON.stringify(testUpdateObject)
    );
    expect(res).toBe(updatedObject);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(2);

    expect(mockQuery.mock.calls[0][0]).toBe(
      'update "qcNotes" set "technicalStatus" = $1::integer where "associateId" = $2::text and "weekNumber" = $3::integer and "batchId" = $4::text'
    );

    expect(mockQuery.mock.calls[0][1]).toEqual([
      testUpdateObject.technicalStatus,
      original.associateId,
      original.weekNumber,
      original.batchId,
    ]);

    expect(mockQuery.mock.calls[1][0]).toBe(
      'select "batchId", "weekNumber", "associateId", "noteContent", "technicalStatus" from "qcNotes" where "associateId" = $2::text and "weekNumber" = $3::integer and "batchId" = $4::text'
    );

    expect(mockQuery.mock.calls[1][1]).toEqual([
      testUpdateObject.technicalStatus,
      original.associateId,
      original.weekNumber,
      original.batchId,
    ]);

    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test("That invalid input returns null but doesn't break anything", async () => {
    const testUpdateObject = { nonsense: 3 };

    const res = await associateLambda.patchAssociate(
      testPath,
      JSON.stringify(testUpdateObject)
    );
    expect(res).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(0);
    expect(mockQuery).toHaveBeenCalledTimes(0);
    expect(mockEnd).toHaveBeenCalledTimes(0);
  });
});
