import AWS from 'aws-sdk-mock';
import { Client } from 'pg';

// mocked client
jest.mock('pg', () => {
    const mClient = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
  });

function success(data: any){jest.fn()}
function failure(data: any){jest.fn()}

describe('Given an event, the handler can determine the correct method', () => {
    // mocked event
    const mEvent = {
        path: '',
        body: {},
        method: ''
    }

    test('that method is GET', () => {
        mEvent.method = 'GET';

    });

    test('that method is POST', () => {
        mEvent.method = 'POST';
        
    });
});

describe('handler', () => {
    let client: any;

    // create a mocked client
    beforeEach(() => {
        client = new Client();
    });

    // clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET request should succeed', () => {
        client.query.mockReturnValue('default');
        expect(client.connect).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith('select * from categories');
        expect(client.end).toBeCalledTimes(1);
    });

    test('GET request should fail', () => {

    });

    test('POST request should succeed', () => {


    });

    test('POST request should fail', () => {

    });

});