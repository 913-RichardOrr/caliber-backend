import {Client} from 'pg';



exports.handler = async (event:any)=>{

    
    
let myConn = new Object({
    user: process.env.user_env,
    host: process.env.url_env, 
    database: process.env.db_env,
    password: process.env.pass_env,
    port: process.env.port_env,
  }); 
 
let retres;

// 
let client = new Client(myConn); 
await client.query('delete from week-categories where week-categories_id = ($1::text)', [event.category_id]).then((response:any)=>{
  retres = response; 
});
client.end(); 

  return {
    'statusCode': 200,
    'headers': { 'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"            
    },
    'body': JSON.stringify(retres),
} 

 

}