import { Client } from 'pg';

/**
 * Adds a new qcWeek object to the postgres database
 * @param {object} event - the event that triggers the API gateway which contains the information for that week.
 * @returns {object} - HTTP response containing the status code and headers to deal with CORS issues.
 */
export default async function AddWeekLambda(event:any) {
    const client = new Client();
    const week = JSON.parse(event.body);
    client.connect();

    const query = `insert into qcweeks (weeknumber, note, overallstatus, batchid)
                    values ($1::int, $2::text, $3::STATUS, $4::text)`;
    const values = [week.weeknumber, week.note, week.overallstatus, week.batchid];

    let response = await client.query(query, values);
    if (response) {
        client.end();
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            }
        };
    } else {
        client.end();
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            }
        };
    }
}

