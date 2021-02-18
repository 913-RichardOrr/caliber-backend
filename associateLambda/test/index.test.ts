//Tests for associate lambda handler and helpers

import * as associateLambda from '../index';
import { Client } from 'pg';

let testEvent: associateLambda.AssocEvent;

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

//Author: Tyler
describe('tests for handler', () => {
  associateLambda.getAssociate = jest.fn().mockReturnValue('');
  associateLambda.putAssociate = jest.fn().mockReturnValue('');
  associateLambda.patchAssociate = jest.fn().mockReturnValue('');

  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'PUT',
    };

    await associateLambda.handler(testEvent);

    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(1);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(0);
  });
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'GET',
    };

    await associateLambda.handler(testEvent);

    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(1);
    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(0);
  });
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'PATCH',
    };

    await associateLambda.handler(testEvent);

    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(1);
  });
});

describe('tests for getAssociate', () => {
  let body = {
    batchId: 'batch1',
    weekId: 1,
    associateId: 'testAssociateId',
    qcNote: 'test note',
    qcTechnicalStatus: 2,
  };
  test('that getAssociate calls pg', async () => {
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  })

  test('that getAssociate returns a promise with associate data.', async () => {
    let client = new Client();
    client.query = jest.fn().mockResolvedValueOnce(body);
    const mockResult = body;
    let result = await associateLambda.getAssociate('batch1', 1, 'testAssociateId');

    expect(result).toBeTruthy(); //non-empty object
    expect(associateLambda.getAssociate).toBeCalledTimes(1);
    expect(associateLambda.getAssociate).toBeCalledWith('batch1', 1, 'testAssociateId');
    //update qcnotes set note = $1::text where associateid = $2::text and weekid = $3::integer and batchid = $3::text'
    expect(client.query).toBeCalledWith('select associate from associates where batchid = $1::text and weekid = $2::integer and associateid = $3::text',
    [
      body.batchId,
      body.weekId,
      body.associateId,
    ]
    )
    expect(result).toEqual(mockResult);  
  });
 
  test('that invalid input returns an error and does not call anything.', async () => {
    const result = await associateLambda.getAssociate('fakeBatchId', 12, 'fakeAssociateId');
    expect(result).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(0);
    expect(mockQuery).toHaveBeenCalledTimes(0);
    expect(mockEnd).toHaveBeenCalledTimes(0);
  });
});

describe('tests for putAssociate', () => {
  let body = {
    batchId: 'batch1',
    weekId: 1,
    associateId: 'testAssociateId',
    qcNote: 'test note',
    qcTechnicalStatus: 2,
  };

  Client.connect = jest.fn();
  Client.query = jest.fn().mockResolvedValue(body);
  Client.end = jest.fn();
  test('that putAssociate returns the object', async () => {
    expect(Client.connect).toHaveBeenCalledTimes(1);
    expect(associateLambda.putAssociate()).toBe(body);
    expect(Client.query).toHaveBeenCalledTimes(1);
    expect(Client.end).toHaveBeenCalledTimes(1);
  });

  test('that an incorrect input does not break anything', async () => {
    expect(Client.query).toHaveBeenCalledTimes(0);
    expect(Client.connect).toHaveBeenCalledTimes(0);
    expect(Client.end).toHaveBeenCalledTimes(0);
    expect(associateLambda.putAssociate()).toBe(null);
  });
});

describe('tests for patchAssociate', () => {
  const original: associateLambda.qcFeedback = {
    batchId: 'YYMM-mmmDD-Stuff',
    weekId: 1,
    associateId: 'example@example.net',
    qcNote: 'blablabla',
    qcTechnicalStatus: 2,
  };

  test("That updating an associate's note calls pg with correct query", async () => {
    const testUpdateObject = { qcNote: 'Updated blablabla' };

    const updatedObject = original;
    updatedObject.qcNote = testUpdateObject.qcNote;

    const res = await associateLambda.patchAssociate(
      JSON.stringify(testUpdateObject)
    );
    expect(res).toBe(updatedObject);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(
      mockQuery
    ).toHaveBeenLastCalledWith(
      'update qcnotes set note = $1::text where associateid = $2::text and weekid = $3::integer and batchid = $3::text',
      [
        testUpdateObject.qcNote,
        original.associateId,
        original.weekId,
        original.batchId,
      ]
    );
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test("That updating an associate's status calls pg with correct query", async () => {
    const testUpdateObject = { qcTechnicalStatus: 3 };

    const updatedObject = original;
    updatedObject.qcTechnicalStatus = testUpdateObject.qcTechnicalStatus;

    const res = await associateLambda.patchAssociate(
      JSON.stringify(testUpdateObject)
    );
    expect(res).toBe(updatedObject);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(
      mockQuery
    ).toHaveBeenLastCalledWith(
      'update qcnotes set techstatus = $1::integer where associateid = $2::text and weekid = $3::integer and batchid = $3::text',
      [
        testUpdateObject.qcTechnicalStatus,
        original.associateId,
        original.weekId,
        original.batchId,
      ]
    );
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test("That invalid input returns null but doesn't break anything", async () => {
    const testUpdateObject = { nonsense: 3 };

    const res = await associateLambda.patchAssociate(
      JSON.stringify(testUpdateObject)
    );
    expect(res).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(0);
    expect(mockQuery).toHaveBeenCalledTimes(0);
    expect(mockEnd).toHaveBeenCalledTimes(0);
  });
});
