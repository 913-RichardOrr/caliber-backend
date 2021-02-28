import { Client } from 'pg';
import * as categoriesHelpers from '../../categoriesFeature/CategoriesHelpers';

// mocked client
jest.mock('pg', () => {
    const mConnect = jest.fn();
    const mQuery = jest.fn();
    const mEnd = jest.fn();
    
    return{
        Client: jest.fn(() => ({
            connect: mConnect,
            query: mQuery,
            end: mEnd
        })
    )
}});

describe('getCategories', () => {

    let client: any;
    let mEvent: any;

    // create mocks
    beforeEach(() => {
        client = new Client();
        mEvent = {
            path: '/test',
            body: {},
            httpMethod: 'GET',
            queryStringParameters: { active: true }
        }
    });

    // clear all mocks
    afterEach(() => {
        jest.clearAllMocks();

    });

    test('GET request should succeed', async () => {
        await categoriesHelpers.getCategories(client, mEvent.queryStringParameters);
        expect(client.query).toBeCalledWith('select c.categoryid, c.skill, c.active from categories c where active=$1::boolean', [true]);
        expect(client.end).toBeCalledTimes(1);
    });
});

describe('postCategories', () => {

    let client: any;
    let mEvent: any;

    // create mocks
    beforeEach(() => {
        client = new Client();
        mEvent = {
            path: '',
            body: {},
            httpMethod: 'POST',
            queryStringParameters: {}
        }
    });

    // clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('POST request should succeed', async () => {
        mEvent = {
            path: '/something',
            body: { skill: 'testskill', active: true },
            httpMethod: 'POST',
            queryStringParameters: { active: 'true' }
        };
        const res = await categoriesHelpers.postCategories(client, mEvent);
        expect(client.query).toBeCalledWith(`insert into categories (skill,active) values ($1::text,true) returning categoryid, skill, active`, [{"active": true,"skill": "testskill"}]);
        expect(client.end).toBeCalledTimes(1);
    });

    test('POST request should fail', async () => {
        mEvent = {
            path: '/something',
            body: { skill: 'testskill', active: 'true' },
            httpMethod: 'POST',
            queryStringParameters: { active: 'true' }
        };
        const res = await categoriesHelpers.postCategories(client, mEvent);
        expect(res.statusCode).not.toBe(200);
        expect(client.query).toBeCalledWith(`insert into categories (skill,active) values ($1::text,true) returning categoryid, skill, active`, [{"active": "true","skill": "testskill"}]);
        expect(client.end).toBeCalledTimes(1);
    });
});

describe('putCategory', () => {

    let client: any;
    let mEvent: any;

    // create a mocked client
    beforeEach(() => {
        client = new Client();
        mEvent = {
            path: '',
            body: {},
            httpMethod: 'PUT',
            queryStringParameters: {}
        }
    });

    // clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('PUT request should succeed', async () => {
        mEvent = {
            path: '/something/2',
            body: JSON.stringify({skill: 'test', active: true}),
            httpMethod: 'PUT',
            queryStringParameters: {}
        }
        const res = await categoriesHelpers.putCategory(client, mEvent);
        expect(client.query).toBeCalledWith('update categories set skill=$1, active=$2 where categoryid=$3',['test', true, '2']);
        expect(client.end).toBeCalledTimes(1);
    });

    test('PUT request should fail', async () => {
        mEvent = {
            path: '/something/2',
            body: JSON.stringify({ skill: 'testskill', active: true }),
            httpMethod: 'PUT',
            queryStringParameters: {}
        };
        const res = await categoriesHelpers.putCategory(client, mEvent);
        expect(res.statusCode).not.toBe(200);
        expect(client.query).toBeCalledWith('update categories set skill=$1, active=$2 where categoryid=$3',['testskill', true, '2']);
        expect(client.end).toBeCalledTimes(1);
    });
});