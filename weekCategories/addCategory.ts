
import createResponse from "../response";

/**
 * Given a category and week id, add the item from the database
 * @param event
 * @path the week id
 * @body the category id
 */

exports.handler = async (event: any) => {
    const {Client} = require('pg');
    const client = new Client();
    client.connect();

    let category = JSON.parse(event.body);
    let week = event.path.substring(event.path.lastIndexOf('/')+ 1, event.path.length);
   
    const query = `insert into week_categories (category_id, qc_week_id) values ($1, $2)`;
    const values = [ category, week ] ;

    let response = await client.query(query, values);
    client.end();
    if (response) {
        return createResponse(JSON.stringify(response.rows), 200);
    } else {
        return createResponse('', 400);
    }  
}