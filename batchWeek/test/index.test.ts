import { handler, getAllWeeks} from '../index';

let testEvent = {
    path: 'path',
    body: "1",
    method: 'method'
}

describe('test for handler', () => {

  beforeEach( () => {
    {
        testEvent.path = '/something';
        testEvent.body = "1";
        testEvent.method = 'GET';
    }
  })

  test('test handler can differentiate between get/post and the path', async () => {
       //const testhandler = jest.fn()
       handler(testEvent);
       expect(getAllWeeks).toHaveBeenCalledTimes(1);
  });



});

