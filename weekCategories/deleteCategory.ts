import createResponse from "../Response";

/**
 * Given a category and week id, delete the item from the database
 * @param event
 * @path the week id
 * @body the category id
 */

exports.handler = async (event: any) => {
  const { Client } = require('pg');
  const client = new Client();
  client.connect();


  let category = JSON.parse(event.body);
  let week = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);

  await client.query(`delete from week_categories where category_id = ${category} and qc_week_id =  ${week}`).then((response: any) => {
    client.end();
    if(response){
      return createResponse('', 200);      
    }else{
      return createResponse('', 400)
    }
  });
  
}