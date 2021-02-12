import { handler, getAllWeeks, addNewWeek } from '../index';

let testEvent = {
  path: 'path',
  body: "1",
  method: 'method'
}

describe('test for handler', async () => {

  beforeEach(() => {
    {
      testEvent.path = '/something';
      testEvent.body = "1";
      testEvent.method = 'GET';
    }
  });

  test('test handler can differentiate between get/post and the path', async () => {
    jest.mock('mock getAllWeeks', () => ({
      getAllWeeks: jest.fn().mockImplementation(),
    }));

    jest.mock('mock getAllWeeks', () => ({
      addNewWeek: jest.fn().mockImplementation(),
    }));

    await handler(testEvent);
    //const testhandler = jest.fn()
    //handler(testEvent);
    expect(getAllWeeks).toHaveBeenCalledTimes(1);
    expect(addNewWeek).toHaveBeenCalledTimes(1);
  });
});
