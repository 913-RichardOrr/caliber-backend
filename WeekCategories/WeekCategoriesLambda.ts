import {getCategories, addCategory, deleteCategory} from './WeekCategoriesHelper';

exports.handler = 
async function (event:any){
    const { Client } = require('pg');
    const client = new Client({  
        
      
    });
     await client.connect();
    
     //getCategories(client, {weekID: Number('1')});
     // addCategory(client,{weekID: Number('1'), categoryID: Number('2')});
     // deleteCategory(client, {weekID: Number('1'), categoryID: Number('1')});


    const method = event.httpMethod;
    switch (method) {
        case 'GET':
            let id = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
            getCategories(client, {weekID: Number(id)});
            break;
        case 'POST':
            let postCategory = JSON.stringify(event.body.categoryid);
            let postWeek = event.path.substring(event.path.lastIndexOf('/')+ 1, event.path.length);
            addCategory(client,{weekID: Number(postWeek), categoryID: Number(postCategory)});
            break;
        case 'DELETE':
            let deleteVarCategory = JSON.stringify(event.body.categoryid);
            let deleteWeek = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
            deleteCategory(client, {weekID: Number(deleteWeek), categoryID: Number(deleteVarCategory)});
            break;
        default:
            console.log(`Does not support HTTP method ${method}`);
          //  client.end();
            break;
    }
}

