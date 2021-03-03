import {getCategories, addCategory, deleteCategory} from './WeekCategoriesHelper';

interface getCategoryParams {
    weekID: number

}
console.log("We have entered the Container Made by Salman Saeed"); 

let response:any;

exports.handler = 
async function (event:any){
    const { Client } = require('pg');
    const client = new Client();  
    await client.connect(); 
    const method = event.httpMethod;
    switch (method) {
        case 'GET':
            // /qc/batches/{batchid}/weeks/{weeknumber}/categories
            const parts = event.path.split('/');
            let batchid: string = parts[parts.length - 4];
            let weeknumber: number = Number(parts[parts.length - 2]);
            console.log(batchid + "  " + weeknumber);
            //let id = event.path.substring(event.path.('/') + 1, event.path.length);
            return await  getCategories(client, weeknumber, batchid);
            break;
        case 'POST':
            let postCategory = JSON.stringify(event.body.categoryid);
            let postWeek = JSON.stringify(event.body.qcweekid);
            return await addCategory(client,{weekID: Number(postWeek), categoryID: Number(postCategory)});
            break;
        case 'DELETE':
            // /qc/batches/{batchid}/weeks/{weeknumber}/categories/{categoryid}
            const del_parts = event.path.split('/');
            let del_batchid: string = parts[parts.length - 4];
            let del_weeknumber: number = Number(parts[parts.length - 2]);
            let del_categoryid: number = Number(parts[parts.length-1]);
            return await deleteCategory(client, del_weeknumber, del_batchid, del_categoryid);
            break;
        default:
            console.log(`Does not support HTTP method ${method}`);
            client.end();
            break;
    }
    
}

