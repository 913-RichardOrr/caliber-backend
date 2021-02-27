import {getCategories, addCategory, deleteCategory} from './WeekCategoriesHelper';


/**
 * Process an http request and return objects depending on if the httpMethod is Get, Post, or Delete
 * 
 * @event - the http request
 */
export const handler = async (event:any)=>{
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();

    const method = event.httpMethod;
    switch (method) {
        case 'GET':
            let id = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
            getCategories(client,id);
            break;
        case 'POST':
            let postCategory = JSON.parse(event.body);
            let postWeek = event.path.substring(event.path.lastIndexOf('/')+ 1, event.path.length);
            addCategory(client,{weekID: postWeek, categoryID: postCategory});
            break;
        case 'DELETE':
            let deleteVarCategory = JSON.parse(event.body);
            let deleteWeek = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
            deleteCategory(client, {weekID: deleteWeek, categoryID: deleteVarCategory})
            break;
        default:
            console.log(`Does not support HTTP method ${method}`);
            client.end();
            break;
    }
}