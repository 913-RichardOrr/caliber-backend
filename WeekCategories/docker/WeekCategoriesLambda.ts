import createResponse from './response';
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
            let postCategory = JSON.parse(event.body).categoryId;
            console.log("Just Body: "+event.body);
            console.log(typeof(event.body));

            let postWeek = JSON.parse(event.body).qcWeekId;
            return await addCategory(client,{weekID: Number(postWeek), categoryID: Number(postCategory)});
            break;
        case 'DELETE':
            // /qc/batches/{batchid}/weeks/{weeknumber}/categories/{categoryid}
            const del_parts = event.path.split('/');
            let del_batchid: string = del_parts[del_parts.length - 5];
            let del_weeknumber: number = Number(del_parts[del_parts.length - 3]);
            let del_categoryid: number = Number(del_parts[del_parts.length-1]);
            console.log(del_batchid + "  " + del_weeknumber + "  " + del_categoryid);
            return await deleteCategory(client, del_weeknumber, del_batchid, del_categoryid);
            break;
        default:
            console.log(`Does not support HTTP method ${method}`);
            client.end();
            return createResponse('', 400);
            break;
    }
    
}

