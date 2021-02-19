import { getCategories, postCategories, putCategory } from './categoriesHelpers';

export const handler = async (event: any) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();

    const method = event.httpMethod;
    console.log(method);

    switch (method) {
        case 'GET':
            if (event.queryStringParameters) {
                getCategories(client, event.queryStringParameters.active);
            } else {
                getCategories(client);
            }
            break;
        case 'POST':
            postCategories(client,event);
            break;
        case 'PUT':
            putCategory(client, event);
            break;
        default:
            console.log(`Does not support HTTP method ${method}`);
            client.end();
            break;
    }
}
