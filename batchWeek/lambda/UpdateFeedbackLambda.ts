import { Client } from 'pg';

/**
 * Method is POST
 * updates an overall note and/or status for that batch in this specific week
 * @param {object} event - the event that triggers the API gateway which contains the information for that week.
 * @returns {object} - HTTP response containing the status code and headers to deal with CORS issues.
 */

export default function UpdateFeedbackLambda(event: any) {
    const client = new Client();
    const weekInfo = JSON.parse(event.body);
    client.connect();

    const query = `update qcweeks set note = $1::text, overallstatus = $2::STATUS where weeknumber = $3::number`;
    const values = [weekInfo.note, weekInfo.overallstatus, weekInfo.weeknumber];

    let response = client.query(query, values);

    if(response) {
        client.end();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            }
        }
    } else {
        client.end();
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            }
        }
    }
}