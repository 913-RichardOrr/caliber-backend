//Tests for associate lambda handler and helpers

import * as batchAssociatesHelper from '../../batchAssociatesLambda/batchAssociatesHelper';
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
  const body = {
    email:"value.gmail.com",
    firstname:"TestFirst",
    lastname:"TestLast",
  };
  const testPath =
    'blablabla/batches/YYMM-mmmDD-Stuff/weeks/1/associates/example@example.net';
  test('that getAssociate calls pg', async () => {
      mockQuery
        .mockResolvedValueOnce(body);
  
      const res = await batchAssociatesHelper.getAssociates(
        testPath
      );
      //expect(res).toBe(body);
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockConnect).toHaveBeenCalledTimes(1);
  
      expect(mockQuery.mock.calls[0][1]).toEqual([
        body.email,
        body.firstname,
        body.lastname,
      ]);
  
      expect(mockEnd).toHaveBeenCalledTimes(1);
    });

  test('that getAssociate returns a promise with associate data.', async () => {
    const mockResult = body;
    mockQuery
        .mockResolvedValueOnce({rows: [body]});
  
      const res = await batchAssociatesHelper.getAssociates(
        testPath
      );
    //expect(result).toBeTruthy();
    expect(res).toEqual(mockResult);
  });

  test('that nonexistent path returns null.', async () => {
    const result = await batchAssociatesHelper.getAssociates(
      '/batches/fakeBatchId'
    );
    expect(result).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
  
  test('that invalid input returns null and does not call anything.', async () => {
    const result = await batchAssociatesHelper.getAssociates(
      'this is definitely not a path'
    );
    expect(result).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(0);
    expect(mockQuery).toHaveBeenCalledTimes(0);
    expect(mockEnd).toHaveBeenCalledTimes(0);
  });
});
