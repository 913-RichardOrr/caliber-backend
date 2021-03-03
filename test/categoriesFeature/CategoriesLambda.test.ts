import { Client } from 'pg';
import { handler } from '../../categoriesFeature/CategoriesLambda';
import * as categoriesHelpers from '../../categoriesFeature/CategoriesHelpers';

// mocked client
jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});

// mocked helper functions
jest.mock('../../categoriesFeature/CategoriesHelpers', () => {
    const mockget = jest.fn();
    const mockpost = jest.fn();
    const mockput = jest.fn();

    return {
        getCategories: mockget,
        postCategories: mockpost,
        putCategory: mockput,
    };
});

let mEvent = {
    path: '',
    body: {},
    httpMethod: '',
    queryStringParameters: {},
}

describe('tests for handler', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('that method is GET', async () => {
        mEvent = {
            path: '/something',
            body: '{1:1}',
            httpMethod: 'GET',
            queryStringParameters: {active: 'true'}
        };
        await handler(mEvent);

        expect(categoriesHelpers.getCategories).toHaveBeenCalledTimes(1);
        expect(categoriesHelpers.postCategories).toHaveBeenCalledTimes(0);
        expect(categoriesHelpers.putCategory).toHaveBeenCalledTimes(0);
    })
    test('that method is POST', async () => {
        mEvent = {
            path: '/something',
            body: '{1:1}',
            httpMethod: 'POST',
            queryStringParameters: {active: 'true'}
        };
        await handler(mEvent);

        expect(categoriesHelpers.postCategories).toHaveBeenCalledTimes(1);
        expect(categoriesHelpers.getCategories).toHaveBeenCalledTimes(0);
        expect(categoriesHelpers.putCategory).toHaveBeenCalledTimes(0);
    })
    test('that method is PUT', async () => {
        mEvent = {
            path: '/something',
            body: '{1:1}',
            httpMethod: 'PUT',
            queryStringParameters: {active: 'true'}
        };
        await handler(mEvent);

        expect(categoriesHelpers.putCategory).toHaveBeenCalledTimes(1);
        expect(categoriesHelpers.getCategories).toHaveBeenCalledTimes(0);
        expect(categoriesHelpers.postCategories).toHaveBeenCalledTimes(0);
    })
});