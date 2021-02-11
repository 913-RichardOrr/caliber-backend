import AWS from 'aws-sdk-mock';
import { Client } from 'pg';

jest.mock('pg', () => {
    const mClient = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
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
        client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
        expect(client.connect).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith('');
        expect(client.end).toBeCalledTimes(1);
        expect(success).toBeCalledWith({ message: '0 item(s) returned', data: [], status: true });
    });

    test('GET request should fail', () => {
        // connect to client

        // perform an action to postgres

        // create a response

        // end connection to client

        // return response

    });

    test('POST request should succeed', () => {

        // connect to client

        // perform an action to postgres

        // create a response

        // end connection to client

        // return response

    });



        // connect to client

        // perform an action to postgres

        // create a response

        // end connection to client

        // return response

    });

});