import createResponse from "../response";

exports.handler = async(event:any)=>{

    const { Client } = require("pg");
    const client = new Client();

    client.connect();

    let week = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
    let response;

    //we want the name of category and the id
    response = await client.query(`select name, catID from category where catID = (select catID from catweek where weekID = '${week}')`);
    client.end();
    if (response){
        return createResponse(JSON.stringify(response.rows), 200);
    } else{
        return createResponse('', 400);
    };
}