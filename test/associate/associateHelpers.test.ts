//Tests for associate lambda handler and helpers

import * as associateLambda from '../../associateLambda/associateHelpers';

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
    batchid: 'YYMM-mmmDD-Stuff',
    weeknumber: 1,
    associateid: 'example@example.net',
    notecontent: 'blablabla',
    technicalstatus: 2,
  };
  const testPath =
    'blablabla/batches/YYMM-mmmDD-Stuff/weeks/1/associates/example@example.net';
  test('that getAssociate calls pg', async () => {
      mockQuery
        .mockResolvedValueOnce(body);
  
      //expect(res).toBe(body);
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockConnect).toHaveBeenCalledTimes(1);
  
      expect(mockQuery.mock.calls[0][0]).toBe(
        `select batchid, weeknumber, associateid, notecontent, technicalstatus from qcnotes where batchid = $1::text and weeknumber = $2::integer and associateid = $3::text`);
  
      expect(mockQuery.mock.calls[0][1]).toEqual([
        body.batchid,
        body.weeknumber,
        body.associateid,
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
  let body = '{"notecontent":"test note","technicalstatus":2}';

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
    let expectedResponse: associateLambda.QCFeedback = {
      batchid: 'batch1',
      weeknumber: 1,
      associateid: 'testAssociateId',
      notecontent: 'test note',
      technicalstatus: 2,
    };

    expect(response).toStrictEqual(expectedResponse);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});

describe('tests for patchAssociate', () => {
  const original: associateLambda.QCFeedback = {
    batchid: 'YYMM-mmmDD-Stuff',
    weeknumber: 1,
    associateid: 'example@example.net',
    notecontent: 'blablabla',
    technicalstatus: 2,
  };
  const testPath =
    'blablabla/batches/YYMM-mmmDD-Stuff/weeks/1/associates/example@example.net';

  test("That updating an associate's note calls pg with correct query", async () => {
    const testUpdateObject = { notecontent: 'Updated blablabla' };

    const updatedObject = original;
    updatedObject.notecontent = testUpdateObject.notecontent;

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
      'update qcnotes set notecontent = $1::text where associateid = $2::text and weeknumber = $3::integer and batchid = $4::text'
    );

    expect(mockQuery.mock.calls[0][1]).toEqual([
      testUpdateObject.notecontent,
      original.associateid,
      original.weeknumber,
      original.batchid,
    ]);

    expect(mockQuery.mock.calls[1][0]).toBe(
      'select batchid, weeknumber, associateid, notecontent, technicalstatus from qcnotes where associateid = $1::text and weeknumber = $2::integer and batchid = $3::text'
    );

    expect(mockQuery.mock.calls[1][1]).toEqual([
      original.associateid,
      original.weeknumber,
      original.batchid,
    ]);

    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test("That updating an associate's status calls pg with correct query", async () => {
    const testUpdateObject = { technicalstatus: 3 };

    const updatedObject = original;
    updatedObject.technicalstatus = testUpdateObject.technicalstatus;

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
      'update qcnotes set technicalstatus = $1::STATUS where associateid = $2::text and weeknumber = $3::integer and batchid = $4::text'
    );

    expect(mockQuery.mock.calls[0][1]).toEqual([
      'Good',
      original.associateid,
      original.weeknumber,
      original.batchid,
    ]);

    expect(mockQuery.mock.calls[1][0]).toBe(
      'select batchid, weeknumber, associateid, notecontent, technicalstatus from qcnotes where associateid = $1::text and weeknumber = $2::integer and batchid = $3::text'
    );

    expect(mockQuery.mock.calls[1][1]).toEqual([
      original.associateid,
      original.weeknumber,
      original.batchid,
    ]);

    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test("That updating an associate's note AND status calls pg with correct query", async () => {
    const testUpdateObject = {
      notecontent: 'Updated blablabla',
      technicalstatus: 3
    };

    const updatedObject = original;
    updatedObject.notecontent = testUpdateObject.notecontent;
    updatedObject.technicalstatus = testUpdateObject.technicalstatus;

    mockQuery
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce({ rows: [updatedObject] });

    const res = await associateLambda.patchAssociate(
      testPath,
      JSON.stringify(testUpdateObject)
    );
    expect(res).toBe(updatedObject);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(3);

    expect(mockQuery.mock.calls[0][0]).toBe(
      'update qcnotes set notecontent = $1::text where associateid = $2::text and weeknumber = $3::integer and batchid = $4::text'
    );

    expect(mockQuery.mock.calls[0][1]).toEqual([
      testUpdateObject.notecontent,
      original.associateid,
      original.weeknumber,
      original.batchid,
    ]);

    expect(mockQuery.mock.calls[1][0]).toBe(
      'update qcnotes set technicalstatus = $1::STATUS where associateid = $2::text and weeknumber = $3::integer and batchid = $4::text'
    );

    expect(mockQuery.mock.calls[1][1]).toEqual([
      'Good',
      original.associateid,
      original.weeknumber,
      original.batchid,
    ]);

    expect(mockQuery.mock.calls[2][0]).toBe(
      'select batchid, weeknumber, associateid, notecontent, technicalstatus from qcnotes where associateid = $1::text and weeknumber = $2::integer and batchid = $3::text'
    );

    expect(mockQuery.mock.calls[2][1]).toEqual([
      original.associateid,
      original.weeknumber,
      original.batchid,
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

describe('Tests for parsePath', () => {

  test("That parsePath returns the expected values", () => {
    const testPath = 'blablabla/batches/YYMM-mmmDD-Stuff/weeks/1/associates/example@example.net';
    const expected = { batchid: 'YYMM-mmmDD-Stuff', weeknumber: 1, associateid: 'example@example.net' };

    expect(associateLambda.parsePath(testPath)).toEqual(expected);

  })
})