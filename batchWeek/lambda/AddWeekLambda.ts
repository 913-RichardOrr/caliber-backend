import { Client } from 'pg';

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
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
        };
    } else {
        client.end();
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            }
        };
    }
}

