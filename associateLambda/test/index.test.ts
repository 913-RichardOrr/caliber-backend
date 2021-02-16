//Tests for associate lambda handler and helpers

import * as associateLambda from '../index';
import { Client } from 'pg';

let testEvent: associateLambda.AssociateEvent;

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

describe('tests for getAssociate', async () => {
  testEvent.path = '/something';

  test('that getAssociate gets associate');
});

describe('tests for putAssociate', () => {
  let path = '{"batchId":"batch1","weekId":1,"associateId":"testAssociateId"}';
  let body = '{"qcNote":"test note","qcTechnicalStatus":2}';

  Client.connect = jest.fn();
  Client.query = jest.fn().mockResolvedValue(body);
  Client.end = jest.fn();

  test('that putAssociate returns the object', async () => {
    let response = await associateLambda.putAssociate(body, path);
    let expectedResponse = {
      batchId: 'batch1',
      weekId: 1,
      associateId: 'testAssociateId',
      qcNote: 'test note',
      qcTechnicalStatus: 2,
    };

    expect(response).toStrictEqual(expectedResponse);
    expect(Client.connect).toHaveBeenCalledTimes(1);
    expect(Client.query).toHaveBeenCalledTimes(1);
    expect(Client.end).toHaveBeenCalledTimes(1);
  });

  test('that an incorrect input does not break anything', async () => {
    let response = await associateLambda.putAssociate('', '');
    expect(response).toBe(null);
    expect(Client.query).toHaveBeenCalledTimes(0);
    expect(Client.connect).toHaveBeenCalledTimes(0);
    expect(Client.end).toHaveBeenCalledTimes(0);
  });
});

describe('tests for patchAssociate', () => {
  const original: associateLambda.QCFeedback = {
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
