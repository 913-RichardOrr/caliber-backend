//Tests for associate lambda handler and helpers

import { handler, getAssociate, putAssociate, patchAssociate } from '../index';
let testEvent = {
    path: 'path',
    body?: {"1":1},
    method?: 'method'
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

describe('tests for patchAssociate', () => {});
