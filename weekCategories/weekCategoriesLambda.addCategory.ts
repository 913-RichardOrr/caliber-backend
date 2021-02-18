import { Client } from "pg";
import createResponse from "../response";

interface MyEvent {
    body: string;
}

export const handler = async (event: MyEvent) => {
    let weekCategory = JSON.parse(event.body);
    const client = new Client();
    await client.connect();
    const query = `insert into catweek (category_id, qc_week_id) values ($1, $2)`;
    const values = [ weekCategory.category_id, weekCategory.qc_week_id ] ;

    let response = await client.query(query, values);
    if (response) {
        client.end();
        return createResponse(JSON.stringify(response.rows), 200);
    } else {
        client.end();
        return createResponse('', 400);
    }  
}