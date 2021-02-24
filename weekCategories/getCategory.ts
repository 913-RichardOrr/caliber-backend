import createResponse from "../Response";

/**
 * Given week id, retrieve all categories for that week
 * @param event
 * @path the week id
 */

exports.handler = async(event:any)=>{

    const { Client } = require("pg");
    const client = new Client();

    client.connect();

    let week = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
    let response;

    //we want the name of category and the id
    response = await client.query(`select skill, id from category where id = (select category_id from week_categories where week_id = '${week}')`);
    client.end();

    if (response){
        return createResponse(JSON.stringify(response.rows), 200);
    } else{
        return createResponse('', 400);
    };
}