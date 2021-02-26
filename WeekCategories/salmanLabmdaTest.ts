import { getCategories, addCategory, deleteCategory } from './WeekCategoriesHelper';

var event: any;
const { Client } = require('pg');
const client = new Client();
client.connect();

//let id = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
//getCategories(client,id);

client.query('select * from weekcategories', (err:any, res:string) => {
    console.log(res);
    client.end()
  })