//Tests for associate lambda handler and helpers

const { handler, getAssociate, putAssociate, patchAssociate, qcFeedback } = require('../index');
const { Client } = require('pg');

let testEvent = {
    path: 'path',
    body: {"1":1},
    method: 'method'
}

describe('tests for handler', () => {
    
  beforeEach( () => {
    {
        testEvent.path = '/something';
        testEvent.body = {"1":1};
        testEvent.method = 'PUT';
    }
  })
      
  test('test handler can differentiate between get/put/patch', async () => {
    handler(testEvent) = jest.fn();
  });
});

describe('tests for getAssociate', async () => {
  testEvent.path = '/something';
  

  test('that getAssociate gets associate')
});

describe('tests for putAssociate', () => {
  testEvent.path = 'idk';
  testEvent.body = { note: 'test note', status: 2 };
  test('that putAssociate does things....', () => {

  });
    {
        testEvent.path = '1';
    }
  })
      
  test('test handler can differentiate between get/put/patch', async () => {
    
  });
});

describe('tests for getAssociate', async () => {});

describe('tests for putAssociate', () => {
  let testEvent = {
    path:
  }
  test('that putAssociate does things....', () => {

  });
});

describe('tests for patchAssociate', () => {
    const original = {
        batchId: 'YYMM-mmmDD-Stuff',
        weekId: 1,
        associateId: 'example@example.net',
        qcNote: 'blablabla',
        qcTechnicalStatus: 2
    };

    const mockConnect = jest.fn();
    const mockQuery = jest.fn();
    const mockEnd = jest.fn();
    jest.mock('pg', ()=>{
        return {
            Client: jest.fn(()=>({connect: mockConnect, query: mockQuery, end: mockEnd}))
        }
    });

    test('That updating an associate\'s note works', async () => {
        const testUpdateObject = {qcNote: 'Updated blablabla'};

        const updatedObject = original;
        updatedObject.qcNote = testUpdateObject.qcNote;

        await expect(patchAssociate(JSON.stringify(testUpdateObject))).toBe(updatedObject);
        expect(mockConnect).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockEnd).toHaveBeenCalledTimes(1);
    });

    test('That updating an associate\'s status works', async () => {
        const testUpdateObject = {qcTechnicalStatus: 3};

        const updatedObject = original;
        updatedObject.qcTechnicalStatus = testUpdateObject.qcTechnicalStatus;

        await expect(patchAssociate(JSON.stringify(testUpdateObject))).toBe(updatedObject);
        expect(mockConnect).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockEnd).toHaveBeenCalledTimes(1);
    });

    test('That invalid input returns an error but doesn\'t break anything', async () => {
        const testUpdateObject = {nonsense: 3};

        await expect(patchAssociate(JSON.stringify(testUpdateObject))).toBe(null);
        expect(mockConnect).toHaveBeenCalledTimes(0);
        expect(mockQuery).toHaveBeenCalledTimes(0);
        expect(mockEnd).toHaveBeenCalledTimes(0);
    });
});
