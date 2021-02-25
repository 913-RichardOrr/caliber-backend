import { Client } from 'pg';

/**
 * Method is POST
 * add an overall note for that batch in this specific week
 * @param {object} event - the event that triggers the API gateway which contains the information for that week.
 * @returns {object} - HTTP response containing the status code and headers to deal with CORS issues.
 */

export default function AddOverallNoteLambda(event: any) {
    const client = new Client();
    const weekInfo = JSON.parse(event.body);
    client.connect();

    const query = `update qcweeks set note = $1::text where weeknumber = $2::number`;
    const values = [weekInfo.note, weekInfo.weeknumber];

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