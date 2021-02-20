import { Client } from 'pg';

/**
 * Method is POST
 * @param event 
 */

export function addOverallNote(event: any) {
    const client = new Client();
    const weekInfo = JSON.parse(event.body);
    client.connect();

    const query = `update qc_week set overall_note = $1::text where week_id = $2::number`;
    const values = [weekInfo.overall_note, weekInfo.week];

    let response = client.query(query, values);

    if(response) {
        client.end();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            }
        }
    } else {
        client.end();
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            }
        }
    }
}