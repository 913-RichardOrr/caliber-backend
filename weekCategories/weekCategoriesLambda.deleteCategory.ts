import createResponse from "../response";

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