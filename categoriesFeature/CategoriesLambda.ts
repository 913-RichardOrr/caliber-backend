import { getCategories, postCategories, putCategory } from "./CategoriesHelpers";

export const handler = async (event: any) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();

    const method = event.httpMethod;
    console.log(method);

    switch (method) {
        case 'GET':
                return getCategories(client, event.queryStringParameters);
        case 'POST':
            return postCategories(client, event);
        case 'PUT':
            return putCategory(client, event);
        default:
            console.log(`Does not support HTTP method ${method}`);
            client.end();
            break;
    }
}