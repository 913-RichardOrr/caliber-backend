import { Client } from 'pg';

export async function handler(event: any) {

}

export async function addWeek(event:any) {
    const client = new Client();
    const week = JSON.parse(event.body);
    client.connect();

    const query = `insert into qcweeks (weeknumber, note, overallstatus, batchid)
                    values ($1::number, $2::text, $3, $4::text)`;
    const values = [week.weeknumber, week.note, week.overallstatus, week.batchId];

    let response = await client.query(query, values);
    if (response) {
        client.end();
        return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        }
        };
    } else {
        client.end();
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            }
        };
    }
}
